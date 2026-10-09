// T7.6 (REQ-029 AC2): with `prefers-reduced-motion: reduce` emulated, the skeleton does not fade and the indeterminate
// progress bar does not move. motion.reduced.ts already checks that no animation runs on any route; this names the two
// components, and proves the reason: their animation is switched off in the rule, not just paused.
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const running = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length)

test('REQ-029 AC2: the skeleton does not animate under reduced motion', async ({ page }) => {
  await openDemo(page, 'skeleton', 'states')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  for (const shape of await page.locator('.cn-skeleton').all()) {
    expect(await shape.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
    expect(await shape.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  }
  expect(await page.locator('.cn-skeleton').count()).toBeGreaterThan(0)
  expect(await running(page)).toBe(0)
})

test('REQ-029 AC2: the indeterminate progress bar is still under reduced motion', async ({ page }) => {
  await openDemo(page, 'progress', 'states')
  const fill = page.locator('[data-state="indeterminate"]:not([data-slot])').locator('[data-slot="indicator"]')
  expect(await fill.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  // The bar shows a still, partly filled bar rather than a full one, which would read as finished.
  const [fillBox, trackBox] = await Promise.all([
    fill.boundingBox(),
    page.locator('[data-state="indeterminate"]:not([data-slot])').getByRole('progressbar').boundingBox(),
  ])
  expect(fillBox!.width).toBeLessThan(trackBox!.width * 0.5)
  expect(fillBox!.width).toBeGreaterThan(0)
  expect(await running(page)).toBe(0)
})
