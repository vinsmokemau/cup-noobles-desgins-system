// T8.4 checks: the tabs, breadcrumb, and pagination tokens, theme, demos, and docs (REQ-020, REQ-026, REQ-016, REQ-015). What
// needs a browser, such as computed colors, arrow keys, aria-current, and axe, is in apps/showcase/tests/e2e/tabs.spec.ts,
// breadcrumb.spec.ts, and pagination.spec.ts.
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
const start = css.indexOf('T8.4 (REQ-020')
// The rules of T8.4 only: from its comment to the next block comment, or the end of the file.
const next = css.indexOf('\n/*\n', start)
const navigationCss = css.slice(start, next === -1 ? undefined : next).replace(/^[\s\S]*?\*\//, '')
const SLUGS = ['tabs', 'breadcrumb', 'pagination'] as const
const NUXT_UI = { tabs: 'UTabs', breadcrumb: 'UBreadcrumb', pagination: 'UPagination' } as const
const docOf = (slug: string) => read(`docs/02-components/molecules/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: the three docs are nuxt-ui molecules named for their Nuxt UI component, and all are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'molecule', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The text colors, the neutral scale, the radius, and the stroke width are placeholders (REQ-009).
    assert.equal(data.status, slug === 'tabs' ? 'stable' : 'draft', slug) // ADR-0033 approved the tabs
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
    assert.match(docOf(slug), /ADR-0028/, `${slug} doc cites the look decision`)
  }
})

test('the tabs, breadcrumb, and pagination tokens reference semantic tokens, and the radius is stable', () => {
  assert.deepEqual(problems, [])
  for (const [path, value, status] of [
    ['border.width.tabs', '{border.width.interactive}', 'stable'],
    ['radius.pagination', '{radius.interactive}', 'stable'],
    ['border.width.pagination', '{border.width.interactive}', 'stable'],
    ['tabs.fg', '{color.text.muted}', 'stable'],
    ['tabs.fgHover', '{color.text.default}', 'stable'],
    ['tabs.rule', '{color.border.default}', 'stable'],
    ['tabs.active.fg', '{color.brand.primary}', 'stable'],
    ['tabs.active.indicator', '{color.brand.primary}', 'stable'],
    ['breadcrumb.link.fg', '{color.brand.primary}', 'stable'],
    ['breadcrumb.link.fgHover', '{color.brand.primaryHover}', 'stable'],
    ['breadcrumb.current.fg', '{color.text.default}', 'stable'],
    ['breadcrumb.separator.fg', '{color.text.muted}', 'stable'],
    ['pagination.item.fg', '{color.text.default}', 'stable'],
    ['pagination.item.border', '{color.border.default}', 'stable'],
    ['pagination.item.borderHover', '{color.brand.primary}', 'stable'],
    ['pagination.current.bg', '{color.brand.primary}', 'stable'],
    ['pagination.current.fg', '{color.text.inverted}', 'stable'],
    ['pagination.current.border', '{color.brand.primary}', 'stable'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, value, path)
    assert.equal(token?.cn?.status, status, path)
  }
  for (const slug of SLUGS)
    assert.equal(
      byPath.get(`${slug}.focus.color`)?.value,
      '{focus.ring.color}',
      `${slug} focus ring is the yellow ring`,
    )
})

test('REQ-016: the rules read only tokens that exist, and never a glow on the pagination', () => {
  assert.ok(start > 0 && navigationCss.length > 500, 'the T8.4 rules were found')
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of navigationCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'tabs.fg',
    'tabs.rule',
    'tabs.active.fg',
    'tabs.active.indicator',
    'tabs.focus.color',
    'border.width.tabs',
    'breadcrumb.link.fg',
    'breadcrumb.current.fg',
    'breadcrumb.separator.fg',
    'breadcrumb.focus.color',
    'pagination.item.fg',
    'pagination.item.border',
    'pagination.current.bg',
    'pagination.current.fg',
    'pagination.focus.color',
    'radius.pagination',
    'border.width.pagination',
  ])
    assert.ok(navigationCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  // ADR-0028: the chip and the outlines carry no glow, and the focus indicator is an outline.
  assert.doesNotMatch(navigationCss, /effect-glow/)
  assert.match(navigationCss, /\.cn-pagination \.cn-button \{[^}]*box-shadow: none/)
  assert.doesNotMatch(navigationCss, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/, 'no color literal')
})

test('REQ-015: the navigation pairs are declared, and the pink and yellow ones pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, background, ratio, result] of [
    ['tabs.active.fg', 'color.bg.base', 8.37, 'pass'],
    ['tabs.active.indicator', 'color.bg.base', 8.37, 'pass'],
    ['tabs.focus.color', 'color.bg.base', 18.55, 'pass'],
    ['tabs.fg', 'color.bg.base', 11.18, 'pass'],
    ['breadcrumb.link.fg', 'color.bg.base', 8.37, 'pass'],
    ['breadcrumb.focus.color', 'color.bg.base', 18.55, 'pass'],
    ['breadcrumb.current.fg', 'color.bg.base', 19.26, 'pass'],
    ['pagination.current.fg', 'pagination.current.bg', 8.37, 'pass'],
    ['pagination.current.border', 'color.bg.base', 8.37, 'pass'],
    ['pagination.item.borderHover', 'color.bg.base', 8.37, 'pass'],
    ['pagination.focus.color', 'color.bg.base', 18.55, 'pass'],
    ['pagination.item.fg', 'color.bg.base', 19.26, 'pass'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === background)
    assert.equal(pair?.result, result, `${foreground} on ${background}`)
    assert.equal(pair?.ratio, ratio, `${foreground} on ${background}`)
  }
})

test('REQ-020: the theme puts the hook classes on the right slots, and makes the underline tabs the default', () => {
  const ui = appConfig.ui as unknown as Record<
    string,
    { slots: Record<string, string>; defaultVariants?: Record<string, string> }
  >
  for (const [slot, hook] of [
    ['list', 'cn-tabs__list'],
    ['trigger', 'cn-tabs__trigger'],
    ['indicator', 'cn-tabs__indicator'],
    ['content', 'cn-tabs__content'],
  ] as const) {
    assert.equal(ui.tabs?.slots[slot], hook, slot)
    assert.ok(navigationCss.includes(`.${hook}`), `${hook} has a rule`)
  }
  assert.equal(ui.tabs?.defaultVariants?.variant, 'link', 'Nuxt UI pill variant is not the default')
  assert.equal(ui.breadcrumb?.slots.link, 'cn-breadcrumb__link')
  assert.equal(ui.breadcrumb?.slots.separatorIcon, 'cn-breadcrumb__separator')
  assert.equal(ui.pagination?.slots.root, 'cn-pagination')
  assert.equal(ui.pagination?.slots.list, 'cn-pagination__list')
  assert.match(navigationCss, /\.cn-pagination__list \{\s*flex-wrap: wrap/)
})

test('REQ-026 AC1, AC2: each doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = {
    tabs: ['default', 'hover', 'focus-visible', 'selected', 'disabled'],
    breadcrumb: ['default', 'hover', 'focus-visible'],
    pagination: ['default', 'hover', 'focus-visible', 'selected', 'disabled'],
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

test('REQ-027 AC2: each doc has a keyboard map, and the tabs doc lists the arrow keys, Home, and End', () => {
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const map = doc.slice(doc.indexOf('Keyboard map'), doc.indexOf('ARIA:'))
    assert.match(map, /^\| Key \| Result \|/m, `${slug} keyboard map table`)
    assert.match(map, /\| Tab \|/, slug)
  }
  const tabs = docOf('tabs')
  for (const key of ['Arrow right', 'Arrow left', 'Home', 'End']) assert.ok(tabs.includes(`| ${key}`), key)
})

test('the pagination demos give the controls es-MX accessible names, since Nuxt UI keeps English ones', () => {
  for (const demo of ['states', 'playground']) {
    const source = read(`apps/showcase/demos/pagination/${demo}.vue`)
    assert.match(source, /aria-label="Página anterior"/, demo)
    assert.match(source, /aria-label="Página siguiente"/, demo)
    assert.match(source, /:aria-label="`Página \$\{item\.value\}`"/, demo)
  }
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    tabs: (await import('../apps/showcase/demos/tabs/controls')).default,
    breadcrumb: (await import('../apps/showcase/demos/breadcrumb/controls')).default,
    pagination: (await import('../apps/showcase/demos/pagination/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})
