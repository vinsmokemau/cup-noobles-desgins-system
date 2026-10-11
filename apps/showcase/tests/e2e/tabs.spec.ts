// T8.4 end-to-end checks of the tabs (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028). They run against the isolated demo pages,
// `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and 1280 px in
// navigation.matrix.ts, and their baselines are in navigation.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/tabs.md', import.meta.url)),
  'utf8',
)
const statesOf = () => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const PINK = 'rgb(239, 128, 174)'
const YELLOW = 'rgb(255, 244, 136)'
const tab = (page: Page, name: string) => page.getByRole('tab', { name, exact: true })
// Nuxt UI transitions colors, so the value is read after any running transition has finished.
const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(async (el, names) => {
    getComputedStyle(el).getPropertyValue('color')
    await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => undefined)))
    return Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)]))
  }, properties)

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible', 'selected', 'disabled'])
  await expectStateMatrix(page, 'tabs', statesOf())
})

test('Done when: arrow keys move focus between tabs and select them, and Home and End jump to the ends', async ({
  page,
}) => {
  await openDemo(page, 'tabs', 'playground')
  await expect(page.getByRole('tablist')).toBeVisible()
  await expect(tab(page, 'Reglas')).toHaveAttribute('aria-selected', 'true')

  // One tab stop for the list: Tab enters the selected tab.
  await page.keyboard.press('Tab')
  await expect(tab(page, 'Reglas')).toBeFocused()

  await page.keyboard.press('ArrowRight')
  await expect(tab(page, 'Mesas')).toBeFocused()
  await expect(tab(page, 'Mesas')).toHaveAttribute('aria-selected', 'true')
  await expect(tab(page, 'Reglas')).toHaveAttribute('aria-selected', 'false')
  await expect(page.getByRole('tabpanel')).toHaveText('Hay seis mesas para cuatro personas.')

  await page.keyboard.press('ArrowLeft')
  await expect(tab(page, 'Reglas')).toBeFocused()
  await expect(tab(page, 'Reglas')).toHaveAttribute('aria-selected', 'true')

  // It wraps from the first tab to the last.
  await page.keyboard.press('ArrowLeft')
  await expect(tab(page, 'Torneos')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(tab(page, 'Reglas')).toBeFocused()

  await page.keyboard.press('End')
  await expect(tab(page, 'Torneos')).toBeFocused()
  await expect(tab(page, 'Torneos')).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Home')
  await expect(tab(page, 'Reglas')).toBeFocused()
  await expect(tab(page, 'Reglas')).toHaveAttribute('aria-selected', 'true')
})

test('REQ-027 AC2: Tab moves from the selected tab into its panel, and Shift+Tab goes back', async ({ page }) => {
  await openDemo(page, 'tabs', 'playground')
  await page.keyboard.press('Tab')
  await expect(tab(page, 'Reglas')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('tabpanel')).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(tab(page, 'Reglas')).toBeFocused()
})

test('REQ-027 AC2: a disabled tab cannot be focused, and the arrow keys skip it', async ({ page }) => {
  await openDemo(page, 'tabs', 'playground')
  await setProps(page, { disabledTab: true })
  await expect(tab(page, 'Torneos')).toBeDisabled()
  await page.keyboard.press('Tab')
  await expect(tab(page, 'Reglas')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(tab(page, 'Mesas')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(tab(page, 'Reglas'), 'the arrow keys skip the disabled tab').toBeFocused()
  await page.keyboard.press('End')
  await expect(tab(page, 'Mesas'), 'End goes to the last enabled tab').toBeFocused()
})

test('REQ-027 AC2: a vertical list uses the up and down arrows, and says so with aria-orientation', async ({
  page,
}) => {
  await openDemo(page, 'tabs', 'playground')
  await setProps(page, { orientation: 'vertical' })
  await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
  await page.keyboard.press('Tab')
  await expect(tab(page, 'Reglas')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(tab(page, 'Mesas')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(tab(page, 'Reglas')).toBeFocused()
})

test('ADR-0028: the selected tab is pink and bold with a pink underline, and the others are not', async ({ page }) => {
  await openDemo(page, 'tabs', 'playground')
  const selected = await styleOf(tab(page, 'Reglas'), ['color', 'font-weight'])
  expect(selected.color).toBe(PINK)
  expect(selected['font-weight']).toBe('700')
  const other = await styleOf(tab(page, 'Mesas'), ['color', 'font-weight'])
  expect(other.color).not.toBe(PINK)
  expect(other['font-weight']).not.toBe('700')

  const indicator = page.locator('[data-slot="indicator"]')
  await expect(indicator).toBeVisible()
  const bar = await styleOf(indicator, ['background-color', 'height', 'border-top-left-radius'])
  expect(bar['background-color']).toBe(PINK)
  expect(bar['border-top-left-radius']).toBe('0px')

  // The line is thick as the token says, and its color is the token's.
  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-tabs-active-indicator', 'rgb(1, 2, 3)')
    style.setProperty('--cn-border-width-tabs', '5px')
    style.setProperty('--cn-tabs-rule', 'rgb(4, 5, 6)')
  })
  expect(await styleOf(indicator, ['background-color', 'height'])).toEqual({
    'background-color': 'rgb(1, 2, 3)',
    height: '5px',
  })
  expect(await styleOf(page.getByRole('tablist'), ['border-bottom-color', 'border-bottom-width'])).toEqual({
    'border-bottom-color': 'rgb(4, 5, 6)',
    'border-bottom-width': '5px',
  })
})

test('REQ-024 AC1, AC2: the tab shows the yellow focus ring on the keyboard only', async ({ page }) => {
  await openDemo(page, 'tabs', 'playground')
  const ring = ['outline-style', 'outline-width', 'outline-color', 'outline-offset']
  expect((await styleOf(tab(page, 'Reglas'), ring))['outline-style']).not.toBe('solid')

  await page.keyboard.press('Tab')
  await expect(tab(page, 'Reglas')).toBeFocused()
  expect(await styleOf(tab(page, 'Reglas'), ring)).toEqual({
    'outline-style': 'solid',
    'outline-width': '3px',
    'outline-color': YELLOW,
    'outline-offset': '3px',
  })

  // A mouse click selects a tab without showing the ring.
  await tab(page, 'Mesas').click()
  await expect(tab(page, 'Mesas')).toHaveAttribute('aria-selected', 'true')
  expect((await styleOf(tab(page, 'Mesas'), ring))['outline-style']).not.toBe('solid')
})

test('REQ-028 AC1: the tab list stays inside the page at 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openDemo(page, 'tabs', 'playground')
  const box = await page.getByRole('tablist').boundingBox()
  expect(box!.x + box!.width).toBeLessThanOrEqual(360)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('REQ-027 AC1: axe is clean on both demos', async ({ page }) => {
  await openDemo(page, 'tabs', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/tabs/states' })
  await openDemo(page, 'tabs', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/tabs/playground' })
})
