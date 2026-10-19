// T10.2 checks: the email build in packages/email (REQ-041 AC1 and AC2, REQ-042, REQ-044). The build compiles fixture
// sources from tests/fixtures/email/, because the real components arrive in T10.3 and the layout in T10.4. Tokens come
// from a token build into a temporary directory, as in tests/token-build.test.ts, so `pnpm test` needs no earlier build.
import { afterAll, beforeAll, expect, test } from 'vitest'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build as buildTokens } from '../packages/tokens/build'
import {
  MJML_DEFAULTS,
  build,
  checkOutput,
  injectTokens,
  lintSource,
  lintSources,
  remToPx,
  type EmailTokens,
} from '../packages/email/build'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/email')
const temp = mkdtempSync(join(tmpdir(), 'cn-email-build-'))
const tokensFile = join(temp, 'tokens/email/email-tokens.json')
let tokens: EmailTokens
let outA: string
let outB: string

const out = (name: string) => join(temp, name)
const compile = (fixture: string) => build({ src: join(fixtures, fixture), out: out(fixture), tokensFile })
const html = (dir: string, name: string) => readFileSync(join(dir, `${name}.html`), 'utf8')

beforeAll(async () => {
  await buildTokens(join(temp, 'tokens'))
  tokens = JSON.parse(readFileSync(tokensFile, 'utf8')) as EmailTokens
  outA = out('a')
  outB = out('b')
  await build({ src: join(fixtures, 'good'), out: outA, tokensFile })
  await build({ src: join(fixtures, 'good'), out: outB, tokensFile })
}, 60_000)
afterAll(() => rmSync(temp, { recursive: true, force: true }))

test('REQ-041 AC1: the package build script is the one the spec names, and mjml is pinned (ADR-0004)', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'packages/email/package.json'), 'utf8'))
  assert.equal(pkg.name, '@vinsmokemau/cup-noobles-email')
  assert.match(pkg.scripts?.build, /node build\.ts$/)
  assert.equal(pkg.devDependencies?.mjml, '5.4.1', 'ADR-0004 pins mjml 5.4.1')
  for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    assert.equal(pkg[field], undefined, `${field}: the published package ships HTML and has no runtime dependency`)
  }
})

test('REQ-041 AC1: the build compiles every .mjml source under src/ to one flat dist/<name>.html', () => {
  assert.deepEqual(readdirSync(outA).sort(), ['button.html', 'note.html'])
})

test('REQ-041 AC2: the compiled HTML has no stylesheet link, no var(), no script, and no external CSS', () => {
  for (const name of ['button', 'note']) {
    const text = html(outA, name)
    assert.doesNotMatch(text, /var\(/, name)
    assert.doesNotMatch(text, /<link\b/i, name)
    assert.doesNotMatch(text, /<script\b/i, name)
    assert.doesNotMatch(text, /@import|\burl\(/i, name)
    assert.match(text, /<style\b/, `${name}: MJML keeps its reset and media queries embedded`)
  }
})

test('REQ-041 AC2: the output check catches each forbidden construct', () => {
  const finding = (fragment: string) => checkOutput('x', `<html lang="es-MX">${fragment}`, tokens)
  assert.equal(finding('<p style="color:var(--cn-x)">').length, 1)
  assert.equal(finding('<link rel="stylesheet" href="a.css">').length, 1)
  assert.equal(finding('<script>alert(1)</script>').length, 1)
  assert.equal(finding('<style>@import "a.css";</style>').length, 1)
  assert.equal(finding('<p style="background:url(a.png)">').length, 1)
  assert.equal(finding('$cn(color.bg.base)').length, 1)
  assert.deepEqual(finding('<noscript>MJML puts this in its Outlook block</noscript>'), [])
})

test('REQ-041 AC4, REQ-044 AC1: {{ slot_name }} survives, and no backend template tag reaches the output', () => {
  assert.match(html(outA, 'button'), /href="\{\{ url \}\}"/)
  assert.match(html(outA, 'button'), /\{\{ label \}\}/)
  assert.match(html(outA, 'note'), /\{\{ note \}\}/)
  for (const name of ['button', 'note']) assert.doesNotMatch(html(outA, name), /\{%|<%|@\{/, name)
  for (const tag of ['{% if x %}', '<% x %>', '@{x}']) {
    assert.equal(checkOutput('x', `<html lang="es-MX">${tag}`, tokens).length, 1, tag)
  }
})

test('REQ-042 AC1: every hex value in the output is a hex value of email-tokens.json', () => {
  const allowed = new Set(
    Object.values(tokens)
      .map(String)
      .filter((value) => /^#[0-9a-f]{6,8}$/i.test(value)),
  )
  const found = new Set(
    [...html(outA, 'button').matchAll(/#[0-9a-f]{3,8}(?![0-9a-z_-])/gi)].map((match) => match[0].toLowerCase()),
  )
  assert.ok(found.size > 0, 'the button has colors')
  for (const hex of found) assert.ok(allowed.has(hex), `${hex} is a token value`)
  assert.deepEqual(checkOutput('x', '<html lang="es-MX"><p style="color:#123456">', tokens), [
    'x: the output has hex values that are not in email-tokens.json: #123456',
  ])
})

test('REQ-042 AC1: the injected values are the token values, in px for rem dimensions (ADR-0040)', () => {
  const text = html(outA, 'button')
  assert.ok(text.includes(`background:${tokens['button.primary.bg']}`))
  assert.ok(text.includes(`color:${tokens['button.primary.fg']}`))
  assert.ok(text.includes(`border:${tokens['border.width.button']} solid ${tokens['button.primary.border']}`))
  assert.equal(tokens['radius.button'], '0.75rem', 'the Chunky radius is in rem (ADR-0050)')
  assert.ok(text.includes('border-radius:12px'), 'rem is written as px at 16 px per rem')
  assert.ok(text.includes(`font-family:${tokens['font.family.body']}`))
})

test('ADR-0040: remToPx converts one whole rem dimension and leaves every other value alone', () => {
  assert.equal(remToPx('0.375rem'), '6px')
  assert.equal(remToPx('1.75rem'), '28px')
  assert.equal(remToPx('.25rem'), '4px')
  assert.equal(remToPx('0rem'), '0px')
  for (const value of ['3px', '#ef80ae', '1.5', 'none', '0 10px 15px -3px rgb(0 0 0 / 0.1)', '2rem 1rem', '180ms']) {
    assert.equal(remToPx(value), value)
  }
})

test('REQ-042 AC2: the lint rule rejects hex literals and color functions, and accepts token references', () => {
  const ok = '<mjml lang="es-MX"><mj-text color="$cn(color.text.default)">{{ label }}</mj-text></mjml>'
  assert.deepEqual(lintSource('ok', ok), [])
  assert.deepEqual(lintSource('hex', ok.replace('$cn(color.text.default)', '#ef80ae')), [
    'hex:1: hex literal "#ef80ae" (use $cn(token.path), REQ-042 AC2)',
  ])
  for (const literal of ['#fff', '#ffff', '#EF80AE', '#ef80aeff']) {
    assert.equal(lintSource('hex', ok.replace('$cn(color.text.default)', literal)).length, 1, literal)
  }
  assert.equal(lintSource('fn', ok.replace('$cn(color.text.default)', 'rgb(0 0 0)')).length, 1)
  assert.equal(lintSource('fn', ok.replace('$cn(color.text.default)', 'hsl(0, 0%, 0%)')).length, 1)
  assert.deepEqual(lintSource('anchor', ok.replace('{{ label }}', '<a href="#top">{{ label }}</a>')), [])
})

test('REQ-042 AC2: the lint rule fails the build on a fixture with a hex literal, naming file and line', async () => {
  await assert.rejects(compile('hex-literal'), /button\.mjml:5: hex literal "#ef80ae"/)
  assert.equal(existsSync(out('hex-literal')), false, 'a failed build writes nothing')
})

test('ADR-0004: the root <mjml> must set lang, because MJML defaults it to "und"', async () => {
  await assert.rejects(compile('no-lang'), /no lang attribute/)
  assert.match(html(outA, 'button'), /<html[^>]*lang="es-MX"/)
})

test('ADR-0004: an unknown $cn() path fails the build and names the path and line', async () => {
  await assert.rejects(compile('unknown-token'), /button\.mjml:5: unknown token in \$cn\(button\.primary\.missing\)/)
  assert.throws(() => injectTokens('<a>$cn()</a>', tokens), /unknown token/)
  assert.equal(injectTokens('{{ label }} $cn(color.bg.base)', tokens), '{{ label }} #000000')
})

test('ADR-0004: an MJML default that reaches the output fails the build', async () => {
  await assert.rejects(compile('mjml-default'), /MJML default "padding:10px 25px"/)
  assert.deepEqual(
    [...MJML_DEFAULTS].sort(),
    ['Ubuntu', 'border-radius:3px', 'font-size:13px', 'padding:10px 25px'].sort(),
  )
  assert.ok(!html(outA, 'button').includes('Ubuntu'))
  for (const value of MJML_DEFAULTS) assert.ok(!html(outA, 'button').includes(value), value)
})

test('T13.1: the 13px MJML default passes only when a font size token sets 13px', () => {
  const page = '<html lang="es-MX"><p style="font-size:13px">'
  const withToken = { ...tokens, 'font.size.caption': '0.8125rem' }
  const without = { ...tokens, 'font.size.caption': '0.875rem' }
  assert.deepEqual(checkOutput('x', page, withToken), [])
  assert.deepEqual(checkOutput('x', page, without), [
    'x: the output has the MJML default "font-size:13px" (set it from a token)',
  ])
  // A border width of 3px does not excuse the border-radius default.
  const radius = '<html lang="es-MX"><p style="border-radius:3px">'
  assert.equal(checkOutput('x', radius, { ...tokens, 'border.width.default': '3px' }).length, 1)
})

test('two sources with the same file name fail the build, because dist/ is flat', async () => {
  await assert.rejects(compile('duplicate'), /would both build to button\.html/)
})

test('REQ-041 AC1: two builds are byte-identical, with LF line endings only', () => {
  for (const name of ['button', 'note']) {
    assert.equal(html(outA, name), html(outB, name), name)
    assert.doesNotMatch(html(outA, name), /\r/)
  }
})

test('REQ-041 AC1: the package build runs as a script, and lints its real sources', () => {
  const real = out('real')
  const result = execFileSync(
    process.execPath,
    [join(root, 'packages/email/build.ts'), '--out', real, '--tokens', tokensFile],
    { cwd: root },
  ).toString()
  expect(result).toMatch(/^build: wrote \d+ email files? to /)
  assert.deepEqual(lintSources(), [], 'the sources in packages/email/src have no hex literal (REQ-042 AC2)')
  execFileSync(process.execPath, [join(root, 'packages/email/build.ts'), '--lint'], { cwd: root })
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [join(root, 'packages/email/build.ts'), '--lint', '--src', join(fixtures, 'hex-literal')],
        { cwd: root, stdio: 'pipe' },
      ),
    /hex literal/,
  )
}, 30_000)

test('REQ-041 AC1: the build fails with a clear message when the tokens are not built', async () => {
  await assert.rejects(
    build({ src: join(fixtures, 'good'), out: out('nope'), tokensFile: join(temp, 'missing.json') }),
    /build the tokens first/,
  )
})
