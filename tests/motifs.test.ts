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
  // The frame draws no artwork of its own: the supplied file is shown as an image (ADR-0024, ADR-0025).
  assert.doesNotMatch(frame, /<svg|<path|v-html|UIcon|i-ph-/)
  assert.match(frame, /<img\s[^>]*alt=""[^>]*aria-hidden="true"/)
  // The frame wraps arbitrary content, so `inert` is what makes "no focusable children" true whatever the slot holds.
  assert.match(frame, /<div class="cn-sticker-frame" aria-hidden="true" inert>/)
  assert.match(frame, /<div class="cn-sticker-frame__content">\s*<slot \/>/)
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

// The ramen cup the owner chose (ADR-0019). No component renders it yet, so only the file itself is locked here.
const RAMEN_CUP = ['Ramen-Cup-CN.svg', '35c7bab3786c67a0e8867c0bb497c4d033329065a4f221bc09a1a608bc605bb2'] as const

test('ADR-0019: the ramen cup file is the owner file, transparent, safe to serve, and drawn in brand colours only', () => {
  const [file, hash] = RAMEN_CUP
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    `${file} was modified`,
  )

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the ramen cup has a viewBox')
  assert.doesNotMatch(svg, /<svg [^>]*\s(width|height)=/, 'the size comes from the page, not the file')
  assert.doesNotMatch(
    svg,
    /<script|href=|<image|<text|<filter|foreignObject|onload|data:image/,
    `${file} is safe to serve`,
  )
  // No editor metadata, and no background shape: every drawn element is a path, polygon, or circle.
  assert.doesNotMatch(svg, /<metadata|xpacket|\sid="Capa_/, `${file} carries no editor data`)
  assert.doesNotMatch(svg, /<(rect|use|g)\b/, `${file} has no background rectangle`)
  // Pink, yellow, and black only, exactly the brand values and not the colours it was generated with (ADR-0019).
  const colours = [...new Set([...svg.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))].sort()
  assert.deepEqual(colours, ['#000000', '#ef80ae', '#fff488'])
})

// The golden d20 the owner chose (ADR-0021). No component renders it yet, so only the file itself is locked here.
const D20 = ['D20-CN.svg', 'd68f31f0ec8e8242d1c353ef00eb7152fa85d5ea3b662436b5256ea70f3bd85b'] as const

test('ADR-0021: the d20 file is the owner file, transparent, safe to serve, and drawn in yellow and black only', () => {
  const [file, hash] = D20
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    `${file} was modified`,
  )

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the d20 has a viewBox')
  assert.doesNotMatch(svg, /<svg [^>]*\s(width|height)=/, 'the size comes from the page, not the file')
  assert.doesNotMatch(
    svg,
    /<script|href=|<image|<text|<filter|foreignObject|onload|data:image/,
    `${file} is safe to serve`,
  )
  // No editor metadata, no style block, and no background shape: every drawn element is a path or polygon.
  assert.doesNotMatch(svg, /<\?xml|<metadata|xpacket|<style|<defs|\sid="|\sclass="/, `${file} carries no editor data`)
  assert.doesNotMatch(svg, /<(rect|use|g)\b/, `${file} has no background rectangle`)
  // Yellow and black only, exactly the brand values. No white, so the four shine marks are gone (ADR-0021).
  const colours = [...new Set([...svg.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))].sort()
  assert.deepEqual(colours, ['#000000', '#fff488'])
})

// The chopsticks the owner chose (ADR-0020). No component renders it yet, so only the file itself is locked here.
const CHOPSTICKS = ['Chopsticks-CN.svg', 'b0953bcc1a4e7431e4108626f3df92e658480033a1b66a8f0e1675018b2467a1'] as const

test('ADR-0020: the chopsticks file is the owner file, transparent, safe to serve, and drawn in brand colours only', () => {
  const [file, hash] = CHOPSTICKS
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    `${file} was modified`,
  )

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the chopsticks have a viewBox')
  assert.doesNotMatch(svg, /<svg [^>]*\s(width|height)=/, 'the size comes from the page, not the file')
  assert.doesNotMatch(
    svg,
    /<script|href=|<image|<text|<filter|foreignObject|onload|data:image/,
    `${file} is safe to serve`,
  )
  // No editor metadata and no background shape: every drawn element is a path.
  assert.doesNotMatch(svg, /<metadata|xpacket|\sid="Capa_/, `${file} carries no editor data`)
  assert.doesNotMatch(svg, /<(rect|use|g)\b/, `${file} has no background rectangle`)
  // Pink, yellow, and black are the brand values. White is allowed only for the shine marks (ADR-0020).
  const colours = [...new Set([...svg.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))].sort()
  assert.deepEqual(colours, ['#000000', '#ef80ae', '#fff488', '#ffffff'])
})

// The noodle curves and waves the owner chose (ADR-0022). No component renders it yet, so only the file itself is locked here.
const NOODLE_WAVE = ['Noodle-Wave-CN.svg', '49504853feee891ff6b686297a789ebcd797c23c716e9655631949705fab328e'] as const

test('ADR-0022: the noodle wave file is the owner file, transparent, safe to serve, and drawn in brand colours only', () => {
  const [file, hash] = NOODLE_WAVE
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    `${file} was modified`,
  )

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the noodle waves have a viewBox')
  assert.doesNotMatch(svg, /<svg [^>]*\s(width|height)=/, 'the size comes from the page, not the file')
  assert.doesNotMatch(
    svg,
    /<script|href=|<image|<text|<filter|foreignObject|onload|data:image/,
    `${file} is safe to serve`,
  )
  // No editor metadata, no style block, and no background shape: every drawn element is a path.
  assert.doesNotMatch(svg, /<metadata|xpacket|<style|<\?xml|\sid="Capa_|class="cls-/, `${file} carries no editor data`)
  assert.doesNotMatch(svg, /<(rect|use|g)\b/, `${file} has no background rectangle`)
  // Pink, yellow, and black are the brand values. White is allowed only for the shine marks (ADR-0022).
  const colours = [...new Set([...svg.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))].sort()
  assert.deepEqual(colours, ['#000000', '#ef80ae', '#fff488', '#ffffff'])
})

// The arcade shapes and dynamic lines the owner chose (ADR-0023). No component renders it yet, so only the file itself is locked here.
const ARCADE_LINES = [
  'Arcade-Lines-CN.svg',
  'b5acc2e515b13647787db4dc87c6b8cdcf7a4a470130f9c67a50484d12989683',
] as const

test('ADR-0023: the arcade lines file is the owner file, transparent, safe to serve, and drawn in brand colours only', () => {
  const [file, hash] = ARCADE_LINES
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    ` was modified`,
  )

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the arcade lines have a viewBox')
  assert.doesNotMatch(svg, /<svg [^>]*\s(width|height)=/, 'the size comes from the page, not the file')
  assert.doesNotMatch(svg, /<script|href=|<image|<text|<filter|foreignObject|onload|data:image/, ` is safe to serve`)
  // No editor metadata, no style block, and no background shape: every drawn element is a path.
  assert.doesNotMatch(svg, /<metadata|xpacket|<style|<defs|<\?xml|\sid="Capa_|class="cls-/, ` carries no editor data`)
  assert.doesNotMatch(svg, /<(rect|use|g)\b/, ` has no background rectangle`)
  // Pink, yellow, and black are the brand values. White is allowed only for the shine marks (ADR-0023).
  const colours = [...new Set([...svg.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))].sort()
  assert.deepEqual(colours, ['#000000', '#ef80ae', '#fff488', '#ffffff'])
})

// The sticker border the owner chose (ADR-0024). `CnStickerFrame` renders it unmodified (T7.17, ADR-0025), so its bytes are locked here.
const STICKER_BORDER = [
  'Sticker-Border-CN.svg',
  '1425523e51729b84a7b9bcff8a91c4bacf018fd7fe215e50df2f113861ef2c54',
] as const

test('ADR-0024: the sticker border file is the cleaned owner file, transparent with an empty centre, safe to serve, and drawn in brand colours only', () => {
  const [file, hash] = STICKER_BORDER
  const path = `packages/nuxt/assets/brand/${file}`
  assert.ok(existsSync(join(root, path)), path)
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
    hash,
    `${file} was modified`,
  )

  const svg = read(path)
  assert.match(svg, /<svg [^>]*viewBox="[^"]+"/, 'the sticker border has a viewBox')
  assert.doesNotMatch(svg, /<svg [^>]*\s(width|height)=/, 'the size comes from the page, not the file')
  assert.doesNotMatch(
    svg,
    /<script|href=|<image|<text|<filter|foreignObject|onload|data:image/,
    `${file} is safe to serve`,
  )
  // No editor metadata, no style block, and no background shape: every drawn element is a path.
  assert.doesNotMatch(svg, /<metadata|xpacket|<style|<defs|<\?xml|\sid="|class="cls-/, `${file} carries no editor data`)
  assert.doesNotMatch(svg, /<(rect|circle|polygon|use|g)\b/, `${file} has no background rectangle or stray shape`)
  // Pink, yellow, and black are the brand values. White is allowed only for the shine marks (ADR-0024).
  const colours = [...new Set([...svg.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))].sort()
  assert.deepEqual(colours, ['#000000', '#ef80ae', '#fff488', '#ffffff'])

  // The frame renders exactly this file, as an image, and its box has the ratio of the file's viewBox (ADR-0025).
  const frame = read('packages/nuxt/components/CnStickerFrame.vue')
  assert.match(frame, new RegExp(`new URL\\('\\.\\./assets/brand/${file}', import\\.meta\\.url\\)\\.href`))
  const [, , , width, height] = svg.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/)!.map(Number)
  assert.match(ownCss, new RegExp(`aspect-ratio: ${width} / ${height};`))
})

test('the sticker frame placeholder is gone: no outline, token, contrast pair, or callout remains from T7.8', () => {
  for (const path of ['motif.placeholder.bg', 'motif.placeholder.border', 'border.width.motif', 'radius.motif'])
    assert.equal(byPath.has(path), false, `${path} was removed`)
  assert.equal(existsSync(join(root, 'tokens/component/motif.json')), false)
  assert.doesNotMatch(ownCss, /cn-motif-|border-width-motif|radius-motif/)
  assert.doesNotMatch(read('tokens/contrast-pairs.json'), /motif\./)
  // The frame is drawn by the artwork alone: it declares no colour, stroke, radius, or padding of its own (ADR-0025).
  const frame = ownCss.slice(ownCss.indexOf('.cn-sticker-frame {'), ownCss.indexOf('@media'))
  assert.doesNotMatch(frame, /(^|\s)(background[\w-]*|padding[\w-]*|border[\w-]*|color):/m)
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

test('the rules read only tokens that exist', () => {
  assert.deepEqual(problems, [])
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  // The sparkle takes its height from the text beside it, so it adds no size of its own (ADR-0017).
  assert.match(ownCss, /height: var\(--sparkle-size, 1em\)/)
  // The frame keeps the ratio of its artwork, is as wide as its container unless a page sets --sticker-frame-width, and
  // never overflows it (REQ-028 AC1). Its content is clipped at the edge of the empty centre (ADR-0025).
  const frame = ownCss.slice(ownCss.indexOf('.cn-sticker-frame {'), ownCss.indexOf('@media'))
  assert.match(frame, /width: var\(--sticker-frame-width, 100%\)/)
  assert.match(frame, /max-width: 100%/)
  assert.match(frame, /inset: 11% 6\.8%/)
  assert.match(frame, /overflow: hidden/)
  assert.match(frame, /overflow-wrap: anywhere/)
})

test('REQ-015: no contrast pair is declared for the motifs, because they are artwork and decoration', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  const names = (p: { foreground: string; background: string }) => [p.foreground, p.background]
  assert.equal(
    report.pairs.some((p) => names(p).some((n) => /^(sparkle|motif)\b/.test(n))),
    false,
  )
})

test('REQ-020 AC1, AC2, REQ-009: both docs are custom components with a "Why custom" paragraph', () => {
  for (const slug of SLUGS) {
    const data = frontmatter(slug)
    assert.equal(data.layer, 'component', slug)
    assert.equal(data.level, 'atom', slug)
    assert.equal(data.source, 'custom', slug)
    assert.equal(data.component, COMPONENT[slug], slug)
    assert.deepEqual(data.demos, ['states', 'playground'], slug)
    assert.match(docOf(slug), /\*\*Why custom:\*\*[^\n]*Nuxt UI has no equivalent/, slug)
    assert.doesNotMatch(docOf(slug), /Content pending/, slug)
  }
  // The sparkle stays a draft until the owner approves it (REQ-009); its fade duration is ADR-0032, so no TBD is left.
  assert.equal(frontmatter('sparkle').status, 'draft')
  assert.deepEqual(frontmatter('sparkle').tbd, [])
  assert.doesNotMatch(docOf('sparkle'), /> \*\*TBD \(TBD-18\):\*\*/)
  assert.match(docOf('sparkle'), /ADR-0017/)
  // The sticker frame has its artwork (ADR-0024) and reads no placeholder token, so no TBD is left on it (ADR-0025).
  assert.equal(frontmatter('sticker-frame').status, 'stable')
  assert.deepEqual(frontmatter('sticker-frame').tbd, [])
  assert.deepEqual(frontmatter('sticker-frame').tokens, [])
  assert.doesNotMatch(docOf('sticker-frame'), /> \*\*TBD|TBD-\d\d|placeholder/)
  assert.match(docOf('sticker-frame'), /ADR-0024/)
  assert.match(docOf('sticker-frame'), /ADR-0025/)
  assert.match(docOf('sticker-frame'), /Sticker-Border-CN\.svg/)
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

test('the docs point to each other, and the foundation docs name the supplied sparkle, ramen cup, d20, chopsticks, noodle wave, arcade lines, and sticker border files', () => {
  assert.match(docOf('sparkle'), /sticker-frame/)
  assert.match(docOf('sticker-frame'), /sparkle/)
  for (const path of ['docs/01-foundations/imagery-and-motifs.md', 'docs/00-overview/brand-identity.md']) {
    const doc = read(path)
    assert.match(doc, /Sparkle-CN\.svg/, path)
    assert.match(doc, /ADR-0017/, path)
    assert.match(doc, /Ramen-Cup-CN\.svg/, path)
    assert.match(doc, /ADR-0019/, path)
    assert.match(doc, /D20-CN\.svg/, path)
    assert.match(doc, /ADR-0021/, path)
    assert.match(doc, /Chopsticks-CN\.svg/, path)
    assert.match(doc, /ADR-0020/, path)
    assert.match(doc, /Noodle-Wave-CN\.svg/, path)
    assert.match(doc, /ADR-0022/, path)
    assert.match(doc, /Arcade-Lines-CN\.svg/, path)
    assert.match(doc, /ADR-0023/, path)
    assert.match(doc, /Sticker-Border-CN\.svg/, path)
    assert.match(doc, /ADR-0024/, path)
    // TBD-18 is resolved (ADR-0025): `CnStickerFrame` renders the border file, so neither doc keeps the callout.
    assert.doesNotMatch(doc, /> \*\*TBD \(TBD-18\):\*\*/, path)
    assert.ok(!((readFrontmatter(doc).data as Record<string, unknown>).tbd as string[]).includes('TBD-18'), path)
    assert.match(doc, /ADR-0025/, path)
  }
  assert.doesNotMatch(read('docs/01-foundations/imagery-and-motifs.md'), /Motif pending \(TBD-18\)/)
})
