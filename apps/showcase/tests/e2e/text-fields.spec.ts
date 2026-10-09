// T7.4 end-to-end checks of the input, the textarea, and the select (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028). They run
// against the isolated demo pages, `states` and `playground` of each, in the `functional` project at 1280 px. The same
// pages are audited at 360, 768, and 1280 px in text-fields.matrix.ts, and their baselines are in text-fields.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const SLUGS = ['input', 'textarea', 'select'] as const
type Slug = (typeof SLUGS)[number]
const ROLE = { input: 'textbox', textarea: 'textbox', select: 'combobox' } as const
const ERROR_TEXT = {
  input: 'Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.',
  textarea: 'Escribe al menos 10 caracteres.',
  select: 'Elige una categoría de la lista.',
} as const
const LABEL = { input: 'Correo electrónico', textarea: 'Comentarios del pedido', select: 'Categoría' } as const

const docOf = (slug: string) =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/02-components/atoms/${slug}.md`, import.meta.url)), 'utf8')
/** The `default`, `hover`, ... rows of the States table of a doc. */
const statesOf = (slug: string) => {
  const doc = docOf(slug)
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

const YELLOW = 'rgb(255, 244, 136)'

type Style = Record<string, string>
// Nuxt UI fades colors in over a short transition, so a style read right after a state change is a blend of the two
// states. This waits for the element's transitions to end first.
const styleOf = (target: Locator, properties: string[]): Promise<Style> =>
  target.evaluate(async (el, names) => {
    const running = el.getAnimations().filter((animation) => animation instanceof CSSTransition)
    await Promise.all(running.map((animation) => animation.finished.catch(() => undefined)))
    return Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)]))
  }, properties)

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const cell = (page: Page, state: string) => page.locator(`[data-state="${state}"]`)
/** The control of a field: the input, the textarea, or the select trigger. */
const control = (page: Page, state: string) => cell(page, state).locator('[data-slot="base"]')
const playgroundControl = (page: Page, slug: Slug) => page.getByRole(ROLE[slug], { name: LABEL[slug] })

/** Overrides the text-field tokens on the page with distinct colors, to prove that the rules read them. */
async function overrideTokens(page: Page) {
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-input-border', 'rgb(1, 2, 3)')
    root.setProperty('--cn-input-border-hover', 'rgb(4, 5, 6)')
    root.setProperty('--cn-input-error-border', 'rgb(7, 8, 9)')
    root.setProperty('--cn-input-fg', 'rgb(10, 11, 12)')
    root.setProperty('--cn-input-bg', 'rgb(13, 14, 15)')
    root.setProperty('--cn-radius-input', '11px')
    root.setProperty('--cn-border-width-input', '5px')
  })
}

for (const slug of SLUGS) {
  test.describe(slug, () => {
    test(`REQ-026 AC1, AC2: the ${slug} state matrix shows exactly the states the doc lists`, async ({ page }) => {
      expect(statesOf(slug)).toEqual(['default', 'hover', 'focus-visible', 'disabled', 'error'])
      await expectStateMatrix(page, slug, statesOf(slug))
      for (const state of statesOf(slug)) await expect(control(page, state), state).toBeVisible()
    })

    test(`REQ-024 AC1: the ${slug} outline, text, fill, radius, and stroke come from the component tokens`, async ({
      page,
    }) => {
      await openDemo(page, slug, 'states')
      await overrideTokens(page)
      const properties = [
        'border-top-color',
        'border-top-style',
        'border-top-width',
        'border-top-left-radius',
        'box-shadow',
      ]
      const colors: Record<string, string> = {
        default: 'rgb(1, 2, 3)',
        hover: 'rgb(4, 5, 6)',
        error: 'rgb(7, 8, 9)',
      }
      for (const [state, color] of Object.entries(colors)) {
        expect(await styleOf(control(page, state), properties), state).toEqual({
          'border-top-color': color,
          'border-top-style': 'solid',
          'border-top-width': '5px',
          'border-top-left-radius': '11px',
          'box-shadow': 'none',
        })
      }
      // The text and the fill follow their tokens; the select shows its placeholder in the placeholder color.
      expect(await styleOf(control(page, 'default'), ['background-color'])).toEqual({
        'background-color': 'rgb(13, 14, 15)',
      })
      if (slug !== 'select')
        expect(await styleOf(control(page, 'default'), ['color'])).toEqual({ color: 'rgb(10, 11, 12)' })
    })

    test(`the ${slug} outline turns pink on a real hover, and not while disabled`, async ({ page }) => {
      await openDemo(page, slug, 'states')
      await overrideTokens(page)
      const target = control(page, 'default')
      expect((await styleOf(target, ['border-top-color']))['border-top-color']).toBe('rgb(1, 2, 3)')
      await target.hover()
      expect((await styleOf(target, ['border-top-color']))['border-top-color']).toBe('rgb(4, 5, 6)')
      // A disabled field ignores hover. Playwright's hover waits for actionability, so it is forced.
      const disabled = control(page, 'disabled')
      await disabled.hover({ force: true })
      expect((await styleOf(disabled, ['border-top-color']))['border-top-color']).toBe('rgb(1, 2, 3)')
    })

    test(`REQ-024 AC1, AC2: the ${slug} shows the yellow focus ring on the keyboard`, async ({ page }) => {
      await openDemo(page, slug, 'playground')
      const target = playgroundControl(page, slug)
      const ring = ['outline-style', 'outline-width', 'outline-color', 'outline-offset']
      expect((await styleOf(target, ring))['outline-style']).not.toBe('solid')

      await page.keyboard.press('Tab')
      await expect(target).toBeFocused()
      expect(await styleOf(target, ring)).toEqual({
        'outline-style': 'solid',
        'outline-width': '3px',
        'outline-color': YELLOW,
        'outline-offset': '3px',
      })
    })

    test(`REQ-024 AC1: the forced focus-visible cell of the ${slug} draws the same ring as the real one`, async ({
      page,
    }) => {
      await openDemo(page, slug, 'states')
      expect(
        await styleOf(control(page, 'focus-visible'), ['outline-style', 'outline-width', 'outline-color']),
      ).toEqual({ 'outline-style': 'solid', 'outline-width': '3px', 'outline-color': YELLOW })
      expect((await styleOf(control(page, 'default'), ['outline-style']))['outline-style']).not.toBe('solid')
    })

    test(`REQ-027, Done when: the ${slug} error text is linked with aria-describedby, and aria-invalid is set`, async ({
      page,
    }) => {
      await openDemo(page, slug, 'states')
      const target = control(page, 'error')
      await expect(target).toHaveAttribute('aria-invalid', 'true')
      const describedBy = await target.getAttribute('aria-describedby')
      expect(describedBy, 'the error field names its message').toBeTruthy()
      const message = page.locator(`[id="${describedBy}"]`)
      await expect(message).toHaveText(ERROR_TEXT[slug])
      await expect(target).toHaveAccessibleDescription(ERROR_TEXT[slug])
      // The field is named by its visible label, and the label is a real <label>.
      await expect(page.getByRole(ROLE[slug], { name: LABEL[slug] })).toHaveCount(5)
      // Only the error state has the attributes.
      for (const state of ['default', 'hover', 'focus-visible', 'disabled']) {
        await expect(control(page, state), state).not.toHaveAttribute('aria-invalid')
        await expect(control(page, state), state).not.toHaveAttribute('aria-describedby')
      }
      // The error is told apart by more than color: the message has an icon that assistive technology skips.
      await expect(message.locator('[aria-hidden="true"]')).toHaveCount(1)
    })

    test(`REQ-055: the ${slug} playground shows the error message only when error is set`, async ({ page }) => {
      await openDemo(page, slug, 'playground')
      const target = playgroundControl(page, slug)
      await expect(target).not.toHaveAttribute('aria-invalid')
      await expect(target).not.toHaveAccessibleDescription(ERROR_TEXT[slug])
      await setProps(page, { error: true })
      await expect(target).toHaveAttribute('aria-invalid', 'true')
      await expect(target).toHaveAccessibleDescription(ERROR_TEXT[slug])
      await setProps(page, { error: false })
      await expect(target).not.toHaveAttribute('aria-invalid')
    })

    test(`REQ-027 AC2: Tab skips a disabled ${slug}`, async ({ page }) => {
      await openDemo(page, slug, 'playground')
      await setProps(page, { disabled: true })
      const target = playgroundControl(page, slug)
      await expect(target).toBeDisabled()
      await page.keyboard.press('Tab')
      await expect(target, 'a disabled field is skipped by Tab').not.toBeFocused()
    })

    test(`REQ-027 AC1: axe is clean in every state of the ${slug}`, async ({ page }) => {
      await openDemo(page, slug, 'states')
      await expect
        .poll(() => page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSTransition).length))
        .toBe(0)
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/states` })
      await openDemo(page, slug, 'playground')
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/playground` })
      await setProps(page, { error: true })
      await expect(playgroundControl(page, slug)).toHaveAttribute('aria-invalid', 'true')
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/playground with error` })
    })
  })
}

// ------------------------------------------------------------------------------------------------------------------ input

test('REQ-027 AC2: Tab focuses the input, and typing fills it', async ({ page }) => {
  await openDemo(page, 'input', 'playground')
  const target = page.getByRole('textbox', { name: 'Correo electrónico' })
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.type('mau@ejemplo.mx')
  await expect(target).toHaveValue('mau@ejemplo.mx')
  await page.keyboard.press('Shift+Tab')
  await expect(target).not.toBeFocused()
})

test('a text field shows its focus ring on a mouse click too, because :focus-visible matches while typing is possible', async ({
  page,
}) => {
  await openDemo(page, 'input', 'playground')
  const target = page.getByRole('textbox', { name: 'Correo electrónico' })
  await target.click()
  await expect(target).toBeFocused()
  expect(await target.evaluate((el) => el.matches(':focus-visible'))).toBe(true)
  expect((await styleOf(target, ['outline-style']))['outline-style']).toBe('solid')
})

// -------------------------------------------------------------------------------------------------------------- textarea

test('REQ-027 AC2: Tab focuses the textarea, Enter starts a new line, and Tab leaves it', async ({ page }) => {
  await openDemo(page, 'textarea', 'playground')
  const target = page.getByRole('textbox', { name: 'Comentarios del pedido' })
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.type('Hola')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Gracias')
  await expect(target).toHaveValue('Hola\nGracias')
  await page.keyboard.press('Tab')
  await expect(target, 'the textarea never traps focus').not.toBeFocused()
})

// ---------------------------------------------------------------------------------------------------------------- select

const OPTIONS = ['Cartas', 'Juegos de mesa', 'Figuras']

test('REQ-027 AC2: Tab focuses the select, Enter or Space opens it, arrows move, Enter chooses, Escape closes', async ({
  page,
}) => {
  await openDemo(page, 'select', 'playground')
  // While the list is open Reka UI hides the trigger from the accessibility tree, so it is found by id, not by role.
  const trigger = page.locator('#select-playground')
  await expect(page.getByRole('combobox', { name: 'Categoría' })).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('Tab')
  await expect(trigger).toBeFocused()

  // Enter opens the list, and the options are named.
  await page.keyboard.press('Enter')
  const list = page.getByRole('listbox')
  await expect(list).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('option')).toHaveText(OPTIONS)

  // The arrows move the highlight, and the highlighted option wears the focus ring.
  const highlighted = page.locator('[role="option"][data-highlighted]')
  await expect(highlighted).toHaveText('Cartas')
  await page.keyboard.press('ArrowDown')
  await expect(highlighted).toHaveText('Juegos de mesa')
  expect(await styleOf(highlighted, ['outline-style', 'outline-width', 'outline-color'])).toEqual({
    'outline-style': 'solid',
    'outline-width': '3px',
    'outline-color': YELLOW,
  })
  await page.keyboard.press('ArrowDown')
  await expect(highlighted).toHaveText('Figuras')
  await page.keyboard.press('ArrowUp')
  await expect(highlighted).toHaveText('Juegos de mesa')

  // Escape closes the list without a choice and returns focus to the trigger.
  await page.keyboard.press('Escape')
  await expect(list).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveText('Elige una categoría')

  // Space opens it again, and Enter chooses the highlighted option.
  await page.keyboard.press('Space')
  await expect(list).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(list).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveText(/Cartas|Juegos de mesa|Figuras/)
  await expect(trigger).not.toHaveText('Elige una categoría')
})

test('REQ-024 AC2: the select ring is drawn by :focus-visible, so a plain :focus (a pointer press) draws none', async ({
  page,
}) => {
  await openDemo(page, 'select', 'playground')
  const trigger = page.locator('#select-playground')
  // Pressing the mouse button on the trigger opens the list and moves focus into it, so the trigger is not focus-visible.
  await trigger.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  expect(await trigger.evaluate((el) => el.matches(':focus-visible'))).toBe(false)
  expect((await styleOf(trigger, ['outline-style']))['outline-style']).not.toBe('solid')
})

// axe is not run with the list open: Reka UI hides the rest of the page with aria-hidden while the list is open and leaves
// the trigger focusable, so axe reports `aria-hidden-focus`. That is the library's own behavior (see the select doc).
test('REQ-028 AC1: the select list fits a 360 px screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openDemo(page, 'select', 'playground')
  await page.getByRole('combobox', { name: 'Categoría' }).click()
  const list = page.getByRole('listbox')
  await expect(list).toBeVisible()
  const box = await list.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(360)
})
