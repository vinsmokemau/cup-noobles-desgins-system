// T6.3 checks: the model behind the foundation previews (REQ-054 AC2, AC3, AC4). The browser checks are in
// apps/showcase/tests/e2e/token-preview.spec.ts. The previews are picked by each doc's generated blocks, so these tests
// read the real docs and the real token build, and nothing is retyped.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tableBlockPrefixes } from '../apps/showcase/lib/doc-blocks'
import { scanPreviewBlocks } from '../apps/showcase/lib/doc-scan'
import type { FlatToken } from '../apps/showcase/lib/token-filter'
import {
  DIACRITICS,
  SPECIMEN_TEXT,
  TYPE_ROLES,
  aggregateStatus,
  specimenStyle,
  toPreviews,
  toSections,
} from '../apps/showcase/lib/token-preview'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const flat = JSON.parse(readFileSync(join(root, 'packages/tokens/dist/json/tokens.flat.json'), 'utf8')) as Record<
  string,
  FlatToken
>
const blocks = scanPreviewBlocks(join(root, 'docs'))
const previewsOf = (doc: string) => toPreviews(flat, blocks[`01-foundations/${doc}.md`] ?? [])

test('tableBlockPrefixes reads the table blocks only, and skips fenced code', () => {
  const markdown = [
    '<!-- cn:generated tokens="radius border" format="table" -->',
    '<!-- /cn:generated -->',
    '<!-- cn:generated tokens="color" format="contrast" -->',
    '<!-- /cn:generated -->',
    '```md',
    '<!-- cn:generated tokens="motion" format="table" -->',
    '```',
    '<!-- cn:generated tokens="font, radius" format="table" -->',
  ].join('\n')
  assert.deepEqual(tableBlockPrefixes(markdown), ['radius', 'border', 'font'])
})

test('REQ-054: every foundation doc with a table block is in the scan, and nothing else', () => {
  assert.deepEqual(blocks['01-foundations/motion.md'], ['motion'])
  assert.deepEqual(blocks['01-foundations/shape.md'], ['radius', 'border'])
  assert.deepEqual(blocks['01-foundations/effects.md'], ['effect', 'z', 'focus'])
  assert.ok(Object.keys(blocks).every((file) => file.startsWith('01-foundations/')))
})

test('REQ-054 AC2: typography has a specimen for H1, H2, H3, body, and caption, each with the Spanish diacritics', () => {
  const specimens = previewsOf('typography').filter((p) => p.kind === 'type')
  assert.deepEqual(
    specimens.map((p) => p.role),
    [...TYPE_ROLES],
  )
  assert.equal(DIACRITICS, 'áéíóú ñ ¿¡')
  for (const role of TYPE_ROLES) assert.ok(SPECIMEN_TEXT[role].includes('áéíóú ñ ¿¡'), role)
})

test('REQ-054 AC2: a specimen is set only with var() of its own role tokens', () => {
  for (const specimen of previewsOf('typography')) {
    const style = specimenStyle(specimen)
    assert.deepEqual(Object.keys(style).sort(), ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight'])
    for (const value of Object.values(style)) assert.match(value, new RegExp(`^var\\(--cn-font-${specimen.role}-`))
  }
})

test('REQ-054 AC3: spacing, stroke, radius, glow, elevation, and motion each get a preview per token', () => {
  const kinds = (doc: string) => previewsOf(doc).map((p) => `${p.kind}:${p.label}`)
  assert.deepEqual(kinds('spacing'), ['space:space.base'])
  assert.deepEqual(kinds('shape'), [
    'stroke:border.width.badge',
    'stroke:border.width.button',
    'stroke:border.width.choice',
    'stroke:border.width.default',
    'stroke:border.width.input',
    'stroke:border.width.interactive',
    'radius:radius.badge',
    'radius:radius.button',
    'radius:radius.choice',
    'radius:radius.input',
    'radius:radius.interactive',
    'radius:radius.lg',
    'radius:radius.md',
    'radius:radius.sm',
  ])
  assert.deepEqual(kinds('effects'), [
    'glow:effect.glow.button',
    'glow:effect.glow.default',
    'glow:effect.glow.interactive',
    'elevation:effect.elevation.overlay',
    'elevation:effect.shadow.overlay',
  ])
  assert.deepEqual(kinds('motion'), ['motion:motion.*.default'])
  const motion = previewsOf('motion')[0]!
  assert.deepEqual(
    motion.tokens.map((t) => t.path),
    ['motion.duration.default', 'motion.easing.default'],
  )
})

test('REQ-054: the previews cover every token the tables show, except the z-index and focus ones', () => {
  const covered = new Set(
    Object.values(blocks)
      .flatMap((prefixes) => toPreviews(flat, prefixes))
      .flatMap((p) => p.tokens.map((t) => t.path)),
  )
  for (const path of Object.keys(flat)) {
    if (!/^(space|radius|border\.width|effect\.(glow|elevation|shadow)|motion)\./.test(path)) continue
    assert.ok(covered.has(path), `${path} has no preview`)
  }
})

test('REQ-054 AC4: the status of a preview is the worst of its tokens, with their TBD ids', () => {
  assert.equal(aggregateStatus(['stable', 'tbd', 'derived-pending']), 'tbd')
  assert.equal(aggregateStatus(['stable', 'derived-pending']), 'derived-pending')
  assert.equal(aggregateStatus(['stable']), 'stable')
  assert.equal(aggregateStatus([null]), null)
  const h1 = previewsOf('typography')[0]!
  assert.equal(h1.status, 'tbd')
  assert.deepEqual(h1.tbd, ['TBD-01', 'TBD-03'])
  assert.deepEqual(previewsOf('spacing')[0]!.tbd, ['TBD-09'])
})

test('the sections come in the page order and only the ones with previews', () => {
  assert.deepEqual(
    toSections(previewsOf('effects')).map((s) => s.kind),
    ['glow', 'elevation'],
  )
  assert.deepEqual(toSections(toPreviews(flat, ['color'])), [])
})
