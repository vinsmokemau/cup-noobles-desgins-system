// T15.3 checks: CnImageGallery, its tokens, theme rules, demos, doc, and ADR (DSR-03, REQ-020, REQ-021, REQ-022, REQ-026,
// ADR-0066). What needs a browser, such as the keys, the focus ring, the fallback, the overflow, and axe, is in
// apps/showcase/tests/e2e/image-gallery.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast } from '../scripts/check-contrast'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'
import { clampPosition, pictureProblem } from '../packages/nuxt/utils/image-gallery'
import { findDomainTerms, findForbiddenPrimitives, findMisnamedComponents, listFiles } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const css = read('packages/nuxt/assets/css/main.css').replace(/\r\n/g, '\n')
// From the T15.3 comment to the T15.2 comment, which is the next block in the file.
const ownCss = css.slice(css.indexOf('T15.3 (REQ-020'), css.indexOf('T15.2 (REQ-020')).replace(/^[\s\S]*?\*\//, '')
const component = read('packages/nuxt/components/CnImageGallery.vue').replace(/\r\n/g, '\n')
const template = component.slice(component.indexOf('<template>'))
const docPath = 'docs/02-components/molecules/image-gallery.md'
const doc = read(docPath)
const data = readFrontmatter(doc).data as Record<string, unknown>

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: CnImageGallery is named Cn*, hand-rolls no primitive, and uses no domain term', () => {
  assert.ok(
    listFiles(root, 'packages/nuxt/components', /\.vue$/).includes('packages/nuxt/components/CnImageGallery.vue'),
  )
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-020 AC1, AC2: the doc is a custom molecule that says why it is custom, and it is stable', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'molecule')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnImageGallery')
  assert.equal(data.status, 'stable')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.deepEqual(data.tbd, [])
  assert.match(doc, /\*\*Why custom:\*\* the component starts from Nuxt UI's `UCarousel`/)
  assert.match(doc, /ADR-0066/)
})

test('ADR-0066: the choice is recorded, names what was checked, and is in the decision log', () => {
  const adr = read('docs/06-governance/decisions/0066-image-gallery-custom.md')
  assert.match(adr, /# ADR-0066: The image gallery is a custom component over UCarousel/)
  assert.match(adr, /`UCarousel`/)
  assert.match(adr, /ADR-0056/)
  assert.match(adr, /ADR-0057/)
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0066-image-gallery-custom\.md\)/)
})

test('SPEC 1.55: the spec lists the doc and the component, and the change is logged', () => {
  const spec = read('SPEC.md')
  assert.match(spec, /pagination\.md key-value-list\.md image-gallery\.md/)
  assert.match(
    spec,
    /\| image-gallery \| molecule \| custom \| CnImageGallery over UCarousel \(DSR-03, ADR-0066\) \| T15\.3 \|/,
  )
  assert.match(spec, /\| 1\.55 \| 2026-11-01 \|/)
})

test('the Nuxt UI check holds: UCarousel gives no fallback for a failed picture and names its dots from the locale', () => {
  // ADR-0066 rests on this. If a Nuxt UI release handles a failed picture and names the dots through props, this test
  // fails and the decision is reviewed (C-01).
  const store = join(root, 'node_modules/.pnpm')
  const installed = readdirSync(store).filter((name) => name.startsWith('@nuxt+ui@'))
  assert.ok(installed.length > 0, '@nuxt/ui is installed')
  for (const name of installed) {
    const text = readFileSync(join(store, name, 'node_modules/@nuxt/ui/dist/runtime/components/Carousel.vue'), 'utf8')
    assert.match(text, /t\('carousel\.goto'/, name)
    assert.doesNotMatch(text, /@error|onerror|<img/, name)
    assert.match(text, /role="region"/, name)
    assert.match(text, /aria-roledescription="carousel"/, name)
  }
})

test('REQ-020: the component composes UCarousel and draws its own controls, with no primitive of its own', () => {
  assert.match(template, /<UCarousel\b/)
  assert.match(template, /<UButton\b/)
  assert.doesNotMatch(template, /role="(dialog|listbox|menu|tooltip|combobox)"/)
  // The 4:3 frame holds one image, scaled to fit, and the fallback is the brand d20 (ADR-0056, ADR-0057).
  assert.match(component, /assets\/brand\/D20-CN\.svg/)
  assert.match(template, /class="cn-image-gallery__frame"/)
  assert.match(template, /@error="showFallback\(/)
  assert.match(template, /:aria-hidden="!item\.src \|\| item\.decorative \? 'true' : undefined"/)
})

test('REQ-022 AC2, A-11: the component holds no text of its own, and its labels arrive through props', () => {
  assert.match(component, /label: string/)
  assert.match(component, /labels: \{/)
  for (const key of [
    'previous: string',
    'next: string',
    'dots: string',
    'dot: (position: number, total: number) => string',
  ])
    assert.ok(component.includes(key), key)
  assert.match(component, /position: \(position: number, total: number\) => string/)
  assert.match(template, /:aria-label="label"/)
  assert.match(template, /:aria-label="labels\.previous"/)
  assert.match(template, /:aria-label="labels\.next"/)
  assert.match(template, /:aria-label="labels\.dot\(index \+ 1, items\.length\)"/)
  assert.match(template, /:aria-label="labels\.dots"/)
  // No text node outside an expression.
  assert.doesNotMatch(template.replace(/="[^"]*"/g, '=""'), />\s*[A-Za-zÁ-ú][^<{]*</)
  // The names of the controls are never literal.
  assert.doesNotMatch(template, /(?<!:)aria-label="[^"]/)
})

test('REQ-025 AC2: a picture needs alt or decorative, a picture without src needs neither, and positions stay in range', () => {
  assert.equal(pictureProblem([]), undefined)
  assert.equal(pictureProblem([{ src: '/a.jpg', alt: 'Una caja' }]), undefined)
  assert.equal(pictureProblem([{ src: '/a.jpg', decorative: true }]), undefined)
  assert.equal(pictureProblem([{}]), undefined)
  assert.match(pictureProblem([{ src: '/a.jpg', alt: 'Una caja' }, { src: '/b.jpg' }])!, /Picture 2 needs `alt`/)
  assert.ok(pictureProblem([{ src: '/a.jpg', alt: '   ' }]))
  assert.equal(clampPosition(-3, 4), 0)
  assert.equal(clampPosition(2, 4), 2)
  assert.equal(clampPosition(9, 4), 3)
  assert.equal(clampPosition(5, 0), 0)
  assert.match(component, /pictureProblem\(props\.items\)/)
  assert.match(component, /process\.env\.NODE_ENV !== 'production'/)
})

test('ADR-0066: the tokens reference semantic tokens, are stable, and open no TBD item', () => {
  assert.deepEqual(problems, [])
  for (const [path, value, type] of [
    ['radius.imageGallery', '{radius.container}', 'dimension'],
    ['border.width.imageGallery', '{border.width.interactive}', 'dimension'],
    ['imageGallery.bg', '{color.surface.card}', 'color'],
    ['imageGallery.highlight', '{color.brand.primary}', 'color'],
    ['imageGallery.dot.border', '{color.border.default}', 'color'],
    ['imageGallery.dot.borderHover', '{color.brand.primary}', 'color'],
    ['imageGallery.dot.current', '{color.brand.primary}', 'color'],
    ['imageGallery.focus.color', '{focus.ring.color}', 'color'],
    ['imageGallery.focus.width', '{focus.ring.width}', 'dimension'],
    ['imageGallery.focus.offset', '{focus.ring.offset}', 'dimension'],
    ['imageGallery.focus.style', '{focus.ring.style}', 'strokeStyle'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, value, path)
    assert.equal(token?.type, type, path)
    assert.equal(token?.cn?.status, 'stable', path)
  }
})

test('REQ-016: the rules read only tokens that exist, use the spacing scale, and draw no glow, animation, or raw value', () => {
  assert.ok(ownCss.includes('.cn-carousel {'), 'the T15.3 rules are found')
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'radius.imageGallery',
    'border.width.imageGallery',
    'imageGallery.bg',
    'imageGallery.highlight',
    'imageGallery.dot.border',
    'imageGallery.dot.borderHover',
    'imageGallery.dot.current',
    'imageGallery.focus.color',
    'imageGallery.focus.width',
    'imageGallery.focus.offset',
    'imageGallery.focus.style',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(ownCss, /\d+(px|rem|em|ms)\b|#[0-9a-f]{3,8}\b/i)
  assert.doesNotMatch(ownCss, /effect-glow|animation|transition|@keyframes/)
  // The frame has no glow, the picture frame is 4:3 and never crops, and a dot is one `space.lg` step (ADR-0049, ADR-0056).
  assert.match(ownCss, /\.cn-carousel \{[^}]*box-shadow: none;/)
  assert.match(ownCss, /\.cn-image-gallery__frame \{[^}]*aspect-ratio: 4 \/ 3;/)
  assert.match(ownCss, /\.cn-image-gallery__image \{[^}]*object-fit: contain;/)
  const dot = ownCss.slice(ownCss.indexOf('.cn-image-gallery__dot {')).split('\n}')[0]!
  assert.match(dot, /width: var\(--cn-space-lg\)/)
  assert.match(dot, /height: var\(--cn-space-lg\)/)
  // The focus ring is an outline from the focus tokens, on `:focus-visible` (REQ-024).
  assert.match(ownCss, /\.cn-carousel:focus-visible/)
  assert.match(ownCss, /\.cn-image-gallery__dot:focus-visible/)
  assert.doesNotMatch(ownCss, /:focus[^-]/)
})

test('ADR-0066: the theme puts the hooks on UCarousel and removes its gutter', () => {
  const config = read('packages/nuxt/app.config.ts')
  const block = config.slice(config.indexOf('carousel: {'), config.indexOf('// T8.3'))
  assert.match(block, /root: 'cn-carousel'/)
  assert.match(block, /viewport: 'cn-carousel__viewport'/)
  assert.match(block, /item: 'cn-carousel__item'/)
  assert.match(block, /horizontal: \{ container: 'ms-0', item: 'ps-0' \}/)
})

test('REQ-015: the pairs are declared and pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const foreground of [
    'imageGallery.highlight',
    'imageGallery.dot.border',
    'imageGallery.dot.borderHover',
    'imageGallery.dot.current',
    'imageGallery.focus.color',
  ]) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'imageGallery.bg')
    assert.equal(pair?.result, 'pass', foreground)
    assert.equal(pair?.usage, 'ui', foreground)
  }
})

test('REQ-026 AC1, AC2: the doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = ['default', 'hover', 'focus-visible', 'selected', 'disabled', 'error', 'empty']
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  assert.deepEqual(
    [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]),
    expected,
  )
  const demo = read('apps/showcase/demos/image-gallery/states.vue')
  const shown = demo
    .match(/const states = \[([^\]]*)\]/)?.[1]
    ?.match(/'[a-z-]+'/g)
    ?.map((s) => s.slice(1, -1))
  assert.deepEqual(shown, expected)
  assert.match(doc, /no `active` \(pressed\) state of its own/)
})

test('REQ-007, A-11: the demos use es-MX example copy with no forbidden domain word', () => {
  const terms = read('scripts/domain-terms.txt').split(/\s+/).filter(Boolean)
  for (const file of ['states.vue', 'playground.vue', 'controls.ts']) {
    const text = read(`apps/showcase/demos/image-gallery/${file}`)
      .toLowerCase()
      .replaceAll(/\bvariant="[^"]*"/g, '')
    for (const term of terms)
      assert.doesNotMatch(text.replace(/\/\/.*$/gm, ''), new RegExp(`\\b${term}\\b`), `${file}: ${term}`)
  }
})

test('the playground controls match the demo props, and DESIGN.md and the inventory list the doc', async () => {
  const valid = assertControls((await import('../apps/showcase/demos/image-gallery/controls')).default, 'controls.ts')
  const playground = read('apps/showcase/demos/image-gallery/playground.vue')
  for (const control of valid) assert.match(playground, new RegExp(`\\b${control.name}\\??:`), control.name)
  assert.match(read('DESIGN.md'), /\(docs\/02-components\/molecules\/image-gallery\.md\)/)
  assert.match(
    read('docs/02-components/inventory.md'),
    /\| \[Image gallery\]\(molecules\/image-gallery\.md\) \| molecule \| custom \| `CnImageGallery` \| stable \| — \|/,
  )
})

test('a minor changeset for the layer exists (§4.8)', () => {
  // Once the "Version packages" pull request has consumed the changeset, its text lives in the changelog.
  if (!existsSync(join(root, '.changeset/image-gallery.md'))) {
    assert.match(read('CHANGELOG.md'), /CnImageGallery/)
    return
  }
  const changeset = read('.changeset/image-gallery.md')
  for (const name of ['tokens', 'nuxt', 'email'])
    assert.match(changeset, new RegExp(`'@vinsmokemau/cup-noobles-${name}': minor`))
  assert.match(changeset, /CnImageGallery/)
})
