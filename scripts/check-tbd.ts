// T2.4: `pnpm check:tbd` collects every open item and writes reports/tbd-report.json (SPEC.md §0.3, REQ-005 AC3).
// Rules: callout (§4.4 callout forms), unknown-id (REQ-005 AC1), unknown-task (§4.4 content pending),
// resolved-callout (§4.4 resolution), missing-adr (REQ-073 AC2), token-file (REQ-005 AC2), spec (SPEC.md layout).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { prose, readFrontmatter, scan } from './check-docs.ts'

export type TbdRule =
  'callout' | 'unknown-id' | 'unknown-task' | 'resolved-callout' | 'missing-adr' | 'token-file' | 'spec'

export interface TbdProblem {
  file: string
  line: number
  rule: TbdRule
  message: string
}

interface RegisterRow {
  id: string
  item: string
  line: number // line in SPEC.md
  resolved: boolean
  adrs: string[]
}

export interface TbdReport {
  summary: {
    openItems: number // §2.4 rows not marked resolved
    resolvedItems: number
    callouts: number
    tokens: number // tokens with status `tbd`
    derivedPendingTokens: number
    contentPending: number
    draftDocs: number
    draftCallouts: number
    problems: number
  }
  items: { id: string; item: string; resolved: boolean; adrs: string[]; callouts: number }[]
  callouts: { file: string; line: number; id: string; text: string }[]
  tokens: { file: string; path: string; status: 'tbd' | 'derived-pending' }[]
  contentPending: { file: string; line: number; task: string }[]
  drafts: { docs: { file: string }[]; callouts: { file: string; line: number; text: string }[] }
  problems: TbdProblem[]
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SPEC = 'SPEC.md'
const ADR_DIR = 'docs/06-governance/decisions'
// The brand source is verbatim and hash-locked (REQ-006): it can hold no callouts to fix, so it is not scanned.
const SKIP = ['docs/00-overview/brand-context-source.md']
// The template's own `status: draft` is a placeholder for authors, not a draft doc.
const TEMPLATE = 'docs/_template.md'
const TOKEN_TIERS = ['primitive', 'semantic', 'component']

// §4.4: the only two callout forms. Anything else that starts `> **TBD` fails, and so does a malformed Draft callout.
const ITEM_CALLOUT = /^ {0,3}> \*\*TBD \((TBD-\d{2})\):\*\* (\S.*)$/
const PENDING_CALLOUT = /^ {0,3}> \*\*TBD:\*\* Content pending \((T\d+\.\d+)\)\.\s*$/
const DRAFT_CALLOUT = /^ {0,3}> \*\*Draft:\*\* (\S.*)$/
const ANY_TBD = /^ {0,3}>\s*\*\*\s*TBD/i
const ANY_DRAFT = /^ {0,3}>\s*\*\*\s*Draft/i
const TBD_ID = /^TBD-\d{2}$/

// The lines of one SPEC.md section, from its heading to the next heading of the same or a higher level.
function section(lines: string[], heading: RegExp): { start: number; lines: string[] } | null {
  const start = lines.findIndex((line) => heading.test(line))
  if (start < 0) return null
  const level = lines[start]!.match(/^#+/)![0].length
  const end = lines.findIndex((line, i) => i > start && new RegExp(`^#{1,${level}} `).test(line))
  return { start, lines: lines.slice(start + 1, end < 0 ? undefined : end) }
}

function cells(row: string): string[] {
  return row
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

const adrNumbers = (text: string) => [...new Set([...text.matchAll(/\bADR-(\d{4})\b/g)].map((m) => m[1]!))]

function readSpec(root: string, problems: TbdProblem[]) {
  const lines = readFileSync(join(root, SPEC), 'utf8').split(/\r?\n/)
  const adrFiles = existsSync(join(root, ADR_DIR)) ? readdirSync(join(root, ADR_DIR)) : []
  const adrExists = (n: string) => adrFiles.some((file) => file.startsWith(`${n}-`) && file.endsWith('.md'))

  // REQ-073 AC2: a resolved TBD row or a decided OD names at least one ADR, and every ADR it names exists.
  const requireAdr = (label: string, line: number, adrs: string[]) => {
    if (!adrs.length)
      problems.push({ file: SPEC, line, rule: 'missing-adr', message: `${label} names no ADR (REQ-073 AC2)` })
    for (const n of adrs.filter((n) => !adrExists(n)))
      problems.push({
        file: SPEC,
        line,
        rule: 'missing-adr',
        message: `${label} names ADR-${n}, but ${ADR_DIR}/${n}-*.md does not exist (REQ-073 AC2)`,
      })
  }

  const register: RegisterRow[] = []
  const tbd = section(lines, /^### 2\.4 TBD register\s*$/)
  if (!tbd) problems.push({ file: SPEC, line: 1, rule: 'spec', message: 'no "### 2.4 TBD register" section' })
  tbd?.lines.forEach((text, i) => {
    const row = cells(text)
    const id = row[0]?.replace(/~/g, '')
    if (!text.trimStart().startsWith('|') || !id || !TBD_ID.test(id)) return
    const line = tbd.start + 2 + i
    // §4.4: a resolved row says `Resolved (ADR-NNNN)`.
    const resolved = /\bResolved\b/i.test(text)
    const adrs = resolved ? adrNumbers(text) : []
    if (resolved) requireAdr(`${id} is resolved but`, line, adrs)
    register.push({ id, item: row[1] ?? '', line, resolved, adrs: adrs.map((n) => `ADR-${n}`) })
  })

  const decisions = section(lines, /^### 7\.2 Open decisions\s*$/)
  if (!decisions) problems.push({ file: SPEC, line: 1, rule: 'spec', message: 'no "### 7.2 Open decisions" section' })
  decisions?.lines.forEach((text, i) => {
    const id = cells(text)[0]
    if (!id || !/^OD-\d{2}$/.test(id) || !/\*\*Decided\b/.test(text)) return
    requireAdr(`${id} is decided but`, decisions.start + 2 + i, adrNumbers(text))
  })

  const tasks = new Set(lines.flatMap((line) => line.match(/^- \[[ x]\] \*\*(T\d+\.\d+) — /)?.[1] ?? []))
  if (!tasks.size) problems.push({ file: SPEC, line: 1, rule: 'spec', message: 'no tasks found in §6' })
  return { register, tasks }
}

function listFiles(root: string, dir: string, extension: string): string[] {
  if (!existsSync(join(root, dir))) return []
  return readdirSync(join(root, dir), { recursive: true, encoding: 'utf8' })
    .map((path) => `${dir}/${path.replaceAll('\\', '/')}`)
    .filter((path) => path.endsWith(extension))
    .sort()
}

// DTCG: a node with `$value` is a token, and its path is the chain of group keys. Keys starting with `$` are metadata.
function collectTokens(file: string, node: unknown, path: string[], out: TbdReport['tokens']) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return
  const record = node as Record<string, unknown>
  if ('$value' in record) {
    const status = (record.$extensions as { cn?: { status?: unknown } } | undefined)?.cn?.status
    if (status === 'tbd' || status === 'derived-pending') out.push({ file, path: path.join('.'), status })
    return
  }
  for (const [key, child] of Object.entries(record))
    if (!key.startsWith('$')) collectTokens(file, child, [...path, key], out)
}

export function checkTbd(root: string = repoRoot): TbdReport {
  const problems: TbdProblem[] = []
  const { register, tasks } = readSpec(root, problems)
  const known = new Map(register.map((row) => [row.id, row]))

  const report: TbdReport = {
    summary: {} as TbdReport['summary'],
    items: [],
    callouts: [],
    tokens: [],
    contentPending: [],
    drafts: { docs: [], callouts: [] },
    problems,
  }

  const checkId = (id: string, file: string, line: number, where: string) => {
    if (!known.has(id))
      problems.push({
        file,
        line,
        rule: 'unknown-id',
        message: `${where} \`${id}\` is not in SPEC.md §2.4 (REQ-005 AC1)`,
      })
  }

  const docs = [...(existsSync(join(root, 'DESIGN.md')) ? ['DESIGN.md'] : []), ...listFiles(root, 'docs', '.md')]
  for (const file of docs.filter((file) => !SKIP.includes(file))) {
    const text = readFileSync(join(root, file), 'utf8')
    const fm = file.startsWith('docs/') ? readFrontmatter(text) : { data: null, end: 0 }
    if (fm.data?.status === 'draft' && file !== TEMPLATE) report.drafts.docs.push({ file })

    // The frontmatter `tbd:` list names TBD IDs too (§4.3).
    if (Array.isArray(fm.data?.tbd)) {
      const line = Math.max(1, text.split(/\r?\n/, fm.end).findIndex((l) => l.startsWith('tbd:')) + 1)
      for (const id of fm.data.tbd) checkId(String(id), file, line, 'frontmatter `tbd` ID')
    }

    for (const line of scan(file, text, fm.end, []).filter(prose)) {
      const item = line.text.match(ITEM_CALLOUT)
      const pending = line.text.match(PENDING_CALLOUT)
      const draft = line.text.match(DRAFT_CALLOUT)
      if (item) {
        const id = item[1]!
        report.callouts.push({ file, line: line.n, id, text: item[2]!.trim() })
        checkId(id, file, line.n, 'TBD callout ID')
        const row = known.get(id)
        if (row?.resolved)
          problems.push({
            file,
            line: line.n,
            rule: 'resolved-callout',
            message: `${id} is marked resolved in SPEC.md §2.4, so the callout must be removed (§4.4)`,
          })
      } else if (pending) {
        const task = pending[1]!
        report.contentPending.push({ file, line: line.n, task })
        if (!tasks.has(task))
          problems.push({
            file,
            line: line.n,
            rule: 'unknown-task',
            message: `content-pending callout names \`${task}\`, which is not a task in SPEC.md §6 (§4.4)`,
          })
      } else if (draft) {
        report.drafts.callouts.push({ file, line: line.n, text: draft[1]!.trim() })
      } else if (ANY_TBD.test(line.text) || ANY_DRAFT.test(line.text)) {
        problems.push({
          file,
          line: line.n,
          rule: 'callout',
          message:
            'malformed callout: use `> **TBD (TBD-NN):** …`, `> **TBD:** Content pending (Tn.n).`, or `> **Draft:** …` (§4.4, REQ-009 AC1)',
        })
      }
    }
  }

  // REQ-005 AC2: token statuses. The token files arrive in P3; until then this finds nothing.
  for (const tier of TOKEN_TIERS) {
    for (const file of listFiles(root, `tokens/${tier}`, '.json')) {
      try {
        collectTokens(file, JSON.parse(readFileSync(join(root, file), 'utf8')), [], report.tokens)
      } catch (error) {
        problems.push({ file, line: 1, rule: 'token-file', message: `not valid JSON: ${(error as Error).message}` })
      }
    }
  }

  report.items = register.map((row) => ({
    id: row.id,
    item: row.item,
    resolved: row.resolved,
    adrs: row.adrs,
    callouts: report.callouts.filter((c) => c.id === row.id).length,
  }))
  problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
  report.summary = {
    openItems: register.filter((row) => !row.resolved).length,
    resolvedItems: register.filter((row) => row.resolved).length,
    callouts: report.callouts.length,
    tokens: report.tokens.filter((t) => t.status === 'tbd').length,
    derivedPendingTokens: report.tokens.filter((t) => t.status === 'derived-pending').length,
    contentPending: report.contentPending.length,
    draftDocs: report.drafts.docs.length,
    draftCallouts: report.drafts.callouts.length,
    problems: problems.length,
  }
  return report
}

export function writeReport(report: TbdReport, out: string) {
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`)
}

// Usage: node scripts/check-tbd.ts [root] [--out file]. The root defaults to this repository, and the report to
// <root>/reports/tbd-report.json. Tests pass a fixture root and a temporary --out.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  const outAt = args.indexOf('--out')
  const outArg = outAt >= 0 ? args.splice(outAt, 2)[1] : undefined
  const root = args[0] ? resolve(args[0]) : repoRoot
  const out = outArg ? resolve(outArg) : join(root, 'reports/tbd-report.json')

  const report = checkTbd(root)
  writeReport(report, out)
  const s = report.summary
  for (const p of report.problems) console.error(`${p.file}:${p.line}  ${p.rule}  ${p.message}`)
  console.log(
    `check-tbd: ${s.openItems} open TBD items (${s.callouts} callouts, ${s.tokens} tbd tokens), ` +
      `${s.contentPending} content-pending callouts, ${s.draftDocs} draft docs, ${s.draftCallouts} draft callouts. ` +
      `Report: ${relative(process.cwd(), out).replaceAll('\\', '/')}`,
  )
  if (report.problems.length) {
    console.error(`\ncheck-tbd: ${report.problems.length} problem(s)`)
    process.exitCode = 1
  }
}
