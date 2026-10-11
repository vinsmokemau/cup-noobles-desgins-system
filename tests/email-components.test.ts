// T10.3 checks: the six email components in packages/email/src/components/ (REQ-041 AC3 and AC4, REQ-042). They compile
// with the real build, the button draws a solid border in place of a glow (REQ-040), and every `{{ slot_name }}` in a
// source is documented in docs/05-email/email-components.md. Tokens come from a token build into a temporary directory,
// as in tests/email-build.test.ts, so `pnpm test` needs no earlier build.
import { afterAll, beforeAll, test } from 'vitest'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build as buildTokens } from '../packages/tokens/build'
import { build, lintSources, type EmailTokens } from '../packages/email/build'
import { readFrontmatter } from '../scripts/check-docs'
import { flatTokens } from './lib/flat-tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const components = join(root, 'packages/email/src/components')
const COMPONENTS = ['button', 'card', 'content-section', 'divider', 'footer', 'header']
const temp = mkdtempSync(join(tmpdir(), 'cn-email-components-'))
const tokensFile = join(temp, 'tokens/email/email-tokens.json')
const dist = join(temp, 'dist')
let tokens: EmailTokens

const source = (name: string) => readFileSync(join(components, `${name}.mjml`), 'utf8')
const html = (name: string) => readFileSync(join(dist, `${name}.html`), 'utf8')
const slotsOf = (text: string) => [...new Set([...text.matchAll(/\{\{\s*([a-z_]+)\s*\}\}/g)].map((m) => m[1]!))].sort()

const doc = readFileSync(join(root, 'docs/05-email/email-components.md'), 'utf8')
const section = (heading: string, level = 2) =>
  doc
    .split(new RegExp(`^${'#'.repeat(level)} ${heading}\\s*$`, 'm'))[1]
    ?.split(new RegExp(`^#{1,${level}} `, 'm'))[0] ?? ''

beforeAll(async () => {
  await buildTokens(join(temp, 'tokens'))
  tokens = JSON.parse(readFileSync(tokensFile, 'utf8')) as EmailTokens
  await build({ src: components, out: dist, tokensFile })
}, 60_000)
afterAll(() => rmSync(temp, { recursive: true, force: true }))

test('REQ-041 AC3: the six components are button, header, content section, card, divider, and footer, and each compiles', () => {
  assert.deepEqual(
    readdirSync(components)
      .filter((file) => file.endsWith('.mjml'))
      .map((file) => file.replace(/\.mjml$/, ''))
      .sort(),
    COMPONENTS,
  )
  assert.deepEqual(
    readdirSync(dist)
      .map((file) => file.replace(/\.html$/, ''))
      .sort(),
    COMPONENTS,
  )
  for (const name of COMPONENTS) assert.match(html(name), /<html[^>]*lang="es-MX"/, name)
})

test('REQ-042 AC2: no component source holds a hex literal or a color function', () => {
  assert.deepEqual(lintSources(), [])
})

test('REQ-040, BR-10, BR-13: the button draws a solid border from the border tokens, and no component emits a glow', () => {
  assert.ok(
    html('button').includes(`border:${tokens['border.width.button']} solid ${tokens['button.primary.border']}`),
    'a solid border of border.width.button in button.primary.border',
  )
  assert.ok(html('button').includes(`background:${tokens['button.primary.bg']}`))
  assert.ok(html('button').includes(`color:${tokens['button.primary.fg']}`))
  assert.doesNotMatch(source('button'), /effect\.glow/, 'the glow token is not referenced')
  for (const name of COMPONENTS) {
    assert.doesNotMatch(html(name), /box-shadow|text-shadow|filter\s*:/i, `${name} emits no shadow or filter`)
  }
})

test('REQ-042 AC1: the card, header, divider, and footer read the tokens of their web counterparts', () => {
  const has = (name: string, property: string, token: string) =>
    assert.ok(html(name).includes(`${property}${tokens[token]}`), `${name} uses ${token}`)
  has('card', `border:${tokens['border.width.card']} solid `, 'card.highlight')
  has('card', 'background:', 'card.bg')
  assert.ok(html('card').includes(`border-top:solid ${tokens['border.width.card']} ${tokens['card.divider']}`))
  assert.ok(
    html('header').includes(`border-bottom:${tokens['border.width.siteHeader']} solid ${tokens['siteHeader.line']}`),
  )
  assert.ok(
    html('footer').includes(`border-top:${tokens['border.width.siteFooter']} solid ${tokens['siteFooter.line']}`),
  )
  assert.ok(
    html('divider').includes(`border-top:solid ${tokens['border.width.separator']} ${tokens['separator.color']}`),
  )
  assert.ok(
    html('header').replace(/:\s+/g, ':').includes(`height:${tokens['logo.rule.minHeight.horizontal']}`),
    'the logo is not shorter than its rule',
  )
})

test('ADR-0004, REQ-040: every component sets its body width, language, and pairs text with a background', () => {
  for (const name of COMPONENTS) {
    assert.match(
      source(name),
      /<mj-body width="\$cn\(layout\.email\.width\.max\)"/,
      `${name} sets the body width from a token`,
    )
    assert.match(html(name), /max-width:600px/, name)
    assert.match(html(name), /bgcolor="#000000"/, `${name} sets the base color as a bgcolor attribute`)
  }
})

test('REQ-040: the header logo is an image with an alt text slot, and a text fallback in the display font', () => {
  // Prettier formats the inline style of the source with a space after each colon, which is the same CSS.
  const header = html('header').replace(/:\s+/g, ':')
  assert.match(header, /<img\s[^>]*alt="\{\{ logo_alt \}\}"/)
  assert.ok(header.includes(`color:${tokens['siteHeader.fg']}`))
  assert.ok(header.includes(`font-family:${tokens['font.family.display']}`))
})

test('REQ-041 AC4, REQ-044 AC1: slots are {{ slot_name }}, and no component has a backend tag or leftover token reference', () => {
  assert.deepEqual(slotsOf(source('button')), ['button_label', 'button_url'])
  for (const name of COMPONENTS) {
    assert.doesNotMatch(source(name), /\{%|<%|@\{/, name)
    assert.doesNotMatch(html(name), /\{%|<%|@\{|\$cn\(/, name)
    for (const slot of slotsOf(source(name)))
      assert.ok(html(name).includes(`{{ ${slot} }}`), `${name}: ${slot} survives`)
  }
})

test('REQ-041 AC4: every slot of every component is listed in email-components.md, and the doc lists no other slot', () => {
  const code = section('Code reference')
  const all = new Set<string>()
  for (const name of COMPONENTS) {
    const part = section(name, 3)
    assert.ok(part.trim().length > 0, `${name} has a section`)
    assert.ok(part.includes(`\`${name}.mjml\``), `${name} names its file`)
    const documented = slotsOf(part.replace(/`/g, ''))
    assert.deepEqual(documented, slotsOf(source(name)), `${name}: documented slots equal source slots`)
    for (const slot of documented) {
      assert.ok(!all.has(slot), `${slot} is unique across components`)
      all.add(slot)
    }
  }
  assert.deepEqual(slotsOf(code), [...all].sort())
  assert.match(section('divider', 3), /no slots/)
})

test('REQ-042, REQ-040 AC2: every token the doc names in a code span is in email-tokens.json', async () => {
  const flat = await flatTokens<unknown>()
  const prose = doc
    .replace(/<!-- cn:generated[\s\S]*?<!-- \/cn:generated -->/g, '')
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, '')
  const names = [...prose.matchAll(/`([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9-]+)+)`/g)].map((m) => m[1]!)
  const files = new Set(['email-tokens.json', 'build.ts'])
  const found = [...new Set(names)].filter((name) => !files.has(name) && !/\.(json|ts|md|html|mjml)$/.test(name))
  assert.ok(found.length >= 20, 'the doc names its tokens')
  for (const token of found) assert.ok(token in flat, `"${token}" is a token`)
})

test('REQ-009, REQ-037: the doc is a draft with a Draft callout and its TBD items, and holds no hex literal or typeface', () => {
  const data = readFrontmatter(doc).data as Record<string, unknown>
  assert.equal(data.status, 'draft')
  assert.equal(data.layer, 'email')
  // ADR-0041: the owner approved the mapping, so no Draft callout remains; the open TBD items keep the doc a draft.
  assert.doesNotMatch(doc, /^> \*\*Draft:\*\*/m)
  assert.match(doc, /^- 0\.1\.0 — Component-to-token mapping approved by the owner[^\n]* — ADR-0041$/m)
  assert.doesNotMatch(doc, /Content pending/)
  for (const id of ['TBD-01', 'TBD-03', 'TBD-09', 'TBD-10', 'TBD-12']) {
    assert.ok((data.tbd as string[]).includes(id), `${id} is listed`)
    assert.match(section('Open items'), new RegExp(`\\*\\*TBD \\(${id}\\):\\*\\*`), `${id} has a callout`)
  }
  const prose = doc.replace(/<!-- cn:generated[\s\S]*?<!-- \/cn:generated -->/g, '')
  assert.doesNotMatch(prose, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(prose, /\b(?:Ubuntu|Helvetica|Arial|Roboto|Segoe)\b/)
  assert.match(doc, /^- 0\.1\.0 — First draft: .*\(T10\.3, REQ-041 AC3 and AC4, REQ-042\)/m)
})
