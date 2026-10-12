// T11.4: `pnpm release:check` is the 1.0 gate (SPEC.md Â§4.8, REQ-018).
// AC1: a component doc with `status: stable` fails the gate if any token it lists in `tokens:`, or any token that
//      one references (directly or through a chain), has status `tbd` or `derived-pending`.
// AC2: for a version of 1.0.0 or later, a doc under docs/01-foundations/ with status `tbd` fails the gate.
// The gate is necessary, not sufficient: the owner decides in an ADR (T12.3).
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { readFrontmatter } from './check-docs.ts'
import { checkTokens, type Token } from './check-tokens.ts'

export type ReleaseRule = 'stable-component' | 'foundation-tbd'

export interface ReleaseProblem {
  file: string
  rule: ReleaseRule
  message: string
}

export interface PendingToken {
  path: string
  status: 'tbd' | 'derived-pending'
  tbd: string[] // $extensions.cn.tbd
  // The listed tokens whose reference chain reaches it; the token itself when it is listed.
  via: string[]
}

export interface StableComponent {
  file: string
  slug: string
  pending: PendingToken[]
}

export interface ReleaseReport {
  version: string
  foundationGate: boolean // true when the version is 1.0.0 or later, so AC2 applies
  stableComponents: number
  components: StableComponent[] // stable component docs that reach a pending token
  foundations: { file: string; status: string }[] // 01-foundations docs with status tbd
  problems: ReleaseProblem[]
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ALIAS = /^\{([^{}]+)\}$/
const PENDING = ['tbd', 'derived-pending']

// Same matching rule as `cn:generated` blocks (Â§4.5): a prefix names a token or the group of tokens under it.
const matches = (path: string, prefixes: string[]) =>
  prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`))

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}
const refsOf = (token: Token) => strings(token.value).flatMap((s) => s.match(ALIAS)?.[1] ?? [])

function listDocs(root: string, dir: string): string[] {
  if (!existsSync(join(root, dir))) return []
  return readdirSync(join(root, dir), { recursive: true, encoding: 'utf8' })
    .map((path) => `${dir}/${path.replaceAll('\\', '/')}`)
    .filter((path) => path.endsWith('.md'))
    .sort()
}

// The lockstep version (A-04): every package carries the same one, so the tokens package speaks for all three.
function currentVersion(root: string): string {
  const file = join(root, 'packages/tokens/package.json')
  if (!existsSync(file)) return '0.0.0'
  return String((JSON.parse(readFileSync(file, 'utf8')) as { version?: unknown }).version ?? '0.0.0')
}

export function releaseCheck(root: string = repoRoot, version: string = currentVersion(root)): ReleaseReport {
  const problems: ReleaseProblem[] = []
  const { tokens } = checkTokens(root)
  const byPath = new Map(tokens.map((token) => [token.path, token]))
  const isPending = (token: Token | undefined): token is Token =>
    token !== undefined && PENDING.includes(token.cn?.status as string)

  // Every token reachable from `start` through references, `start` included.
  const chain = (start: Token): Token[] => {
    const seen = new Set<string>([start.path])
    const stack = [start]
    while (stack.length) {
      for (const ref of refsOf(stack.pop()!)) {
        const next = byPath.get(ref)
        if (!next || seen.has(ref)) continue
        seen.add(ref)
        stack.push(next)
      }
    }
    return [...seen].map((path) => byPath.get(path)!)
  }

  const components: StableComponent[] = []
  const foundations: ReleaseReport['foundations'] = []
  let stableComponents = 0

  for (const file of listDocs(root, 'docs')) {
    const data = readFrontmatter(readFileSync(join(root, file), 'utf8')).data
    if (!data) continue
    const status = String(data.status)

    if (file.startsWith('docs/01-foundations/') && status === 'tbd') foundations.push({ file, status })
    if (data.layer !== 'component' || status !== 'stable') continue

    stableComponents++
    const listed = Array.isArray(data.tokens) ? data.tokens.map(String) : []
    const pending = new Map<string, PendingToken>()
    for (const token of tokens.filter((t) => matches(t.path, listed))) {
      for (const reached of chain(token).filter(isPending)) {
        const entry = pending.get(reached.path) ?? {
          path: reached.path,
          status: reached.cn!.status as PendingToken['status'],
          tbd: Array.isArray(reached.cn!.tbd) ? reached.cn!.tbd.map(String) : [],
          via: [],
        }
        entry.via.push(token.path)
        pending.set(reached.path, entry)
      }
    }
    if (pending.size)
      components.push({
        file,
        slug: String(data.slug ?? file),
        pending: [...pending.values()].sort((a, b) => a.path.localeCompare(b.path)),
      })
  }

  for (const component of components) {
    const ids = [...new Set(component.pending.flatMap((p) => p.tbd))].sort()
    problems.push({
      file: component.file,
      rule: 'stable-component',
      message:
        `status is stable, but it reaches ${component.pending.length} token(s) that are tbd or derived-pending` +
        `${ids.length ? ` (${ids.join(', ')})` : ''} (REQ-018 AC1)`,
    })
  }

  const major = Number.parseInt(version.split('.')[0] ?? '0', 10)
  const foundationGate = Number.isFinite(major) && major >= 1
  if (foundationGate)
    for (const doc of foundations)
      problems.push({
        file: doc.file,
        rule: 'foundation-tbd',
        message: `status is tbd, and version ${version} needs every foundation doc resolved (REQ-018 AC2)`,
      })

  return { version, foundationGate, stableComponents, components, foundations, problems }
}

// Usage: node scripts/release-check.ts [root] [--version X.Y.Z]. The root defaults to this repository, and the
// version to the one in packages/tokens/package.json. The T12.3 review passes the version it is about to release.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  const at = args.indexOf('--version')
  const version = at >= 0 ? args.splice(at, 2)[1] : undefined
  const root = args[0] ? resolve(args[0]) : repoRoot

  const report = releaseCheck(root, version)
  for (const component of report.components) {
    console.error(`${component.file}  stable-component  reaches ${component.pending.length} pending token(s):`)
    for (const token of component.pending) {
      const via = token.via.length === 1 && token.via[0] === token.path ? 'listed' : `via ${token.via.join(', ')}`
      console.error(`    ${token.path}  ${token.status} ${token.tbd.join(', ')}  (${via})`)
    }
  }
  for (const problem of report.problems.filter((p) => p.rule === 'foundation-tbd'))
    console.error(`${problem.file}  ${problem.rule}  ${problem.message}`)
  console.log(
    `release-check: version ${report.version}; ${report.components.length} of ${report.stableComponents} stable ` +
      `component docs reach a tbd or derived-pending token; ${report.foundations.length} foundation docs are tbd` +
      `${report.foundationGate ? '' : ' (checked only for 1.0.0 or later)'}.`,
  )
  if (report.problems.length) {
    console.error(`\nrelease-check: ${report.problems.length} problem(s). 1.0.0 is blocked (REQ-018).`)
    process.exitCode = 1
  } else {
    console.log('release-check: the 1.0 gate passes. The owner still decides in an ADR (T12.3).')
  }
}
