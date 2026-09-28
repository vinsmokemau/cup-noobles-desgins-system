// T4.4 checks: docs/01-foundations/shape.md and effects.md quote BR-10 and BR-13, cover the radius, stroke-width, glow,
// elevation, z-index, and focus token groups, keep TBD-10, 11, 12, and 15 as callouts (REQ-005; TBD-16 is resolved by ADR-0009), state that focus
// is never the glow alone (REQ-024), and hold the R-04 glow rule as a draft callout (REQ-009 AC1).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (name: string) => readFileSync(join(root, 'docs/01-foundations', name), 'utf8')
const shape = read('shape.md')
const effects = read('effects.md')
const fm = (text: string) => readFrontmatter(text).data as Record<string, unknown>

const callout = (id: string) => new RegExp(`^> \\*\\*TBD \\(${id}\\):\\*\\* `, 'm')
const quote = (id: string) => new RegExp(`^> \\*\\*${id}:\\*\\* `, 'm')
const block = (text: string, tokens: string, format = 'table') =>
  new RegExp(`^<!-- cn:generated tokens="${tokens}" format="${format}" -->$`, 'm').test(text)

test('frontmatter: both docs are draft, with their BR IDs, TBD IDs, and token groups', () => {
  assert.equal(fm(shape).status, 'draft')
  assert.deepEqual(fm(shape).brandRules, ['BR-10', 'BR-13'])
  assert.deepEqual(fm(shape).tbd, ['TBD-10', 'TBD-11'])
  assert.deepEqual(fm(shape).tokens, ['radius', 'border'])
  assert.equal(fm(effects).status, 'draft')
  assert.deepEqual(fm(effects).brandRules, ['BR-06', 'BR-10', 'BR-13'])
  // TBD-16 was resolved after T4.4 (ADR-0009), so its callout is gone (§4.4).
  assert.deepEqual(fm(effects).tbd, ['TBD-12', 'TBD-15'])
  assert.deepEqual(fm(effects).tokens, ['effect', 'z', 'focus'])
})

test('Done when: the TBD callouts reference TBD-10, 11, 12, and 15; TBD-16 is resolved (ADR-0009)', () => {
  for (const id of ['TBD-10', 'TBD-11']) assert.match(shape, callout(id), `shape.md ${id}`)
  for (const id of ['TBD-12', 'TBD-15']) assert.match(effects, callout(id), `effects.md ${id}`)
  assert.doesNotMatch(effects, callout('TBD-16'))
})

test('scope: BR-10 and BR-13 are quoted with their IDs in both docs', () => {
  for (const text of [shape, effects]) for (const id of ['BR-10', 'BR-13']) assert.match(text, quote(id), id)
})

test('scope: generated blocks cover radius, stroke width, glow, elevation, z-index, and focus', () => {
  assert.ok(block(shape, 'radius border'))
  assert.ok(block(effects, 'effect z focus'))
  assert.ok(block(effects, 'focus', 'contrast'))
  for (const token of ['radius.sm', 'radius.md', 'radius.lg', 'border.width.default'])
    assert.match(
      shape,
      new RegExp(`^\\| \`${token.replace(/\./g, '\\.')}\` \\|.*\\| tbd \\(TBD-1[01]\\) \\|$`, 'm'),
      token,
    )
  for (const token of ['effect.glow.interactive', 'effect.elevation.overlay', 'effect.zIndex.toast'])
    assert.match(
      effects,
      new RegExp(`^\\| \`${token.replace(/\./g, '\\.')}\` \\|.*\\| tbd \\(TBD-1[25]\\) \\|$`, 'm'),
      token,
    )
  for (const token of ['focus.ring.color', 'focus.ring.width', 'focus.ring.offset', 'focus.ring.style'])
    assert.match(effects, new RegExp(`^\\| \`${token.replace(/\./g, '\\.')}\` \\|.*\\| stable \\|$`, 'm'), token)
})

test('scope: REQ-024, focus is never the glow alone and appears on :focus-visible', () => {
  assert.match(
    effects,
    /REQ-024 AC1: every interactive component shows a focus-visible indicator that is \*\*not the glow alone\*\*/,
  )
  assert.match(effects, /never on a mouse click alone/)
  assert.match(effects, /Never use the glow as the only focus indicator/)
})

test('scope: the R-04 rule (glow on component edges, not body text) is a draft callout', () => {
  const draft = effects.split(/\r?\n/).find((line) => line.startsWith('> **Draft:** '))
  assert.ok(draft, 'a Draft callout exists')
  assert.match(draft, /component edges only/)
  assert.match(draft, /never applied to body text/)
  assert.match(draft, /R-04/)
  assert.match(draft, /awaits owner approval/)
})
