// T3.4: the token build (REQ-013). Style Dictionary reads the DTCG sources in tokens/ and writes four outputs:
// dist/css/tokens.css, dist/json/tokens.flat.json, dist/ts/tokens.ts, and dist/email/email-tokens.json.
// The configuration and the three custom formats follow ADR-0003; CSS names are `name/kebab` (ADR-0008).
//
// Determinism (REQ-013 AC2): every output is sorted, so source order never shows, and nothing writes a timestamp.
// Usage: node packages/tokens/build.ts [outDir] [--reverse-sources]. The default outDir is packages/tokens/dist.
import StyleDictionary from 'style-dictionary'
import type { Config, FormatFn, TransformedToken } from 'style-dictionary/types'
import { fileHeader } from 'style-dictionary/utils'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const defaultTokensDir = resolve(here, '../../tokens')
// ADR-0003: sources are listed tier by tier. REQ-015's contrast files sit beside the tiers and are not sources.
const TIERS = ['primitive', 'semantic', 'component'] as const
const posix = (path: string) => path.replaceAll('\\', '/')

export const OUTPUTS = ['css/tokens.css', 'json/tokens.flat.json', 'ts/tokens.ts', 'email/email-tokens.json'] as const

const dotted = (token: TransformedToken) => token.path.join('.')

// Code-unit order, not localeCompare, so the order cannot depend on the machine's locale.
const byPath = (tokens: TransformedToken[]) =>
  [...tokens].sort((a, b) => (dotted(a) < dotted(b) ? -1 : dotted(a) > dotted(b) ? 1 : 0))

// ADR-0003: a second guard on REQ-013 AC1. A resolved value never holds a reference or a `var()`.
function resolved(token: TransformedToken): string | number | boolean {
  const value: unknown = token.$value
  if (!['string', 'number', 'boolean'].includes(typeof value))
    throw new Error(`${dotted(token)}: ${JSON.stringify(value)} did not resolve to one literal value`)
  if (/\{|var\(/.test(String(value)))
    throw new Error(`${dotted(token)}: ${JSON.stringify(value)} still holds a reference or var()`)
  return value as string | number | boolean
}

const tierOf = (token: TransformedToken) => {
  const tier = posix(token.filePath).match(/\/tokens\/(primitive|semantic|component)\//)?.[1]
  if (!tier) throw new Error(`${dotted(token)}: ${token.filePath} is not in a tier directory`)
  return tier
}

// Flat JSON for the /tokens explorer (REQ-053): keyed by DTCG path, with the CSS variable, the resolved value, the
// DTCG type, the tier, and the metadata from REQ-014.
const jsonFlat: FormatFn = ({ dictionary }) => {
  const flat: Record<string, unknown> = {}
  for (const token of byPath(dictionary.allTokens)) {
    const cn = (token.$extensions as { cn?: Record<string, unknown> } | undefined)?.cn ?? {}
    flat[dotted(token)] = {
      cssVar: `--${token.name}`,
      value: resolved(token),
      type: token.$type ?? null,
      tier: tierOf(token),
      status: cn.status ?? null,
      description: token.$description ?? null,
      ...(cn.tbd === undefined ? {} : { tbd: cn.tbd }),
      ...(cn.source === undefined ? {} : { source: cn.source }),
    }
  }
  return `${JSON.stringify(flat, null, 2)}\n`
}

// Typed constants: one path-keyed object `as const`, and the union of its paths.
const tsConstants: FormatFn = async ({ dictionary, file }) => {
  const rows = byPath(dictionary.allTokens).map(
    (token) => `  ${JSON.stringify(dotted(token))}: ${JSON.stringify(resolved(token))},`,
  )
  return (
    (await fileHeader({ file })) +
    `export const tokens = {\n${rows.join('\n')}\n} as const\n\nexport type TokenPath = keyof typeof tokens\n`
  )
}

// Email-safe values (§4.9): DTCG path → literal, for the `$cn(path)` lookup in packages/email.
const jsonEmail: FormatFn = ({ dictionary }) => {
  const email: Record<string, string | number | boolean> = {}
  for (const token of byPath(dictionary.allTokens)) email[dotted(token)] = resolved(token)
  return `${JSON.stringify(email, null, 2)}\n`
}

StyleDictionary.registerFormat({ name: 'cn/json-flat', format: jsonFlat })
StyleDictionary.registerFormat({ name: 'cn/ts-constants', format: tsConstants })
StyleDictionary.registerFormat({ name: 'cn/json-email', format: jsonEmail })

// `tokensDir` defaults to this repository's tokens/; sync-docs tests pass a fixture's.
export function config(outDir: string, { reverseSources = false, tokensDir = defaultTokensDir } = {}): Config {
  const sources = TIERS.map((tier) => `${posix(tokensDir)}/${tier}/**/*.json`)
  const platform = (dir: string, destination: string, format: string, options = {}) => ({
    transformGroup: 'css',
    prefix: 'cn',
    buildPath: `${posix(resolve(outDir, dir))}/`,
    files: [{ destination, format, options }],
  })
  return {
    source: reverseSources ? sources.reverse() : sources,
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'error' },
    platforms: {
      css: platform('css', 'tokens.css', 'css/variables', { outputReferences: false, sort: 'name' }),
      json: platform('json', 'tokens.flat.json', 'cn/json-flat'),
      ts: platform('ts', 'tokens.ts', 'cn/ts-constants'),
      email: platform('email', 'email-tokens.json', 'cn/json-email'),
    },
  }
}

export async function build(outDir: string, options: { reverseSources?: boolean; tokensDir?: string } = {}) {
  const sd = new StyleDictionary(config(outDir, options))
  await sd.buildAllPlatforms()
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  const outDir = resolve(args.find((arg) => !arg.startsWith('--')) ?? resolve(here, 'dist'))
  await build(outDir, { reverseSources: args.includes('--reverse-sources') })
  console.log(`build: wrote ${OUTPUTS.join(', ')} to ${outDir}`)
}
