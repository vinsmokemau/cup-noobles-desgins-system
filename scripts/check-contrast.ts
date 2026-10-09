// T3.5: `check-contrast` checks the declared color pairs in tokens/contrast-pairs.json (REQ-015). `pnpm check:tokens`
// runs it after check-tokens (SPEC.md §0.3: "Validates the token schema, tier references, and contrast pairs").
//
// Each pair's tokens are resolved through their references to literal colors, the same values the token build writes,
// and the WCAG 2.x contrast ratio is computed from them (AC2). A pair passes at 4.5:1 for `text`, 3:1 for
// `large-text`, and 3:1 for `ui`; the ratio is compared unrounded and reported to 2 decimals. A pair that involves a
// `tbd` token, directly or through its references, is reported as unverified, never as passing (AC4). A pair whose
// resolved colors are a combination from tokens/contrast-forbidden.json fails, whatever its status or tier (AC3).
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { checkTokens, type Token } from './check-tokens.ts'
import { MINIMUMS, contrastRatio, round, type Usage } from './contrast.ts'

export type Result = 'pass' | 'fail' | 'unverified'

export interface PairResult {
  foreground: string
  background: string
  usage: Usage
  foregroundValue: string
  backgroundValue: string
  ratio: number // rounded to 2 decimals
  minimum: number
  result: Result
  tbd: string[] // the tbd tokens that make the pair unverified
}

export interface ForbiddenResult {
  foreground: string
  background: string
  foregroundValue: string
  backgroundValue: string
  ratio: number // rounded to 2 decimals
}

export interface ContrastProblem {
  file: string
  index: number // position of the entry in the file, or -1 for the whole file
  message: string
}

export interface ContrastReport {
  pairs: PairResult[]
  forbidden: ForbiddenResult[]
  problems: ContrastProblem[]
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const PAIRS_FILE = 'tokens/contrast-pairs.json'
export const FORBIDDEN_FILE = 'tokens/contrast-forbidden.json'
const COLOR = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const ALIAS = /^\{([^{}]+)\}$/

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// The math lives in contrast.ts so the showcase can use it too (T6.2); it is re-exported for existing importers.
export { MINIMUMS, contrastRatio, round, type Usage }

export function checkContrast(root: string = repoRoot): ContrastReport {
  const problems: ContrastProblem[] = []
  const pairs: PairResult[] = []
  const forbidden: ForbiddenResult[] = []

  // Token problems are check-tokens' to report; this only needs the tokens.
  const byPath = new Map<string, Token>()
  for (const token of checkTokens(root).tokens) if (!byPath.has(token.path)) byPath.set(token.path, token)

  // A token path, followed through whole-value references to a color literal, with the tbd tokens on the way.
  const resolveColor = (path: string): { value: string; tbd: string[] } | string => {
    const tbd: string[] = []
    const seen = new Set<string>()
    let token = byPath.get(path)
    if (!token) return `{${path}} is not a token`
    for (;;) {
      if (seen.has(token.path)) return `{${path}} is part of a circular reference`
      seen.add(token.path)
      if (token.cn?.status === 'tbd') tbd.push(token.path)
      const alias = typeof token.value === 'string' ? token.value.match(ALIAS)?.[1] : undefined
      if (alias === undefined) break
      const next = byPath.get(alias)
      if (!next) return `{${path}} references {${alias}}, which is not a token`
      token = next
    }
    if (typeof token.value !== 'string' || !COLOR.test(token.value))
      return `{${path}} resolves to ${JSON.stringify(token.value)}, not a #rrggbb or #rrggbbaa color`
    return { value: token.value.toLowerCase(), tbd }
  }

  const readList = (file: string): unknown[] => {
    if (!existsSync(join(root, file))) {
      problems.push({ file, index: -1, message: 'is missing (REQ-015)' })
      return []
    }
    try {
      const json: unknown = JSON.parse(readFileSync(join(root, file), 'utf8'))
      if (Array.isArray(json)) return json
      problems.push({ file, index: -1, message: 'must hold a list' })
    } catch (error) {
      problems.push({ file, index: -1, message: `not valid JSON: ${(error as Error).message}` })
    }
    return []
  }

  // REQ-015 AC3: forbidden combinations are token paths or color literals, resolved to their values.
  const forbiddenValues: { entry: ForbiddenResult; reason: string }[] = []
  readList(FORBIDDEN_FILE).forEach((entry, index) => {
    const add = (message: string) => problems.push({ file: FORBIDDEN_FILE, index, message })
    if (!isObject(entry) || typeof entry.foreground !== 'string' || typeof entry.background !== 'string') {
      add('each entry has a string `foreground` and `background`')
      return
    }
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) add('each entry gives its `reason`')
    const sides = [entry.foreground, entry.background].map((ref) =>
      COLOR.test(ref) ? { value: ref.toLowerCase(), tbd: [] } : resolveColor(ref),
    )
    const [fg, bg] = sides
    for (const side of sides) if (typeof side === 'string') add(side)
    if (typeof fg === 'string' || typeof bg === 'string') return
    try {
      const result = {
        foreground: entry.foreground,
        background: entry.background,
        foregroundValue: fg!.value,
        backgroundValue: bg!.value,
        ratio: round(contrastRatio(fg!.value, bg!.value)),
      }
      forbidden.push(result)
      forbiddenValues.push({ entry: result, reason: String(entry.reason) })
    } catch (error) {
      add((error as Error).message)
    }
  })

  // REQ-015 AC1, AC2, and AC4: every declared pair.
  readList(PAIRS_FILE).forEach((entry, index) => {
    const add = (message: string) => problems.push({ file: PAIRS_FILE, index, message })
    if (
      !isObject(entry) ||
      typeof entry.foreground !== 'string' ||
      typeof entry.background !== 'string' ||
      typeof entry.usage !== 'string'
    ) {
      add('each pair has a string `foreground`, `background`, and `usage`')
      return
    }
    const { foreground, background } = entry
    const label = `${foreground} on ${background} (${entry.usage})`
    if (!(entry.usage in MINIMUMS)) {
      add(`${label}: usage must be one of ${Object.keys(MINIMUMS).join(', ')}`)
      return
    }
    const usage = entry.usage as Usage
    const fg = resolveColor(foreground)
    const bg = resolveColor(background)
    for (const side of [fg, bg]) if (typeof side === 'string') add(`${label}: ${side}`)
    if (typeof fg === 'string' || typeof bg === 'string') return

    let exact: number
    try {
      exact = contrastRatio(fg.value, bg.value)
    } catch (error) {
      add(`${label}: ${(error as Error).message}`)
      return
    }
    const tbd = [...new Set([...fg.tbd, ...bg.tbd])].sort()
    const minimum = MINIMUMS[usage]
    const result: Result = tbd.length ? 'unverified' : exact >= minimum ? 'pass' : 'fail'
    const ratio = round(exact)
    pairs.push({
      foreground,
      background,
      usage,
      foregroundValue: fg.value,
      backgroundValue: bg.value,
      ratio,
      minimum,
      result,
      tbd,
    })
    if (result === 'fail') add(`${label}: ${ratio.toFixed(2)}:1 is below the ${usage} minimum of ${minimum}:1 (AC2)`)
    for (const { entry: f, reason } of forbiddenValues)
      if (f.foregroundValue === fg.value && f.backgroundValue === bg.value)
        add(`${label}: combines ${f.foreground} on ${f.background}, which is forbidden (AC3). ${reason}`)
  })

  return { pairs, forbidden, problems }
}

// Usage: node scripts/check-contrast.ts [root]. The root defaults to this repository; tests pass a fixture root.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = process.argv[2] ? resolve(process.argv[2]) : repoRoot
  const { pairs, forbidden, problems } = checkContrast(root)
  const ratio = (r: number) => `${r.toFixed(2)}:1`
  for (const p of pairs) {
    const verdict =
      p.result === 'unverified' ? `unverified, tbd: ${p.tbd.join(', ')}` : `${p.result}, minimum ${ratio(p.minimum)}`
    console.log(`${p.foreground} on ${p.background} (${p.usage})  ${ratio(p.ratio)}  ${verdict}`)
  }
  for (const f of forbidden) console.log(`forbidden: ${f.foreground} on ${f.background}  ${ratio(f.ratio)}`)
  for (const p of problems) console.error(`${p.file}${p.index >= 0 ? ` #${p.index}` : ''}  ${p.message}`)
  const count = (result: Result) => pairs.filter((p) => p.result === result).length
  console.log(
    `check-contrast: ${pairs.length} pairs (${count('pass')} pass, ${count('fail')} fail, ` +
      `${count('unverified')} unverified), ${forbidden.length} forbidden combinations.`,
  )
  if (problems.length) {
    console.error(`\ncheck-contrast: ${problems.length} problem(s)`)
    process.exitCode = 1
  }
}
