// T6.1 (REQ-053): the /tokens explorer. The expected rows come from tokens.flat.json itself, read from disk, so a token
// added to the sources shows up in these checks without an edit here.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'
import { expect, test } from './helpers/test'

interface Flat {
  cssVar: string
  raw: string | number | (string | number)[]
  value: string | number | boolean
  tier: string
  status: string | null
  description: string | null
}
const flat = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../../../../packages/tokens/dist/json/tokens.flat.json', import.meta.url)),
    'utf8',
  ),
) as Record<string, Flat>
const all = Object.entries(flat).map(([path, token]) => ({ path, group: path.split('.')[0]!, ...token }))

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/tokens')
  // The page is prerendered; wait until Vue has taken it over, or typed input would be lost.
  await expect(page.getByTestId('token-explorer')).toHaveAttribute('data-ready', 'true')
})

const rows = (page: Page) => page.getByTestId('token-row')
const choose = async (page: Page, label: string, option: string) => {
  await page.getByRole('combobox', { name: label }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}
const shownPaths = (page: Page) => rows(page).evaluateAll((els) => els.map((el) => el.getAttribute('data-path')))

test('REQ-053 AC4: the row count and the count shown equal the token count in tokens.flat.json', async ({ page }) => {
  expect(all.length).toBeGreaterThan(100)
  await expect(rows(page)).toHaveCount(all.length)
  await expect(page.getByTestId('token-total')).toHaveText(String(all.length))
  await expect(page.getByTestId('token-shown')).toHaveText(String(all.length))
})

test('REQ-053 AC1: every row shows the path, CSS variable, raw value, resolved value, tier, status, and description', async ({
  page,
}) => {
  const table = await rows(page).evaluateAll((els) =>
    els.map((el) => ({
      path: el.getAttribute('data-path'),
      cssVar: el.querySelector('[data-testid="css-var"]')?.textContent,
      raw: el.querySelector('[data-testid="raw-value"]')?.textContent,
      value: el.querySelector('[data-testid="resolved-value"]')?.textContent,
      tier: el.querySelector('[data-testid="tier"]')?.textContent?.trim(),
      cells: [...el.querySelectorAll('td')].map((td) => td.textContent?.replace(/\s+/g, ' ').trim()),
    })),
  )
  expect(table.map((row) => row.path)).toEqual(all.map((token) => token.path))
  for (const [index, token] of all.entries()) {
    const row = table[index]!
    expect(row.cssVar, token.path).toBe(token.cssVar)
    expect(row.raw, token.path).toBe(typeof token.raw === 'string' ? token.raw : JSON.stringify(token.raw))
    expect(row.value, token.path).toBe(String(token.value))
    expect(row.tier, token.path).toBe(token.tier)
    expect(row.cells.at(-2), `${token.path} status`).toContain(token.status ?? 'none')
    expect(row.cells.at(-1), `${token.path} description`).toBe(token.description?.replace(/\s+/g, ' ').trim() ?? '')
  }
  // An alias shows the reference it was written with, next to the value it resolves to.
  const alias = all.find((token) => String(token.raw).startsWith('{'))!
  expect(String(alias.raw)).not.toBe(String(alias.value))
})

test('REQ-053 AC2: filtering by tier', async ({ page }) => {
  await choose(page, 'Tier', 'semantic')
  const expected = all.filter((token) => token.tier === 'semantic').map((token) => token.path)
  expect(expected.length).toBeGreaterThan(0)
  expect(expected.length).toBeLessThan(all.length)
  expect(await shownPaths(page)).toEqual(expected)
  await expect(page.getByTestId('token-shown')).toHaveText(String(expected.length))
  await expect(page.getByTestId('token-total')).toHaveText(String(all.length))
})

test('REQ-053 AC2: filtering by group', async ({ page }) => {
  await choose(page, 'Group', 'color')
  const expected = all.filter((token) => token.group === 'color').map((token) => token.path)
  expect(expected.length).toBeGreaterThan(0)
  expect(await shownPaths(page)).toEqual(expected)
})

test('REQ-053 AC2: filtering by status', async ({ page }) => {
  await choose(page, 'Status', 'tbd')
  const expected = all.filter((token) => token.status === 'tbd').map((token) => token.path)
  expect(expected.length).toBeGreaterThan(0)
  expect(expected.length).toBeLessThan(all.length)
  expect(await shownPaths(page)).toEqual(expected)
})

test('REQ-053 AC2: the filters combine, and Reset filters restores every row', async ({ page }) => {
  await choose(page, 'Tier', 'primitive')
  await choose(page, 'Group', 'color')
  await choose(page, 'Status', 'stable')
  const expected = all
    .filter((token) => token.tier === 'primitive' && token.group === 'color' && token.status === 'stable')
    .map((token) => token.path)
  expect(await shownPaths(page)).toEqual(expected)
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(rows(page)).toHaveCount(all.length)
})

test('REQ-053 AC2: the search matches the path, the CSS variable, the value, and the description, ignoring case', async ({
  page,
}) => {
  const search = page.getByRole('searchbox', { name: 'Search' })
  const sample = all.find((token) => token.description)!

  await search.fill(sample.path.toUpperCase())
  expect(await shownPaths(page)).toContain(sample.path)

  await search.fill(sample.cssVar)
  expect(await shownPaths(page)).toContain(sample.path)

  await search.fill(String(sample.value))
  const byValue = all.filter((token) => `${token.value}`.toLowerCase().includes(`${sample.value}`.toLowerCase()))
  expect(byValue.map((token) => token.path)).toContain(sample.path)
  expect((await shownPaths(page)).length).toBeGreaterThanOrEqual(byValue.length)

  const word = sample.description!.split(/\s+/).find((w) => w.length > 6)!
  await search.fill(word)
  expect(await shownPaths(page)).toContain(sample.path)

  // Several words must all match, and a nonsense word matches nothing.
  await search.fill('color brand')
  const both = await shownPaths(page)
  expect(both.length).toBeGreaterThan(0)
  expect(both.length).toBeLessThan(all.length)
  await search.fill('zzzz-no-such-token')
  await expect(rows(page)).toHaveCount(0)
  await expect(page.getByTestId('token-empty')).toBeVisible()
})

test('REQ-053 AC3: the copy buttons put the exact CSS variable and resolved value on the clipboard', async ({
  page,
}) => {
  const clipboard = () => page.evaluate(() => navigator.clipboard.readText())
  for (const path of [
    'color.brand.primary',
    'color.bg.base',
    all.find((token) => typeof token.value === 'number')?.path,
  ]) {
    const token = flat[path!]!
    const row = page.locator(`[data-path="${path}"]`)

    await row.getByTestId('copy-var').click()
    await expect.poll(clipboard).toBe(token.cssVar)
    await expect(page.getByTestId('copy-notice')).toContainText(token.cssVar)

    await row.getByTestId('copy-value').click()
    await expect.poll(clipboard).toBe(String(token.value))
  }
  // The values the spec names, so a wrong token file cannot make this test agree with itself.
  const primary = page.locator('[data-path="color.brand.primary"]')
  await primary.getByTestId('copy-var').click()
  await expect.poll(clipboard).toBe('--cn-color-brand-primary')
  await primary.getByTestId('copy-value').click()
  await expect.poll(clipboard).toBe('#ef80ae')
})
