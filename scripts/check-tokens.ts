// T3.1: `pnpm check:tokens` validates the DTCG token sources in tokens/ (SPEC.md §0.3).
// Rules: json, structure, type, value, reference (REQ-010 AC1: DTCG), tier (REQ-010 AC1 location, AC2, AC3),
// metadata and source (REQ-014), tbd and placeholder (§4.4, ADR-0006), naming (REQ-017).
//
// DTCG values use the string forms that Style Dictionary 5.5.5 reads (ADR-0003): colors are `#rrggbb` or
// `#rrggbbaa`, dimensions are `<number>px` or `<number>rem`, and durations are `<number>ms` or `<number>s`.
// A token whose type cannot be determined (no `$type` on it or its groups, and not a reference) falls back to
// its JSON type, as in the DTCG drafts, so it must hold a string, number, or boolean.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export type TokenRule =
  | 'json'
  | 'structure'
  | 'type'
  | 'value'
  | 'reference'
  | 'tier'
  | 'metadata'
  | 'source'
  | 'tbd'
  | 'placeholder'
  | 'naming'

export interface TokenProblem {
  file: string
  path: string // dotted DTCG path of the token or group, or '' for the whole file
  rule: TokenRule
  message: string
}

export type Tier = 'primitive' | 'semantic' | 'component'

export interface Token {
  file: string
  tier: Tier
  path: string
  value: unknown
  type: string | undefined // own `$type`, or the nearest group's; references are followed by `typeOf`
  description: unknown
  cn: Record<string, unknown> | undefined // $extensions.cn
}

export interface TokenReport {
  files: string[]
  tokens: Token[]
  problems: TokenProblem[]
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TIERS: Tier[] = ['primitive', 'semantic', 'component']
const ADR_DIR = 'docs/06-governance/decisions'
// REQ-015 files sit next to the tier directories; they hold pairs, not tokens.
const NOT_SOURCES = ['tokens/contrast-pairs.json', 'tokens/contrast-forbidden.json']
// §4.4 and ADR-0006: placeholders live in one file, under one group, with one description prefix.
export const PLACEHOLDER_FILE = 'tokens/primitive/_placeholder.json'
const PLACEHOLDER_GROUP = 'placeholder'
const PLACEHOLDER_DESCRIPTION = 'Placeholder, not a brand value.'

const STATUSES = ['stable', 'tbd', 'derived-pending', 'deprecated']
const GROUP_KEYS = ['$type', '$description', '$extensions', '$deprecated']
const TOKEN_KEYS = ['$value', ...GROUP_KEYS]
const TBD_ID = /^TBD-\d{2}$/
// REQ-017 AC2: a path segment is lowercase kebab-case or camelCase and starts with a letter (ADR-0006 renames `2xl`).
export const SEGMENT = /^[a-z][a-z0-9]*(?:(?:-[a-z0-9]+)+|(?:[A-Z][a-z0-9]*)+)?$/
const ALIAS = /^\{([^{}]+)\}$/

const COLOR = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const NUMBER = String.raw`-?(?:\d+(?:\.\d+)?|\.\d+)`
const DIMENSION = new RegExp(`^${NUMBER}(?:px|rem)$`)
const DURATION = new RegExp(`^${NUMBER}(?:ms|s)$`)
const FONT_WEIGHTS = [
  'thin',
  'hairline',
  'extra-light',
  'ultra-light',
  'light',
  'normal',
  'regular',
  'book',
  'medium',
  'semi-bold',
  'demi-bold',
  'bold',
  'extra-bold',
  'ultra-bold',
  'black',
  'heavy',
  'extra-black',
  'ultra-black',
]
const STROKE_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset']
const LINE_CAPS = ['round', 'butt', 'square']
// DTCG composite types: each field and the type its value (or the token it references) must have.
const COMPOSITES: Record<string, Record<string, string>> = {
  border: { color: 'color', width: 'dimension', style: 'strokeStyle' },
  transition: { duration: 'duration', delay: 'duration', timingFunction: 'cubicBezier' },
  shadow: { color: 'color', offsetX: 'dimension', offsetY: 'dimension', blur: 'dimension', spread: 'dimension' },
  typography: {
    fontFamily: 'fontFamily',
    fontSize: 'dimension',
    fontWeight: 'fontWeight',
    letterSpacing: 'dimension',
    lineHeight: 'number',
  },
}
const TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'strokeStyle',
  'gradient',
  ...Object.keys(COMPOSITES),
]

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const aliasOf = (value: unknown) => (typeof value === 'string' ? value.match(ALIAS)?.[1] : undefined)

// REQ-017 AC1: the DTCG path `color.bg.base` maps to `--cn-color-bg-base`.
export const cssVariable = (path: string) => `--cn-${path.split('.').join('-')}`
// Style Dictionary's `name/kebab` also splits camelCase segments (ADR-0003); names must stay unique under it too.
const kebabVariable = (path: string) =>
  `--cn-${path
    .split('.')
    .map((segment) => segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-')}`

function listJson(root: string): string[] {
  if (!existsSync(join(root, 'tokens'))) return []
  return readdirSync(join(root, 'tokens'), { recursive: true, encoding: 'utf8' })
    .map((path) => `tokens/${path.replaceAll('\\', '/')}`)
    .filter((path) => path.endsWith('.json'))
    .sort()
}

// Every string in a value: whole-value references are `{path}`, and DTCG allows no other use of braces.
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (isObject(value)) return Object.values(value).flatMap(strings)
  return []
}

// The leaves of a value: scalars, or references standing in for a whole sub-value.
function leaves(value: unknown): unknown[] {
  if (Array.isArray(value)) return value.flatMap(leaves)
  if (isObject(value)) return Object.values(value).flatMap(leaves)
  return [value]
}

interface Check {
  rule: 'type' | 'value'
  message: string
}

// REQ-010 AC1: a value is valid for its DTCG type. A reference is valid when the token it names has that type.
function checkValue(value: unknown, type: string, typeOf: (path: string) => string | undefined): Check[] {
  const alias = aliasOf(value)
  if (alias !== undefined) {
    const target = typeOf(alias)
    return target && target !== type
      ? [{ rule: 'type', message: `references {${alias}}, a ${target} token, where a ${type} is expected` }]
      : []
  }
  const bad = (expected: string): Check[] => [
    { rule: 'value', message: `${JSON.stringify(value)} is not a valid ${type}: expected ${expected}` },
  ]
  const sub = (v: unknown, t: string) => checkValue(v, t, typeOf)
  switch (type) {
    case 'color':
      return typeof value === 'string' && COLOR.test(value) ? [] : bad('#rrggbb or #rrggbbaa')
    case 'dimension':
      return typeof value === 'string' && DIMENSION.test(value) ? [] : bad('a number with px or rem')
    case 'duration':
      return typeof value === 'string' && DURATION.test(value) ? [] : bad('a number with ms or s')
    case 'number':
      return typeof value === 'number' && Number.isFinite(value) ? [] : bad('a number')
    case 'fontFamily': {
      const names = Array.isArray(value) ? value : [value]
      return names.length && names.every((name) => typeof name === 'string' && name.trim())
        ? []
        : bad('a font name or a non-empty list of font names')
    }
    case 'fontWeight':
      return (typeof value === 'number' && value >= 1 && value <= 1000) ||
        (typeof value === 'string' && FONT_WEIGHTS.includes(value))
        ? []
        : bad('a number from 1 to 1000 or a DTCG weight keyword')
    case 'cubicBezier':
      return Array.isArray(value) &&
        value.length === 4 &&
        value.every((n) => typeof n === 'number' && Number.isFinite(n)) &&
        [value[0], value[2]].every((x) => x >= 0 && x <= 1)
        ? []
        : bad('[x1, y1, x2, y2] with x1 and x2 from 0 to 1')
    case 'strokeStyle':
      if (typeof value === 'string') return STROKE_STYLES.includes(value) ? [] : bad('a DTCG stroke style keyword')
      if (!isObject(value) || !Array.isArray(value.dashArray) || !LINE_CAPS.includes(value.lineCap as string))
        return bad('a keyword, or { dashArray, lineCap }')
      return value.dashArray.flatMap((dash) => sub(dash, 'dimension'))
    case 'gradient':
      if (!Array.isArray(value) || !value.length) return bad('a non-empty list of { color, position } stops')
      return value.flatMap((stop) =>
        isObject(stop) && 'color' in stop && 'position' in stop
          ? [...sub(stop.color, 'color'), ...sub(stop.position, 'number')]
          : bad('a non-empty list of { color, position } stops'),
      )
    case 'shadow':
      if (Array.isArray(value) && value.length) return value.flatMap((layer) => composite(layer, type, typeOf))
      return composite(value, type, typeOf)
    default:
      return composite(value, type, typeOf)
  }
}

function composite(value: unknown, type: string, typeOf: (path: string) => string | undefined): Check[] {
  const fields = COMPOSITES[type]!
  const names = Object.keys(fields)
  if (!isObject(value))
    return [
      { rule: 'value', message: `${JSON.stringify(value)} is not a valid ${type}: expected { ${names.join(', ')} }` },
    ]
  const checks: Check[] = []
  for (const name of names.filter((name) => !(name in value)))
    checks.push({ rule: 'value', message: `a ${type} needs \`${name}\`` })
  for (const [name, sub] of Object.entries(value)) {
    if (type === 'shadow' && name === 'inset') {
      if (typeof sub !== 'boolean') checks.push({ rule: 'value', message: 'shadow `inset` must be true or false' })
    } else if (!(name in fields)) {
      checks.push({ rule: 'value', message: `a ${type} has no \`${name}\` field` })
    } else {
      checks.push(...checkValue(sub, fields[name]!, typeOf))
    }
  }
  return checks
}

export function checkTokens(root: string = repoRoot): TokenReport {
  const problems: TokenProblem[] = []
  const tokens: Token[] = []
  const files: string[] = []
  const add = (file: string, path: string, rule: TokenRule, message: string) =>
    problems.push({ file, path, rule, message })

  // REQ-014 AC3: sources are BR IDs from SPEC.md §2.1, or ADRs that exist.
  const spec = existsSync(join(root, 'SPEC.md')) ? readFileSync(join(root, 'SPEC.md'), 'utf8') : ''
  const brIds = new Set([...spec.matchAll(/^\| (BR-\d{2}) \|/gm)].map((m) => m[1]!))
  const adrFiles = existsSync(join(root, ADR_DIR)) ? readdirSync(join(root, ADR_DIR)) : []
  const adrExists = (id: string) => adrFiles.some((file) => file.startsWith(`${id.slice(4)}-`) && file.endsWith('.md'))

  // DTCG walk: a node with `$value` is a token, any other node is a group; `$type` on a group is inherited.
  const walk = (file: string, tier: Tier, node: Record<string, unknown>, path: string[], type: string | undefined) => {
    const at = path.join('.')
    for (const key of Object.keys(node).filter((key) => key.startsWith('$') && !GROUP_KEYS.includes(key)))
      add(file, at, 'structure', `unknown group property \`${key}\` (DTCG)`)
    if (node.$type !== undefined && !TYPES.includes(node.$type as string))
      add(file, at, 'type', `unknown $type ${JSON.stringify(node.$type)} (DTCG)`)
    const inherited = TYPES.includes(node.$type as string) ? (node.$type as string) : type

    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue
      const childPath = [...path, key].join('.')
      if (/[{}.]/.test(key)) {
        add(file, childPath, 'structure', 'a DTCG name cannot contain `{`, `}`, or `.`')
        continue
      }
      if (!SEGMENT.test(key))
        add(file, childPath, 'naming', `\`${key}\` is not lowercase kebab-case or camelCase (REQ-017 AC2)`)
      if (!isObject(child)) {
        add(file, childPath, 'structure', 'is neither a group nor a token (DTCG)')
      } else if ('$value' in child) {
        for (const k of Object.keys(child).filter((k) => !TOKEN_KEYS.includes(k)))
          add(
            file,
            childPath,
            'structure',
            k.startsWith('$')
              ? `unknown token property \`${k}\` (DTCG)`
              : `a token cannot contain groups or tokens (\`${k}\`) (DTCG)`,
          )
        if (child.$type !== undefined && !TYPES.includes(child.$type as string))
          add(file, childPath, 'type', `unknown $type ${JSON.stringify(child.$type)} (DTCG)`)
        const extensions = child.$extensions
        tokens.push({
          file,
          tier,
          path: childPath,
          value: child.$value,
          type: TYPES.includes(child.$type as string) ? (child.$type as string) : inherited,
          description: child.$description,
          cn: isObject(extensions) && isObject(extensions.cn) ? extensions.cn : undefined,
        })
      } else {
        walk(file, tier, child, [...path, key], inherited)
      }
    }
  }

  for (const file of listJson(root)) {
    if (NOT_SOURCES.includes(file)) continue
    const tier = TIERS.find((t) => file.startsWith(`tokens/${t}/`))
    if (!tier) {
      add(
        file,
        '',
        'tier',
        'token sources live only in tokens/primitive/, tokens/semantic/, and tokens/component/ (REQ-010 AC1)',
      )
      continue
    }
    files.push(file)
    let json: unknown
    try {
      json = JSON.parse(readFileSync(join(root, file), 'utf8'))
    } catch (error) {
      add(file, '', 'json', `not valid JSON: ${(error as Error).message}`)
      continue
    }
    if (isObject(json)) walk(file, tier, json, [], undefined)
    else add(file, '', 'structure', 'the file must hold one top-level group object (DTCG)')
  }

  // One path, one token, across every file; and a token never sits where another token's group is.
  const byPath = new Map<string, Token>()
  const groups = new Set(
    tokens.flatMap((t) =>
      t.path
        .split('.')
        .slice(0, -1)
        .map((_, i, a) => a.slice(0, i + 1).join('.')),
    ),
  )
  for (const token of tokens) {
    const first = byPath.get(token.path)
    if (first) add(token.file, token.path, 'structure', `is also defined in ${first.file}`)
    else byPath.set(token.path, token)
    if (groups.has(token.path))
      add(token.file, token.path, 'structure', 'is a token and also a group of other tokens (DTCG)')
  }

  const refsOf = (token: Token) => strings(token.value).flatMap((s) => aliasOf(s) ?? [])
  const typeOf = (path: string, seen = new Set<string>()): string | undefined => {
    const token = byPath.get(path)
    if (!token || seen.has(path)) return undefined
    if (token.type) return token.type
    const alias = aliasOf(token.value)
    return alias === undefined ? undefined : typeOf(alias, seen.add(path))
  }
  // Every token reachable through references, the token itself excluded unless there is a cycle.
  const reachable = (start: Token): Set<string> => {
    const seen = new Set<string>()
    const stack = refsOf(start)
    while (stack.length) {
      const path = stack.pop()!
      if (seen.has(path)) continue
      seen.add(path)
      const next = byPath.get(path)
      if (next) stack.push(...refsOf(next))
    }
    return seen
  }
  const isPlaceholder = (path: string) => byPath.get(path)?.file === PLACEHOLDER_FILE

  const cssNames = new Map<string, string>()
  const kebabNames = new Map<string, string>()

  for (const token of tokens) {
    const { file, path, tier } = token
    const refs = refsOf(token)
    const status = token.cn?.status

    // REQ-010 AC1: references are whole values that name existing tokens, without cycles.
    for (const s of strings(token.value))
      if (aliasOf(s) === undefined && /[{}]/.test(s))
        add(file, path, 'reference', `${JSON.stringify(s)}: a DTCG reference is a whole value, \`{group.token}\``)
    for (const ref of refs.filter((ref) => !byPath.has(ref)))
      add(file, path, 'reference', `references {${ref}}, which is not a token`)
    const deps = reachable(token)
    if (deps.has(path)) add(file, path, 'reference', 'is part of a circular reference')

    // REQ-010 AC1: the value fits the DTCG type.
    const alias = aliasOf(token.value)
    if (token.type) {
      for (const check of checkValue(token.value, token.type, (p) => (p === path ? undefined : typeOf(p))))
        add(file, path, check.rule, check.message)
    } else if (alias === undefined && !['string', 'number', 'boolean'].includes(typeof token.value)) {
      add(file, path, 'type', 'has no $type, so its value must be a string, number, or boolean (DTCG)')
    }

    // REQ-010 AC2 and AC3: raw values only in primitives; semantic → primitive, component → semantic.
    const allowed: Tier = tier === 'component' ? 'semantic' : 'primitive'
    if (tier !== 'primitive' && leaves(token.value).some((leaf) => aliasOf(leaf) === undefined))
      add(
        file,
        path,
        'tier',
        `a ${tier} token holds references only; raw values belong in primitive tokens (REQ-010 AC3)`,
      )
    for (const ref of refs) {
      const target = byPath.get(ref)
      if (target && target.tier !== allowed)
        add(
          file,
          path,
          'tier',
          `${tier} tokens reference only ${allowed} tokens, but {${ref}} is ${target.tier} (REQ-010 AC2)`,
        )
    }

    // REQ-014 AC1 and AC2.
    if (typeof token.description !== 'string' || !token.description.trim())
      add(file, path, 'metadata', 'has no $description (REQ-014 AC1)')
    if (!STATUSES.includes(status as string))
      add(
        file,
        path,
        'metadata',
        `$extensions.cn.status must be one of ${STATUSES.join(', ')}, not ${JSON.stringify(status)} (REQ-014 AC2)`,
      )

    // REQ-014 AC3: a stable raw value names where it comes from: a BR ID (BC), or the ADR that recorded it (§4.4).
    const source = token.cn?.source
    if (source !== undefined) {
      const ids = Array.isArray(source) ? source : [source]
      for (const id of ids)
        if (!(
          typeof id === 'string' &&
          ((/^BR-\d{2}$/.test(id) && brIds.has(id)) || (/^ADR-\d{4}$/.test(id) && adrExists(id)))
        ))
          add(file, path, 'source', `source ${JSON.stringify(id)} is not a BR ID from SPEC.md §2.1 or an existing ADR`)
      if (!ids.length) add(file, path, 'source', '$extensions.cn.source is empty')
    } else if (status === 'stable' && !refs.length) {
      add(
        file,
        path,
        'source',
        'a stable raw value names its BR ID (or the ADR that recorded it) in $extensions.cn.source (REQ-014 AC3)',
      )
    }

    // §4.4: tbd and derived-pending tokens name their §2.4 items; stable and deprecated tokens name none.
    const tbd = token.cn?.tbd
    if (status === 'tbd' || status === 'derived-pending') {
      if (!Array.isArray(tbd) || !tbd.length || !tbd.every((id) => typeof id === 'string' && TBD_ID.test(id)))
        add(file, path, 'tbd', `a ${status} token lists its TBD IDs in $extensions.cn.tbd, e.g. ["TBD-05"] (§4.4)`)
      else if (status === 'derived-pending' && (tbd.length !== 1 || tbd[0] !== 'TBD-08'))
        add(file, path, 'tbd', 'a derived-pending token has $extensions.cn.tbd ["TBD-08"] (§4.4, C-06)')
    } else if (tbd !== undefined) {
      add(file, path, 'tbd', `a ${String(status)} token has no $extensions.cn.tbd (§4.4)`)
    }

    // §4.4 and ADR-0006: placeholders are raw, tbd, labeled, and kept apart; tbd tokens point at them.
    const inPlaceholderFile = file === PLACEHOLDER_FILE
    const underPlaceholder = path.split('.')[0] === PLACEHOLDER_GROUP
    if (inPlaceholderFile) {
      if (!underPlaceholder)
        add(file, path, 'placeholder', `tokens in ${PLACEHOLDER_FILE} live under \`${PLACEHOLDER_GROUP}\` (ADR-0006)`)
      if (status !== 'tbd') add(file, path, 'placeholder', 'every placeholder has status tbd (§4.4)')
      if (refs.length) add(file, path, 'placeholder', 'a placeholder holds its raw value, not a reference (ADR-0006)')
      if (typeof token.description === 'string' && !token.description.startsWith(PLACEHOLDER_DESCRIPTION))
        add(
          file,
          path,
          'placeholder',
          `a placeholder's $description starts with "${PLACEHOLDER_DESCRIPTION}" (ADR-0006)`,
        )
    } else {
      if (underPlaceholder)
        add(file, path, 'placeholder', `\`${PLACEHOLDER_GROUP}.*\` tokens live only in ${PLACEHOLDER_FILE} (ADR-0006)`)
      const placeholderDeps = [...deps].some(isPlaceholder)
      if (status === 'tbd' && !refs.length)
        add(file, path, 'placeholder', `a tbd token references a placeholder; it never holds a raw value (§4.4)`)
      else if (status === 'tbd' && !placeholderDeps)
        add(file, path, 'placeholder', `a tbd token references a placeholder in ${PLACEHOLDER_FILE} (§4.4)`)
      if (status === 'stable' && placeholderDeps)
        add(
          file,
          path,
          'placeholder',
          'a stable token cannot depend on a placeholder, which is not a brand value (ADR-0006)',
        )
    }

    // REQ-017 AC1: every token gets its own CSS custom property, whichever way camelCase segments are written.
    if (byPath.get(path) === token) {
      for (const [names, name] of [
        [cssNames, cssVariable(path)],
        [kebabNames, kebabVariable(path)],
      ] as const) {
        const other = names.get(name)
        if (other && other !== path) {
          add(file, path, 'naming', `\`${name}\` is also the CSS name of ${other} (REQ-017 AC1)`)
          break
        }
        names.set(name, path)
      }
    }
  }

  problems.sort((a, b) => a.file.localeCompare(b.file) || a.path.localeCompare(b.path) || a.rule.localeCompare(b.rule))
  return { files, tokens, problems }
}

// Usage: node scripts/check-tokens.ts [root]. The root defaults to this repository; tests pass a fixture root.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = process.argv[2] ? resolve(process.argv[2]) : repoRoot
  const { files, tokens, problems } = checkTokens(root)
  const count = (tier: Tier) => tokens.filter((t) => t.tier === tier).length
  for (const p of problems) console.error(`${p.file}${p.path ? ` ${p.path}` : ''}  ${p.rule}  ${p.message}`)
  console.log(
    `check-tokens: ${tokens.length} tokens in ${files.length} files ` +
      `(${count('primitive')} primitive, ${count('semantic')} semantic, ${count('component')} component).`,
  )
  if (problems.length) {
    console.error(`\ncheck-tokens: ${problems.length} problem(s)`)
    process.exitCode = 1
  }
}
