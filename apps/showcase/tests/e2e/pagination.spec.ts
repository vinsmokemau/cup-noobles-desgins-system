// T8.4 end-to-end checks of the pagination (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028). They run against the isolated demo
// pages, `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and
// 1280 px in navigation.matrix.ts, and their baselines are in navigation.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/pagination.md', import.meta.url)),
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
const BLACK = 'rgb(0, 0, 0)'
const YELLOW = 'rgb(255, 244, 136)'
// Nuxt UI transitions colors, so the value is read after any running transition has finished.
const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(async (el, names) => {
    getComputedStyle(el).getPropertyValue('color')
    await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => undefined)))
    return Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)]))
  }, properties)
const pageButton = (page: Page, number: number) => page.getByRole('button', { name: `Página ${number}`, exact: true })
const previous = (page: Page) => page.getByRole('button', { name: 'Página anterior', exact: true })
const next = (page: Page) => page.getByRole('button', { name: 'Página siguiente', exact: true })

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible', 'selected', 'disabled'])
  await expectStateMatrix(page, 'pagination', statesOf())
})

test('Done when: the current page is marked aria-current, and only one page is', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  await expect(page.locator('[aria-current="page"]')).toHaveCount(1)
  await expect(pageButton(page, 2)).toHaveAttribute('aria-current', 'page')
  await expect(pageButton(page, 3)).not.toHaveAttribute('aria-current')
})

test('ADR-0028: the current page is a pink chip with a black bold number, and the others are an outline with no glow', async ({
  page,
}) => {
  await openDemo(page, 'pagination', 'playground')
  const chip = await styleOf(pageButton(page, 2), [
    'background-color',
    'color',
    'border-top-color',
    'font-weight',
    'box-shadow',
  ])
  expect(chip).toEqual({
    'background-color': PINK,
    color: BLACK,
    'border-top-color': PINK,
    'font-weight': '700',
    'box-shadow': 'none',
  })
  const other = await styleOf(pageButton(page, 3), [
    'background-color',
    'border-top-color',
    'border-top-style',
    'box-shadow',
  ])
  expect(other['background-color']).toBe('rgba(0, 0, 0, 0)')
  expect(other['border-top-color']).not.toBe(PINK)
  expect(other['border-top-style']).toBe('solid')
  expect(other['box-shadow']).toBe('none')

  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-pagination-current-bg', 'rgb(1, 2, 3)')
    style.setProperty('--cn-pagination-current-fg', 'rgb(4, 5, 6)')
    style.setProperty('--cn-radius-pagination', '9px')
    style.setProperty('--cn-border-width-pagination', '4px')
  })
  const changed = await styleOf(pageButton(page, 2), [
    'background-color',
    'color',
    'border-top-left-radius',
    'border-top-width',
  ])
  expect(changed).toEqual({
    'background-color': 'rgb(1, 2, 3)',
    color: 'rgb(4, 5, 6)',
    'border-top-left-radius': '9px',
    'border-top-width': '4px',
  })
})

test('ADR-0028: a page that is not current gets a pink outline on hover', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  await pageButton(page, 4).hover()
  expect((await styleOf(pageButton(page, 4), ['border-top-color']))['border-top-color']).toBe(PINK)
})

test('REQ-027 AC2: Enter and Space go to the focused page, and aria-current follows', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  await pageButton(page, 3).focus()
  await page.keyboard.press('Enter')
  await expect(pageButton(page, 3)).toHaveAttribute('aria-current', 'page')
  await expect(pageButton(page, 2)).not.toHaveAttribute('aria-current')
  await next(page).focus()
  await page.keyboard.press('Space')
  await expect(pageButton(page, 4)).toHaveAttribute('aria-current', 'page')
  await previous(page).focus()
  await page.keyboard.press('Enter')
  await expect(pageButton(page, 3)).toHaveAttribute('aria-current', 'page')
})

test('REQ-027 AC2: Tab moves through the controls in order, previous to next', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  await page.keyboard.press('Tab')
  await expect(previous(page)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(pageButton(page, 1)).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(previous(page)).toBeFocused()
})

test('REQ-027 AC2: the previous control is disabled on the first page and skipped by Tab', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  await pageButton(page, 1).click()
  await expect(pageButton(page, 1)).toHaveAttribute('aria-current', 'page')
  await expect(previous(page)).toBeDisabled()
  await page.keyboard.press('Shift+Tab')
  await expect(previous(page)).not.toBeFocused()
})

test('REQ-027 AC2: a disabled pagination disables every control', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  await setProps(page, { disabled: true })
  await expect(previous(page)).toBeDisabled()
  await expect(next(page)).toBeDisabled()
  await expect(pageButton(page, 3)).toBeDisabled()
  await page.keyboard.press('Tab')
  await expect(pageButton(page, 3)).not.toBeFocused()
})

test('REQ-024 AC1, AC2: a page shows the yellow focus ring on the keyboard only', async ({ page }) => {
  await openDemo(page, 'pagination', 'playground')
  const ring = ['outline-style', 'outline-width', 'outline-color', 'outline-offset']
  await page.keyboard.press('Tab')
  await expect(previous(page)).toBeFocused()
  expect(await styleOf(previous(page), ring)).toEqual({
    'outline-style': 'solid',
    'outline-width': '3px',
    'outline-color': YELLOW,
    'outline-offset': '3px',
  })
  await pageButton(page, 4).click()
  expect((await styleOf(pageButton(page, 4), ring))['outline-style']).not.toBe('solid')
})

test('REQ-028 AC1: a long list wraps inside the page at 360 px, and every target is at least 24 px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openDemo(page, 'pagination', 'playground')
  await setProps(page, { total: 900 })
  await expect(pageButton(page, 2)).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  for (const button of await page.getByRole('button').all()) {
    const box = await button.boundingBox()
    expect(box!.width).toBeGreaterThanOrEqual(24)
    expect(box!.height).toBeGreaterThanOrEqual(24)
  }
})

test('REQ-027 AC1: axe is clean on both demos', async ({ page }) => {
  await openDemo(page, 'pagination', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/pagination/states' })
  await openDemo(page, 'pagination', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/pagination/playground' })
})
