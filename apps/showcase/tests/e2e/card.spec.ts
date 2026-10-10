// T8.1 end-to-end checks of the standard card (REQ-020, REQ-025, REQ-026, REQ-027, REQ-028). They run against the isolated
// demo pages, `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and
// 1280 px in card.matrix.ts, and their baselines are in card.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/card.md', import.meta.url)),
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

const BLACK = 'rgb(0, 0, 0)'
const PINK = 'rgb(239, 128, 174)'
const root = (page: Page) => page.locator('[data-state="default"] [data-slot="root"]')

const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(
    (el, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)])),
    properties,
  )

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default'])
  await expectStateMatrix(page, 'card', statesOf())
  await expect(root(page)).toBeVisible()
})

test('REQ-025 AC1: the card shows its header, body, and footer slots', async ({ page }) => {
  await openDemo(page, 'card', 'states')
  const card = root(page)
  for (const slot of ['header', 'body', 'footer'])
    await expect(card.locator(`[data-slot="${slot}"]`), slot).toBeVisible()
  await expect(card.locator('[data-slot="header"]')).toHaveText('Noche de juegos')
  await expect(card.locator('[data-slot="footer"]')).toHaveText('Viernes a las 7 p. m.')
})

test('REQ-025 AC3, C-05: the card renders on color.bg.base, and the surface token does not change it', async ({
  page,
}) => {
  await openDemo(page, 'card', 'states')
  expect((await styleOf(root(page), ['background-color']))['background-color']).toBe(BLACK)
  await page.evaluate(() => document.documentElement.style.setProperty('--cn-color-surface-card', 'rgb(200, 0, 0)'))
  expect((await styleOf(root(page), ['background-color']))['background-color']).toBe(BLACK)
  // Only the card bg token moves the fill.
  await page.evaluate(() => document.documentElement.style.setProperty('--cn-card-bg', 'rgb(13, 14, 15)'))
  expect((await styleOf(root(page), ['background-color']))['background-color']).toBe('rgb(13, 14, 15)')
})

test('REQ-025 AC3: the pink outline, the dividers, the radius, and the stroke come from the tokens, with no glow', async ({
  page,
}) => {
  await openDemo(page, 'card', 'states')
  const properties = [
    'border-top-color',
    'border-top-style',
    'border-top-width',
    'border-top-left-radius',
    'box-shadow',
  ]
  const base = await styleOf(root(page), properties)
  expect(base['border-top-color']).toBe(PINK)
  expect(base['border-top-style']).toBe('solid')
  expect(base['box-shadow']).toBe('none')
  const header = root(page).locator('[data-slot="header"]')
  expect((await styleOf(header, ['border-bottom-color', 'border-bottom-style']))['border-bottom-color']).toBe(PINK)

  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-card-highlight', 'rgb(1, 2, 3)')
    style.setProperty('--cn-card-divider', 'rgb(4, 5, 6)')
    style.setProperty('--cn-radius-card', '11px')
    style.setProperty('--cn-border-width-card', '5px')
  })
  expect(await styleOf(root(page), properties)).toEqual({
    'border-top-color': 'rgb(1, 2, 3)',
    'border-top-style': 'solid',
    'border-top-width': '5px',
    'border-top-left-radius': '11px',
    'box-shadow': 'none',
  })
  expect(await styleOf(header, ['border-bottom-color', 'border-bottom-width'])).toEqual({
    'border-bottom-color': 'rgb(4, 5, 6)',
    'border-bottom-width': '5px',
  })
  // Every part but the last has the divider under it, in the divider token's color.
  const body = root(page).locator('[data-slot="body"]')
  expect(await styleOf(body, ['border-bottom-color', 'border-bottom-width'])).toEqual({
    'border-bottom-color': 'rgb(4, 5, 6)',
    'border-bottom-width': '5px',
  })
  // The last part has no divider under it.
  const footer = root(page).locator('[data-slot="footer"]')
  expect((await styleOf(footer, ['border-bottom-width']))['border-bottom-width']).toBe('0px')
})

test('REQ-027: the card is not focusable and adds no role or tab stop', async ({ page }) => {
  await openDemo(page, 'card', 'states')
  const card = root(page)
  await expect(card).not.toHaveAttribute('role')
  await expect(card).not.toHaveAttribute('tabindex')
  await expect(card.locator('a, button, input, [tabindex]')).toHaveCount(0)
  await page.keyboard.press('Tab')
  await expect(card).not.toBeFocused()
})

test('REQ-055: the playground title, description, and footer follow the controls', async ({ page }) => {
  await openDemo(page, 'card', 'playground')
  const card = page.locator('[data-slot="root"]')
  await expect(card.locator('[data-slot="title"]')).toHaveText('Noche de juegos')
  await expect(card.locator('[data-slot="footer"]')).toBeVisible()
  await setProps(page, { title: 'Torneo de cartas', description: 'Inscripción abierta.', footer: false })
  await expect(card.locator('[data-slot="title"]')).toHaveText('Torneo de cartas')
  await expect(card.locator('[data-slot="description"]')).toHaveText('Inscripción abierta.')
  await expect(card.locator('[data-slot="footer"]')).toHaveCount(0)
})

test('REQ-028 AC1: a long title wraps inside the card at 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openDemo(page, 'card', 'playground')
  await setProps(page, { title: 'Campeonato regional de juegos de mesa y cartas coleccionables '.repeat(3) })
  const card = page.locator('[data-slot="root"]')
  await expect(card.locator('[data-slot="title"]')).toContainText('Campeonato regional')
  const box = await card.boundingBox()
  expect(box!.x + box!.width).toBeLessThanOrEqual(360)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('REQ-027 AC1: axe is clean on both demos', async ({ page }) => {
  await openDemo(page, 'card', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/card/states' })
  await openDemo(page, 'card', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/card/playground' })
})
