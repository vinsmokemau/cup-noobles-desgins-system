// T8.1 end-to-end checks of the form field (REQ-020, REQ-026, REQ-027). They run against the isolated demo pages, `states`
// and `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and 1280 px in
// form-field.matrix.ts, and their baselines are in form-field.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const ERROR_TEXT = 'Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.'
const HELP_TEXT = 'Lo usamos solo para avisarte.'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/form-field.md', import.meta.url)),
  'utf8',
)
/** The `default`, `hover`, ... rows of the States table of the doc. */
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
const control = (page: Page, state: string) => cell(page, state).getByRole('textbox')
const playgroundControl = (page: Page) => page.getByRole('textbox', { name: 'Correo electrónico' })

/** Every id named by aria-describedby of a control exists in the page, and the described text is what is shown. */
async function describedIds(target: Locator): Promise<string[]> {
  return ((await target.getAttribute('aria-describedby')) ?? '').split(/\s+/).filter(Boolean)
}

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible', 'disabled', 'error'])
  await expectStateMatrix(page, 'form-field', statesOf())
  for (const state of statesOf()) await expect(control(page, state), state).toBeVisible()
})

test('Done when: the label names the control, and clicking the label focuses it', async ({ page }) => {
  await openDemo(page, 'form-field', 'playground')
  const label = page.locator('label', { hasText: 'Correo electrónico' })
  const target = playgroundControl(page)
  await expect(label).toHaveAttribute('for', (await target.getAttribute('id'))!)
  await label.click()
  await expect(target).toBeFocused()
})

test('Done when: the help text is linked to the control with aria-describedby, and aria-invalid is false', async ({
  page,
}) => {
  await openDemo(page, 'form-field', 'states')
  const target = control(page, 'default')
  await expect(target).toHaveAttribute('aria-invalid', 'false')
  const ids = await describedIds(target)
  expect(ids).toHaveLength(1)
  await expect(page.locator(`[id="${ids[0]}"]`)).toHaveText(HELP_TEXT)
  await expect(target).toHaveAccessibleDescription(HELP_TEXT)
})

test('Done when: the error is linked to the control, replaces the help, and has an icon that is not announced', async ({
  page,
}) => {
  await openDemo(page, 'form-field', 'states')
  const target = control(page, 'error')
  await expect(target).toHaveAttribute('aria-invalid', 'true')
  const ids = await describedIds(target)
  expect(ids).toHaveLength(1)
  const message = page.locator(`[id="${ids[0]}"]`)
  await expect(message).toHaveText(ERROR_TEXT)
  await expect(target).toHaveAccessibleDescription(ERROR_TEXT)
  await expect(message.locator('[aria-hidden="true"]')).toHaveCount(1)
  await expect(page.getByRole('textbox', { name: 'Correo electrónico' })).toHaveCount(5)
  // The help text is not shown next to an error.
  await expect(cell(page, 'error').getByText(HELP_TEXT)).toHaveCount(0)
})

test('every id that aria-describedby names exists in the page, in every cell', async ({ page }) => {
  await openDemo(page, 'form-field', 'states')
  for (const state of statesOf()) {
    for (const id of await describedIds(control(page, state)))
      await expect(page.locator(`[id="${id}"]`), `${state}: #${id}`).toHaveCount(1)
  }
})

test('REQ-027 AC2: Tab focuses the control, and Shift+Tab leaves it', async ({ page }) => {
  await openDemo(page, 'form-field', 'playground')
  const target = playgroundControl(page)
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.type('mau@ejemplo.mx')
  await expect(target).toHaveValue('mau@ejemplo.mx')
  await page.keyboard.press('Shift+Tab')
  await expect(target).not.toBeFocused()
})

test('REQ-027 AC2: Tab skips a disabled control', async ({ page }) => {
  await openDemo(page, 'form-field', 'playground')
  await setProps(page, { disabled: true })
  const target = playgroundControl(page)
  await expect(target).toBeDisabled()
  await page.keyboard.press('Tab')
  await expect(target).not.toBeFocused()
})

test('REQ-055: the playground shows the error only when error is set, and marks a required field', async ({ page }) => {
  await openDemo(page, 'form-field', 'playground')
  const target = playgroundControl(page)
  await expect(target).toHaveAttribute('aria-invalid', 'false')
  await expect(target).toHaveAccessibleDescription(HELP_TEXT)
  await setProps(page, { error: true })
  await expect(target).toHaveAttribute('aria-invalid', 'true')
  await expect(target).toHaveAccessibleDescription(ERROR_TEXT)
  await setProps(page, { error: false, required: true })
  const afterLabel = await page
    .locator('label')
    .first()
    .evaluate((el) => getComputedStyle(el, '::after').content)
  expect(afterLabel).toBe('"*"')
})

test('REQ-016: the label, help, and error colors come from the form field tokens', async ({ page }) => {
  await openDemo(page, 'form-field', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-form-field-label-fg', 'rgb(1, 2, 3)')
    root.setProperty('--cn-form-field-help-fg', 'rgb(4, 5, 6)')
    root.setProperty('--cn-form-field-error-fg', 'rgb(7, 8, 9)')
  })
  const color = (target: Locator) => target.evaluate((el) => getComputedStyle(el).color)
  expect(await color(cell(page, 'default').locator('[data-slot="label"]'))).toBe('rgb(1, 2, 3)')
  expect(await color(cell(page, 'default').locator('[data-slot="help"]'))).toBe('rgb(4, 5, 6)')
  expect(await color(cell(page, 'error').locator('[data-slot="error"]'))).toBe('rgb(7, 8, 9)')
})

test('REQ-027 AC1: axe is clean in every state, including the error state', async ({ page }) => {
  await openDemo(page, 'form-field', 'states')
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSTransition).length))
    .toBe(0)
  await expectNoA11yViolations(page, { label: '/_demo/form-field/states' })
  await openDemo(page, 'form-field', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/form-field/playground' })
  await setProps(page, { error: true })
  await expect(playgroundControl(page)).toHaveAttribute('aria-invalid', 'true')
  await expectNoA11yViolations(page, { label: '/_demo/form-field/playground with error' })
})
