// T8.3 (REQ-029 AC2): with `prefers-reduced-motion: reduce` emulated, the tooltip and the toaster do not animate. Nuxt UI
// starts their open and close animations without `motion-safe`, so the rules switch them off, and this proves it.
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

test('REQ-029 AC2: the tooltip does not animate under reduced motion', async ({ page }) => {
  await openDemo(page, 'tooltip', 'playground')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  await page.keyboard.press('Tab')
  const bubble = page.locator('.cn-tooltip')
  await expect(bubble).toBeVisible()
  expect(await bubble.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
})

test('REQ-029 AC2: a toast does not slide in under reduced motion', async ({ page }) => {
  await openDemo(page, 'toast', 'playground')
  await page.getByRole('button', { name: 'Mostrar aviso' }).click()
  const item = page.locator('.cn-toaster__item')
  await expect(item).toBeVisible()
  expect(await item.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
})
