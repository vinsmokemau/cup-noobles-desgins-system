// T15.5 (DSR-06, A-02, BR-03): the dark-only system tells the browser so. Nuxt UI sets neither `color-scheme` nor
// `theme-color` when its color mode is off, so the layer adds both. These tests run against the fixture built with the
// workspace layer (playwright.config.ts), because the installed layer is the last published one.
import { expect, test } from '@playwright/test'

const page3101 = 'http://localhost:3101/'

test('DSR-06: the page declares color-scheme dark in a meta tag and in CSS', async ({ page }) => {
  await page.goto(page3101)
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark')
})

test('DSR-06, BR-03: the theme-color meta is the pure-black base, the same color the body paints', async ({ page }) => {
  await page.goto(page3101)
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)')
})

test('DSR-06: both tags are in the server-rendered HTML, before any JavaScript runs (ER-03)', async ({ request }) => {
  const html = await (await request.get(page3101)).text()
  expect(html).toContain('<meta name="color-scheme" content="dark">')
  expect(html).toContain('<meta name="theme-color" content="#000000">')
})
