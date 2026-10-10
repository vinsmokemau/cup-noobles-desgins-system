// T7.8 checks: CnSparkle and CnStickerFrame, their tokens, theme rules, demos, and docs (REQ-029, REQ-021, REQ-022, REQ-020,
// REQ-016). What needs a browser, such as computed styles, the accessibility tree, reduced motion, and axe, is in
// apps/showcase/tests/e2e/motifs.spec.ts and motifs.reduced.ts.
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
const ownCss = css.slice(css.indexOf('T7.8 (REQ-029)') - 3, css.indexOf('T7.9 (REQ-030 AC3') - 3)
const SLUGS = ['sparkle', 'sticker-frame'] as const
const COMPONENT = { sparkle: 'CnSparkle', 'sticker-frame': 'CnStickerFrame' } as const
const STATES = { sparkle: ['default', 'animated'], 'sticker-frame': ['default'] } as const
const docOf = (slug: string) => read(`docs/02-components/atoms/${slug}.md`)
const frontmatter = (slug: string) => readFrontmatter(docOf(slug)).data as Record<string, unknown>

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: both are named Cn*, hand-roll no primitive, and use no domain term', () => {
  const files = listFiles(root, 'packages/nuxt/components', /\.vue$/)
  for (const name of Object.values(COMPONENT)) assert.ok(files.includes(`packages/nuxt/components/${name}.vue`), name)
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-029 AC1: both components are aria-hidden, take no label, and hold no focusable element', () => {
  const sparkle = read('packages/nuxt/components/CnSparkle.vue')
  const frame = read('packages/nuxt/components/CnStickerFrame.vue')
  for (const source of [sparkle, frame]) {
    assert.match(source, /aria-hidden="true"/)
    assert.doesNotMatch(source, /\b(tabindex|role|aria-label|aria-labelledby|<button|<a\b|<input|<select|<textarea)\b/i)
  }
  // The frame draws no artwork of its own while the sticker border is missing (TBD-18).
  assert.doesNotMatch(frame, /<img|<svg|<path|v-html|UIcon|i-ph-/)
  // The frame wraps arbitrary content, so `inert` is what makes "no focusable children" true whatever the slot holds.
  assert.match(frame, /<div class="cn-sticker-frame" aria-hidden="true" inert>\s*<slot \/>/)
  assert.doesNotMatch(frame, /defineProps/)
  // The sparkle takes one prop, `animated`, and no slot.
  assert.match(sparkle, /defineProps<\{ animated\?: boolean \}>\(\)/)
  assert.doesNotMatch(sparkle, /<slot/)
})

// The file the owner chose (ADR-0017). CnSparkle renders it unmodified, so its bytes are locked here.
const SPARKLE = ['Sparkle-CN.svg', 'd82b48bf3249f1d8f033ca83e155ea424c421541bf9c303495e8fcbeffdc9c80'] as const

test('ADR-0017: the sparkle renders the supplied file unmodified, and the file is safe to serve', () => {
  const [file, hash] = SPARKLE
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    `${file} was modified`,
  )

  const sparkle = read('packages/nuxt/components/CnSparkle.vue')
  assert.match(sparkle, new RegExp(`new URL\\('\\.\\./assets/brand/${file}', import\\.meta\\.url\\)\\.href`))
  // Shown as an image, never inlined, and the component draws nothing of its own.
  assert.match(sparkle, /<img\s/)
  assert.doesNotMatch(sparkle, /<svg|<path|v-html|UIcon|i-ph-/)

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the sparkle has a viewBox')
  assert.doesNotMatch(svg, /<script|href=|<image|foreignObject|onload|data:image/, `${file} is safe to serve`)
  // The artwork carries the brand yellow exactly, not the colour it was generated with (ADR-0017).
  assert.match(svg, /fill="#fff488"/)
})

test('the sparkle placeholder is gone: no text, token, or rule remains from T7.8', () => {
  const sparkle = read('packages/nuxt/components/CnSparkle.vue')
  assert.doesNotMatch(sparkle, /Motif pending|PLACEHOLDER/)
  assert.doesNotMatch(ownCss, /motif-placeholder-fg|cn-font-size-caption/)
  assert.equal(byPath.has('motif.placeholder.fg'), false, 'motif.placeholder.fg was removed')
})

test('REQ-029 AC2: the fade is declared once, only for an animated sparkle, and is off under reduced motion', () => {
  assert.match(ownCss, /\.cn-sparkle\[data-animated='true'\]\s*\{\s*animation: cn-sparkle-fade/)
  assert.equal([...ownCss.matchAll(/animation:/g)].length, 2, 'the fade and its reset are the only animation rules')
  const reduced = ownCss.slice(ownCss.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /\.cn-sparkle\[data-animated='true'\]\s*\{\s*animation: none;/)
  // The frame does not animate or transition.
  const frame = ownCss.slice(ownCss.indexOf('.cn-sticker-frame {'), ownCss.indexOf('@media'))
  assert.doesNotMatch(frame, /animation|transition/)
})

test('the component tokens reference semantic tokens, and every placeholder is marked tbd', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic, tbd] of [
    ['border.width.motif', 'border.width.interactive', ['TBD-11', 'TBD-18']],
    ['radius.motif', 'radius.interactive', ['TBD-10', 'TBD-18']],
    ['motif.placeholder.border', 'color.border.default', ['TBD-05', 'TBD-18']],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(token?.cn?.status, 'tbd', path)
    assert.deepEqual(token?.cn?.tbd, tbd, path)
  }
  // The black surface follows a brand value, so it is stable.
  assert.equal(byPath.get('motif.placeholder.bg')?.value, '{color.bg.base}')
  assert.equal(byPath.get('motif.placeholder.bg')?.cn?.status, 'stable')
})

test('the rules read only tokens that exist, and each motif token is read', () => {
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of ['motif.placeholder.bg', 'motif.placeholder.border', 'border.width.motif', 'radius.motif'])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  // The sparkle takes its height from the text beside it, so it adds no size of its own (ADR-0017).
  assert.match(ownCss, /height: var\(--sparkle-size, 1em\)/)
  // The frame fits its content and never overflows its container (REQ-028 AC1).
  const frame = ownCss.slice(ownCss.indexOf('.cn-sticker-frame {'), ownCss.indexOf('@media'))
  assert.match(frame, /max-width: 100%/)
  assert.match(frame, /overflow: hidden/)
  assert.match(frame, /overflow-wrap: anywhere/)
})

test('REQ-015: the sticker frame outline pair is declared and reported as unverified', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  const pair = report.pairs.find(
    (p) => p.foreground === 'motif.placeholder.border' && p.background === 'motif.placeholder.bg',
  )
  assert.equal(pair?.usage, 'ui')
  assert.equal(pair?.result, 'unverified')
  assert.equal(pair?.ratio, 7.98)
  // The sparkle is brand artwork, so no contrast pair is declared for it (REQ-015 does not apply to decoration).
  assert.equal(
    report.pairs.some((p) => p.foreground.startsWith('sparkle') || p.background.startsWith('sparkle')),
    false,
  )
})

test('REQ-020 AC1, AC2, REQ-009: both docs are draft custom components with a "Why custom" paragraph', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'atom', slug)
    assert.equal(data.source, 'custom', slug)
    assert.equal(data.component, COMPONENT[slug], slug)
    // Both stay drafts (REQ-009): the sparkle's fade duration follows a placeholder (TBD-14), and the
    // sticker border artwork is still missing (TBD-18).
    assert.equal(data.status, 'draft', slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.match(docOf(slug), /\*\*Why custom:\*\*[^\n]*Nuxt UI has no equivalent/, slug)
    assert.doesNotMatch(docOf(slug), /Content pending/, slug)
  }
  // The sparkle has its artwork now (ADR-0017), so TBD-18 is gone from it; the sticker frame still waits on it.
  assert.deepEqual(frontmatter('sparkle').tbd, ['TBD-14'])
  assert.doesNotMatch(docOf('sparkle'), /> \*\*TBD \(TBD-18\):\*\*/)
  assert.match(docOf('sparkle'), /ADR-0017/)
  assert.ok((frontmatter('sticker-frame').tbd as string[]).includes('TBD-18'))
  assert.match(docOf('sticker-frame'), /> \*\*TBD \(TBD-18\):\*\*/)
  assert.deepEqual(frontmatter('sticker-frame').tokens, ['motif'])
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

test('REQ-055: the playground controls are a valid schema that each playground demo declares as props', async () => {
  const controls = {
    sparkle: (await import('../apps/showcase/demos/sparkle/controls')).default,
    'sticker-frame': (await import('../apps/showcase/demos/sticker-frame/controls')).default,
  }
  for (const [slug, schema] of Object.entries(controls)) {
    const valid = assertControls(schema, `${slug}/controls.ts`)
    const playground = read(`apps/showcase/demos/${slug}/playground.vue`)
    for (const control of valid)
      assert.match(playground, new RegExp(`\\b${control.name}\\??:`), `${slug}: ${control.name}`)
  }
})

test('the docs point to each other, and the foundation docs name the supplied sparkle file', () => {
  assert.match(docOf('sparkle'), /sticker-frame/)
  assert.match(docOf('sticker-frame'), /sparkle/)
  for (const path of ['docs/01-foundations/imagery-and-motifs.md', 'docs/00-overview/brand-identity.md']) {
    const doc = read(path)
    assert.match(doc, /Sparkle-CN\.svg/, path)
    assert.match(doc, /ADR-0017/, path)
    // TBD-18 stays open for the other six motifs, so both docs keep their callout and stay drafts.
    assert.match(doc, /> \*\*TBD \(TBD-18\):\*\*/, path)
    assert.ok((readFrontmatter(doc).data as Record<string, unknown>).tbd, path)
  }
  assert.doesNotMatch(read('docs/01-foundations/imagery-and-motifs.md'), /Motif pending \(TBD-18\)/)
})
