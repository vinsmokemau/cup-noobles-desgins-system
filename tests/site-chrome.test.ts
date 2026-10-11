// T8.6 checks: the site header and site footer tokens, theme, demos, docs, and the showcase layout (REQ-020, REQ-022, REQ-026,
// REQ-027, REQ-028, REQ-061, REQ-016). What needs a browser, such as the menu focus trap, Escape, computed colors, the widths,
// and axe, is in apps/showcase/tests/e2e/site-chrome.spec.ts and scaffold.spec.ts.
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
// The rules of T8.6 without the comment above them.
const ownCss = css.slice(css.indexOf('T8.6 (REQ-020')).replace(/^[\s\S]*?\*\//, '')
const SLUGS = ['site-header', 'site-footer'] as const
const NUXT_UI = { 'site-header': 'UHeader', 'site-footer': 'UFooter' } as const
const GROUP = { 'site-header': 'siteHeader', 'site-footer': 'siteFooter' } as const
const docOf = (slug: string) => read(`docs/02-components/organisms/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: both docs are nuxt-ui organisms named for their Nuxt UI component, and both are drafts', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'organism', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, NUXT_UI[slug], slug)
    // The text color and the stroke width are placeholders (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.deepEqual(data.tbd, ['TBD-04', 'TBD-11'], slug)
    assert.match(docOf(slug), new RegExp(`\`${NUXT_UI[slug]}\``), `${slug} doc names its Nuxt UI component`)
  }
})

test('the bar tokens reference semantic tokens, the brand ones are stable, and the placeholders are tbd', () => {
  assert.deepEqual(problems, [])
  for (const slug of SLUGS) {
    const group = GROUP[slug]
    for (const [path, value, status] of [
      [`${group}.bg`, '{color.bg.base}', 'stable'],
      [`${group}.line`, '{color.brand.primary}', 'stable'],
      [`${group}.fg`, '{color.text.default}', 'tbd'],
      [`border.width.${group}`, '{border.width.interactive}', 'tbd'],
    ] as const) {
      const token = byPath.get(path)
      assert.equal(token?.tier, 'component', path)
      assert.equal(token?.value, value, path)
      assert.equal(token?.cn?.status, status, path)
    }
  }
})

test('REQ-016, ADR-0030: the bar rules read only tokens that exist, with no glow and no card color', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'siteHeader.bg',
    'siteHeader.line',
    'siteHeader.fg',
    'border.width.siteHeader',
    'siteFooter.bg',
    'siteFooter.line',
    'siteFooter.fg',
    'border.width.siteFooter',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(ownCss, /surface/, 'the bars render on color.bg.base, not on a card color')
  assert.doesNotMatch(ownCss, /effect-glow|box-shadow/, 'ADR-0030: no glow')
  // No raw color, length, or time literal: every value is a var() or a keyword (REQ-016 AC1).
  assert.doesNotMatch(ownCss, /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\d(px|rem|ms)\b/)
})

test('REQ-020: the theme puts the hook class on the root of the header and the footer', () => {
  const ui = appConfig.ui as unknown as Record<string, { slots: Record<string, string> }>
  assert.match(ui.header?.slots.root ?? '', /\bcn-site-header\b/)
  assert.match(ui.footer?.slots.root ?? '', /\bcn-site-footer\b/)
  for (const hook of ['.cn-site-header', '.cn-site-footer'])
    assert.ok(ownCss.includes(`${hook} {`), `${hook} has a rule`)
  // The translucent blur Nuxt UI draws is replaced by the opaque fill.
  assert.match(ownCss, /\.cn-site-header \{[^}]*backdrop-filter: none/)
  assert.match(ownCss, /\.cn-site-header \{[^}]*border-bottom:/)
  assert.match(ownCss, /\.cn-site-footer \{[^}]*border-top:/)
})

test('REQ-015: the pink lines pass against the black fill, and the text pairs are declared', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const group of ['siteHeader', 'siteFooter']) {
    const line = report.pairs.find((p) => p.foreground === `${group}.line` && p.background === `${group}.bg`)
    assert.equal(line?.result, 'pass', `${group}.line`)
    assert.equal(line?.ratio, 8.37, `${group}.line`)
    const text = report.pairs.find((p) => p.foreground === `${group}.fg` && p.background === `${group}.bg`)
    assert.equal(text?.result, 'unverified', `${group}.fg`)
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

test('REQ-027 AC2: each doc lists its keyboard interactions, and the e2e spec has a test for the header ones', () => {
  const spec = read('apps/showcase/tests/e2e/site-chrome.spec.ts')
  const covered = {
    '`Tab`': /Tab and Shift\+Tab stay inside the open menu/,
    '`Shift+Tab`': /Tab and Shift\+Tab stay inside the open menu/,
    '`Enter` or `Space`': /Space on the toggle opens the menu/,
    '`Escape`': /Escape closes it/,
  }
  const map = docOf('site-header')
  const keys = map.slice(map.indexOf('Keyboard map:'), map.indexOf('ARIA:'))
  for (const [key, test] of Object.entries(covered)) {
    assert.ok(keys.includes(`| ${key} |`), `site-header lists ${key}`)
    assert.match(spec, test, `${key} has a test`)
  }
  assert.match(map, /ARIA: the bar is `<header>` \(banner\)\. The menu has `role="dialog"`, `aria-labelledby`/)
  const footer = docOf('site-footer')
  const footerKeys = footer.slice(footer.indexOf('Keyboard map:'), footer.indexOf('ARIA:'))
  for (const key of ['`Tab`', '`Shift+Tab`', '`Enter`', '`Space`'])
    assert.ok(footerKeys.includes(`| ${key} |`), `site-footer lists ${key}`)
})

test('REQ-020 AC3, ER-01: the demos use the Nuxt UI component, and no hand-built header or dialog exists', () => {
  for (const slug of SLUGS) {
    for (const demo of ['states', 'playground']) {
      const source = read(`apps/showcase/demos/${slug}/${demo}.vue`)
      assert.match(source, new RegExp(`<${NUXT_UI[slug]}[\\s>]`), `${slug}/${demo}`)
      assert.doesNotMatch(source, /role="dialog"|focus-trap|FocusScope/i, `${slug}/${demo}`)
    }
  }
})

test('REQ-022: the header and footer demos and docs hold no commerce term in a prop, slot, or token name', () => {
  const terms = read('scripts/domain-terms.txt')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  for (const slug of SLUGS) {
    for (const file of ['states.vue', 'playground.vue', 'controls.ts']) {
      const source = read(`apps/showcase/demos/${slug}/${file}`)
      const names = [...source.matchAll(/(?:#|v-slot:)([a-zA-Z-]+)|name: '([a-zA-Z]+)'/g)].map((m) => m[1] ?? m[2]!)
      for (const name of names)
        for (const term of terms)
          assert.ok(!new RegExp(`\\b${term}\\b`, 'i').test(name), `${slug}/${file}: "${name}" has "${term}"`)
    }
  }
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    'site-header': (await import('../apps/showcase/demos/site-header/controls')).default,
    'site-footer': (await import('../apps/showcase/demos/site-footer/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('REQ-061 AC2: the showcase layout uses the themed header with the slideover menu, and the footer', () => {
  const layout = read('apps/showcase/layouts/default.vue')
  assert.match(layout, /<UHeader[\s\S]*?mode="slideover"/, 'the header menu is a slideover')
  assert.match(layout, /<UFooter>/, 'the showcase has the site footer')
  assert.doesNotMatch(layout, /<USlideover/, 'the layout no longer builds its own slideover')
})

test('ADR-0030 is recorded in the decision log', () => {
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0030-site-chrome-look\.md\)/)
})
