// T8.5 checks: the modal and the slideover tokens, theme, demos, and docs (REQ-020, REQ-026, REQ-027, REQ-016). What needs a
// browser, such as the focus trap, Escape, the inert page, computed colors, and axe, is in
// apps/showcase/tests/e2e/overlay.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
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
// The rules of T8.5 without the comment above them.
const ownCss = css.slice(css.indexOf('T8.5 (REQ-020')).replace(/^[\s\S]*?\*\//, '')
const SLUGS = ['modal', 'slideover'] as const
const NUXT_UI = { modal: 'UModal', slideover: 'USlideover' } as const
const docOf = (slug: string) => read(`docs/02-components/organisms/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: both docs are nuxt-ui organisms named for their Nuxt UI component, and both are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'organism', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The corner radius is set (ADR-0050); the docs stay drafts until the owner moves them to stable (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.deepEqual(data.tbd, [], slug)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
  }
})

test('the overlay tokens reference semantic tokens, the brand ones are stable, and the shape tokens are stable', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.overlay', 'radius.container'],
    ['border.width.overlay', 'border.width.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'stable', path)
  }
  for (const [path, value, status] of [
    ['overlay.bg', '{color.surface.elevated}', 'stable'],
    ['overlay.highlight', '{color.brand.primary}', 'stable'],
    ['overlay.divider', '{color.brand.primary}', 'stable'],
    ['overlay.scrim', '{color.bg.base}', 'stable'],
    ['overlay.scrimOpacity', '{effect.scrim.opacity}', 'stable'],
    ['overlay.shadow', '{effect.elevation.overlay}', 'stable'],
    ['overlay.z', '{effect.zIndex.overlay}', 'stable'],
    ['overlay.fg', '{color.text.default}', 'stable'],
    ['overlay.fgMuted', '{color.text.muted}', 'stable'],
  ] as const) {
    assert.equal(byPath.get(path)?.value, value, path)
    assert.equal(byPath.get(path)?.cn?.status, status, path)
  }
  // ADR-0054: Outline only. The backdrop is black at 85%, there is no shadow, and the overlay sits at 50, below the toast.
  for (const [path, value] of [
    ['effect.opacity.scrim', 0.85],
    ['effect.shadow.overlay', 'none'],
    ['z.overlay', 50],
    ['z.toast', 100],
  ] as const) {
    assert.equal(byPath.get(path)?.value, value, path)
    assert.equal(byPath.get(path)?.cn?.status, 'stable', path)
    assert.equal(byPath.get(path)?.cn?.source, 'ADR-0054', path)
  }
  assert.ok(!byPath.has('placeholder.effect.scrimOpacity'), 'the backdrop placeholder is deleted')
})

test('REQ-016, ADR-0029: the overlay rules read only tokens that exist, with no glow and no card color', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'overlay.bg',
    'overlay.highlight',
    'overlay.divider',
    'overlay.scrim',
    'overlay.scrimOpacity',
    'overlay.shadow',
    'overlay.z',
    'overlay.fg',
    'overlay.fgMuted',
    'radius.overlay',
    'border.width.overlay',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(ownCss, /surface/, 'the rules read the overlay tokens, never a surface token (ADR-0053)')
  assert.doesNotMatch(ownCss, /effect-glow/, 'ADR-0029: no glow')
  // No raw color, length, or time literal: every value is a var() or a keyword (REQ-016 AC1).
  assert.doesNotMatch(ownCss, /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\d(px|rem|ms)\b/)
})

test('REQ-020: the theme puts the hook classes on the backdrop and the panel of both overlays', () => {
  const ui = appConfig.ui as unknown as Record<string, { slots: Record<string, string> }>
  for (const name of ['modal', 'slideover']) {
    assert.match(ui[name]?.slots.overlay ?? '', /\bcn-overlay-scrim\b/, `${name} overlay`)
    assert.match(ui[name]?.slots.content ?? '', /\bcn-overlay-panel\b/, `${name} content`)
    // REQ-029 AC2: the opening movement is switched off under reduced motion.
    assert.match(ui[name]?.slots.overlay ?? '', /motion-reduce:animate-none!/, `${name} overlay reduced motion`)
    assert.match(ui[name]?.slots.content ?? '', /motion-reduce:animate-none!/, `${name} content reduced motion`)
  }
  for (const hook of ['.cn-overlay-scrim', '.cn-overlay-panel'])
    assert.ok(ownCss.includes(`${hook} {`), `${hook} has a rule`)
  const slideover = appConfig.ui.slideover as unknown as { compoundVariants: { side: string; class: unknown }[] }
  assert.deepEqual(slideover.compoundVariants.map((v) => v.side).sort(), ['bottom', 'left', 'right', 'top'])
  for (const side of ['top', 'right', 'bottom', 'left'])
    assert.ok(ownCss.includes(`.cn-overlay-panel--edge-${side} {`), `edge-${side} has a rule`)
})

test('REQ-015: the overlay pairs are declared, and the pink outline and dividers pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, ratio, result] of [
    ['overlay.fg', 19.26, 'pass'],
    ['overlay.fgMuted', 11.18, 'pass'],
    ['overlay.highlight', 8.37, 'pass'],
    ['overlay.divider', 8.37, 'pass'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'overlay.bg')
    assert.equal(pair?.result, result, foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
})

test('REQ-026 AC1, AC2: each doc lists the states, and its state matrix demo shows the same ones', () => {
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    assert.deepEqual(listed, ['default'], `${slug} doc`)
    const demo = read(`apps/showcase/demos/${slug}/states.vue`)
    const shown = demo
      .match(/const states = \[([^\]]*)\]/)?.[1]
      ?.match(/'[a-z-]+'/g)
      ?.map((s) => s.slice(1, -1))
    assert.deepEqual(shown, ['default'], `${slug} demo`)
  }
})

test('REQ-027 AC2: each doc lists its keyboard interactions, and the e2e spec has a test for each', () => {
  const spec = read('apps/showcase/tests/e2e/overlay.spec.ts')
  const covered = {
    '`Tab`': /Tab \$\{i \+ 1\} stays in the panel/,
    '`Shift+Tab`': /Shift\+Tab \$\{i \+ 1\} stays in the panel/,
    '`Escape`': /Escape closes it and focus returns/,
    '`Enter` or `Space`': /Enter and Space on the close button close it/,
  }
  for (const slug of SLUGS) {
    const doc = docOf(slug)
    const map = doc.slice(doc.indexOf('Keyboard map:'), doc.indexOf('ARIA:'))
    for (const [key, test] of Object.entries(covered)) {
      assert.ok(map.includes(`| ${key} |`), `${slug} lists ${key}`)
      assert.match(spec, test, `${key} has a test`)
    }
    assert.match(doc, /ARIA: `role="dialog"`, `aria-labelledby`/, `${slug} lists its ARIA`)
  }
})

test('REQ-020 AC3, ER-01: the demos use the Nuxt UI component, and no hand-built dialog exists', () => {
  for (const slug of SLUGS) {
    for (const demo of ['states', 'playground']) {
      const source = read(`apps/showcase/demos/${slug}/${demo}.vue`)
      assert.match(source, new RegExp(`<${NUXT_UI[slug]}[\\s>]`), `${slug}/${demo}`)
      assert.doesNotMatch(source, /role="dialog"|focus-trap|FocusScope/i, `${slug}/${demo}`)
    }
  }
  const components = readdirSync(join(root, 'packages/nuxt/components'))
  assert.ok(!components.some((file) => /modal|slideover|dialog/i.test(file)), 'the layer ships no dialog component')
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    modal: (await import('../apps/showcase/demos/modal/controls')).default,
    slideover: (await import('../apps/showcase/demos/slideover/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('ADR-0029 is recorded in the decision log, and its placeholder is struck from the ADR-0006 table (ADR-0054)', () => {
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0029-overlay-look\.md\)/)
  assert.match(
    read('docs/06-governance/decisions/0006-placeholder-values.md'),
    /\| ~~`placeholder\.effect\.scrimOpacity`~~ \| ~~`0\.75`~~ \|[^\n]*deleted \(ADR-0054\)/,
  )
})
