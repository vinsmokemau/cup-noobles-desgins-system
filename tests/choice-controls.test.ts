// T7.5 checks: the checkbox, radio group, and switch tokens, theme, demos, and docs (REQ-020, REQ-024, REQ-026, REQ-016). What
// needs a browser, such as computed colors, the keyboard, and axe, is in apps/showcase/tests/e2e/choice-controls.spec.ts.
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
const choiceCss = css.slice(css.indexOf('T7.5 (REQ-020, REQ-024, REQ-028)') - 3)
const SLUGS = ['checkbox', 'radio-group', 'switch'] as const
const NUXT_UI = { checkbox: 'UCheckbox', 'radio-group': 'URadioGroup', switch: 'USwitch' } as const
const STATES = {
  checkbox: ['default', 'hover', 'focus-visible', 'checked', 'indeterminate', 'disabled'],
  'radio-group': ['default', 'hover', 'focus-visible', 'checked', 'disabled'],
  switch: ['default', 'hover', 'focus-visible', 'checked', 'disabled'],
} as const
const docOf = (slug: string) => read(`docs/02-components/atoms/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: the three docs are nuxt-ui components named for their Nuxt UI component, and all are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'atom', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The outline color, radius, and stroke width are placeholders, and the look is unapproved (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.deepEqual(data.tokens, ['choice'], slug)
  }
})

test('the choice component tokens reference semantic tokens, and the shape tokens are tbd placeholders', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.choice', 'radius.interactive'],
    ['border.width.choice', 'border.width.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'tbd', path)
  }
  assert.equal(byPath.get('choice.bg')?.value, '{color.bg.base}')
  assert.equal(byPath.get('choice.borderHover')?.value, '{color.brand.primary}')
  assert.equal(byPath.get('choice.checked.bg')?.value, '{color.brand.primary}')
  assert.equal(byPath.get('choice.checked.border')?.value, '{color.brand.primary}')
  // The mark on the pink fill is black (SPEC.md §2.1 derived facts).
  assert.equal(byPath.get('choice.checked.fg')?.value, '{color.text.inverted}')
  for (const part of ['color', 'width', 'offset', 'style'])
    assert.equal(byPath.get(`choice.focus.${part}`)?.value, `{focus.ring.${part}}`, part)
  // The neutral outline follows a placeholder; every color that follows a brand value is stable.
  for (const [path, status] of [
    ['choice.border', 'tbd'],
    ['choice.bg', 'stable'],
    ['choice.borderHover', 'stable'],
    ['choice.checked.bg', 'stable'],
    ['choice.checked.border', 'stable'],
    ['choice.checked.fg', 'stable'],
    ['choice.focus.color', 'stable'],
  ] as const)
    assert.equal(byPath.get(path)?.cn?.status, status, path)
})

test('the rules read only tokens that exist, and the focus indicator is an outline, not a glow', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of choiceCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'radius.choice',
    'border.width.choice',
    'choice.bg',
    'choice.border',
    'choice.borderHover',
    'choice.checked.bg',
    'choice.checked.border',
    'choice.checked.fg',
  ])
    assert.ok(choiceCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  const focus = choiceCss.slice(choiceCss.indexOf('.cn-choice:is(:focus-visible'))
  const body = focus.slice(0, focus.indexOf('}'))
  assert.match(body, /outline:[^;]*--cn-choice-focus-width[^;]*--cn-choice-focus-color/)
  assert.doesNotMatch(body, /box-shadow/)
  // REQ-028 AC2: a control is at least 24 px, six space units.
  assert.match(choiceCss, /min-width: calc\(var\(--cn-space-base\) \* 6\)/)
  assert.match(choiceCss, /min-height: calc\(var\(--cn-space-base\) \* 6\)/)
})

test('REQ-015: the outline, checked, and focus pairs of the choice controls are declared, and all but the neutral pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, background, ratio, result] of [
    ['choice.border', 'choice.bg', 7.98, 'unverified'],
    ['choice.borderHover', 'choice.bg', 8.37, 'pass'],
    ['choice.checked.bg', 'choice.bg', 8.37, 'pass'],
    ['choice.checked.fg', 'choice.checked.bg', 8.37, 'pass'],
    ['choice.focus.color', 'choice.bg', 18.55, 'pass'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === background)
    assert.equal(pair?.result, result, foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
})

test('REQ-020: the theme puts the choice hook classes on the control of the three components', () => {
  const ui = appConfig.ui as unknown as Record<string, { slots: Record<string, string> }>
  assert.equal(ui.checkbox?.slots.base, 'cn-choice cn-choice--box cn-choice--checkbox')
  assert.equal(ui.radioGroup?.slots.base, 'cn-choice cn-choice--box cn-choice--radio')
  assert.equal(ui.switch?.slots.base, 'cn-choice cn-choice--switch')
  for (const slug of SLUGS)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
})

test('REQ-026 AC1, AC2: each doc lists the states, and its state matrix demo shows the same ones', () => {
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    assert.deepEqual(listed, STATES[slug], `${slug} doc`)
    const demo = read(`apps/showcase/demos/${slug}/states.vue`)
    const shown = demo
      .match(/const states = \[([^\]]*)\]/)?.[1]
      ?.match(/'[a-z-]+'/g)
      ?.map((s) => s.slice(1, -1))
    assert.deepEqual(shown, STATES[slug], `${slug} demo`)
  }
})

test('Done when: each component demonstrates checked, unchecked, disabled, and focus-visible, and the checkbox indeterminate', () => {
  for (const slug of SLUGS)
    for (const state of ['default', 'checked', 'disabled', 'focus-visible'])
      assert.ok(STATES[slug].includes(state as never), `${slug}: ${state}`)
  assert.ok(STATES.checkbox.includes('indeterminate'))
  assert.match(read('apps/showcase/demos/checkbox/states.vue'), /'indeterminate'/)
})

test('REQ-027: every demo labels its control, with a visible label or legend', () => {
  for (const slug of SLUGS)
    for (const demo of ['states', 'playground']) {
      const source = read(`apps/showcase/demos/${slug}/${demo}.vue`)
      assert.match(source, slug === 'radio-group' ? /legend="/ : /label="/, `${slug}/${demo}: a visible label`)
    }
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    checkbox: (await import('../apps/showcase/demos/checkbox/controls')).default,
    'radio-group': (await import('../apps/showcase/demos/radio-group/controls')).default,
    switch: (await import('../apps/showcase/demos/switch/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('the docs say that the three controls share one look and one token group', () => {
  assert.match(docOf('checkbox'), /radio-group\.md/)
  assert.match(docOf('checkbox'), /switch\.md/)
  assert.match(docOf('radio-group'), /checkbox\.md/)
  assert.match(docOf('switch'), /checkbox\.md/)
})
