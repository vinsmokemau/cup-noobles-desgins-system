// T8.1 checks: the form field and the card tokens, theme, demos, and docs (REQ-020, REQ-025, REQ-026, REQ-016). What needs a
// browser, such as computed colors, aria-describedby, the label click, and axe, is in
// apps/showcase/tests/e2e/form-field.spec.ts and card.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import appConfig from '../packages/nuxt/app.config'
import { checkContrast } from '../scripts/check-contrast'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const css = read('packages/nuxt/assets/css/main.css')
// The rules of T8.1 without the comment above them, which names the surface token on purpose.
const moleculeCss = css.slice(css.indexOf('T8.1 (REQ-020, REQ-025)')).replace(/^[\s\S]*?\*\//, '')
const SLUGS = ['form-field', 'card'] as const
const NUXT_UI = { 'form-field': 'UFormField', card: 'UCard' } as const
const docOf = (slug: string) => read(`docs/02-components/molecules/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: both docs are nuxt-ui molecules named for their Nuxt UI component, and both are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'molecule', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The text colors, the radius, and the stroke width are placeholders (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
  }
})

test('the card and form field tokens reference semantic tokens, and the placeholders are tbd', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.card', 'radius.interactive'],
    ['border.width.card', 'border.width.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'tbd', path)
  }
  for (const [path, value, status] of [
    ['card.bg', '{color.bg.base}', 'stable'],
    ['card.highlight', '{color.brand.primary}', 'stable'],
    ['card.divider', '{color.brand.primary}', 'stable'],
    ['card.fg', '{color.text.default}', 'tbd'],
    ['card.fgMuted', '{color.text.muted}', 'tbd'],
    ['formField.label.fg', '{color.text.default}', 'tbd'],
    ['formField.description.fg', '{color.text.muted}', 'tbd'],
    ['formField.help.fg', '{color.text.muted}', 'tbd'],
    ['formField.error.fg', '{color.feedback.error}', 'tbd'],
  ] as const) {
    assert.equal(byPath.get(path)?.value, value, path)
    assert.equal(byPath.get(path)?.cn?.status, status, path)
  }
})

test('REQ-025 AC3, C-05: the card rules read only tokens that exist, and never the card surface token', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of moleculeCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
  for (const path of ['card.bg', 'card.highlight', 'card.divider', 'radius.card', 'border.width.card'])
    assert.ok(moleculeCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(moleculeCss, /surface/, 'the card renders on color.bg.base, not color.surface.card')
  // ADR-0018: the highlight is an outline, with no glow.
  const card = moleculeCss.slice(moleculeCss.indexOf('.cn-card {'))
  assert.match(card.slice(0, card.indexOf('}')), /box-shadow: none/)
  assert.doesNotMatch(moleculeCss, /effect-glow/)
})

test('REQ-015: the card pairs are declared, and the pink outline and dividers pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, ratio, result] of [
    ['card.fg', 7.98, 'unverified'],
    ['card.fgMuted', 7.98, 'unverified'],
    ['card.highlight', 8.37, 'pass'],
    ['card.divider', 8.37, 'pass'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'card.bg')
    assert.equal(pair?.result, result, foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
  for (const foreground of ['label', 'description', 'help', 'error']) {
    const pair = report.pairs.find((p) => p.foreground === `formField.${foreground}.fg`)
    assert.equal(pair?.background, 'color.bg.base', foreground)
    assert.equal(pair?.result, 'unverified', foreground)
  }
})

test('REQ-020: the theme puts the hook class on the card root and on each form field text slot', () => {
  const ui = appConfig.ui as unknown as Record<string, { slots: Record<string, string> }>
  assert.equal(ui.card?.slots.root, 'cn-card')
  for (const slot of ['label', 'description', 'hint', 'help', 'error'])
    assert.equal(ui.formField?.slots[slot], `cn-form-field__${slot}`, slot)
  for (const slot of ['label', 'description', 'hint', 'help', 'error'])
    assert.ok(moleculeCss.includes(`.cn-form-field__${slot}`), `${slot} has a rule`)
})

test('REQ-026 AC1, AC2: each doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = {
    'form-field': ['default', 'hover', 'focus-visible', 'disabled', 'error'],
    card: ['default'],
  }
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    assert.deepEqual(listed, expected[slug], `${slug} doc`)
    const demo = read(`apps/showcase/demos/${slug}/states.vue`)
    const shown = demo
      .match(/const states = \[([^\]]*)\]/)?.[1]
      ?.match(/'[a-z-]+'/g)
      ?.map((s) => s.slice(1, -1))
    assert.deepEqual(shown, expected[slug], `${slug} demo`)
  }
})

test('REQ-025 AC1, AC3: the card is documented with header, body, and footer slots and marks color.surface.card as TBD-06', () => {
  const doc = docOf('card')
  for (const part of ['**header**', '**body**', '**footer**']) assert.ok(doc.includes(part), part)
  assert.match(doc, /> \*\*TBD \(TBD-06\):\*\*[^\n]*C-05/)
  assert.match(doc, /\| `color\.surface\.card` \| `--cn-color-surface-card` \| `#[0-9a-f]{6}` \| tbd \(TBD-06\) \|/)
  assert.deepEqual(frontmatter('card').tbd, ['TBD-04', 'TBD-05', 'TBD-06', 'TBD-10', 'TBD-11'])
  const demo = read('apps/showcase/demos/card/states.vue')
  for (const slot of ['#header', '#footer']) assert.ok(demo.includes(slot), `demo uses ${slot}`)
})

test('REQ-027: the form field demos set the error through UFormField, so Nuxt UI wires aria-describedby', () => {
  for (const demo of ['states', 'playground']) {
    const source = read(`apps/showcase/demos/form-field/${demo}.vue`)
    assert.match(source, /<UFormField/, demo)
    assert.match(source, /:error=/, demo)
    // The slot is conditional: a present `error` slot hides the help text in Nuxt UI.
    assert.match(source, /<template v-if="[^"]+" #error/, `${demo}: the error slot carries the icon, only in error`)
    assert.doesNotMatch(source, /\saria-describedby=/, `${demo}: the wiring is Nuxt UI's, not hand-written`)
  }
  // The error replaces the help text, so the error cell passes no help.
  assert.match(read('apps/showcase/demos/form-field/states.vue'), /:help="state === 'error' \? undefined/)
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    'form-field': (await import('../apps/showcase/demos/form-field/controls')).default,
    card: (await import('../apps/showcase/demos/card/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})
