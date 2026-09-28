// T3.4 checks: the token build in packages/tokens (REQ-013), the brand variables in the built CSS (REQ-011 AC3), and
// the CSS naming convention (REQ-017 AC1). Each build runs in its own Node process, into its own temporary directory.
import { afterAll, beforeAll, expect, test } from 'vitest'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { OUTPUTS } from '../packages/tokens/build'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { tokens } = checkTokens(root)
const temp = mkdtempSync(join(tmpdir(), 'cn-token-build-'))
const dirs = { a: join(temp, 'a'), b: join(temp, 'b'), reversed: join(temp, 'reversed') }

const build = (outDir: string, ...args: string[]) =>
  execFileSync(process.execPath, [join(root, 'packages/tokens/build.ts'), outDir, ...args], { cwd: root })
const read = (dir: string, output: string) => readFileSync(join(dir, output))
const text = (output: string) => read(dirs.a, output).toString('utf8')

beforeAll(() => {
  build(dirs.a)
  build(dirs.b)
  build(dirs.reversed, '--reverse-sources')
}, 60_000)
afterAll(() => rmSync(temp, { recursive: true, force: true }))

test('REQ-013 AC1: the build script is the package build', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'packages/tokens/package.json'), 'utf8'))
  assert.equal(pkg.scripts?.build, 'node build.ts')
  assert.equal(pkg.devDependencies?.['style-dictionary'], '5.5.5', 'ADR-0003 pins style-dictionary 5.5.5')
})

test('REQ-013 AC1: the build writes all four outputs, each holding every token', () => {
  assert.deepEqual([...OUTPUTS], ['css/tokens.css', 'json/tokens.flat.json', 'ts/tokens.ts', 'email/email-tokens.json'])
  const paths = tokens.map((t) => t.path).sort()
  const cssNames = [...text('css/tokens.css').matchAll(/^ {2}(--cn-[a-z0-9-]+):/gm)].map((m) => m[1])
  assert.equal(cssNames.length, paths.length, 'one custom property per token')
  assert.deepEqual(Object.keys(JSON.parse(text('json/tokens.flat.json'))).sort(), paths)
  assert.deepEqual(Object.keys(JSON.parse(text('email/email-tokens.json'))).sort(), paths)
})

test('REQ-013 AC1: tokens.flat.json holds resolved values with their CSS variable, type, tier, and metadata', () => {
  const flat = JSON.parse(text('json/tokens.flat.json')) as Record<string, Record<string, unknown>>
  for (const token of tokens) {
    const entry = flat[token.path]!
    assert.equal(entry.cssVar, cssVariable(token.path), token.path)
    assert.equal(entry.tier, token.tier, token.path)
    assert.equal(entry.status, token.cn?.status, token.path)
    assert.equal(entry.description, token.description, token.path)
    assert.deepEqual(entry.tbd, token.cn?.tbd, token.path)
    assert.doesNotMatch(String(entry.value), /\{|var\(/, token.path)
  }
  assert.deepEqual(flat['color.bg.base'], {
    cssVar: '--cn-color-bg-base',
    value: '#000000',
    type: 'color',
    tier: 'semantic',
    status: 'stable',
    description: flat['color.bg.base']!.description,
  })
})

test('REQ-013 AC1: email-tokens.json maps every path to a literal, with no references and no var()', () => {
  const email = JSON.parse(text('email/email-tokens.json')) as Record<string, unknown>
  for (const [path, value] of Object.entries(email)) {
    assert.ok(['string', 'number'].includes(typeof value), `${path} is a literal`)
    assert.doesNotMatch(String(value), /\{|\}|var\(/, path)
  }
  assert.equal(email['color.brand.primary'], '#ef80ae')
})

test('REQ-013 AC1: tokens.ts exports the resolved values as typed constants', async () => {
  const ts = text('ts/tokens.ts')
  assert.match(ts, /^export const tokens = \{$/m)
  assert.match(ts, /^\} as const$/m)
  assert.match(ts, /^export type TokenPath = keyof typeof tokens$/m)
  const module = (await import(pathToFileURL(join(dirs.a, 'ts/tokens.ts')).href)) as {
    tokens: Record<string, unknown>
  }
  assert.deepEqual(module.tokens, JSON.parse(text('email/email-tokens.json')))
})

test('REQ-013 AC2: two builds, and a build with the sources reversed, are byte-identical', () => {
  for (const output of OUTPUTS) {
    assert.ok(read(dirs.a, output).equals(read(dirs.b, output)), `${output}: build a = build b`)
    assert.ok(read(dirs.a, output).equals(read(dirs.reversed, output)), `${output}: independent of source order`)
    assert.ok(!read(dirs.a, output).includes('\r'), `${output} has no CR line endings`)
  }
})

test('REQ-013 AC3: no output imports or requires anything', () => {
  for (const output of OUTPUTS)
    assert.doesNotMatch(text(output), /\bimport\b|\brequire\s*\(|@import/, `${output} depends on nothing`)
})

test('REQ-011 AC3: the built CSS matches the snapshot and holds the three brand variables exactly', async () => {
  const css = text('css/tokens.css')
  for (const line of [
    '--cn-color-brand-primary: #ef80ae;',
    '--cn-color-brand-secondary: #fff488;',
    '--cn-color-bg-base: #000000;',
  ])
    assert.match(css, new RegExp(`^ {2}${line}`, 'm'), line)
  await expect(css).toMatchFileSnapshot('__snapshots__/tokens.css')
})

test('REQ-017 AC1: every CSS custom property is --cn-{path-with-dashes}', () => {
  const css = text('css/tokens.css')
  const names = [...css.matchAll(/^ {2}(--[a-zA-Z0-9-]+):/gm)].map((m) => m[1]).sort()
  assert.deepEqual(names, tokens.map((t) => cssVariable(t.path)).sort())
  assert.match(css, /^ {2}--cn-font-h1-line-height: /m, 'camelCase segments are kebab-cased (ADR-0008)')
})
