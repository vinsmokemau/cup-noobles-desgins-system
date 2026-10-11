// T8.6 end-to-end checks of the site header and the site footer (REQ-020, REQ-022, REQ-026, REQ-027, REQ-028, REQ-061). They run
// against the isolated demo pages, `states` and `playground`, in the `functional` project, which sets the width of each test
// itself: the header is checked at 360 and 1280 px (the task's "Done when"). The `playground` header opens its mobile menu in
// the page portal, as an app does, so the focus trap, Escape, and the restored focus are the real behavior. The same pages are
// audited at 360, 768, and 1280 px in molecules.matrix.ts, and the baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const PINK = 'rgb(239, 128, 174)'
const BLACK = 'rgb(0, 0, 0)'
const NARROW = { width: 360, height: 800 }
const WIDE = { width: 1280, height: 800 }

const docOf = (slug: string) =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/02-components/organisms/${slug}.md`, import.meta.url)), 'utf8')
const statesOf = (slug: string) => {
  const doc = docOf(slug)
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(
    (el, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)])),
    properties,
  )

async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const toggle = (page: Page) => page.locator('[data-slot="toggle"]').first()
const menu = (page: Page) => page.getByRole('dialog')
const banner = (page: Page) => page.getByRole('banner')
const centerNav = (page: Page) => page.getByRole('navigation', { name: 'Principal' })

test.describe('site-header', () => {
  test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
    expect(statesOf('site-header')).toEqual(['default'])
    await expectStateMatrix(page, 'site-header', statesOf('site-header'))
    await expect(page.locator('[data-state="default"] header')).toBeVisible()
  })

  test('ADR-0030: the header is an opaque black bar with a thick pink line under it, and no glow', async ({ page }) => {
    await openDemo(page, 'site-header', 'playground')
    const style = await styleOf(banner(page), [
      'background-color',
      'border-bottom-color',
      'border-bottom-style',
      'border-top-width',
      'backdrop-filter',
      'box-shadow',
      'position',
    ])
    expect(style['background-color']).toBe(BLACK)
    expect(style['border-bottom-color']).toBe(PINK)
    expect(style['border-bottom-style']).toBe('solid')
    expect(style['border-top-width']).toBe('0px')
    expect(style['backdrop-filter']).toBe('none')
    expect(style['box-shadow']).toBe('none')
    // Nuxt UI's own behavior is kept: the header sticks to the top of the page.
    expect(style.position).toBe('sticky')
  })

  test('REQ-028, REQ-061: at 1280 px the navigation is in the bar and the menu toggle is hidden', async ({ page }) => {
    await page.setViewportSize(WIDE)
    await openDemo(page, 'site-header', 'playground')
    await expect(centerNav(page)).toBeVisible()
    await expect(toggle(page)).toBeHidden()
    await expectNoHorizontalOverflow(page, 'site-header at 1280 px')
  })

  test('REQ-028, REQ-061: at 360 px the navigation moves behind the toggle, and nothing overflows', async ({
    page,
  }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await expect(centerNav(page)).toBeHidden()
    await expect(toggle(page)).toBeVisible()
    await expect(toggle(page)).toHaveAccessibleName('Open menu')
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
    await expectNoHorizontalOverflow(page, 'site-header at 360 px')
    const box = (await toggle(page).boundingBox())!
    expect(box.width, 'toggle width').toBeGreaterThanOrEqual(24)
    expect(box.height, 'toggle height').toBeGreaterThanOrEqual(24)
  })

  test('REQ-027 AC2: Enter on the toggle opens the menu as a dialog named by its title, and Escape closes it', async ({
    page,
  }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toBeVisible()
    await expect(menu(page)).toHaveAccessibleName('Menú')
    await expect(menu(page)).toHaveAccessibleDescription('Navegación del sitio.')
    await expect(menu(page).getByRole('link', { name: 'Juegos' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu(page)).toHaveCount(0)
    await expect(toggle(page)).toBeFocused()
  })

  test('REQ-027 AC2: Space on the toggle opens the menu', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Space')
    await expect(menu(page)).toBeVisible()
  })

  test('REQ-027 AC2: Tab and Shift+Tab stay inside the open menu', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toBeVisible()
    const inside = () =>
      page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]')
        return !!dialog && dialog.contains(document.activeElement)
      })
    await expect.poll(inside).toBe(true)
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      expect(await inside(), `Tab ${i + 1} stays in the menu`).toBe(true)
    }
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Shift+Tab')
      expect(await inside(), `Shift+Tab ${i + 1} stays in the menu`).toBe(true)
    }
  })

  test('REQ-027 AC2: Enter on the close toggle inside the menu closes it, and focus returns', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toBeVisible()
    const close = menu(page).getByRole('button', { name: 'Close menu' })
    await close.focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toHaveCount(0)
    await expect(toggle(page)).toBeFocused()
  })

  test('the page behind the open menu is hidden from assistive technology and cannot be clicked', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toBeVisible()
    const link = page.getByTestId('page-link')
    expect(await link.evaluate((el) => !!el.closest('[aria-hidden="true"]'))).toBe(true)
    expect(
      await link.evaluate((el) => {
        const box = el.getBoundingClientRect()
        const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
        return !!hit && !el.contains(hit)
      }),
    ).toBe(true)
  })

  test('REQ-020: the menu is the overlay look, with the pink outline and the dimmed backdrop', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toBeVisible()
    const style = await styleOf(menu(page), ['border-top-color', 'background-color'])
    expect(style['border-top-color']).toBe(PINK)
    expect(style['background-color']).toBe(BLACK)
  })

  test('REQ-055: the toggleSide control moves the toggle before the title', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    const title = page.locator('[data-slot="title"]').first()
    expect((await toggle(page).boundingBox())!.x).toBeGreaterThan((await title.boundingBox())!.x)
    await setProps(page, { toggleSide: 'left' })
    await expect.poll(async () => (await toggle(page).boundingBox())!.x < (await title.boundingBox())!.x).toBe(true)
  })

  test('REQ-027 AC1: axe reports no violation with the menu open', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-header', 'playground')
    await toggle(page).focus()
    await page.keyboard.press('Enter')
    await expect(menu(page)).toBeVisible()
    await expectNoA11yViolations(page, { label: 'site-header with the menu open' })
  })
})

test.describe('site-footer', () => {
  test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
    expect(statesOf('site-footer')).toEqual(['default'])
    await expectStateMatrix(page, 'site-footer', statesOf('site-footer'))
    await expect(page.locator('[data-state="default"] footer')).toBeVisible()
  })

  test('ADR-0030: the footer is a black bar with a thick pink line above it, and no glow', async ({ page }) => {
    await openDemo(page, 'site-footer', 'playground')
    const footer = page.getByRole('contentinfo')
    const style = await styleOf(footer, [
      'background-color',
      'border-top-color',
      'border-top-style',
      'border-bottom-width',
      'box-shadow',
    ])
    expect(style['background-color']).toBe(BLACK)
    expect(style['border-top-color']).toBe(PINK)
    expect(style['border-top-style']).toBe('solid')
    expect(style['border-bottom-width']).toBe('0px')
    expect(style['box-shadow']).toBe('none')
  })

  test('REQ-028 AC1: the footer parts fit at 360 px and sit in one row at 1280 px', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await openDemo(page, 'site-footer', 'playground')
    await expectNoHorizontalOverflow(page, 'site-footer at 360 px')
    const left = page.getByText('© 2026 Cup Noobles')
    const right = page.getByRole('button', { name: 'Contacto' })
    // The parts stack: they never share a row (the action comes first in the source order, below lg).
    expect(
      Math.abs((await right.boundingBox())!.y - (await left.boundingBox())!.y),
      'stacked at 360 px',
    ).toBeGreaterThan(24)
    await page.setViewportSize(WIDE)
    await expectNoHorizontalOverflow(page, 'site-footer at 1280 px')
    await expect
      .poll(async () => Math.abs((await right.boundingBox())!.y - (await left.boundingBox())!.y) < 24, {
        message: 'one row at 1280 px',
      })
      .toBe(true)
  })

  test('REQ-055: the text control changes the footer text', async ({ page }) => {
    await openDemo(page, 'site-footer', 'playground')
    await setProps(page, { text: 'Hecho con cariño' })
    await expect(page.getByRole('contentinfo')).toContainText('Hecho con cariño')
  })

  test('REQ-027 AC1: axe reports no violation', async ({ page }) => {
    await openDemo(page, 'site-footer', 'playground')
    await expectNoA11yViolations(page, { label: 'site-footer' })
  })
})
