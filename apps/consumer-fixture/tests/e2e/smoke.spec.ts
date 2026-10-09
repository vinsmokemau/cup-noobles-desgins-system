// T5.2 smoke tests (REQ-012 AC2, REQ-071 AC1): the fixture consumes the layer and shows the brand colors.
import { expect, test } from '@playwright/test'

test('REQ-012 AC2: the <body> background computes to rgb(0, 0, 0)', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)')
})

test('REQ-071 AC1: the primary UButton background is #ef80ae', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button')
  await expect(button).toHaveCount(1)
  // #ef80ae = rgb(239, 128, 174)
  await expect(button).toHaveCSS('background-color', 'rgb(239, 128, 174)')
})
