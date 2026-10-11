// T10.2: the email build (REQ-041 AC1, AC2, REQ-042, REQ-044). It compiles the MJML sources in src/ to one static HTML
// file each in dist/, following ADR-0004 and SPEC.md §4.9:
//   1. lint the source: no hex literal or color function (REQ-042 AC2), and a `lang` on the root <mjml>;
//   2. expand `<mj-include>` (T10.4, ADR-0042), then replace `$cn(path)` with the literal from email-tokens.json,
//      throwing on an unknown path; `$cn(a*b)` is the product of two tokens;
//   3. compile with MJML (`fonts: {}` so no web font is linked, `validationLevel: 'strict'` so invalid markup throws);
//   4. check the output (REQ-041 AC2, REQ-042 AC1, REQ-044 AC1) and fail the build on any finding.
// `{{ slot_name }}` is never touched. Usage: node packages/email/build.ts [--src dir] [--out dir] [--tokens file].
import mjml2html from 'mjml'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const posix = (path: string) => path.replaceAll('\\', '/')

export type EmailTokens = Record<string, string | number | boolean>

export const DEFAULT_SRC = resolve(here, 'src')
export const DEFAULT_OUT = resolve(here, 'dist')
export const DEFAULT_TOKENS = resolve(here, '../tokens/dist/email/email-tokens.json')

const TOKEN_REFERENCE = /\$cn\(([^()\s]*)\)/g
const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z_-])/gi
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi

// What MJML writes for an attribute that a source leaves unset (ADR-0004 §5). These are MJML's own defaults, not brand
// values, so seeing one in the output means a component forgot to take that value from a token.
export const MJML_DEFAULTS = ['Ubuntu', 'font-size:13px', 'border-radius:3px', 'padding:10px 25px'] as const

// REQ-041 AC2 and REQ-044 AC1. `<script\b` and not `<script`, because MJML's Outlook block holds a `<noscript>`.
const FORBIDDEN_OUTPUT: [RegExp, string][] = [
  [/var\(/, 'var()'],
  [/<link\b/i, '<link> (an external stylesheet)'],
  [/<script\b/i, '<script>'],
  [/@import\b/i, '@import'],
  [/\burl\(/i, 'url() (external CSS)'],
  [/\{%/, 'the template tag {%'],
  [/<%/, 'the template tag <%'],
  [/@\{/, 'the template tag @{'],
  [/\$cn\(/, 'an unreplaced $cn() reference'],
  [/\r/, 'a CR line ending'],
  [/<html[^>]*\blang="und"/i, 'lang="und" (set lang on the root <mjml>)'],
]

const lineOf = (text: string, index: number) => text.slice(0, index).split('\n').length

// MJML's strict validation accepts px only for sizes, and many email clients ignore `rem`. A token that is one whole
// `rem` dimension is written as px, at the CSS default root size of 16 px (ADR-0040). The value is the same size, not
// a new one.
export const PX_PER_REM = 16

export function remToPx(value: string): string {
  const match = value.match(/^(-?(?:\d+\.?\d*|\.\d+))rem$/)
  return match ? `${Number((Number(match[1]) * PX_PER_REM).toFixed(4))}px` : value
}

// A number, or a px dimension, which is what a product may multiply (ADR-0042).
const FACTOR = /^(-?(?:\d+\.?\d*|\.\d+))(px)?$/

// `$cn(a*b)` is the product of two or more tokens, for a length that a brand rule gives as a share of another length,
// such as the logo clear space (ADR-0016): `$cn(logo.rule.clearSpace*logo.rule.minHeight.horizontal)` is 9px. At most
// one factor is a dimension, and the result is px. No value is added: it is the rule applied to the tokens (ADR-0042).
function resolveProduct(path: string, tokens: EmailTokens, where: string): string {
  let product = 1
  let unit = ''
  for (const factor of path.split('*')) {
    if (!Object.hasOwn(tokens, factor)) throw new Error(`${where}: unknown token in $cn(${path})`)
    const match = remToPx(String(tokens[factor])).match(FACTOR)
    if (!match) throw new Error(`${where}: $cn(${path}) multiplies ${factor}, which is not a number or a px dimension`)
    if (match[2]) {
      if (unit) throw new Error(`${where}: $cn(${path}) multiplies two dimensions`)
      unit = 'px'
    }
    product *= Number(match[1])
  }
  return `${Number(product.toFixed(4))}${unit}`
}

// Plain string replacement before MJML parses the source (ADR-0004 §2). An unknown path throws.
export function injectTokens(source: string, tokens: EmailTokens, name = 'source'): string {
  return source.replace(TOKEN_REFERENCE, (_match, path: string, offset: number) => {
    const where = `${name}:${lineOf(source, offset)}`
    if (path.includes('*')) return resolveProduct(path, tokens, where)
    if (!Object.hasOwn(tokens, path)) throw new Error(`${where}: unknown token in $cn(${path})`)
    const value = remToPx(String(tokens[path]))
    if (/["<>]/.test(value)) throw new Error(`${name}: token ${path} holds a character that cannot go in an attribute`)
    return value
  })
}

const INCLUDE = /<mj-include\s+path="([^"]+)"\s*\/>/g

// What an included file must share with the file that includes it: its <mj-head> and the opening <mj-body> tag. Only the
// content of the included <mj-body> is used, so a component must render the same alone and in a layout (ADR-0042).
const frameOf = (source: string) =>
  [/<mj-head>[\s\S]*?<\/mj-head>/.exec(source)?.[0], /<mj-body\b[^>]*>/.exec(source)?.[0]]
    .map((part) => (part ?? '').replace(/\s+/g, ' ').trim())
    .join('\n')

// Replaces each `<mj-include path="…" />` with the content of the included file's <mj-body>, before the tokens are
// injected, so an included component takes the same token values as its own build. MJML's own mj-include is not used,
// because it would read the file after `$cn()` has been replaced. The path is relative to the including file, it must
// end in .mjml, and an included file includes nothing (ADR-0042).
export function expandIncludes(source: string, dir: string, name = 'source'): string {
  return source.replace(INCLUDE, (_match, path: string, offset: number) => {
    const where = `${name}:${lineOf(source, offset)}`
    if (!path.endsWith('.mjml')) throw new Error(`${where}: mj-include "${path}" is not an .mjml file`)
    let included: string
    try {
      included = readFileSync(resolve(dir, path), 'utf8')
    } catch {
      throw new Error(`${where}: mj-include "${path}" cannot be read`)
    }
    const body = /<mj-body\b[^>]*>([\s\S]*)<\/mj-body>/.exec(included)
    if (!body) throw new Error(`${where}: mj-include "${path}" has no <mj-body>`)
    if (/<mj-include\b/.test(body[1]!)) throw new Error(`${where}: mj-include "${path}" includes another file`)
    if (frameOf(included) !== frameOf(source)) {
      throw new Error(`${where}: mj-include "${path}" has an <mj-head> or <mj-body> tag that differs from this file`)
    }
    return body[1]!.trim()
  })
}

// REQ-042 AC2: the sources carry no color literal. `$cn()` references are stripped first, so a token path that looks
// like a color is not a finding. Returns one message per finding.
export function lintSource(name: string, source: string): string[] {
  const findings: string[] = []
  const bare = source.replace(TOKEN_REFERENCE, (match) => ' '.repeat(match.length))
  for (const [pattern, what] of [
    [HEX, 'hex literal'],
    [COLOR_FUNCTION, 'color function'],
  ] as const) {
    for (const match of bare.matchAll(pattern)) {
      findings.push(`${name}:${lineOf(bare, match.index)}: ${what} "${match[0]}" (use $cn(token.path), REQ-042 AC2)`)
    }
  }
  const root = bare.match(/<mjml\b[^>]*>/)
  if (!root) findings.push(`${name}: no root <mjml> element`)
  else if (!/\blang="[^"]+"/.test(root[0])) {
    findings.push(`${name}: the root <mjml> has no lang attribute (MJML defaults it to "und", ADR-0004)`)
  }
  return findings
}

// REQ-041 AC2, REQ-042 AC1, REQ-044 AC1, and the MJML-default check from ADR-0004. Returns one message per finding.
export function checkOutput(name: string, html: string, tokens: EmailTokens): string[] {
  const findings: string[] = []
  for (const [pattern, what] of FORBIDDEN_OUTPUT) {
    if (pattern.test(html)) findings.push(`${name}: the output contains ${what}`)
  }
  const allowed = new Set(
    Object.values(tokens)
      .map(String)
      .filter((value) => /^#[0-9a-f]{3,8}$/i.test(value))
      .map((value) => value.toLowerCase()),
  )
  const strays = new Set<string>()
  for (const match of html.matchAll(HEX)) if (!allowed.has(match[0].toLowerCase())) strays.add(match[0])
  if (strays.size > 0) {
    findings.push(`${name}: the output has hex values that are not in email-tokens.json: ${[...strays].join(', ')}`)
  }
  for (const value of MJML_DEFAULTS) {
    if (html.includes(value)) findings.push(`${name}: the output has the MJML default "${value}" (set it from a token)`)
  }
  return findings
}

// Every .mjml file under dir, in code-unit order, so the build order cannot depend on the machine.
function sourcesIn(dir: string): string[] {
  const files: string[] = []
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (entry.name.endsWith('.mjml')) files.push(path)
    }
  }
  walk(dir)
  return files.sort((a, b) => (posix(a) < posix(b) ? -1 : posix(a) > posix(b) ? 1 : 0))
}

// The lint rule of REQ-042 AC2 on its own, for `pnpm lint`: it needs no token build and writes nothing.
export function lintSources(src = DEFAULT_SRC): string[] {
  return sourcesIn(src).flatMap((file) => lintSource(posix(relative(src, file)), readFileSync(file, 'utf8')))
}

// Returns the dist file names it wrote. Throws one error that lists every finding.
export async function build({ src = DEFAULT_SRC, out = DEFAULT_OUT, tokensFile = DEFAULT_TOKENS } = {}) {
  let tokens: EmailTokens
  try {
    tokens = JSON.parse(readFileSync(tokensFile, 'utf8')) as EmailTokens
  } catch {
    throw new Error(`cannot read ${tokensFile}: build the tokens first (pnpm build:tokens)`)
  }
  const files = sourcesIn(src)
  const names = new Map<string, string>()
  for (const file of files) {
    const name = basename(file, '.mjml')
    const earlier = names.get(name)
    if (earlier) throw new Error(`${posix(relative(src, file))} and ${earlier} would both build to ${name}.html`)
    names.set(name, posix(relative(src, file)))
  }

  const findings: string[] = []
  const compiled: [string, string][] = []
  for (const file of files) {
    const label = posix(relative(src, file))
    const source = readFileSync(file, 'utf8')
    const lint = lintSource(label, source)
    if (lint.length > 0) {
      findings.push(...lint)
      continue
    }
    const { html, errors } = await mjml2html(
      injectTokens(expandIncludes(source, dirname(file), label), tokens, label),
      {
        fonts: {},
        keepComments: false,
        validationLevel: 'strict',
      },
    )
    if (errors.length > 0) {
      findings.push(...errors.map((error) => `${label}: MJML: ${error.message}`))
      continue
    }
    // A single trailing newline, and LF only, so two builds are byte-identical (ADR-0004).
    const text = `${html.replaceAll('\r\n', '\n').trimEnd()}\n`
    findings.push(...checkOutput(label, text, tokens))
    compiled.push([`${basename(file, '.mjml')}.html`, text])
  }
  if (findings.length > 0) throw new Error(`the email build failed:\n${findings.map((f) => `  ${f}`).join('\n')}`)

  mkdirSync(out, { recursive: true })
  for (const [name, text] of compiled) writeFileSync(join(out, name), text)
  return compiled.map(([name]) => name)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  const option = (flag: string) => {
    const at = args.indexOf(flag)
    return at === -1 ? undefined : resolve(args[at + 1] ?? '')
  }
  const out = option('--out') ?? DEFAULT_OUT
  try {
    if (args.includes('--lint')) {
      const findings = lintSources(option('--src'))
      if (findings.length > 0) throw new Error(findings.join('\n'))
    } else {
      const written = await build({ src: option('--src'), out, tokensFile: option('--tokens') })
      console.log(`build: wrote ${written.length} email file${written.length === 1 ? '' : 's'} to ${out}`)
    }
  } catch (error) {
    console.error((error as Error).message)
    process.exitCode = 1
  }
}
