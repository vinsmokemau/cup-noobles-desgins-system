// T8.4 end-to-end checks of the breadcrumb (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028). They run against the isolated demo
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
  fileURLToPath(new URL('../../../../docs/02-components/molecules/breadcrumb.md', import.meta.url)),
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
// Nuxt UI transitions colors, so the value is read after any running transition has finished.
const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(async (el, names) => {
    getComputedStyle(el).getPropertyValue('color')
    await Promise.all(el.getAnimations().map((animation) => animation.finished.catch(() => undefined)))
    return Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)]))
  }, properties)
const link = (page: Page, name: string) => page.getByRole('link', { name, exact: true })
const current = (page: Page) => page.locator('[aria-current="page"]')

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible'])
  await expectStateMatrix(page, 'breadcrumb', statesOf())
})

test('Done when: the last item is the current page with aria-current, and it is not a link', async ({ page }) => {
  await openDemo(page, 'breadcrumb', 'playground')
  const nav = page.getByRole('navigation', { name: 'breadcrumb' })
  await expect(nav).toBeVisible()
  await expect(nav.getByRole('listitem')).toHaveCount(3)
  await expect(current(page)).toHaveCount(1)
  await expect(current(page)).toHaveText('Dados')
  await expect(current(page)).not.toHaveAttribute('href')
  await expect(page.getByRole('link')).toHaveCount(2)
  await expect(link(page, 'Inicio')).not.toHaveAttribute('aria-current')
})

test('REQ-027: the separators are hidden from assistive technology', async ({ page }) => {
  await openDemo(page, 'breadcrumb', 'playground')
  const separators = page.locator('[data-slot="separator"]')
  await expect(separators).toHaveCount(2)
  for (const separator of await separators.all()) await expect(separator).toHaveAttribute('aria-hidden', 'true')
})

test('ADR-0028: links are pink and underlined, and the current page is plain bold text', async ({ page }) => {
  await openDemo(page, 'breadcrumb', 'playground')
  const linkStyle = await styleOf(link(page, 'Inicio'), ['color', 'text-decoration-line'])
  expect(linkStyle.color).toBe(PINK)
  expect(linkStyle['text-decoration-line']).toBe('underline')
  const currentStyle = await styleOf(current(page), ['color', 'font-weight', 'text-decoration-line'])
  expect(currentStyle.color).not.toBe(PINK)
  expect(currentStyle['font-weight']).toBe('700')
  expect(currentStyle['text-decoration-line']).toBe('none')

  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-breadcrumb-link-fg', 'rgb(1, 2, 3)')
    style.setProperty('--cn-breadcrumb-current-fg', 'rgb(4, 5, 6)')
  })
  expect((await styleOf(link(page, 'Inicio'), ['color'])).color).toBe('rgb(1, 2, 3)')
  expect((await styleOf(current(page), ['color'])).color).toBe('rgb(4, 5, 6)')
})

test('REQ-027 AC2: Tab visits the links in order and skips the current page, and Enter follows a link', async ({
  page,
}) => {
  await openDemo(page, 'breadcrumb', 'playground')
  await page.keyboard.press('Tab')
  await expect(link(page, 'Inicio')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(link(page, 'Juegos')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(current(page), 'the current page is not a tab stop').not.toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(link(page, 'Juegos')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#juegos$/)
})

test('REQ-024 AC1, AC2: the link shows the yellow focus ring on the keyboard only', async ({ page }) => {
  await openDemo(page, 'breadcrumb', 'playground')
  const ring = ['outline-style', 'outline-width', 'outline-color', 'outline-offset']
  expect((await styleOf(link(page, 'Inicio'), ring))['outline-style']).not.toBe('solid')
  await page.keyboard.press('Tab')
  await expect(link(page, 'Inicio')).toBeFocused()
  expect(await styleOf(link(page, 'Inicio'), ring)).toEqual({
    'outline-style': 'solid',
    'outline-width': '3px',
    'outline-color': YELLOW,
    'outline-offset': '3px',
  })
})

test('REQ-028 AC1: a long current page truncates inside the page at 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openDemo(page, 'breadcrumb', 'playground')
  await setProps(page, { current: 'Campeonato regional de juegos de mesa y cartas coleccionables '.repeat(3) })
  await expect(current(page)).toContainText('Campeonato regional')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('REQ-027 AC1: axe is clean on both demos', async ({ page }) => {
  await openDemo(page, 'breadcrumb', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/breadcrumb/states' })
  await openDemo(page, 'breadcrumb', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/breadcrumb/playground' })
})
