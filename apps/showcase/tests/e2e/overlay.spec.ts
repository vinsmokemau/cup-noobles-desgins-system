// T8.5 end-to-end checks of the modal and the slideover (REQ-020, REQ-026, REQ-027, REQ-028). They run against the isolated demo
// pages, `states` and `playground`, in the `functional` project at 1280 px. The `playground` opens the real component in the
// page portal, as an app does, so the focus trap, Escape, the restored focus, and the inert page behind are the real behavior.
// The same pages are audited at 360, 768, and 1280 px in molecules.matrix.ts, and the baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const OVERLAYS = [
  { slug: 'modal', title: 'Confirmar lugar', description: 'Te guardamos una mesa para cuatro personas.' },
  { slug: 'slideover', title: 'Filtros', description: 'Elige qué juegos quieres ver.' },
] as const

const docOf = (slug: string) =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/02-components/organisms/${slug}.md`, import.meta.url)), 'utf8')
const statesOf = (slug: string) => {
  const doc = docOf(slug)
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const dialogOf = (page: Page) => page.getByRole('dialog')
const trigger = (page: Page) => page.getByTestId('open')

async function open(page: Page, slug: string) {
  await openDemo(page, slug, 'playground')
  await trigger(page).click()
  await expect(dialogOf(page)).toBeVisible()
}

const focusIsInside = (page: Page) =>
  page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]')
    return !!dialog && dialog.contains(document.activeElement)
  })

const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(
    (el, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)])),
    properties,
  )

const PINK = 'rgb(239, 128, 174)'

for (const { slug, title, description } of OVERLAYS) {
  test.describe(slug, () => {
    test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
      expect(statesOf(slug)).toEqual(['default'])
      await expectStateMatrix(page, slug, statesOf(slug))
      // The matrix cell holds the real open dialog, so its look is what the baseline shows.
      await expect(page.locator('[data-state="default"] [role="dialog"]')).toBeVisible()
    })

    test('REQ-027 AC2: it opens as a dialog named by its title and described by its description', async ({ page }) => {
      await open(page, slug)
      const dialog = dialogOf(page)
      await expect(dialog).toHaveAccessibleName(title)
      await expect(dialog).toHaveAccessibleDescription(description)
      await expect(dialog.locator('[data-slot="title"]')).toHaveText(title)
    })

    test('REQ-027 AC2: focus moves into the panel and Tab and Shift+Tab are trapped there', async ({ page }) => {
      await open(page, slug)
      await expect.poll(() => focusIsInside(page)).toBe(true)
      // More presses than there are controls, so the cycle has to wrap at least once in each direction.
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab')
        expect(await focusIsInside(page), `Tab ${i + 1} stays in the panel`).toBe(true)
      }
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Shift+Tab')
        expect(await focusIsInside(page), `Shift+Tab ${i + 1} stays in the panel`).toBe(true)
      }
    })

    test('REQ-027 AC2: Escape closes it and focus returns to the control that opened it', async ({ page }) => {
      await open(page, slug)
      await page.keyboard.press('Escape')
      await expect(dialogOf(page)).toHaveCount(0)
      await expect(trigger(page)).toBeFocused()
    })

    test('REQ-027 AC2: Enter and Space on the close button close it, and focus returns', async ({ page }) => {
      for (const key of ['Enter', 'Space']) {
        await open(page, slug)
        await dialogOf(page).locator('[data-slot="close"]').focus()
        await page.keyboard.press(key)
        await expect(dialogOf(page), key).toHaveCount(0)
        await expect(trigger(page), key).toBeFocused()
      }
    })

    test('the page behind is inert: hidden from assistive technology, unreachable, and unclickable', async ({
      page,
    }) => {
      await open(page, slug)
      for (const id of ['page-button', 'page-link']) {
        const target = page.getByTestId(id)
        expect(
          await target.evaluate((el) => !!el.closest('[aria-hidden="true"]')),
          `${id} is hidden from assistive technology`,
        ).toBe(true)
        // The point where the control is drawn belongs to the backdrop, not to the control.
        expect(
          await target.evaluate((el) => {
            const box = el.getBoundingClientRect()
            const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
            return !!hit && !el.contains(hit)
          }),
          `${id} cannot be clicked`,
        ).toBe(true)
      }
      // No Tab press reaches the page behind (the trap test above checks it stays in the panel).
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab')
        expect(
          await page.evaluate(() => {
            const active = document.activeElement as HTMLElement | null
            return active?.dataset.testid === 'page-button' || active?.dataset.testid === 'page-link'
          }),
        ).toBe(false)
      }
    })

    test('after it closes, the page behind works again', async ({ page }) => {
      await open(page, slug)
      await page.keyboard.press('Escape')
      await expect(dialogOf(page)).toHaveCount(0)
      const target = page.getByTestId('page-button')
      expect(await target.evaluate((el) => !!el.closest('[aria-hidden="true"]'))).toBe(false)
      await target.focus()
      await expect(target).toBeFocused()
    })

    test('REQ-027 AC1: axe is clean while it is open, and on both demos', async ({ page }) => {
      await openDemo(page, slug, 'states')
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/states` })
      await open(page, slug)
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/playground, open` })
    })

    test('it can be made non-dismissible: Escape then leaves it open', async ({ page }) => {
      await openDemo(page, slug, 'playground')
      await setProps(page, { dismissible: false })
      await trigger(page).click()
      await expect(dialogOf(page)).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(dialogOf(page)).toBeVisible()
      // The footer button still closes it.
      await dialogOf(page).getByRole('button', { name: 'Cancelar' }).click()
      await expect(dialogOf(page)).toHaveCount(0)
    })

    test('REQ-016, ADR-0029: the outline, dividers, radius, stroke, and backdrop come from the tokens, with no glow', async ({
      page,
    }) => {
      await open(page, slug)
      const panel = dialogOf(page)
      const base = await styleOf(panel, ['border-top-color', 'border-top-style', 'background-color'])
      expect(base['border-top-color']).toBe(PINK)
      expect(base['border-top-style']).toBe('solid')
      expect(base['background-color']).toBe('rgb(0, 0, 0)')
      const header = panel.locator('[data-slot="header"]')
      expect((await styleOf(header, ['border-bottom-color']))['border-bottom-color']).toBe(PINK)
      // The backdrop is black at the placeholder amount, 0.75.
      const overlay = page.locator('[data-slot="overlay"]')
      expect((await styleOf(overlay, ['background-color']))['background-color']).toMatch(/0\.75/)

      await page.evaluate(() => {
        const style = document.documentElement.style
        style.setProperty('--cn-overlay-highlight', 'rgb(1, 2, 3)')
        style.setProperty('--cn-overlay-divider', 'rgb(4, 5, 6)')
        style.setProperty('--cn-border-width-overlay', '5px')
        style.setProperty('--cn-overlay-scrim-opacity', '0.5')
      })
      const moved = await styleOf(panel, ['border-top-color', 'border-top-width'])
      expect(moved).toEqual({ 'border-top-color': 'rgb(1, 2, 3)', 'border-top-width': '5px' })
      expect((await styleOf(header, ['border-bottom-color']))['border-bottom-color']).toBe('rgb(4, 5, 6)')
      expect((await styleOf(overlay, ['background-color']))['background-color']).toMatch(/0\.5\b/)
    })

    test('REQ-028 AC1: it stays inside the screen at 360 px, with no horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await open(page, slug)
      // A slideover slides in, so wait until it has come to rest before measuring it.
      await expect
        .poll(async () => {
          const box = (await dialogOf(page).boundingBox())!
          return box.x >= 0 && box.x + box.width <= 360
        })
        .toBe(true)
      await expectNoHorizontalOverflow(page, `${slug} open at 360 px`)
    })

    test('REQ-029 AC2: the opening movement is on normally and off under reduced motion', async ({ page }) => {
      const animationOf = async () => {
        await open(page, slug)
        const name = await page
          .locator('[data-slot="overlay"]')
          .evaluate((el) => getComputedStyle(el).getPropertyValue('animation-name'))
        await page.keyboard.press('Escape')
        await expect(dialogOf(page)).toHaveCount(0)
        return name
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      expect(await animationOf(), 'normal motion animates the backdrop').not.toBe('none')
      await page.emulateMedia({ reducedMotion: 'reduce' })
      expect(await animationOf(), 'reduced motion does not').toBe('none')
    })
  })
}

test('the slideover opens against the edge named by `side`, and rounds only the corners away from it', async ({
  page,
}) => {
  await openDemo(page, 'slideover', 'playground')
  const sides = ['right', 'left', 'top', 'bottom'] as const
  await page.evaluate(() => document.documentElement.style.setProperty('--cn-radius-overlay', '11px'))
  for (const side of sides) {
    await setProps(page, { side })
    await trigger(page).click()
    const panel = dialogOf(page)
    await expect(panel).toBeVisible()
    // Wait for the opening movement to end, so the box is the resting one.
    await expect
      .poll(async () => {
        const box = (await panel.boundingBox())!
        const { innerWidth, innerHeight } = await page.evaluate(() => ({
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        }))
        return {
          right: Math.round(box.x + box.width) === innerWidth,
          left: Math.round(box.x) === 0,
          top: Math.round(box.y) === 0,
          bottom: Math.round(box.y + box.height) === innerHeight,
        }[side]
      })
      .toBe(true)
    const radii = await styleOf(panel, [
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-left-radius',
      'border-bottom-right-radius',
    ])
    const flat = {
      right: ['border-top-right-radius', 'border-bottom-right-radius'],
      left: ['border-top-left-radius', 'border-bottom-left-radius'],
      top: ['border-top-left-radius', 'border-top-right-radius'],
      bottom: ['border-bottom-left-radius', 'border-bottom-right-radius'],
    }[side]
    for (const [corner, value] of Object.entries(radii))
      expect(value, `${side}: ${corner}`).toBe(flat.includes(corner) ? '0px' : '11px')
    await page.keyboard.press('Escape')
    await expect(dialogOf(page)).toHaveCount(0)
  }
})
