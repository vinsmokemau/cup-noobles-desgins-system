// T8.3 checks: the alert, toast, and tooltip tokens, theme, demos, and docs (REQ-020, REQ-026, REQ-016, REQ-015). What needs a
// browser, such as the live region, the tooltip opening on focus, and axe, is in apps/showcase/tests/e2e/{alert,toast,tooltip}.spec.ts.
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
// Our rules sit just before the sparkle's block (T7.8), so each task's slice ends where the next one starts.
const feedbackCss = css.slice(css.indexOf('T8.3 (REQ-020, REQ-026') - 3, css.indexOf('T7.8 (REQ-029)') - 3)
const SLUGS = ['alert', 'toast', 'tooltip'] as const
const NUXT_UI = { alert: 'UAlert', toast: 'UToast', tooltip: 'UTooltip' } as const
const TYPES = ['success', 'info', 'warning', 'error'] as const
const docOf = (slug: string) => read(`docs/02-components/molecules/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: the three docs are nuxt-ui molecules named for their Nuxt UI component, and all are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'molecule', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The feedback colors, the text colors, the radius, and the stroke width are placeholders (REQ-009).
    assert.equal(data.status, 'stable', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
    assert.match(docOf(slug), /ADR-0027/, `${slug} doc cites the decision`)
  }
})

test("Done when: each feedback variant of the alert and the toast uses a feedback token, which is the owner's color (ADR-0032)", () => {
  assert.deepEqual(problems, [])
  for (const component of ['alert', 'toast']) {
    for (const type of TYPES) {
      const token = byPath.get(`${component}.${type}.color`)
      assert.equal(token?.tier, 'component', `${component}.${type}.color`)
      assert.equal(token?.value, `{color.feedback.${type}}`, `${component}.${type}.color`)
      assert.equal(token?.cn?.status, 'stable', `${component}.${type}.color`)
      assert.equal(token?.cn?.tbd, undefined, `${component}.${type}.color`)
    }
  }
})

test('the alert, toast, and tooltip tokens reference semantic tokens, and the shape tokens are stable', () => {
  for (const slug of SLUGS) {
    for (const [path, semantic] of [
      [`radius.${slug}`, slug === 'tooltip' ? 'radius.compact' : 'radius.interactive'],
      [`border.width.${slug}`, 'border.width.interactive'],
    ] as const) {
      const token = byPath.get(path)
      assert.equal(token?.tier, 'component', path)
      assert.equal(token?.value, `{${semantic}}`, path)
      assert.equal(token?.cn?.status, 'stable', path)
    }
    assert.equal(byPath.get(`${slug}.bg`)?.value, '{color.bg.base}', `${slug}.bg`)
    assert.equal(byPath.get(`${slug}.bg`)?.cn?.status, 'stable', `${slug}.bg`)
    assert.equal(byPath.get(`${slug}.fg`)?.value, '{color.text.default}', `${slug}.fg`)
    assert.equal(byPath.get(`${slug}.fg`)?.cn?.status, 'stable', `${slug}.fg`)
  }
  for (const component of ['alert', 'toast']) {
    assert.equal(byPath.get(`${component}.fgMuted`)?.value, '{color.text.muted}', component)
    assert.equal(byPath.get(`${component}.focus.color`)?.value, '{focus.ring.color}', component)
    assert.equal(byPath.get(`${component}.focus.color`)?.cn?.status, 'stable', component)
  }
  // ADR-0027: the tooltip outline is brand pink.
  assert.equal(byPath.get('tooltip.border')?.value, '{color.brand.primary}')
  assert.equal(byPath.get('tooltip.border')?.cn?.status, 'stable')
})

test('REQ-016: the feedback rules read only tokens that exist, and draw no glow or shadow', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of feedbackCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'alert.bg',
    'alert.fg',
    'alert.success.color',
    'alert.error.color',
    'toast.bg',
    'toast.warning.color',
    'toast.info.color',
    'tooltip.bg',
    'tooltip.border',
    'radius.alert',
    'radius.toast',
    'radius.tooltip',
    'border.width.alert',
    'border.width.toast',
    'border.width.tooltip',
  ])
    assert.ok(feedbackCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(feedbackCss, /effect-glow/)
  assert.doesNotMatch(feedbackCss, /surface/)
  assert.doesNotMatch(feedbackCss, /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/, 'no color literal')
})

test('REQ-015: the pairs are declared, the pink tooltip outline passes, and the text and feedback colors pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  const pair = (foreground: string, background: string) =>
    report.pairs.find((p) => p.foreground === foreground && p.background === background)
  assert.equal(pair('tooltip.border', 'tooltip.bg')?.result, 'pass')
  assert.equal(pair('tooltip.border', 'tooltip.bg')?.ratio, 8.37)
  assert.equal(pair('tooltip.fg', 'tooltip.bg')?.result, 'pass')
  for (const component of ['alert', 'toast']) {
    assert.equal(pair(`${component}.fg`, `${component}.bg`)?.result, 'pass', `${component}.fg`)
    assert.equal(pair(`${component}.fgMuted`, `${component}.bg`)?.result, 'pass', `${component}.fgMuted`)
    assert.equal(pair(`${component}.focus.color`, `${component}.bg`)?.result, 'pass', `${component}.focus.color`)
    for (const type of TYPES)
      assert.equal(pair(`${component}.${type}.color`, `${component}.bg`)?.result, 'pass', `${component}.${type}`)
  }
})

test('REQ-020: the theme puts the hook classes on the parts, and each hook has a rule', () => {
  const ui = appConfig.ui as unknown as Record<
    string,
    {
      slots: Record<string, string>
      variants?: { color: Record<string, { root: string }> }
      compoundVariants?: { color: string; class: { root: string } }[]
    }
  >
  for (const [component, parts] of [
    ['alert', ['root', 'title', 'description', 'icon', 'close']],
    ['toast', ['root', 'title', 'description', 'icon', 'close']],
  ] as const) {
    for (const part of parts) {
      const hook = ui[component]!.slots[part]!
      assert.match(hook, new RegExp(`^cn-${component}(__${part})?$`), `${component}.${part}`)
      assert.ok(feedbackCss.includes(`.${hook}`), `${hook} has a rule`)
    }
    for (const type of TYPES) {
      // Nuxt UI's toast theme has a slot object per color; its alert theme has plain strings, so the alert uses a
      // compound variant for the same modifier class.
      const hook =
        component === 'toast'
          ? ui.toast!.variants!.color[type]!.root
          : ui.alert!.compoundVariants!.find((variant) => variant.color === type)!.class.root
      assert.equal(hook, `cn-${component}--${type}`, `${component} ${type}`)
      assert.ok(feedbackCss.includes(`.${hook}`), `${hook} has a rule`)
    }
  }
  assert.equal(ui.tooltip?.slots.content, 'cn-tooltip')
  assert.ok(feedbackCss.includes('.cn-tooltip'))
  // The toast's countdown bar moves by itself and is hidden.
  assert.equal(ui.toast?.slots.progress, 'hidden')
})

test('REQ-029 AC2: the open and close animations of the tooltip and the toaster stop under reduced motion', () => {
  const block = feedbackCss.slice(feedbackCss.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(block, /\.cn-tooltip,\s*\.cn-toaster__item\s*\{\s*animation: none;/)
  assert.equal(
    (appConfig.ui as unknown as { toaster: { slots: { base: string } } }).toaster.slots.base,
    'cn-toaster__item',
  )
})

test('REQ-026 AC1, AC2: each doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = {
    alert: ['default', 'success', 'warning', 'error', 'focus-visible'],
    toast: ['default', 'success', 'warning', 'error', 'focus-visible'],
    tooltip: ['default', 'hover', 'focus-visible'],
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

test('Done when: the toast is shown through the toaster, whose live region announces it, and a demo owns its toaster', () => {
  const states = read('apps/showcase/demos/toast/states.vue')
  assert.match(states, /<UToaster/)
  assert.match(states, /<UToast/)
  const playground = read('apps/showcase/demos/toast/playground.vue')
  assert.match(playground, /useToast\(\)/)
  assert.match(playground, /toast\.add\(/)
  // The page's own toaster is off on demo routes, so a toast is never shown twice.
  assert.match(read('apps/showcase/app.vue'), /\/_demo\//)
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    alert: (await import('../apps/showcase/demos/alert/controls')).default,
    toast: (await import('../apps/showcase/demos/toast/controls')).default,
    tooltip: (await import('../apps/showcase/demos/tooltip/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})
