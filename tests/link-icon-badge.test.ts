// T7.3 checks: the link, icon, and badge tokens, theme, demos, and docs (REQ-020, REQ-026, REQ-016). What needs a browser,
// such as computed colors, the keyboard, axe, and the accessible name of an icon-only link, is in
// apps/showcase/tests/e2e/link-icon-badge.spec.ts.
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
const atomsCss = css.slice(css.indexOf('T7.3 (REQ-020, REQ-024)') - 3)
const docOf = (slug: string) => read(`docs/02-components/atoms/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-020 AC1: the three docs are nuxt-ui components named for their Nuxt UI component, and all are drafts', () => {
  for (const [slug, nuxtUi] of [
    ['link', 'ULink'],
    ['icon', 'UIcon'],
    ['badge', 'UBadge'],
  ] as const) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'atom', slug)
    assert.equal(data.source, 'nuxt-ui', slug)
    assert.equal(data.nuxtUi, nuxtUi, slug)
    // The icon set is open (OD-09), and the link and badge rely on placeholders and unapproved looks (REQ-009).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
  }
  // TBD-19 is resolved (ADR-0012): no doc cites it as open.
  assert.deepEqual(frontmatter('icon').tbd, [])
})

test('ADR-0012: every Nuxt UI icon name is set to a Phosphor Bold glyph, and no demo or showcase file uses another set', () => {
  const icons = (appConfig.ui as unknown as { icons: Record<string, string> }).icons
  assert.ok(Object.keys(icons).length >= 40, 'every default Nuxt UI icon name is mapped')
  for (const [name, value] of Object.entries(icons)) assert.match(value, /^i-ph-[a-z-]+-bold$/, name)
  for (const required of ['close', 'check', 'loading', 'chevronDown', 'search', 'star'])
    assert.ok(required in icons, `${required} is mapped`)
  for (const dir of ['apps/showcase/demos', 'apps/showcase/components', 'apps/showcase/layouts']) {
    const files = readdirSync(join(root, dir), { recursive: true, withFileTypes: true }).filter((e) => e.isFile())
    for (const file of files) {
      const text = readFileSync(join(file.parentPath, file.name), 'utf8')
      assert.doesNotMatch(text, /i-lucide-|i-tabler-|i-heroicons-/, `${file.name} uses another icon set`)
    }
  }
  const layer = JSON.parse(read('packages/nuxt/package.json')) as { dependencies: Record<string, string> }
  assert.equal(layer.dependencies['@iconify-json/ph'], '1.2.2')
})

test('the link and badge component tokens reference semantic tokens, and the shape tokens are tbd placeholders', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.badge', 'radius.interactive'],
    ['border.width.badge', 'border.width.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'tbd', path)
  }
  assert.equal(byPath.get('link.fg')?.value, '{color.brand.primary}')
  for (const part of ['color', 'width', 'offset', 'style'])
    assert.equal(byPath.get(`link.focus.${part}`)?.value, `{focus.ring.${part}}`, part)
  for (const path of ['link.fgHover', 'link.fgActive'])
    assert.equal(byPath.get(path)?.cn?.status, 'derived-pending', path)
})

test('the rules read only tokens that exist, and the link focus ring is an outline, not a glow', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of atomsCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
  for (const path of ['radius.badge', 'border.width.badge'])
    assert.ok(atomsCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  const focus = atomsCss.slice(atomsCss.indexOf('.cn-link:is(:focus-visible'))
  assert.match(focus.slice(0, focus.indexOf('}')), /outline:[^;]*--cn-link-focus-width[^;]*--cn-link-focus-color/)
  assert.doesNotMatch(focus.slice(0, focus.indexOf('}')), /box-shadow/)
  // The underline stays on in every state (WCAG 1.4.1).
  assert.match(atomsCss, /\.cn-link \{[^}]*text-decoration-line: underline;/)
})

test('REQ-015: the label and outline pairs of the link and the badge are declared and pass, and the tag label is black', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, background, ratio] of [
    ['link.fg', 'color.bg.base', 8.37],
    ['link.fgHover', 'color.bg.base', 8.37],
    ['link.fgActive', 'color.bg.base', 8.37],
    ['link.focus.color', 'color.bg.base', 18.55],
    ['badge.primary.fg', 'badge.primary.bg', 8.37],
    ['badge.outline.fg', 'color.bg.base', 8.37],
    ['badge.tag.fg', 'badge.tag.bg', 18.55],
    ['badge.tag.border', 'color.bg.base', 18.55],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === background)
    assert.equal(pair?.result, 'pass', `${foreground} on ${background}`)
    assert.equal(pair?.ratio, ratio, `${foreground} on ${background}`)
  }
  assert.equal(byPath.get('badge.tag.fg')?.value, '{color.text.inverted}')
})

test('REQ-020: the theme maps the badge variants to Nuxt UI props, and doc and theme agree', () => {
  assert.equal(appConfig.ui.link.base, 'cn-link')
  assert.equal(appConfig.ui.badge.slots.base, 'cn-badge')
  assert.deepEqual(appConfig.ui.badge.compoundVariants, [
    { color: 'primary', variant: 'solid', class: 'cn-badge--primary' },
    { color: 'primary', variant: 'outline', class: 'cn-badge--outline' },
    { color: 'secondary', variant: 'solid', class: 'cn-badge--tag' },
  ])
  const doc = docOf('badge')
  const variants = doc.slice(doc.indexOf('## Variants'), doc.indexOf('## States'))
  for (const row of [
    '| `primary` | `color="primary" variant="solid"` |',
    '| `outline` | `color="primary" variant="outline"` |',
    '| `tag` | `color="secondary" variant="solid"` |',
  ])
    assert.ok(variants.includes(row), row)
})

test('REQ-026 AC1, AC2: each doc lists the states that apply, and its state matrix demo shows the same ones', () => {
  const expected: Record<string, string[]> = {
    link: ['default', 'hover', 'focus-visible', 'active', 'disabled'],
    badge: ['default'],
    icon: ['default'],
  }
  for (const [slug, states] of Object.entries(expected)) {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    assert.deepEqual(listed, states, `${slug} doc`)
    const demo = read(`apps/showcase/demos/${slug}/states.vue`)
    const shown = demo
      .match(/const states = \[([^\]]*)\]/)?.[1]
      ?.match(/'[a-z-]+'/g)
      ?.map((s) => s.slice(1, -1))
    assert.deepEqual(shown, states, `${slug} demo`)
  }
})

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    link: (await import('../apps/showcase/demos/link/controls')).default,
    badge: (await import('../apps/showcase/demos/badge/controls')).default,
    icon: (await import('../apps/showcase/demos/icon/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('the tag badge is the variant BR-12 names, and the docs say so', () => {
  const doc = docOf('badge')
  assert.match(doc, /tag badge/i)
  assert.match(doc, /BR-12/)
  assert.ok(byPath.has('badge.tag.bg'), 'the tag badge has tokens')
  assert.ok(frontmatter('badge').brandRules && (frontmatter('badge').brandRules as string[]).includes('BR-12'))
})
