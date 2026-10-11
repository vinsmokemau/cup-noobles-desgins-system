// T8.3 end-to-end checks of the alert (REQ-020, REQ-026, REQ-027). They run against the isolated demo pages, `states` and
// `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and 1280 px in
// molecules.matrix.ts, and their baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/alert.md', import.meta.url)),
  'utf8',
)
/** The `default`, `success`, ... rows of the States table of the doc. */
const statesOf = () => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const cell = (page: Page, state: string) => page.locator(`[data-state="${state}"]`)
const alertOf = (page: Page, state: string) => cell(page, state).locator('[data-slot="root"]')
const color = (target: Locator, property: 'borderTopColor' | 'color') =>
  target.evaluate((el, name) => getComputedStyle(el)[name], property)

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'success', 'warning', 'error', 'focus-visible'])
  await expectStateMatrix(page, 'alert', statesOf())
  for (const state of statesOf()) await expect(alertOf(page, state), state).toBeVisible()
})

test('every type shows an icon and a title, so the type is never told by color alone (WCAG 1.4.1)', async ({
  page,
}) => {
  await openDemo(page, 'alert', 'states')
  for (const state of statesOf()) {
    const alert = alertOf(page, state)
    await expect(alert.locator('[data-slot="title"]'), state).not.toBeEmpty()
    await expect(alert.locator('[data-slot="icon"]'), state).toHaveCount(1)
  }
})

test('Done when: the outline and the icon read the feedback token of their type', async ({ page }) => {
  await openDemo(page, 'alert', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-alert-success-color', 'rgb(1, 2, 3)')
    root.setProperty('--cn-alert-warning-color', 'rgb(4, 5, 6)')
    root.setProperty('--cn-alert-error-color', 'rgb(7, 8, 9)')
    root.setProperty('--cn-alert-info-color', 'rgb(10, 11, 12)')
  })
  const expected = {
    success: 'rgb(1, 2, 3)',
    warning: 'rgb(4, 5, 6)',
    error: 'rgb(7, 8, 9)',
    default: 'rgb(10, 11, 12)',
  } as const
  for (const [state, rgb] of Object.entries(expected)) {
    const alert = alertOf(page, state)
    expect(await color(alert, 'borderTopColor'), `${state} outline`).toBe(rgb)
    expect(await color(alert.locator('[data-slot="icon"]'), 'color'), `${state} icon`).toBe(rgb)
  }
})

test('REQ-016: the fill is the black page and no shadow or glow is drawn', async ({ page }) => {
  await openDemo(page, 'alert', 'states')
  const alert = alertOf(page, 'error')
  expect(await alert.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(0, 0, 0)')
  expect(await alert.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none')
  expect(await alert.evaluate((el) => parseFloat(getComputedStyle(el).borderTopWidth))).toBeGreaterThan(0)
})

test('REQ-027 AC2: Tab reaches the close button, which is named, and Enter closes the alert', async ({ page }) => {
  await openDemo(page, 'alert', 'playground')
  const alert = page.locator('[data-slot="root"]')
  const close = page.getByRole('button', { name: 'Cerrar aviso' })
  await expect(alert).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  // The focus ring is an outline from the focus tokens, and it is not the only thing that draws the focus (REQ-024).
  expect(await close.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none')
  await page.keyboard.press('Enter')
  await expect(alert).toHaveCount(0)
})

test('REQ-028 AC2: the close button is at least 24 x 24 px', async ({ page }) => {
  await openDemo(page, 'alert', 'playground')
  const box = (await page.getByRole('button', { name: 'Cerrar aviso' }).boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(24)
  expect(box.height).toBeGreaterThanOrEqual(24)
})

test('REQ-055: the playground changes the type and the icon, and hides the close button', async ({ page }) => {
  await openDemo(page, 'alert', 'playground')
  const icon = page.locator('[data-slot="icon"]')
  const before = await icon.evaluate((el) => el.className)
  await setProps(page, { type: 'error' })
  await expect(page.locator('.cn-alert--error')).toBeVisible()
  expect(await icon.evaluate((el) => el.className)).not.toBe(before)
  await setProps(page, { close: false })
  await expect(page.getByRole('button', { name: 'Cerrar aviso' })).toHaveCount(0)
})

test('REQ-027 AC1: axe is clean in every state and in the playground', async ({ page }) => {
  await openDemo(page, 'alert', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/alert/states' })
  await openDemo(page, 'alert', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/alert/playground' })
  await setProps(page, { type: 'error' })
  await expect(page.locator('.cn-alert--error')).toBeVisible()
  await expectNoA11yViolations(page, { label: '/_demo/alert/playground as an error' })
})
