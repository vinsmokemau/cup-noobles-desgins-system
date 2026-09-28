// T3.6: `pnpm sync:docs [--check]` rewrites the generated blocks in DESIGN.md and docs/ (SPEC.md §0.3, §4.5).
//
// A block runs from `<!-- cn:generated tokens="…" format="…" -->` to `<!-- /cn:generated -->` (REQ-004 AC1). Its
// `tokens` attribute is one or more token path prefixes, separated by spaces or commas; a prefix matches the token
// with that path and every token below it. Everything between the markers is replaced:
// - `table`: one row per matching token, with its CSS variable, resolved value, and status. Values come from the
//   token build's tokens.flat.json (REQ-013), so a doc shows exactly what the packages ship.
// - `contrast`: every declared pair from tokens/contrast-pairs.json with a matching token on either side, and every
//   combination from tokens/contrast-forbidden.json that names a matching token, as check-contrast reports them.
// - `inventory` blocks are left untouched until T8.7 adds that format.
// Markers inside fenced code or HTML comments are not blocks, the same as in check-docs.
//
// With --check nothing is written: the command lists the files whose blocks have drifted and fails (REQ-004 AC3).
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from '../packages/tokens/build.ts'
import { checkContrast, type ContrastReport } from './check-contrast.ts'
import { readFrontmatter, scan, type Problem } from './check-docs.ts'

export type Format = 'table' | 'contrast' | 'inventory'
export const FORMATS: Format[] = ['table', 'contrast', 'inventory']

export interface SyncProblem {
  file: string
  line: number
  message: string
}

export interface SyncResult {
  files: string[] // every file scanned
  drifted: string[] // files whose generated blocks differ from the tokens (rewritten unless --check)
  problems: SyncProblem[]
}

// One entry of packages/tokens dist/json/tokens.flat.json.
export interface FlatToken {
  cssVar: string
  value: string | number | boolean
  status: string | null
  tbd?: string[]
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Hash-locked and verbatim (REQ-006): never rewritten.
const SKIP = ['docs/00-overview/brand-context-source.md']
const OPEN = /^<!-- cn:generated\b(.*)-->\s*$/
const CLOSE = /^<!-- \/cn:generated -->\s*$/

export const prefixes = (attribute: string) => attribute.split(/[\s,]+/).filter(Boolean)
export const matches = (path: string, list: string[]) =>
  list.some((prefix) => path === prefix || path.startsWith(`${prefix}.`))

// A table cell: inline code, with pipes escaped so they cannot end the cell.
const code = (value: unknown) => `\`${String(value).replaceAll('|', '\\|')}\``
const row = (cells: string[]) => `| ${cells.join(' | ')} |`
const ratio = (r: number) => `${r.toFixed(2)}:1`

export function renderTable(flat: Record<string, FlatToken>, list: string[]): string[] {
  const rows = Object.entries(flat)
    .filter(([path]) => matches(path, list))
    .map(([path, token]) => {
      const status = String(token.status) + (token.tbd?.length ? ` (${token.tbd.join(', ')})` : '')
      return row([code(path), code(token.cssVar), code(token.value), status])
    })
  if (!rows.length) return []
  return [row(['Token', 'CSS variable', 'Value', 'Status']), '|---|---|---|---|', ...rows]
}

export function renderContrast(report: ContrastReport, list: string[]): string[] {
  const side = (ref: string, value: string) => (ref.startsWith('#') ? code(ref) : `${code(ref)} (${code(value)})`)
  const pairs = report.pairs
    .filter((p) => matches(p.foreground, list) || matches(p.background, list))
    .map((p) =>
      row([
        side(p.foreground, p.foregroundValue),
        side(p.background, p.backgroundValue),
        p.usage,
        ratio(p.ratio),
        ratio(p.minimum),
        p.result === 'unverified' ? `unverified (tbd: ${p.tbd.map(code).join(', ')})` : p.result,
      ]),
    )
  const forbidden = report.forbidden
    .filter((f) => matches(f.foreground, list) || matches(f.background, list))
    .map((f) =>
      row([
        side(f.foreground, f.foregroundValue),
        side(f.background, f.backgroundValue),
        '—',
        ratio(f.ratio),
        '—',
        'forbidden',
      ]),
    )
  if (!pairs.length && !forbidden.length) return []
  return [
    row(['Foreground', 'Background', 'Usage', 'Ratio', 'Minimum', 'Result']),
    '|---|---|---|---|---|---|',
    ...pairs,
    ...forbidden,
  ]
}

// Resolved values, from a token build into a temporary directory.
async function flatTokens(root: string): Promise<Record<string, FlatToken>> {
  const out = mkdtempSync(join(tmpdir(), 'cn-sync-docs-'))
  try {
    await build(out, { tokensDir: join(root, 'tokens') })
    return JSON.parse(readFileSync(join(out, 'json/tokens.flat.json'), 'utf8')) as Record<string, FlatToken>
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}

function listFiles(root: string): string[] {
  const docs = existsSync(join(root, 'docs'))
    ? readdirSync(join(root, 'docs'), { recursive: true, encoding: 'utf8' })
        .map((path) => `docs/${path.replaceAll('\\', '/')}`)
        .filter((path) => path.endsWith('.md') && !SKIP.includes(path))
        .sort()
    : []
  return existsSync(join(root, 'DESIGN.md')) ? ['DESIGN.md', ...docs] : docs
}

interface Block {
  open: number // 0-based line index of the opening marker
  close: number // 0-based line index of the closing marker
  attributes: Record<string, string>
}

function findBlocks(file: string, text: string, problems: SyncProblem[]): Block[] {
  const scanProblems: Problem[] = []
  const frontmatterEnd = file.startsWith('docs/') ? readFrontmatter(text).end : 0
  const lines = scan(file, text, frontmatterEnd, scanProblems)
  problems.push(...scanProblems.map(({ file, line, message }) => ({ file, line, message })))
  if (scanProblems.length) return []

  const blocks: Block[] = []
  let open: { index: number; attributes: Record<string, string> } | null = null
  for (const [index, line] of lines.entries()) {
    if (!line.generated) continue
    const opening = line.text.match(OPEN)
    if (opening && !open) {
      const attributes = Object.fromEntries([...opening[1]!.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1]!, m[2]!]))
      open = { index, attributes }
    } else if (CLOSE.test(line.text) && open) {
      blocks.push({ open: open.index, close: index, attributes: open.attributes })
      open = null
    }
  }
  return blocks
}

export async function syncDocs(root: string = repoRoot, { check = false } = {}): Promise<SyncResult> {
  const problems: SyncProblem[] = []
  const drifted: string[] = []
  const files = listFiles(root)
  const texts = new Map(files.map((file) => [file, readFileSync(join(root, file), 'utf8')]))
  const blocks = new Map(files.map((file) => [file, findBlocks(file, texts.get(file)!, problems)]))

  // The token build and the contrast report run only when some block needs them.
  const formats = new Set([...blocks.values()].flat().map((block) => block.attributes.format))
  let flat: Record<string, FlatToken> = {}
  if (formats.has('table')) {
    try {
      flat = await flatTokens(root)
    } catch (error) {
      problems.push({ file: 'tokens/', line: 0, message: `the token build failed: ${(error as Error).message}` })
    }
  }
  const contrast = formats.has('contrast') ? checkContrast(root) : { pairs: [], forbidden: [], problems: [] }

  for (const file of files) {
    const text = texts.get(file)!
    const eol = text.includes('\r\n') ? '\r\n' : '\n'
    const lines = text.split(/\r?\n/)
    // Replace from the last block up, so earlier line indexes stay valid.
    for (const block of [...blocks.get(file)!].reverse()) {
      const add = (message: string) => problems.push({ file, line: block.open + 1, message })
      const { tokens, format } = block.attributes
      const list = prefixes(tokens ?? '')
      if (!list.length) {
        add('the cn:generated block needs a `tokens` attribute with at least one token path prefix (§4.5)')
        continue
      }
      if (!FORMATS.includes(format as Format)) {
        add(`the cn:generated block's \`format\` must be one of ${FORMATS.join(', ')}, not ${JSON.stringify(format)}`)
        continue
      }
      if (format === 'inventory') continue // T8.7
      const table = format === 'table' ? renderTable(flat, list) : renderContrast(contrast, list)
      if (!table.length) {
        add(
          `tokens="${tokens}" matches no ${format === 'table' ? 'tokens' : 'contrast pairs or forbidden combinations'}`,
        )
        continue
      }
      // Blank lines around the table keep it a table after the HTML comment (and satisfy markdownlint MD058).
      lines.splice(block.open + 1, block.close - block.open - 1, '', ...table, '')
    }
    const next = lines.join(eol)
    if (next === text) continue
    drifted.push(file)
    if (!check) writeFileSync(join(root, file), next)
  }

  problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
  return { files, drifted, problems }
}

// Usage: node scripts/sync-docs.ts [--check] [root]. The root defaults to this repository; tests pass a fixture root.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  const check = args.includes('--check')
  const rootArg = args.find((arg) => !arg.startsWith('--'))
  const { files, drifted, problems } = await syncDocs(rootArg ? resolve(rootArg) : repoRoot, { check })
  for (const p of problems) console.error(`${p.file}:${p.line}  ${p.message}`)
  if (check) {
    for (const file of drifted) console.error(`${file}  generated blocks are out of date; run \`pnpm sync:docs\``)
    console.log(`sync-docs --check: ${files.length} files, ${drifted.length} out of date.`)
  } else {
    for (const file of drifted) console.log(`updated ${file}`)
    console.log(`sync-docs: ${files.length} files, ${drifted.length} updated.`)
  }
  if (problems.length) console.error(`\nsync-docs: ${problems.length} problem(s)`)
  if (problems.length || (check && drifted.length)) process.exitCode = 1
}
