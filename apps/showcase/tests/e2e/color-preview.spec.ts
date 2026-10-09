// T6.2 (REQ-054 AC1, AC4): the color previews on /foundations/color. The expected swatches come from tokens.flat.json and
// the expected ratios from `check-contrast`'s own math, both read from disk, so a token added to the sources shows up in
// these checks without an edit here.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { contrastRatio, round } from '../../../../scripts/contrast'
import { expect, test } from './helpers/test'

interface Flat {
  cssVar: string
  value: string
  status: string | null
  tbd?: string[]
}
const flat = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../../../../packages/tokens/dist/json/tokens.flat.json', import.meta.url)),
    'utf8',
  ),
) as Record<string, Flat>
const colors = Object.entries(flat).filter(([path]) => path.startsWith('color.'))
const base = flat['color.bg.base']!.value

test.beforeEach(async ({ page }) => {
  await page.goto('/foundations/color')
})

const swatch = (page: import('@playwright/test').Page, path: string) =>
  page.locator(`[data-testid="swatch"][data-path="${path}"]`)

test('REQ-054 AC1: there is a swatch for every color token, with its variable and value', async ({ page }) => {
  expect(colors.length).toBeGreaterThan(10)
  await expect(page.getByTestId('swatch')).toHaveCount(colors.length)
  for (const [path, token] of colors) {
    const item = swatch(page, path)
    await expect(item.getByTestId('swatch-var')).toHaveText(token.cssVar)
    await expect(item.getByTestId('swatch-value')).toHaveText(token.value)
  }
})

test('REQ-054 AC1: each ratio against color.bg.base equals the one check-contrast computes, with a pass or fail badge', async ({
  page,
}) => {
  for (const [path, token] of colors) {
    if (path === 'color.bg.base' || token.status === 'tbd') continue
    const exact = contrastRatio(token.value, base)
    const item = swatch(page, path)
    await expect(item.getByTestId('ratio'), path).toHaveText(`${round(exact).toFixed(2)}:1`)
    await expect(item.getByTestId('verdict'), path).toHaveText(exact >= 4.5 ? 'Pass' : 'Fail')
  }
  // The values the spec names (§2.1).
  await expect(swatch(page, 'color.brand.primary').getByTestId('ratio')).toHaveText('8.37:1')
  await expect(swatch(page, 'color.brand.secondary').getByTestId('ratio')).toHaveText('18.55:1')
  await expect(swatch(page, 'color.brand.primary').getByTestId('verdict')).toHaveText('Pass')
  await expect(swatch(page, 'color.text.inverted').getByTestId('verdict')).toHaveText('Fail')
  await expect(swatch(page, 'color.bg.base').getByTestId('verdict')).toHaveText('Reference')
})

test('REQ-054 AC1: the swatch is painted with the token itself', async ({ page }) => {
  const painted = await swatch(page, 'color.brand.primary')
    .locator('.swatch-box > div')
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(painted).toBe('rgb(239, 128, 174)')
})

test('REQ-054 AC4: a tbd token shows the hatched overlay and its TBD badge, and is not measured', async ({ page }) => {
  const tbd = colors.filter(([, token]) => token.status === 'tbd')
  expect(tbd.length).toBeGreaterThan(0)
  for (const [path, token] of tbd) {
    const item = swatch(page, path)
    await expect(item.getByTestId('hatch'), path).toHaveCount(1)
    const hatch = await item.getByTestId('hatch').evaluate((el) => getComputedStyle(el).backgroundImage)
    expect(hatch, path).toContain('repeating-linear-gradient')
    await expect(item.getByTestId('status-badge'), path).toHaveText('tbd')
    await expect(item.getByTestId('tbd-badge'), path).toHaveText(token.tbd!)
    await expect(item.getByTestId('verdict'), path).toHaveText('Unverified')
    await expect(item.getByTestId('ratio'), path).toHaveText('Not measured')
  }
})

test('REQ-054 AC4: a derived-pending token shows its status badge and its TBD id, with no hatch', async ({ page }) => {
  const pending = colors.filter(([, token]) => token.status === 'derived-pending')
  expect(pending.length).toBeGreaterThan(0)
  for (const [path, token] of pending) {
    const item = swatch(page, path)
    await expect(item.getByTestId('status-badge'), path).toHaveText('derived-pending')
    await expect(item.getByTestId('tbd-badge'), path).toHaveText(token.tbd!)
    await expect(item.getByTestId('hatch'), path).toHaveCount(0)
  }
})

test('REQ-054 AC4: a stable token has neither a hatch nor a TBD badge', async ({ page }) => {
  const item = swatch(page, 'color.brand.primary')
  await expect(item.getByTestId('hatch')).toHaveCount(0)
  await expect(item.getByTestId('tbd-badge')).toHaveCount(0)
})

test('the previews are not on the other foundation pages', async ({ page }) => {
  await page.goto('/foundations/typography')
  await expect(page.getByTestId('color-previews')).toHaveCount(0)
})
