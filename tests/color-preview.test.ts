// T6.2 checks: the model behind the color previews (REQ-054 AC1, AC4). The ratios are compared with `check-contrast`'s own
// report, so a swatch cannot disagree with `pnpm check:tokens`. The browser checks are in
// apps/showcase/tests/e2e/color-preview.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { BASE, MINIMUM, ratioText, toSwatches } from '../apps/showcase/lib/color-preview'
import type { FlatToken } from '../apps/showcase/lib/token-filter'
import { checkContrast } from '../scripts/check-contrast'

const flat = JSON.parse(readFileSync('packages/tokens/dist/json/tokens.flat.json', 'utf8')) as Record<string, FlatToken>
const swatches = toSwatches(flat)
const byPath = new Map(swatches.map((swatch) => [swatch.path, swatch]))

test('REQ-054 AC1: there is one swatch for every color token, in order', () => {
  const colors = Object.keys(flat).filter((path) => path.startsWith('color.'))
  assert.ok(colors.length > 10)
  assert.deepEqual(
    swatches.map((swatch) => swatch.path),
    colors,
  )
})

test('REQ-054 AC1: the ratios equal the ones check-contrast reports against color.bg.base', () => {
  const pairs = checkContrast().pairs.filter((pair) => pair.background === BASE && pair.usage === 'text')
  assert.ok(pairs.length > 0)
  for (const pair of pairs) {
    const swatch = byPath.get(pair.foreground)!
    if (pair.result === 'unverified') {
      assert.equal(swatch.verdict, 'unverified', pair.foreground)
      continue
    }
    assert.equal(swatch.ratio, pair.ratio, pair.foreground)
    assert.equal(swatch.verdict, pair.result, pair.foreground)
  }
  // The values the spec names (§2.1), so a wrong file cannot make this test agree with itself.
  assert.equal(byPath.get('color.brand.primary')!.ratio, 8.37)
  assert.equal(byPath.get('color.brand.secondary')!.ratio, 18.55)
})

test('REQ-054 AC1: every swatch gets a pass or fail, a tbd token is unverified, and the base is the reference', () => {
  assert.equal(MINIMUM, 4.5)
  assert.equal(byPath.get(BASE)!.verdict, 'reference')
  assert.equal(byPath.get(BASE)!.ratio, null)
  assert.equal(byPath.get('color.brand.primary')!.verdict, 'pass')
  assert.equal(byPath.get('color.text.inverted')!.verdict, 'fail', 'black on black cannot be read')
  for (const swatch of swatches) {
    if (swatch.status === 'tbd') {
      assert.equal(swatch.verdict, 'unverified', swatch.path)
      assert.equal(swatch.ratio, null, swatch.path)
      assert.ok(swatch.tbd.length > 0, `${swatch.path} names its TBD id`)
    } else if (swatch.path !== BASE) {
      assert.ok(['pass', 'fail'].includes(swatch.verdict), swatch.path)
      assert.equal(typeof swatch.ratio, 'number', swatch.path)
    }
  }
})

test('REQ-054 AC4: tbd and derived-pending tokens are in the model with their status and TBD ids', () => {
  assert.ok(swatches.some((swatch) => swatch.status === 'tbd'))
  assert.equal(byPath.get('color.border.default')!.status, 'tbd')
  assert.deepEqual(byPath.get('color.border.default')!.tbd, ['TBD-05'])
  assert.equal(byPath.get('color.brand.pink-100')!.status, 'derived-pending')
  assert.deepEqual(byPath.get('color.brand.pink-100')!.tbd, ['TBD-08'])
})

test('the ratio is shown with two decimals', () => {
  assert.equal(ratioText(8.37), '8.37:1')
  assert.equal(ratioText(21), '21.00:1')
})
