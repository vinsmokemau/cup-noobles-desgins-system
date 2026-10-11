// T8.3 end-to-end checks of the tooltip (REQ-020, REQ-026, REQ-027). They run against the isolated demo pages, `states` and
// `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and 1280 px in
// molecules.matrix.ts, and their baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const TEXT = 'Guardar los cambios'
const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/tooltip.md', import.meta.url)),
  'utf8',
)
/** The `default`, `hover`, ... rows of the States table of the doc. */
const statesOf = () => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

// Reka UI renders a hidden copy of the text for assistive technology, so the visible bubble is the one with the class.
const bubble = (page: import('@playwright/test').Page) => page.locator('.cn-tooltip')

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible'])
  await expectStateMatrix(page, 'tooltip', statesOf())
  await expect(page.locator('[data-state="default"] .cn-tooltip')).toHaveCount(0)
  await expect(page.locator('[data-state="hover"] .cn-tooltip')).toBeVisible()
  await expect(page.locator('[data-state="focus-visible"] .cn-tooltip')).toBeVisible()
})

test('Done when: the tooltip opens when the control is focused with the keyboard', async ({ page }) => {
  await openDemo(page, 'tooltip', 'playground')
  await expect(bubble(page)).toHaveCount(0)
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Guardar' })).toBeFocused()
  await expect(bubble(page)).toBeVisible()
  await expect(bubble(page)).toContainText(TEXT)
})

test('Done when: the tooltip opens on hover', async ({ page }) => {
  await openDemo(page, 'tooltip', 'playground')
  await page.getByRole('button', { name: 'Guardar' }).hover()
  await expect(bubble(page)).toBeVisible()
  await expect(bubble(page)).toContainText(TEXT)
})

test('REQ-027 AC2: Escape closes the open tooltip and keeps focus on the control', async ({ page }) => {
  await openDemo(page, 'tooltip', 'playground')
  await page.keyboard.press('Tab')
  await expect(bubble(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(bubble(page)).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Guardar' })).toBeFocused()
})

test('REQ-027 AC2: the control is described by the open tooltip', async ({ page }) => {
  await openDemo(page, 'tooltip', 'playground')
  await page.keyboard.press('Tab')
  await expect(bubble(page)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Guardar' })).toHaveAccessibleDescription(TEXT)
  await expect(page.locator('[role="tooltip"]')).toHaveText(TEXT)
})

test('REQ-016: the bubble is the black page with a brand pink outline, and draws no shadow', async ({ page }) => {
  await openDemo(page, 'tooltip', 'states')
  const style = await page.locator('[data-state="hover"] .cn-tooltip').evaluate((el) => {
    const s = getComputedStyle(el)
    return { bg: s.backgroundColor, border: s.borderTopColor, shadow: s.boxShadow, width: parseFloat(s.borderTopWidth) }
  })
  expect(style.bg).toBe('rgb(0, 0, 0)')
  expect(style.border).toBe('rgb(239, 128, 174)')
  expect(style.shadow).toBe('none')
  expect(style.width).toBeGreaterThan(0)
})

test('REQ-027 AC1: axe is clean in every state, and with the playground tooltip open', async ({ page }) => {
  await openDemo(page, 'tooltip', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/tooltip/states' })
  await openDemo(page, 'tooltip', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/tooltip/playground' })
  await page.keyboard.press('Tab')
  await expect(bubble(page)).toBeVisible()
  await expectNoA11yViolations(page, { label: '/_demo/tooltip/playground with the tooltip open' })
})
