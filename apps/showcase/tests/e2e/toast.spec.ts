// T8.3 end-to-end checks of the toast (REQ-020, REQ-026, REQ-027). They run against the isolated demo pages, `states` and
// `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and 1280 px in
// molecules.matrix.ts, and their baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const TITLE = 'Cambios guardados'
const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/toast.md', import.meta.url)),
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
const toastOf = (page: Page, state: string) => cell(page, state).locator('[data-slot="root"]')
// The toaster gives each toast data-slot="base"; a standalone UToast keeps "root".
const toasts = (page: Page) => page.locator('li[data-slot="base"]')
const color = (target: Locator, property: 'borderTopColor' | 'color') =>
  target.evaluate((el, name) => getComputedStyle(el)[name], property)

async function show(page: Page) {
  await page.getByRole('button', { name: 'Mostrar aviso' }).click()
  await expect(page.locator('[data-slot="title"]', { hasText: TITLE })).toBeVisible()
}

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'success', 'warning', 'error', 'focus-visible'])
  await expectStateMatrix(page, 'toast', statesOf())
  for (const state of statesOf()) await expect(toastOf(page, state), state).toBeVisible()
})

test('Done when: the outline and the icon read the feedback token of their type', async ({ page }) => {
  await openDemo(page, 'toast', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-toast-success-color', 'rgb(1, 2, 3)')
    root.setProperty('--cn-toast-warning-color', 'rgb(4, 5, 6)')
    root.setProperty('--cn-toast-error-color', 'rgb(7, 8, 9)')
    root.setProperty('--cn-toast-info-color', 'rgb(10, 11, 12)')
  })
  const expected = {
    success: 'rgb(1, 2, 3)',
    warning: 'rgb(4, 5, 6)',
    error: 'rgb(7, 8, 9)',
    default: 'rgb(10, 11, 12)',
  } as const
  for (const [state, rgb] of Object.entries(expected)) {
    const toast = toastOf(page, state)
    expect(await color(toast, 'borderTopColor'), `${state} outline`).toBe(rgb)
    expect(await color(toast.locator('[data-slot="icon"]'), 'color'), `${state} icon`).toBe(rgb)
  }
})

test('REQ-016: the fill is the black page, no shadow is drawn, and the countdown bar is hidden', async ({ page }) => {
  await openDemo(page, 'toast', 'states')
  const toast = toastOf(page, 'error')
  expect(await toast.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(0, 0, 0)')
  expect(await toast.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none')
  await expect(toast.locator('[data-slot="progress"]')).toBeHidden()
})

test('Done when: a toast opened with useToast is announced by a live region', async ({ page }) => {
  await openDemo(page, 'toast', 'playground')
  await page.getByRole('button', { name: 'Mostrar aviso' }).click()
  // Reka UI renders the announcer as a visually hidden `role="alert"` element with `aria-live` (assertive for a foreground toast).
  const live = page.locator('[role="alert"][aria-live]')
  await expect(live.filter({ hasText: TITLE })).toHaveCount(1)
  const politeness = await live.filter({ hasText: TITLE }).getAttribute('aria-live')
  expect(['polite', 'assertive']).toContain(politeness)
  // The toast itself is in the viewport, a labelled region.
  await expect(page.getByRole('region', { name: /Notifications|Notificaciones/ })).toHaveCount(1)
  await expect(page.locator('[data-slot="title"]', { hasText: TITLE })).toBeVisible()
})

test('REQ-027 AC2: F8 moves focus to the viewport, and Escape closes the focused toast', async ({ page }) => {
  await openDemo(page, 'toast', 'playground')
  await show(page)
  await page.keyboard.press('F8')
  await page.keyboard.press('Tab')
  await expect(toasts(page).first()).toBeFocused()
  expect(
    await toasts(page)
      .first()
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe('none')
  await page.keyboard.press('Escape')
  await expect(toasts(page)).toHaveCount(0)
})

test('REQ-027 AC2: Tab moves from the page to the toast, and axe finds no focusable aria-hidden element', async ({
  page,
}) => {
  await openDemo(page, 'toast', 'playground')
  await show(page)
  await page.getByRole('button', { name: 'Mostrar aviso' }).focus()
  await page.keyboard.press('Tab')
  await expect(toasts(page).first()).toBeFocused()
  await expect(page.locator('[role="region"] > span[aria-hidden="true"]').first()).toBeHidden()
})
test('REQ-027 AC2: the close button is named, is at least 24 x 24 px, and closes the toast on Enter', async ({
  page,
}) => {
  await openDemo(page, 'toast', 'playground')
  await show(page)
  const close = page.getByRole('button', { name: 'Cerrar aviso' })
  const box = (await close.boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(24)
  expect(box.height).toBeGreaterThanOrEqual(24)
  await close.focus()
  await page.keyboard.press('Enter')
  await expect(toasts(page)).toHaveCount(0)
})

test('Usage rule: a toast with an action stays open past the default duration', async ({ page }) => {
  await openDemo(page, 'toast', 'playground')
  await setProps(page, { action: true })
  await show(page)
  await expect(page.getByRole('button', { name: 'Deshacer' })).toBeVisible()
  await page.waitForTimeout(6000)
  await expect(page.locator('[data-slot="title"]', { hasText: TITLE })).toBeVisible()
})

test('REQ-055: the playground changes the type and the icon of the toast it opens', async ({ page }) => {
  await openDemo(page, 'toast', 'playground')
  await setProps(page, { type: 'error', title: 'No pudimos guardar' })
  await page.getByRole('button', { name: 'Mostrar aviso' }).click()
  await expect(page.locator('.cn-toast--error [data-slot="title"]', { hasText: 'No pudimos guardar' })).toBeVisible()
})

test('REQ-027 AC1: axe is clean in every state and with a toast open', async ({ page }) => {
  await openDemo(page, 'toast', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/toast/states' })
  await openDemo(page, 'toast', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/toast/playground' })
  await show(page)
  await expectNoA11yViolations(page, { label: '/_demo/toast/playground with a toast open' })
})
