// T7.9 checks: CnLogo with the supplied logo files, its tokens, theme rule, demos, and doc (REQ-030, REQ-021, REQ-022,
// REQ-020, ADR-0016). What needs a browser, such as the rendered image, the accessibility tree, the clear space, and axe, is in
// apps/showcase/tests/e2e/logo.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
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
const ownCss = css.slice(css.indexOf('T7.9 (REQ-030 AC3') - 3)
const component = read('packages/nuxt/components/CnLogo.vue')
const doc = read('docs/02-components/atoms/logo.md')
const data = readFrontmatter(doc).data as Record<string, unknown>

// The files the owner supplied (ADR-0016). CnLogo renders them unmodified, so their bytes are locked here (REQ-030 AC3).
const FILES = {
  icon: ['Icon-CN.svg', 'eb5abba764bb473cbf64544e23774bb99f3830060fe07d0a6f88144fc68de325'],
  vertical: ['LogoVertical-CN.svg', '7ac002cfd92a1c0984bf3a19dc51f9cefdc7147ea52ad82cca790b73e692ab21'],
  horizontal: ['LogoHorizontal-CN.svg', '183f296cb0ad6d3f3387c786bcbbb28e4f05b78fbb9a244dce61c133b33551b2'],
} as const

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: CnLogo is named Cn*, hand-rolls no primitive, and uses no domain term', () => {
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
  // A named logo is an image with the label as its alt text; a decorative one has an empty alt and is hidden.
  assert.match(component, /:alt="decorative \? '' : label"/)
  assert.match(component, /:aria-hidden="decorative \? 'true' : undefined"/)
  assert.match(component, /:data-variant="variant"/)
})

test('REQ-030 AC3: the three supplied files are byte-identical to the owner files, and each variant renders its own', () => {
  for (const [variant, [file, hash]] of Object.entries(FILES)) {
    const path = `packages/nuxt/assets/brand/${file}`
    assert.ok(existsSync(join(root, path)), path)
    assert.equal(
      createHash('sha256')
        .update(readFileSync(join(root, path)))
        .digest('hex'),
      hash,
      `${file} was modified`,
    )
    assert.match(
      component,
      new RegExp(`${variant}: new URL\\('\\.\\./assets/brand/${file}', import\\.meta\\.url\\)\\.href`),
    )
  }
  // Only the three supplied files are in the brand folder.
  assert.deepEqual(
    listFiles(root, 'packages/nuxt/assets/brand', /\.(svg|png|jpe?g|webp|gif|avif)$/i).map((f) => f.split('/').pop()),
    Object.values(FILES)
      .map(([file]) => file)
      .sort(),
  )
})

test('REQ-030 AC3: the files are shown as images, never inlined, and no artwork is drawn by the component', () => {
  assert.match(component, /<img\s[^>]*:src="SOURCES\[variant\]"/)
  assert.doesNotMatch(component, /<svg|<path|v-html|<picture|background-image|UIcon|i-ph-/i)
  // The three files reuse the same class names, so inlining them would make their styles collide.
  for (const [file] of Object.values(FILES)) {
    const svg = read(`packages/nuxt/assets/brand/${file}`)
    assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, `${file} has a viewBox`)
    assert.match(svg, /\.cls-1\{/, `${file} has internal class names`)
    assert.doesNotMatch(svg, /<script|href=|<image|foreignObject|onload|data:image/, `${file} is safe to serve`)
  }
})

test('the placeholder is gone: no text, token, or rule remains from T7.7', () => {
  assert.doesNotMatch(component, /Logo asset pending|TBD-17|PLACEHOLDER/)
  assert.doesNotMatch(css, /logo-placeholder|border-width-logo|cn-logo__placeholder/)
  for (const path of ['logo.placeholder.bg', 'logo.placeholder.border', 'logo.placeholder.fg', 'border.width.logo'])
    assert.equal(byPath.has(path), false, `${path} was removed`)
})

test('ADR-0016: the clear space and the minimum heights are the owner values, in all three token tiers', () => {
  assert.deepEqual(problems, [])
  const values = [
    ['clearSpace', 0.25, 'number'],
    ['minHeight.icon', '64px', 'dimension'],
    ['minHeight.vertical', '80px', 'dimension'],
    ['minHeight.horizontal', '36px', 'dimension'],
  ] as const
  for (const [name, value, type] of values) {
    const primitive = byPath.get(`logo.rule.${name}`)
    const semantic = byPath.get(`layout.logo.${name}`)
    const own = byPath.get(`logo.${name}`)
    assert.equal(primitive?.tier, 'primitive', name)
    assert.equal(primitive?.value, value, name)
    assert.equal(primitive?.type, type, name)
    assert.equal(primitive?.cn?.source, 'ADR-0016', name)
    assert.equal(semantic?.tier, 'semantic', name)
    assert.equal(semantic?.value, `{logo.rule.${name}}`, name)
    assert.equal(own?.tier, 'component', name)
    assert.equal(own?.value, `{layout.logo.${name}}`, name)
    for (const token of [primitive, semantic, own]) {
      assert.equal(token?.cn?.status, 'stable', name)
      assert.equal(token?.cn?.tbd, undefined, `${name} names no TBD item`)
    }
  }
})

test('the rule reads only tokens that exist, and each logo token is read', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of ['logo.clearSpace', 'logo.minHeight.icon', 'logo.minHeight.vertical', 'logo.minHeight.horizontal'])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  // The minimum is a floor: the height is the larger of the page's height and the variant's minimum.
  assert.match(ownCss, /--logo-h: max\(var\(--logo-height, var\(--logo-min\)\), var\(--logo-min\)\)/)
  assert.match(ownCss, /padding: calc\(var\(--logo-h\) \* var\(--cn-logo-clear-space\)\)/)
  // The logo does not animate, so reduced motion has nothing to switch off (REQ-029 does not apply).
  assert.doesNotMatch(ownCss, /animation|transition|@keyframes/)
})

test('REQ-015: the logo declares no contrast pair, because it is brand artwork', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  assert.equal(
    report.pairs.some((p) => p.foreground.startsWith('logo.') || p.background.startsWith('logo.')),
    false,
  )
})

test('REQ-020 AC1, AC2, REQ-009: the doc is a stable custom component with a "Why custom" paragraph and no open item', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'atom')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnLogo')
  // OD-08 is decided for the logos (ADR-0016), and the doc names it in its changelog (REQ-009 AC2).
  assert.equal(data.status, 'stable')
  assert.deepEqual(data.tbd, [])
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.match(doc, /\*\*Why custom:\*\*[^\n]*Nuxt UI has no equivalent/)
  assert.match(doc, /ADR-0016/)
  assert.doesNotMatch(doc, /^> \*\*(TBD|Draft)/m)
  for (const rule of ['25%', '64 px', '80 px', '36 px']) assert.ok(doc.includes(rule), rule)
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

test('the brand identity doc states the rules, names the files, and the docs point to each other', () => {
  const brand = read('docs/00-overview/brand-identity.md')
  assert.match(brand, /logo\.md/)
  assert.match(brand, /ADR-0016/)
  for (const file of ['Icon-CN.svg', 'LogoVertical-CN.svg', 'LogoHorizontal-CN.svg'])
    assert.ok(brand.includes(file), file)
  assert.doesNotMatch(brand, /Not supplied/)
  assert.deepEqual((readFrontmatter(brand).data as Record<string, unknown>).tbd, ['TBD-18'])
  assert.match(doc, /brand-identity\.md/)
})
