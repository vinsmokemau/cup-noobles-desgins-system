// T2.3: `check-links` checks every relative link in DESIGN.md and docs/ (REQ-001). It runs in `pnpm check:docs` (§0.3).
// Rules: broken-link and broken-anchor (REQ-001 AC3), orphan (REQ-001 AC2).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, posix, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { prose, readFrontmatter, scan, type Line } from './check-docs.ts'

export type LinkRule = 'broken-link' | 'broken-anchor' | 'orphan'

export interface LinkProblem {
  file: string
  line: number
  rule: LinkRule
  message: string
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// REQ-001 AC2: DESIGN.md links every doc except the template and the ADRs; the decision log links the ADRs.
const ENTRY = 'DESIGN.md'
const DECISION_LOG = 'docs/06-governance/decision-log.md'
const TEMPLATE = 'docs/_template.md'
const isAdr = (file: string) => file.startsWith('docs/06-governance/decisions/')

interface Link {
  line: number
  target: string
}

interface Parsed {
  lines: Line[]
  links: Link[]
  anchors: Set<string>
}

const INLINE_LINK = /!?\[(?:[^\]\\]|\\.)*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g
const REFERENCE_DEFINITION = /^ {0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i

// GitHub's heading anchors (github-slugger): lowercase, drop punctuation except `-` and `_`, one `-` per space.
// Repeated headings get `-1`, `-2`, and so on. Inline markup is removed first, as GitHub renders it.
export function slugify(heading: string): string {
  return heading
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-')
}

function parse(file: string, text: string): Parsed {
  const fm = file.startsWith('docs/') ? readFrontmatter(text) : { end: 0 }
  const lines = scan(file, text, fm.end, [])
  const links: Link[] = []
  const anchors = new Set<string>()
  const seen = new Map<string, number>()

  for (const line of lines.filter(prose)) {
    const heading = line.text.match(/^ {0,3}#{1,6}(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/)
    if (heading) {
      const base = slugify(heading[1] ?? '')
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      anchors.add(count ? `${base}-${count}` : base)
    }
    for (const html of line.text.matchAll(/<a\s[^>]*\b(?:id|name)="([^"]+)"/g)) anchors.add(html[1]!)

    const code = line.text.replace(/(`+)(?:(?!\1)[\s\S])*?\1/g, (span) => ' '.repeat(span.length))
    const definition = code.match(REFERENCE_DEFINITION)
    if (definition) links.push({ line: line.n, target: definition[1]! })
    for (const match of code.matchAll(INLINE_LINK)) links.push({ line: line.n, target: match[1]! })
  }
  for (const link of links) link.target = link.target.replace(/^<(.*)>$/, '$1')
  return { lines, links, anchors }
}

// Case-exact, so a link that only resolves on a case-insensitive file system (Windows, macOS) still fails.
function existsExact(root: string, path: string): boolean {
  let dir = root
  for (const part of path.split('/').filter(Boolean)) {
    if (!existsSync(dir) || !statSync(dir).isDirectory() || !readdirSync(dir).includes(part)) return false
    dir = join(dir, part)
  }
  return true
}

// Checks DESIGN.md and every docs/**/*.md under `root`.
export function checkLinks(root: string = repoRoot): LinkProblem[] {
  const docs = existsSync(join(root, 'docs'))
    ? readdirSync(join(root, 'docs'), { recursive: true, encoding: 'utf8' })
        .map((path) => `docs/${path.replaceAll('\\', '/')}`)
        .filter((path) => path.endsWith('.md'))
        .sort()
    : []
  const files = existsSync(join(root, ENTRY)) ? [ENTRY, ...docs] : docs

  const parsed = new Map<string, Parsed>()
  const read = (file: string) => {
    if (!parsed.has(file)) parsed.set(file, parse(file, readFileSync(join(root, file), 'utf8')))
    return parsed.get(file)!
  }

  const problems: LinkProblem[] = []
  const linkedFrom = new Map<string, Set<string>>() // target file → files that link to it
  for (const file of files) {
    for (const { line, target } of read(file).links) {
      if (EXTERNAL.test(target)) continue
      const hash = target.indexOf('#')
      const path = decodeURIComponent(hash < 0 ? target : target.slice(0, hash))
      const anchor = hash < 0 ? null : decodeURIComponent(target.slice(hash + 1))

      const resolved = !path
        ? file
        : path.startsWith('/')
          ? posix.normalize(path.slice(1))
          : posix.join(posix.dirname(file), path)
      if (resolved.startsWith('..') || !existsExact(root, resolved)) {
        problems.push({
          file,
          line,
          rule: 'broken-link',
          message: `\`${target}\`: ${resolved} does not exist (REQ-001 AC3)`,
        })
        continue
      }
      if (!linkedFrom.has(resolved)) linkedFrom.set(resolved, new Set())
      linkedFrom.get(resolved)!.add(file)

      if (anchor === null || anchor === '') continue
      if (!resolved.endsWith('.md') || statSync(join(root, resolved)).isDirectory()) continue
      if (!read(resolved).anchors.has(anchor))
        problems.push({
          file,
          line,
          rule: 'broken-anchor',
          message: `\`${target}\`: ${resolved} has no heading anchor \`#${anchor}\` (REQ-001 AC3)`,
        })
    }
  }

  for (const file of docs) {
    if (file === TEMPLATE) continue
    const index = isAdr(file) ? DECISION_LOG : ENTRY
    if (!linkedFrom.get(file)?.has(index))
      problems.push({ file, line: 1, rule: 'orphan', message: `not linked from ${index} (REQ-001 AC2)` })
  }
  return problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

// Usage: node scripts/check-links.ts [root]. The root defaults to this repository; tests pass a fixture root.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const problems = checkLinks(process.argv[2] ? resolve(process.argv[2]) : repoRoot)
  for (const p of problems) console.error(`${p.file}:${p.line}  ${p.rule}  ${p.message}`)
  if (problems.length) {
    console.error(
      `\ncheck-links: ${problems.length} problem(s) in ${new Set(problems.map((p) => p.file)).size} file(s)`,
    )
    process.exitCode = 1
  } else {
    console.log('check-links: zero broken links and zero orphan docs')
  }
}
