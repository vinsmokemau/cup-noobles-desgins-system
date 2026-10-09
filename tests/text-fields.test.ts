// T7.4 checks: the input, textarea, and select tokens, theme, demos, and docs (REQ-020, REQ-024, REQ-026, REQ-016). What needs
// a browser, such as computed colors, the keyboard, aria-describedby, and axe, is in
// apps/showcase/tests/e2e/text-fields.spec.ts.
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
const fieldCss = css.slice(css.indexOf('T7.4 (REQ-020, REQ-024)') - 3)
const SLUGS = ['input', 'textarea', 'select'] as const
const NUXT_UI = { input: 'UInput', textarea: 'UTextarea', select: 'USelect' } as const
const docOf = (slug: string) => read(`docs/02-components/atoms/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: the three docs are nuxt-ui components named for their Nuxt UI component, and all are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'atom', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The colors, radius, and stroke width are placeholders, and the look is unapproved (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.deepEqual(data.tokens, ['input'], slug)
  }
})

test('the text-field component tokens reference semantic tokens, and the shape tokens are tbd placeholders', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.input', 'radius.interactive'],
    ['border.width.input', 'border.width.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'tbd', path)
  }
  assert.equal(byPath.get('input.bg')?.value, '{color.bg.base}')
  assert.equal(byPath.get('input.borderHover')?.value, '{color.brand.primary}')
  for (const part of ['color', 'width', 'offset', 'style'])
    assert.equal(byPath.get(`input.focus.${part}`)?.value, `{focus.ring.${part}}`, part)
  // The colors that follow a placeholder are tbd, and the ones that follow a brand value are stable.
  for (const [path, status] of [
    ['input.fg', 'tbd'],
    ['input.placeholder', 'tbd'],
    ['input.border', 'tbd'],
    ['input.error.border', 'tbd'],
    ['input.error.fg', 'tbd'],
    ['input.bg', 'stable'],
    ['input.borderHover', 'stable'],
    ['input.focus.color', 'stable'],
  ] as const)
    assert.equal(byPath.get(path)?.cn?.status, status, path)
})

test('the rules read only tokens that exist, and the focus indicator is an outline, not a glow', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of fieldCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
  for (const path of ['radius.input', 'border.width.input', 'input.border', 'input.borderHover', 'input.error.border'])
    assert.ok(fieldCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  for (const selector of ['.cn-field:is(:focus-visible', '.cn-select-item[data-highlighted]']) {
    const rule = fieldCss.slice(fieldCss.indexOf(selector))
    const body = rule.slice(0, rule.indexOf('}'))
    assert.match(body, /outline:[^;]*--cn-input-focus-width[^;]*--cn-input-focus-color/, selector)
    assert.doesNotMatch(body, /box-shadow/, selector)
  }
  // The error state is read from aria-invalid, so the rule and assistive technology share one source.
  assert.match(fieldCss, /\.cn-field\[aria-invalid='true'\] \{[^}]*--cn-input-error-border/)
})

test('REQ-015: the text, outline, and focus pairs of the text fields are declared, and the pink hover and the focus ring pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, ratio, result] of [
    ['input.fg', 7.98, 'unverified'],
    ['input.placeholder', 7.98, 'unverified'],
    ['input.border', 7.98, 'unverified'],
    ['input.error.border', 7.98, 'unverified'],
    ['input.error.fg', 7.98, 'unverified'],
    ['input.borderHover', 8.37, 'pass'],
    ['input.focus.color', 18.55, 'pass'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'input.bg')
    assert.equal(pair?.result, result, foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
})

test('REQ-020: the theme puts the field hook class on the control of the three components, and the select list item', () => {
  const ui = appConfig.ui as unknown as Record<string, { slots: Record<string, string> }>
  for (const slug of SLUGS) assert.equal(ui[slug]?.slots.base, 'cn-field', slug)
  assert.equal(ui.select?.slots.item, 'cn-select-item')
  for (const slug of SLUGS)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
})

test('REQ-026 AC1, AC2: each doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = ['default', 'hover', 'focus-visible', 'disabled', 'error']
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    assert.deepEqual(listed, expected, `${slug} doc`)
    const demo = read(`apps/showcase/demos/${slug}/states.vue`)
    const shown = demo
      .match(/const states = \[([^\]]*)\]/)?.[1]
      ?.match(/'[a-z-]+'/g)
      ?.map((s) => s.slice(1, -1))
    assert.deepEqual(shown, expected, `${slug} demo`)
  }
})

test('REQ-027: the error state links its message with aria-describedby and sets aria-invalid, in every demo', () => {
  for (const slug of SLUGS) {
    for (const demo of ['states', 'playground']) {
      const source = read(`apps/showcase/demos/${slug}/${demo}.vue`)
      assert.match(source, /:aria-invalid="[^"]*'true'/, `${slug}/${demo}: aria-invalid`)
      assert.match(source, /:aria-describedby="[^"]*-error`?/, `${slug}/${demo}: aria-describedby`)
      assert.match(source, /:id="`?[a-z]+-[^"]*-error`?"|id="[a-z]+-playground-error"/, `${slug}/${demo}: message id`)
      assert.match(source, /<label :?for=/, `${slug}/${demo}: a visible label`)
    }
  }
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    input: (await import('../apps/showcase/demos/input/controls')).default,
    textarea: (await import('../apps/showcase/demos/textarea/controls')).default,
    select: (await import('../apps/showcase/demos/select/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('the docs say that the three fields share one look and one token group', () => {
  assert.match(docOf('textarea'), /input\.md/)
  assert.match(docOf('select'), /input\.md/)
  assert.match(docOf('input'), /textarea\.md/)
  assert.match(docOf('input'), /select\.md/)
})
