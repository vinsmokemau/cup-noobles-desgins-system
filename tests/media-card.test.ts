// T8.2 checks: CnMediaCard, its tokens, theme rules, demos, and doc (REQ-025 AC2 to AC4, REQ-021, REQ-022, REQ-020, REQ-026,
// ADR-0026). What
// needs a browser, such as the tab stop, the focus ring, hover, the overflow, and axe, is in
// apps/showcase/tests/e2e/media-card.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast } from '../scripts/check-contrast'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'
import { thumbnailProblem } from '../packages/nuxt/utils/media-card'
import { findDomainTerms, findForbiddenPrimitives, findMisnamedComponents, listFiles } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const css = read('packages/nuxt/assets/css/main.css')
// The rules of T8.2 without the comment above them, which names the surface token on purpose.
// From the T8.2 comment to the T8.5 comment, which is the next block in the file.
const ownCss = css.slice(css.indexOf('T8.2 (REQ-020'), css.indexOf('T8.5 (REQ-020')).replace(/^[\s\S]*?\*\//, '')
const component = read('packages/nuxt/components/CnMediaCard.vue')
const template = component.slice(component.indexOf('<template>'))
const doc = read('docs/02-components/molecules/media-card.md')
const data = readFrontmatter(doc).data as Record<string, unknown>

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: CnMediaCard is named Cn*, hand-rolls no primitive, and uses no domain term', () => {
  assert.ok(listFiles(root, 'packages/nuxt/components', /\.vue$/).includes('packages/nuxt/components/CnMediaCard.vue'))
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-020 AC1, AC2: the doc is a custom molecule that says why it is custom, and it is a draft', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'molecule')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnMediaCard')
  assert.equal(data.status, 'draft')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.deepEqual(data.tbd, ['TBD-06', 'TBD-10', 'TBD-20'])
  assert.match(doc, /\*\*Why custom:\*\* Nuxt UI has no equivalent\./)
})

test('REQ-025 AC2: the thumbnail takes src and a title, tags, and an optional link, and needs alt or decorative', () => {
  // The type is a union: a `src` brings `alt`, or `decorative: true`, and no `src` needs neither.
  assert.match(component, /\{ src: string; alt: string; decorative\?: false \}/)
  assert.match(component, /\{ src: string; decorative: true; alt\?: string \}/)
  assert.match(component, /title: string/)
  assert.match(component, /tags\?: string\[\]/)
  assert.match(component, /to\?: string/)
  // A named thumbnail is an image with `alt`; a decorative one has an empty alt and is hidden.
  assert.match(template, /:alt="decorative \? '' : alt"/)
  assert.match(template, /:aria-hidden="decorative \? 'true' : undefined"/)
  // The tags are tag badges (ADR-0011).
  assert.match(template, /<UBadge[^>]*color="secondary"[^>]*variant="solid"/)
})

test('REQ-025 AC2: a card with a thumbnail and neither alt nor decorative fails the development warning test', () => {
  const warning = thumbnailProblem({ hasThumbnail: true })
  assert.match(warning!, /Pass `alt` for the thumbnail, or set `decorative`/)
  // Whitespace is no text alternative either.
  assert.ok(thumbnailProblem({ hasThumbnail: true, alt: '   ' }))
  assert.ok(thumbnailProblem({ hasThumbnail: true, decorative: false, alt: '' }))
  // Each of the two ways to label it is fine, and so is a card with no thumbnail.
  assert.equal(thumbnailProblem({ hasThumbnail: true, alt: 'Un dado dorado' }), undefined)
  assert.equal(thumbnailProblem({ hasThumbnail: true, decorative: true }), undefined)
  assert.equal(thumbnailProblem({ hasThumbnail: false }), undefined)
  // The component runs it in development, for `src` and for the thumbnail slot, and warns with the message.
  assert.match(component, /import \{ thumbnailProblem \} from '\.\.\/utils\/media-card'/)
  assert.match(component, /process\.env\.NODE_ENV !== 'production'/)
  assert.match(component, /hasThumbnail: Boolean\(props\.src\) \|\| Boolean\(slots\.thumbnail\)/)
  assert.match(component, /if \(problem\) console\.warn\(problem\)/)
})
test('REQ-025 AC4: the card has one link, and it is the title, so the name is the title and nothing else takes focus', () => {
  // The only focusable element in the template is the ULink, and it exists only when the card has a target.
  assert.equal([...template.matchAll(/<ULink\b/g)].length, 1)
  assert.match(template, /<ULink v-if="to" :to="to" raw class="cn-media-card__link">\{\{ title \}\}<\/ULink>/)
  assert.doesNotMatch(template, /<(a|button|input|select|textarea)\b|tabindex|role=/)
  // Its hit area covers the card, so a click anywhere follows it, and the link draws no ring of its own: the card does.
  assert.match(ownCss, /\.cn-media-card__link::after \{[^}]*position: absolute;[^}]*inset: 0;/)
  assert.match(ownCss, /\.cn-media-card__link:focus-visible \{\s*outline: none;/)
  assert.match(ownCss, /:has\(\.cn-media-card__link:focus-visible\)/)
})

test('ADR-0026: the media card tokens reference semantic tokens, and the placeholders are tbd', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.mediaCard', 'radius.interactive'],
    ['border.width.mediaCard', 'border.width.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, path.startsWith('border.width') ? 'stable' : 'tbd', path)
  }
  for (const [path, value, status] of [
    ['mediaCard.bg', '{color.bg.base}', 'stable'],
    ['mediaCard.highlight', '{color.brand.primary}', 'stable'],
    ['mediaCard.divider', '{color.brand.primary}', 'stable'],
    ['mediaCard.fg', '{color.text.default}', 'stable'],
    ['mediaCard.focus.color', '{focus.ring.color}', 'stable'],
    ['mediaCard.focus.width', '{focus.ring.width}', 'stable'],
    ['mediaCard.focus.offset', '{focus.ring.offset}', 'stable'],
    ['mediaCard.focus.style', '{focus.ring.style}', 'stable'],
  ] as const) {
    assert.equal(byPath.get(path)?.tier, 'component', path)
    assert.equal(byPath.get(path)?.value, value, path)
    assert.equal(byPath.get(path)?.cn?.status, status, path)
  }
})

test('REQ-025 AC3, C-05: the rules read only tokens that exist, never the card surface token, and draw no glow', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'mediaCard.bg',
    'mediaCard.highlight',
    'mediaCard.divider',
    'mediaCard.fg',
    'mediaCard.focus.color',
    'mediaCard.focus.width',
    'mediaCard.focus.offset',
    'mediaCard.focus.style',
    'radius.mediaCard',
    'border.width.mediaCard',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(ownCss, /surface/, 'the card renders on color.bg.base, not color.surface.card')
  assert.match(ownCss.slice(ownCss.indexOf('.cn-media-card {')).split('}')[0]!, /box-shadow: none/)
  assert.doesNotMatch(ownCss, /effect-glow/)
  // The thumbnail keeps its own proportions (TBD-20): no aspect ratio or fixed height is declared.
  assert.doesNotMatch(ownCss, /aspect-ratio|object-fit/)
  // The card does not animate, so reduced motion has nothing to switch off.
  assert.doesNotMatch(ownCss, /animation|transition|@keyframes/)
})

test('REQ-015: the media card pairs are declared, and the outline, the divider, and the focus ring pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, ratio, result] of [
    ['mediaCard.fg', 19.26, 'pass'],
    ['mediaCard.highlight', 8.37, 'pass'],
    ['mediaCard.divider', 8.37, 'pass'],
    ['mediaCard.focus.color', 18.55, 'pass'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'mediaCard.bg')
    assert.equal(pair?.result, result, foreground)
    assert.equal(pair?.ratio, ratio, foreground)
  }
})

test('REQ-026 AC1, AC2: the doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = ['default', 'hover', 'focus-visible', 'active']
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  assert.deepEqual(
    [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]),
    expected,
  )
  const demo = read('apps/showcase/demos/media-card/states.vue')
  const shown = demo
    .match(/const states = \[([^\]]*)\]/)?.[1]
    ?.match(/'[a-z-]+'/g)
    ?.map((s) => s.slice(1, -1))
  assert.deepEqual(shown, expected)
})

test('REQ-025 AC3: the doc marks color.surface.card as TBD-06 and the thumbnail ratio as TBD-20', () => {
  assert.match(doc, /> \*\*TBD \(TBD-06\):\*\*[^\n]*C-05/)
  assert.match(doc, /> \*\*TBD \(TBD-20\):\*\*/)
  assert.match(doc, /\| `color\.surface\.card` \| `--cn-color-surface-card` \| `#[0-9a-f]{6}` \| tbd \(TBD-06\) \|/)
})

test('ADR-0026 is recorded in the decision log, and the playground controls match the demo props', async () => {
  assert.ok(existsSync(join(root, 'docs/06-governance/decisions/0026-media-card-look.md')))
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0026-media-card-look\.md\)/)
  const valid = assertControls((await import('../apps/showcase/demos/media-card/controls')).default, 'controls.ts')
  const playground = read('apps/showcase/demos/media-card/playground.vue')
  for (const control of valid) assert.match(playground, new RegExp(`\\b${control.name}\\??:`), control.name)
})
