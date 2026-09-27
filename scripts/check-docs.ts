// T2.2: `pnpm check:docs` validates every doc in docs/ and DESIGN.md (SPEC.md §0.3).
// Rules: frontmatter (REQ-002, REQ-007 AC1), slug (§4.3), headings (REQ-003 AC1), not-applicable (REQ-003 AC2),
// generated-block and hex (REQ-004 AC2), mdc (REQ-008 AC1), copy-locale (REQ-007 AC2), stable-callout (REQ-037).
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Ajv2020 } from 'ajv/dist/2020.js'
import type { ErrorObject } from 'ajv'
import { parse } from 'yaml'

export type Rule =
  | 'frontmatter'
  | 'slug'
  | 'headings'
  | 'not-applicable'
  | 'generated-block'
  | 'hex'
  | 'mdc'
  | 'copy-locale'
  | 'stable-callout'

export interface Problem {
  file: string
  line: number
  rule: Rule
  message: string
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// REQ-002 AC4 and §4.3: exempt from frontmatter and template rules.
export const EXEMPT = ['docs/_template.md', 'docs/00-overview/brand-context-source.md']

// REQ-004 AC2: files where hex literals are allowed anywhere (SPEC 1.9 adds the ADRs).
const HEX_EXEMPT = (file: string) =>
  file === 'docs/00-overview/brand-context-source.md' || file.startsWith('docs/06-governance/decisions/')

// §4.2: the H2 headings, in order, and the layers that require each. Row 14 is three headings.
// tests/check-docs.test.ts compares this table with SPEC.md so the two can't drift.
export const TEMPLATE: ReadonlyArray<readonly [heading: string, layers: readonly string[]]> = [
  ['Purpose', ['overview', 'foundation', 'component', 'pattern', 'content', 'email', 'governance']],
  ['Anatomy', ['component']],
  ['Tokens and specs', ['foundation', 'component', 'email']],
  ['Variants', ['component']],
  ['States', ['component']],
  ['Usage rules', ['overview', 'foundation', 'component', 'pattern', 'content', 'email']],
  ["Do and don't", ['foundation', 'component', 'pattern', 'content']],
  ['Accessibility', ['foundation', 'component', 'pattern', 'content', 'email']],
  ['Content', ['component', 'pattern']],
  ['Responsive behavior', ['foundation', 'component', 'pattern']],
  ['Email notes', ['foundation', 'component']],
  ['Code reference', ['foundation', 'component', 'pattern', 'email']],
  ['Policy and process', ['governance']],
  ['Context', ['adr']],
  ['Decision', ['adr']],
  ['Consequences', ['adr']],
  ['Open items', ['overview', 'foundation', 'component', 'pattern', 'content', 'email', 'governance']],
  ['Changelog', ['overview', 'foundation', 'component', 'pattern', 'content', 'email', 'governance']],
]

export const requiredHeadings = (layer: string) =>
  TEMPLATE.filter(([, layers]) => layers.includes(layer)).map(([heading]) => heading)

const NOT_APPLICABLE = 'Not applicable.'
const USAGE_H3S = ['When to use', 'When not to use']
const HEX = /#[0-9a-fA-F]{3,8}\b/g

interface Line {
  n: number // 1-based line number in the file
  text: string
  frontmatter: boolean
  fence: string[] | null // the fence's info-string words, when the line is inside a fenced block (delimiters included)
  fenceOpen: boolean
  comment: boolean // inside an HTML comment (Markdown does not render it)
  generated: boolean // inside a cn:generated block (markers included)
}

const OPEN_FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/
const GENERATED_OPEN = /^<!-- cn:generated\b.*-->\s*$/
const GENERATED_CLOSE = /^<!-- \/cn:generated -->\s*$/

function scan(file: string, text: string, frontmatterEnd: number, problems: Problem[]): Line[] {
  const lines: Line[] = []
  let fence: { marker: string; info: string[] } | null = null
  let comment = false
  let generated: number | null = null

  text.split(/\r?\n/).forEach((text, i) => {
    const n = i + 1
    const line: Line = {
      n,
      text,
      frontmatter: n <= frontmatterEnd,
      fence: null,
      fenceOpen: false,
      comment: false,
      generated: false,
    }
    lines.push(line)
    if (line.frontmatter) return

    if (fence) {
      line.fence = fence.info
      const close = text.match(/^ {0,3}(`{3,}|~{3,})\s*$/)
      if (close && close[1]![0] === fence.marker[0] && close[1]!.length >= fence.marker.length) fence = null
    } else if (comment) {
      line.comment = true
      if (text.includes('-->')) comment = false
    } else if (GENERATED_OPEN.test(text)) {
      if (generated !== null)
        problems.push({
          file,
          line: n,
          rule: 'generated-block',
          message: `cn:generated block opened inside the block opened on line ${generated} (REQ-004 AC1)`,
        })
      generated = n
    } else if (GENERATED_CLOSE.test(text)) {
      if (generated === null)
        problems.push({
          file,
          line: n,
          rule: 'generated-block',
          message: '/cn:generated marker without an opening marker (REQ-004 AC1)',
        })
      line.generated = true
      generated = null
    } else {
      const open = text.match(OPEN_FENCE)
      if (open && !(open[1]![0] === '`' && open[2]!.includes('`'))) {
        fence = { marker: open[1]!, info: open[2]!.trim().split(/\s+/).filter(Boolean) }
        line.fence = fence.info
        line.fenceOpen = true
      } else if (/^ {0,3}<!--/.test(text) && !text.includes('-->')) {
        line.comment = true
        comment = true
      } else if (/^ {0,3}<!--.*-->\s*$/.test(text)) {
        line.comment = true
      }
    }
    if (generated !== null) line.generated = true
  })

  if (generated !== null)
    problems.push({
      file,
      line: generated,
      rule: 'generated-block',
      message: 'cn:generated block is never closed (REQ-004 AC1)',
    })
  return lines
}

// Lines that Markdown renders as prose (not frontmatter, fenced code, or comments).
const prose = (line: Line) => !line.frontmatter && !line.fence && !line.comment

function checkHex(file: string, lines: Line[], problems: Problem[]) {
  if (HEX_EXEMPT(file)) return
  for (const line of lines) {
    if (line.generated || line.fence?.includes('bad-example')) continue
    for (const match of line.text.matchAll(HEX)) {
      problems.push({
        file,
        line: line.n,
        rule: 'hex',
        message: `hex color literal \`${match[0]}\` outside a generated block (REQ-004 AC2)`,
      })
    }
  }
}

function checkMdc(file: string, lines: Line[], problems: Problem[]) {
  for (const line of lines.filter(prose)) {
    if (/^\s*::/.test(line.text)) {
      problems.push({
        file,
        line: line.n,
        rule: 'mdc',
        message: 'MDC block syntax: the line starts with `::` (REQ-008 AC1)',
      })
    }
    const inline = line.text.match(/(?:^|[^\w:])(:[A-Za-z][\w-]*\{)/)
    if (inline) {
      problems.push({
        file,
        line: line.n,
        rule: 'mdc',
        message: `MDC inline component syntax \`${inline[1]}…}\` (REQ-008 AC1)`,
      })
    }
  }
}

function checkCopyLocale(file: string, lines: Line[], problems: Problem[]) {
  for (const line of lines) {
    if (!line.fenceOpen) continue
    const [tag, locale, ...rest] = line.fence!
    if ((tag === 'copy' || tag === 'copy-bad') && (locale !== 'es-MX' || rest.length > 0)) {
      problems.push({
        file,
        line: line.n,
        rule: 'copy-locale',
        message: `\`${tag}\` block must be tagged \`${tag} es-MX\` (REQ-007 AC2)`,
      })
    }
  }
}

interface Frontmatter {
  data: Record<string, unknown> | null
  end: number // last line of the frontmatter block, 0 if none
}

function readFrontmatter(text: string): Frontmatter {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/)
  if (!match) return { data: null, end: 0 }
  const end = match[0].replace(/\r?\n$/, '').split(/\r?\n/).length
  try {
    const data: unknown = parse(match[1]!)
    return {
      data: data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : {},
      end,
    }
  } catch {
    return { data: {}, end }
  }
}

const describe = (error: ErrorObject) => {
  const field = error.instancePath.split('/')[1]
  if (error.keyword === 'required') return `missing required field \`${error.params.missingProperty}\``
  if (error.keyword === 'additionalProperties') return `unknown field \`${error.params.additionalProperty}\``
  if (error.keyword === 'false schema') return `\`${field}\` is not allowed on this layer`
  if (error.keyword === 'const') return `\`${field}\` must be \`${error.params.allowedValue}\``
  if (error.keyword === 'enum')
    return `\`${error.instancePath.slice(1)}\` must be one of ${error.params.allowedValues.join(', ')}`
  return `\`${error.instancePath.slice(1) || 'frontmatter'}\` ${error.message}`
}

function checkFrontmatter(
  file: string,
  text: string,
  fm: Frontmatter,
  validate: ReturnType<Ajv2020['compile']>,
  problems: Problem[],
) {
  if (text.charCodeAt(0) === 0xfeff) {
    problems.push({
      file,
      line: 1,
      rule: 'frontmatter',
      message: 'the file starts with a UTF-8 BOM, which hides the frontmatter (ADR-0002)',
    })
    return
  }
  if (!fm.data) {
    problems.push({ file, line: 1, rule: 'frontmatter', message: 'no frontmatter block (REQ-002 AC1)' })
    return
  }
  if (validate(fm.data)) return
  const fieldLine = (field: string | undefined) => {
    const index = text.split(/\r?\n/, fm.end).findIndex((line) => field && line.startsWith(`${field}:`))
    return index >= 0 ? index + 1 : 1
  }
  const seen = new Set<string>()
  for (const error of validate.errors ?? []) {
    if (error.keyword === 'if') continue // the failing branch reports its own error
    const message = describe(error)
    if (seen.has(message)) continue
    seen.add(message)
    const field = error.params.missingProperty ?? error.params.additionalProperty ?? error.instancePath.split('/')[1]
    problems.push({ file, line: fieldLine(field), rule: 'frontmatter', message: `${message} (REQ-002)` })
  }
}

interface Heading {
  level: number
  text: string
  line: number
}

function checkHeadings(file: string, fm: Record<string, unknown>, lines: Line[], problems: Problem[]) {
  const headings: Heading[] = []
  for (const line of lines.filter(prose)) {
    const match = line.text.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/)
    if (match) headings.push({ level: match[1]!.length, text: (match[2] ?? '').trim(), line: line.n })
  }

  const h1s = headings.filter((h) => h.level === 1)
  if (h1s.length !== 1) {
    problems.push({
      file,
      line: h1s[1]?.line ?? 1,
      rule: 'headings',
      message: `expected exactly one H1, found ${h1s.length} (§4.2)`,
    })
  } else if (typeof fm.title === 'string' && h1s[0]!.text !== fm.title) {
    problems.push({
      file,
      line: h1s[0]!.line,
      rule: 'headings',
      message: `H1 "${h1s[0]!.text}" must equal the frontmatter title "${fm.title}" (§4.2)`,
    })
  }

  if (typeof fm.layer !== 'string') return
  const expected = requiredHeadings(fm.layer)
  const h2s = headings.filter((h) => h.level === 2)
  const actual = h2s.map((h) => h.text)
  if (actual.join('\n') !== expected.join('\n')) {
    const missing = expected.filter((h) => !actual.includes(h))
    const extra = actual.filter((h) => !expected.includes(h))
    const detail = [
      missing.length ? `missing: ${missing.join(', ')}` : '',
      extra.length ? `not allowed: ${extra.join(', ')}` : '',
      !missing.length && !extra.length ? 'out of order' : '',
    ]
      .filter(Boolean)
      .join('; ')
    const first = h2s.find((h, i) => h.text !== expected[i])
    problems.push({
      file,
      line: first?.line ?? h2s.at(-1)?.line ?? h1s[0]?.line ?? 1,
      rule: 'headings',
      message: `H2 headings for layer \`${fm.layer}\` must be, in order: ${expected.join(', ')} (${detail}) (REQ-003 AC1)`,
    })
  }

  // Each H2 section runs to the next H2. REQ-003 AC2 and the Usage rules H3s from §4.2 row 6.
  h2s.forEach((h2, i) => {
    const end = h2s[i + 1]?.line ?? Infinity
    const body = lines.filter((line) => line.n > h2.line && line.n < end && !line.frontmatter)
    const content = body.filter((line) => line.text.trim() !== '')
    const notApplicable = body.some((line) => !line.fence && line.text.trim() === NOT_APPLICABLE)
    if (notApplicable && !(content.length === 1 && content[0]!.text.trim() === NOT_APPLICABLE)) {
      problems.push({
        file,
        line: h2.line,
        rule: 'not-applicable',
        message: `"${h2.text}" contains \`${NOT_APPLICABLE}\`, so it must contain that single line and nothing else (REQ-003 AC2)`,
      })
    }
    if (h2.text === 'Usage rules' && !notApplicable) {
      const h3s = headings.filter((h) => h.level === 3 && h.line > h2.line && h.line < end).map((h) => h.text)
      const found = h3s.filter((h) => USAGE_H3S.includes(h))
      if (found.join('\n') !== USAGE_H3S.join('\n')) {
        problems.push({
          file,
          line: h2.line,
          rule: 'headings',
          message: `"Usage rules" must have the H3s ${USAGE_H3S.join(' and ')}, in that order (§4.2)`,
        })
      }
    }
  })
}

function checkStableCallouts(file: string, fm: Record<string, unknown>, lines: Line[], problems: Problem[]) {
  if (fm.status !== 'stable') return
  for (const line of lines.filter(prose)) {
    if (/^ {0,3}>\s*\*\*(?:Draft:\*\*|TBD)/.test(line.text)) {
      problems.push({
        file,
        line: line.n,
        rule: 'stable-callout',
        message: 'a `stable` doc contains a Draft or TBD callout (REQ-037)',
      })
    }
  }
}

export function checkFile(
  file: string,
  text: string,
  validate: ReturnType<Ajv2020['compile']>,
): { problems: Problem[]; slug?: string } {
  const problems: Problem[] = []
  const isDoc = file.startsWith('docs/')
  const exempt = !isDoc || EXEMPT.includes(file)
  const fm = isDoc && !EXEMPT.includes(file) ? readFrontmatter(text) : { data: null, end: 0 }
  const lines = scan(file, text, fm.end, problems)

  checkHex(file, lines, problems)
  checkMdc(file, lines, problems)
  checkCopyLocale(file, lines, problems)
  if (exempt) return { problems }

  checkFrontmatter(file, text, fm, validate, problems)
  const data = fm.data ?? {}
  checkHeadings(file, data, lines, problems)
  checkStableCallouts(file, data, lines, problems)
  return { problems, slug: typeof data.slug === 'string' ? data.slug : undefined }
}

export function compileSchema() {
  const schema = JSON.parse(readFileSync(join(repoRoot, 'docs/_schema/frontmatter.schema.json'), 'utf8'))
  return new Ajv2020({ allErrors: true, allowUnionTypes: true }).compile(schema)
}

// Checks every docs/**/*.md and DESIGN.md under `root`. The schema is always this repository's.
export function checkDocs(root: string = repoRoot): Problem[] {
  const validate = compileSchema()
  const docs = existsSync(join(root, 'docs'))
    ? readdirSync(join(root, 'docs'), { recursive: true, encoding: 'utf8' })
        .map((path) => `docs/${path.replaceAll('\\', '/')}`)
        .filter((path) => path.endsWith('.md'))
        .sort()
    : []
  const files = existsSync(join(root, 'DESIGN.md')) ? ['DESIGN.md', ...docs] : docs

  const problems: Problem[] = []
  const slugs = new Map<string, string>()
  for (const file of files) {
    const result = checkFile(file, readFileSync(join(root, file), 'utf8'), validate)
    problems.push(...result.problems)
    if (!result.slug) continue
    const other = slugs.get(result.slug)
    if (other)
      problems.push({
        file,
        line: 1,
        rule: 'slug',
        message: `slug \`${result.slug}\` is already used by ${other} (§4.3)`,
      })
    else slugs.set(result.slug, file)
  }
  return problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

// Usage: node scripts/check-docs.ts [root]. The root defaults to this repository; tests pass a fixture root.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const problems = checkDocs(process.argv[2] ? resolve(process.argv[2]) : repoRoot)
  for (const p of problems) console.error(`${p.file}:${p.line}  ${p.rule}  ${p.message}`)
  if (problems.length) {
    console.error(`\ncheck-docs: ${problems.length} problem(s) in ${new Set(problems.map((p) => p.file)).size} file(s)`)
    process.exitCode = 1
  } else {
    console.log('check-docs: all docs pass')
  }
}
