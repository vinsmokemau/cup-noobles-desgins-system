// T7.7 checks: CnLogo, its tokens, theme rule, demos, and doc (REQ-030, REQ-021, REQ-022, REQ-020). What needs a browser, such
// as the rendered placeholder, the accessibility tree, and axe, is in apps/showcase/tests/e2e/logo.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast } from '../scripts/check-contrast'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'
import { findDomainTerms, findForbiddenPrimitives, findMisnamedComponents, listFiles } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const css = read('packages/nuxt/assets/css/main.css')
const ownCss = css.slice(css.indexOf('T7.7 (REQ-030)') - 3)
const component = read('packages/nuxt/components/CnLogo.vue')
const doc = read('docs/02-components/atoms/logo.md')
const data = readFrontmatter(doc).data as Record<string, unknown>

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: CnLogo is named Cn*, hand-rolls no primitive, and uses no domain term', () => {
  assert.ok(existsSync(join(root, 'packages/nuxt/components/CnLogo.vue')))
  assert.ok(listFiles(root, 'packages/nuxt/components', /\.vue$/).includes('packages/nuxt/components/CnLogo.vue'))
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-030 AC1: CnLogo takes variant icon, vertical, or horizontal, and a label unless decorative', () => {
  assert.match(component, /type Variant = 'icon' \| 'vertical' \| 'horizontal'/)
  // The label is required when the logo is not decorative, and decorative drops it (the two members of the union).
  assert.match(component, /\{ variant: Variant; label: string; decorative\?: false \}/)
  assert.match(component, /\{ variant: Variant; decorative: true; label\?: string \}/)
  // A named logo is an image with the label; a decorative one is hidden from assistive technology.
  assert.match(component, /:role="decorative \? undefined : 'img'"/)
  assert.match(component, /:aria-label="decorative \? undefined : label"/)
  assert.match(component, /:aria-hidden="decorative \? 'true' : undefined"/)
  assert.match(component, /:data-variant="variant"/)
})

test('REQ-030 AC2: the placeholder text is the exact string, hidden from assistive technology, and no artwork is drawn', () => {
  assert.match(component, /const PLACEHOLDER_TEXT = 'Logo asset pending \(TBD-17\)'/)
  assert.match(component, /<span class="cn-logo__placeholder" aria-hidden="true">\{\{ PLACEHOLDER_TEXT \}\}<\/span>/)
  // No invented logo: no SVG, image, path, or icon in the component, and no asset file in the brand folder yet.
  assert.doesNotMatch(component, /<svg|<img|<path|<picture|<image|i-ph-|UIcon|background-image/i)
  assert.deepEqual(listFiles(root, 'packages/nuxt/assets/brand', /\.(svg|png|jpe?g|webp|gif|avif)$/i), [])
})

test('the logo tokens reference semantic tokens, and every placeholder is marked tbd', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic, status, tbd] of [
    ['border.width.logo', 'border.width.interactive', 'tbd', ['TBD-11']],
    ['logo.placeholder.border', 'color.border.default', 'tbd', ['TBD-05', 'TBD-17']],
    ['logo.placeholder.fg', 'color.text.muted', 'tbd', ['TBD-05', 'TBD-17']],
    ['logo.placeholder.bg', 'color.bg.base', 'stable', undefined],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, status, path)
    if (tbd) assert.deepEqual(token?.cn?.tbd, tbd, path)
  }
})

test('the rule reads only tokens that exist, and each logo token is read', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of ['logo.placeholder.bg', 'logo.placeholder.border', 'logo.placeholder.fg', 'border.width.logo'])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  // The logo does not animate, so reduced motion has nothing to switch off (REQ-029 does not apply).
  assert.doesNotMatch(ownCss, /animation|transition|@keyframes/)
})

test('REQ-015: the placeholder pairs are declared, and the neutral ones are unverified while TBD-05 is open', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, ratio] of [
    ['logo.placeholder.fg', 7.98],
    ['logo.placeholder.border', 7.98],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'logo.placeholder.bg')
    assert.equal(pair?.result, 'unverified', foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
})

test('REQ-020 AC1, AC2: the doc is a custom component with a "Why custom" paragraph, and stays a draft', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'atom')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnLogo')
  // The logo files are missing (TBD-17, OD-08), so the doc cannot be stable (SPEC.md T7.7).
  assert.equal(data.status, 'draft')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.match(doc, /\*\*Why custom:\*\*[^\n]*Nuxt UI has no equivalent/)
  assert.match(doc, /Logo asset pending \(TBD-17\)/)
})

test('REQ-026 AC1, AC2: the doc lists the one state, and its state matrix demo shows the same one', () => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  assert.deepEqual(
    [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]),
    ['default'],
  )
  const shown = read('apps/showcase/demos/logo/states.vue')
    .match(/const states = \[([^\]]*)\]/)?.[1]
    ?.match(/'[a-z-]+'/g)
    ?.map((s) => s.slice(1, -1))
  assert.deepEqual(shown, ['default'])
})

test('REQ-030 AC1: every demo gives each logo a label or sets decorative, and the states show all three variants', () => {
  for (const demo of ['states', 'playground']) {
    const source = read(`apps/showcase/demos/logo/${demo}.vue`)
    for (const [tag] of source.matchAll(/<CnLogo\b[^>]*>/g)) assert.match(tag, /\blabel=|:label=|\bdecorative\b/, tag)
  }
  const states = read('apps/showcase/demos/logo/states.vue')
  for (const variant of ['icon', 'vertical', 'horizontal']) assert.match(states, new RegExp(`variant="${variant}"`))
  assert.match(states, /<CnLogo variant="icon" decorative \/>/)
})

test('REQ-055: the playground controls are a valid schema that the playground declares as props', async () => {
  const schema = (await import('../apps/showcase/demos/logo/controls')).default
  const playground = read('apps/showcase/demos/logo/playground.vue')
  for (const control of assertControls(schema, 'logo/controls.ts'))
    assert.match(playground, new RegExp(`\\b${control.name}\\??:`), control.name)
})

test('the docs point to each other and to the brand identity rules', () => {
  assert.match(doc, /brand-identity\.md/)
  assert.match(read('docs/00-overview/brand-identity.md'), /logo\.md/)
})
