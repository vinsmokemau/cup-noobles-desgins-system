// T8.2 end-to-end checks of the featured media card (REQ-020, REQ-025, REQ-026, REQ-027, REQ-028, ADR-0026). They run against
// the isolated demo pages, `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at
// 360, 768, and 1280 px in molecules.matrix.ts, and the baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/media-card.md', import.meta.url)),
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
const YELLOW = 'rgb(255, 244, 136)'
const card = (page: Page, state = 'default') => page.locator(`[data-state="${state}"] .cn-media-card`)

const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(
    (el, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)])),
    properties,
  )

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible', 'active'])
  await expectStateMatrix(page, 'media-card', statesOf())
})

test('REQ-025 AC2: the thumbnail, the title, and the tag badges render', async ({ page }) => {
  await openDemo(page, 'media-card', 'states')
  const target = card(page)
  const image = target.locator('img')
  await expect(image).toBeVisible()
  await expect(image).toHaveAttribute('alt', 'Un dado de veinte caras dorado')
  expect(await image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
  await expect(target.getByRole('heading', { name: 'Noche de juegos de mesa' })).toBeVisible()
  const tags = target.locator('.cn-badge--tag')
  await expect(tags).toHaveText(['Anime', 'Cartas'])
})

test('REQ-025 AC2: a decorative thumbnail is hidden from assistive technology', async ({ page }) => {
  await openDemo(page, 'media-card', 'playground')
  await setProps(page, { decorative: true })
  const image = page.locator('.cn-media-card img')
  await expect(image).toHaveAttribute('alt', '')
  await expect(image).toHaveAttribute('aria-hidden', 'true')
  await expectNoA11yViolations(page, { label: '/_demo/media-card/playground (decorative)' })
})

test('REQ-025 AC3, C-05: the card renders on color.bg.base with the pink outline and no glow, from the tokens', async ({
  page,
}) => {
  await openDemo(page, 'media-card', 'states')
  const target = card(page)
  const properties = ['background-color', 'border-top-color', 'border-top-style', 'box-shadow']
  expect(await styleOf(target, properties)).toEqual({
    'background-color': BLACK,
    'border-top-color': PINK,
    'border-top-style': 'solid',
    'box-shadow': 'none',
  })
  // The surface token does not move the fill.
  await page.evaluate(() => document.documentElement.style.setProperty('--cn-color-surface-card', 'rgb(200, 0, 0)'))
  expect((await styleOf(target, ['background-color']))['background-color']).toBe(BLACK)
  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-media-card-highlight', 'rgb(1, 2, 3)')
    style.setProperty('--cn-media-card-divider', 'rgb(4, 5, 6)')
    style.setProperty('--cn-radius-media-card', '11px')
    style.setProperty('--cn-border-width-media-card', '5px')
  })
  expect(
    await styleOf(target, ['border-top-color', 'border-top-width', 'border-top-left-radius', 'box-shadow']),
  ).toEqual({
    'border-top-color': 'rgb(1, 2, 3)',
    'border-top-width': '5px',
    'border-top-left-radius': '11px',
    'box-shadow': 'none',
  })
  const thumbnail = target.locator('.cn-media-card__thumbnail')
  expect(await styleOf(thumbnail, ['border-bottom-color', 'border-bottom-width'])).toEqual({
    'border-bottom-color': 'rgb(4, 5, 6)',
    'border-bottom-width': '5px',
  })
})

test('REQ-025 AC4: a linked card has exactly one tab stop, and its accessible name is its title', async ({ page }) => {
  await openDemo(page, 'media-card', 'playground')
  const target = page.locator('.cn-media-card')
  await expect(target.locator('a, button, input, select, textarea, [tabindex]')).toHaveCount(1)
  const link = page.getByRole('link', { name: 'Noche de juegos de mesa', exact: true })
  await expect(link).toHaveCount(1)
  // One Tab reaches the link; the next Tab leaves the card.
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(link).not.toBeFocused()
  expect(await target.evaluate((el) => el.contains(document.activeElement))).toBe(false)
  // The whole card is the hit area: a point over the thumbnail, and one over the tags, both land on the link.
  const hits = await page.evaluate(() => {
    const at = (selector: string) => {
      const part = document.querySelector(selector)!
      part.scrollIntoView({ block: 'center' })
      const box = part.getBoundingClientRect()
      return document
        .elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
        ?.closest('a')
        ?.textContent?.trim()
    }
    return [at('.cn-media-card__thumbnail'), at('.cn-media-card__tags')]
  })
  expect(hits).toEqual(['Noche de juegos de mesa', 'Noche de juegos de mesa'])
})

test('REQ-025 AC4: a card that is not linked has no focusable element', async ({ page }) => {
  await openDemo(page, 'media-card', 'playground')
  await setProps(page, { linked: false })
  const target = page.locator('.cn-media-card')
  await expect(target.locator('a, button, input, select, textarea, [tabindex]')).toHaveCount(0)
  await expect(target.getByRole('heading', { name: 'Noche de juegos de mesa' })).toBeVisible()
  await page.keyboard.press('Tab')
  expect(await target.evaluate((el) => el.contains(document.activeElement))).toBe(false)
})

test('REQ-024: the keyboard focus ring surrounds the whole card, and a mouse click shows none', async ({ page }) => {
  await openDemo(page, 'media-card', 'playground')
  const target = page.locator('.cn-media-card')
  const ring = ['outline-color', 'outline-style', 'outline-width']
  expect((await styleOf(target, ['outline-style']))['outline-style']).toBe('none')
  await page.keyboard.press('Tab')
  const focused = await styleOf(target, ring)
  expect(focused['outline-color']).toBe(YELLOW)
  expect(focused['outline-style']).toBe('solid')
  expect(Number.parseFloat(focused['outline-width']!)).toBeGreaterThan(0)
  // The ring is not the glow (REQ-024 AC1).
  expect((await styleOf(target, ['box-shadow']))['box-shadow']).toBe('none')
  await page.evaluate(() => (document.activeElement as HTMLElement).blur())
  // The link covers the thumbnail, so a click lands on it. The page does not follow it here, so the card stays to inspect.
  await page.evaluate(() => document.addEventListener('click', (event) => event.preventDefault()))
  await target.locator('.cn-media-card__thumbnail').click({ force: true })
  await expect(page.locator('.cn-media-card__link')).toBeFocused()
  expect((await styleOf(target, ['outline-style']))['outline-style']).toBe('none')
})

test('REQ-026: hover underlines the title without changing its color', async ({ page }) => {
  await openDemo(page, 'media-card', 'playground')
  const link = page.locator('.cn-media-card__link')
  const before = await styleOf(link, ['text-decoration-line', 'color'])
  expect(before['text-decoration-line']).toBe('none')
  await page.locator('.cn-media-card').hover()
  const after = await styleOf(link, ['text-decoration-line', 'color'])
  expect(after['text-decoration-line']).toBe('underline')
  expect(after.color).toBe(before.color)
})

test('REQ-055: the playground title and tags follow the controls', async ({ page }) => {
  await openDemo(page, 'media-card', 'playground')
  const target = page.locator('.cn-media-card')
  await expect(target.locator('.cn-badge--tag')).toHaveCount(2)
  await setProps(page, { title: 'Torneo de cartas', tagCount: 4 })
  await expect(target.getByRole('heading', { name: 'Torneo de cartas' })).toBeVisible()
  await expect(target.locator('.cn-badge--tag')).toHaveCount(4)
})

test('REQ-028 AC1: a long title wraps inside the card at 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openDemo(page, 'media-card', 'playground')
  await setProps(page, {
    title: 'Campeonato regional de juegos de mesa y cartas coleccionables '.repeat(3),
    tagCount: 5,
  })
  const target = page.locator('.cn-media-card')
  await expect(target.locator('.cn-media-card__link')).toContainText('Campeonato regional')
  const box = (await target.boundingBox())!
  expect(box.x + box.width).toBeLessThanOrEqual(360)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  // An unbroken word does not overflow either.
  await setProps(page, { title: 'Superlargapalabrasinningunespacioquedebeajustarseaanchodelacartaenpantallaspequeñas' })
  const wide = (await target.boundingBox())!
  expect(wide.x + wide.width).toBeLessThanOrEqual(360)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('REQ-027 AC1: axe is clean on both demos', async ({ page }) => {
  await openDemo(page, 'media-card', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/media-card/states' })
  await openDemo(page, 'media-card', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/media-card/playground' })
})
