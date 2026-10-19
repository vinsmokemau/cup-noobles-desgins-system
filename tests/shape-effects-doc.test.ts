// T4.4 checks: docs/01-foundations/shape.md and effects.md quote BR-10 and BR-13, cover the radius, stroke-width, glow,
// elevation, z-index, and focus token groups, hold no TBD callout (REQ-005; TBD-10, 11, 12, 15, and 16 are resolved), state that focus
// is never the glow alone (REQ-024), and hold the R-04 glow rule as a stable rule (ADR-0052).
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

test('frontmatter: shape is draft and effects is stable, with their BR IDs, TBD IDs, and token groups', () => {
  assert.equal(fm(shape).status, 'stable')
  assert.deepEqual(fm(shape).brandRules, ['BR-10', 'BR-13'])
  assert.deepEqual(fm(shape).tbd, [])
  assert.deepEqual(fm(shape).tokens, ['radius', 'border'])
  // T13.2: effects.md holds no TBD item and its glow rule is approved (ADR-0052), so it is stable.
  assert.equal(fm(effects).status, 'stable')
  assert.deepEqual(fm(effects).brandRules, ['BR-06', 'BR-10', 'BR-13'])
  // TBD-16 (ADR-0009), TBD-12 (ADR-0051), and TBD-15 (ADR-0054) are resolved, so their callouts are gone (§4.4).
  assert.deepEqual(fm(effects).tbd, [])
  assert.deepEqual(fm(effects).tokens, ['effect', 'z', 'focus'])
})

test('Done when: no TBD item has a callout; TBD-10, 11, 12, 15, and 16 are resolved (ADR-0050, ADR-0032, ADR-0051, ADR-0054, ADR-0009)', () => {
  for (const id of ['TBD-10', 'TBD-11']) assert.doesNotMatch(shape, callout(id), `shape.md ${id}`)
  assert.doesNotMatch(shape, /^> \*\*TBD/m)
  for (const id of ['TBD-12', 'TBD-15', 'TBD-16']) assert.doesNotMatch(effects, callout(id), `effects.md ${id}`)
  assert.doesNotMatch(effects, /^> \*\*TBD/m)
})

test('scope: BR-10 and BR-13 are quoted with their IDs in both docs', () => {
  for (const text of [shape, effects]) for (const id of ['BR-10', 'BR-13']) assert.match(text, quote(id), id)
})

test('scope: generated blocks cover radius, stroke width, glow, elevation, z-index, and focus', () => {
  assert.ok(block(shape, 'radius border'))
  assert.ok(block(effects, 'effect z focus'))
  assert.ok(block(effects, 'focus', 'contrast'))
  for (const token of ['radius.sm', 'radius.md', 'radius.lg'])
    assert.match(shape, new RegExp(`^\\| \`${token.replace(/\./g, '\\.')}\` \\|.*\\| stable \\|$`, 'm'), token)
  assert.match(shape, /^\| `border\.width\.default` \|.*\| stable \|$/m, 'border.width.default')
  for (const token of ['effect.glow.interactive', 'effect.elevation.overlay', 'effect.zIndex.toast'])
    assert.match(effects, new RegExp(`^\\| \`${token.replace(/\./g, '\\.')}\` \\|.*\\| stable \\|$`, 'm'), token)
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

test('scope: the R-04 rule (glow on component edges, not body text) is a stable rule that cites ADR-0052', () => {
  assert.doesNotMatch(effects, /^> \*\*Draft:\*\* /m, 'no draft callout is left')
  const rule = effects.split(/\r?\n/).find((line) => line.startsWith('> **Rule (ADR-0052):** '))
  assert.ok(rule, 'a Rule callout exists')
  assert.match(rule, /component edges only/)
  assert.match(rule, /never applied to body text/)
  assert.match(rule, /R-04/)
  assert.doesNotMatch(rule, /awaits owner approval/)
})

test('T13.2, ADR-0051, ADR-0054: the doc states the Neon tube glow and the Outline only elevation numbers', () => {
  const glow = effects.slice(effects.indexOf('### Glow'), effects.indexOf('### Elevation and stacking'))
  for (const row of [
    '| Default (rest) | blur 12 px, spread 1 px, opacity 60% |',
    '| Hover | blur 20 px, spread 2 px, opacity 85% |',
    '| Disabled | none (REQ-023 AC5) |',
  ])
    assert.ok(glow.includes(row), row)
  const elevation = effects.slice(effects.indexOf('### Elevation and stacking'), effects.indexOf('### Focus'))
  for (const row of ['| 0.85, black at 85% |', '| 50 |', '| 100 |', '| none |']) assert.ok(elevation.includes(row), row)
})
