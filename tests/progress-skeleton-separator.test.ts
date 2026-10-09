// T7.6 checks: the progress, skeleton, and separator tokens, theme, demos, and docs (REQ-020, REQ-026, REQ-029, REQ-016). What
// needs a browser, such as computed styles, reduced motion, the accessibility tree, and axe, is in
// apps/showcase/tests/e2e/progress-skeleton-separator.spec.ts.
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
const ownCss = css.slice(css.indexOf('T7.6 (REQ-020, REQ-029)') - 3)
const SLUGS = ['progress', 'skeleton', 'separator'] as const
const NUXT_UI = { progress: 'UProgress', skeleton: 'USkeleton', separator: 'USeparator' } as const
const STATES = {
  progress: ['default', 'empty', 'complete', 'indeterminate'],
  skeleton: ['default'],
  separator: ['default'],
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
    // The outline color, the stroke widths, the radius, and the motion are placeholders (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.deepEqual(data.tokens, [slug], slug)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
  }
})

test('the component tokens reference semantic tokens, and every placeholder is marked tbd', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic, tbd] of [
    ['border.width.progress', 'border.width.interactive', 'TBD-11'],
    ['border.width.skeleton', 'border.width.interactive', 'TBD-11'],
    ['border.width.separator', 'border.width.interactive', 'TBD-11'],
    ['radius.skeleton', 'radius.interactive', 'TBD-10'],
    ['progress.border', 'color.border.default', 'TBD-05'],
    ['skeleton.border', 'color.border.default', 'TBD-05'],
    ['separator.color', 'color.border.default', 'TBD-05'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'tbd', path)
    assert.deepEqual(token?.cn?.tbd, [tbd], path)
  }
  // The black fill and the pink fill follow brand values, so they are stable.
  for (const [path, semantic] of [
    ['progress.bg', 'color.bg.base'],
    ['separator.bg', 'color.bg.base'],
    ['progress.fill', 'color.brand.primary'],
  ] as const) {
    assert.equal(byPath.get(path)?.value, `{${semantic}}`, path)
    assert.equal(byPath.get(path)?.cn?.status, 'stable', path)
  }
})

test('the rules read only tokens that exist, and each component token is read', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'progress.bg',
    'progress.border',
    'progress.fill',
    'border.width.progress',
    'skeleton.border',
    'border.width.skeleton',
    'separator.color',
    'border.width.separator',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
})

test('REQ-029 AC2: the skeleton fade and the indeterminate progress movement are switched off under reduced motion', () => {
  const reduced = ownCss.slice(ownCss.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /\.cn-skeleton,[^{]*\.cn-progress__fill\[data-state='indeterminate'\]\s*\{\s*animation: none;/)
  // The fade is the only animation the skeleton declares, and it is infinite, so it must be off under reduced motion.
  assert.match(ownCss, /\.cn-skeleton\s*\{[^}]*animation: cn-skeleton-fade/)
})

test('REQ-015: the progress and separator pairs are declared, and all but the neutral outlines pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, background, ratio, result] of [
    ['progress.border', 'progress.bg', 7.98, 'unverified'],
    ['progress.fill', 'progress.bg', 8.37, 'pass'],
    ['separator.color', 'separator.bg', 7.98, 'unverified'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === background)
    assert.equal(pair?.result, result, foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
})

test('REQ-020: the theme puts the hook classes on the right slots of the three components', () => {
  const ui = appConfig.ui as unknown as {
    progress: { slots: { base: string; indicator: string } }
    skeleton: { base: string }
    separator: {
      slots: { border: string }
      compoundVariants: { orientation: string; class: { border: string } }[]
    }
  }
  assert.equal(ui.progress.slots.base, 'cn-progress')
  assert.equal(ui.progress.slots.indicator, 'cn-progress__fill')
  // The skeleton radius is a utility class that reads the token, so a page can still make a circle with `rounded-full`.
  assert.equal(ui.skeleton.base, 'cn-skeleton rounded-(--cn-radius-skeleton)')
  assert.ok(byPath.has('radius.skeleton'))
  assert.equal(ui.separator.slots.border, 'cn-separator')
  const hooks = Object.fromEntries(ui.separator.compoundVariants.map((v) => [v.orientation, v.class.border]))
  assert.deepEqual(hooks, { horizontal: 'cn-separator--horizontal', vertical: 'cn-separator--vertical' })
})

test('REQ-026 AC1, AC2: each doc lists the states that apply, and its state matrix demo shows the same ones', () => {
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    assert.deepEqual(listed, STATES[slug], `${slug} doc`)
    const shown = read(`apps/showcase/demos/${slug}/states.vue`)
      .match(/const states = \[([^\]]*)\]/)?.[1]
      ?.match(/'[a-z-]+'/g)
      ?.map((s) => s.slice(1, -1))
    assert.deepEqual(shown, STATES[slug], `${slug} demo`)
  }
})

test('REQ-027: every progress demo names its bar, and every skeleton demo overrides the fixed English label', () => {
  for (const demo of ['states', 'playground'])
    assert.match(read(`apps/showcase/demos/progress/${demo}.vue`), /:get-value-label=/, `progress/${demo}`)
  for (const demo of ['states', 'playground']) {
    const source = read(`apps/showcase/demos/skeleton/${demo}.vue`)
    assert.match(source, /role="status"/, `skeleton/${demo}: a status role`)
    assert.match(source, /aria-label="Cargando/, `skeleton/${demo}: an es-MX label`)
    assert.doesNotMatch(source, /aria-label="loading"/, `skeleton/${demo}: no English label`)
  }
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    progress: (await import('../apps/showcase/demos/progress/controls')).default,
    skeleton: (await import('../apps/showcase/demos/skeleton/controls')).default,
    separator: (await import('../apps/showcase/demos/separator/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('the docs point to each other and to the motion rules', () => {
  assert.match(docOf('progress'), /skeleton\.md/)
  assert.match(docOf('progress'), /separator\.md/)
  assert.match(docOf('skeleton'), /progress\.md/)
  assert.match(docOf('separator'), /ADR-0015/)
})
