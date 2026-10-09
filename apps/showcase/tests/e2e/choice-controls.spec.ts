// T7.5 end-to-end checks of the checkbox, the radio group, and the switch (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028). They run
// against the isolated demo pages, `states` and `playground` of each, in the `functional` project at 1280 px. The same pages
// are audited at 360, 768, and 1280 px in choice-controls.matrix.ts, and their baselines are in choice-controls.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const SLUGS = ['checkbox', 'radio-group', 'switch'] as const
type Slug = (typeof SLUGS)[number]
const ROLE = { checkbox: 'checkbox', 'radio-group': 'radio', switch: 'switch' } as const
const LABEL = {
  checkbox: 'Recibir avisos de lanzamientos',
  'radio-group': 'Cartas',
  switch: 'Avisos de lanzamientos',
} as const

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
const styleOf = (target: Locator, properties: string[], pseudo?: string): Promise<Style> =>
  target.evaluate(
    async (el, [names, pseudoElement]) => {
      const running = el.getAnimations().filter((animation) => animation instanceof CSSTransition)
      await Promise.all(running.map((animation) => animation.finished.catch(() => undefined)))
      const style = getComputedStyle(el, pseudoElement)
      return Object.fromEntries(names!.map((name) => [name, style.getPropertyValue(name)]))
    },
    [properties, pseudo] as const,
  )

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const cell = (page: Page, state: string) => page.locator(`[data-state="${state}"]:not([data-slot])`)
/** The first control of a matrix cell: the checkbox, the first radio, or the switch track. */
const control = (page: Page, state: string) => cell(page, state).locator('button[data-slot="base"]').first()
const playgroundControl = (page: Page, slug: Slug) => page.getByRole(ROLE[slug], { name: LABEL[slug] })

/** Overrides the choice tokens on the page with distinct colors, to prove that the rules read them. */
async function overrideTokens(page: Page) {
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-choice-bg', 'rgb(13, 14, 15)')
    root.setProperty('--cn-choice-border', 'rgb(1, 2, 3)')
    root.setProperty('--cn-choice-border-hover', 'rgb(4, 5, 6)')
    root.setProperty('--cn-choice-checked-bg', 'rgb(7, 8, 9)')
    root.setProperty('--cn-choice-checked-border', 'rgb(10, 11, 12)')
    root.setProperty('--cn-choice-checked-fg', 'rgb(16, 17, 18)')
    root.setProperty('--cn-radius-choice', '11px')
    root.setProperty('--cn-border-width-choice', '5px')
  })
}

for (const slug of SLUGS) {
  test.describe(slug, () => {
    test(`REQ-026 AC1, AC2: the ${slug} state matrix shows exactly the states the doc lists`, async ({ page }) => {
      await expectStateMatrix(page, slug, statesOf(slug))
      for (const state of statesOf(slug)) await expect(control(page, state), state).toBeVisible()
    })

    test(`REQ-024 AC1: the ${slug} outline and fill come from the component tokens, unchecked and checked`, async ({
      page,
    }) => {
      await openDemo(page, slug, 'states')
      await overrideTokens(page)
      // Unchecked: the black fill and the neutral outline. Hover: the hover outline.
      expect(await styleOf(control(page, 'default'), ['background-color', 'border-top-color'])).toEqual({
        'background-color': 'rgb(13, 14, 15)',
        'border-top-color': 'rgb(1, 2, 3)',
      })
      expect((await styleOf(control(page, 'hover'), ['border-top-color']))['border-top-color']).toBe('rgb(4, 5, 6)')
      // Checked: the checked fill and outline, and no glow anywhere.
      const checked = await styleOf(control(page, 'checked'), ['background-color', 'border-top-color', 'box-shadow'])
      expect(checked).toEqual({
        'background-color': 'rgb(7, 8, 9)',
        'border-top-color': 'rgb(10, 11, 12)',
        'box-shadow': 'none',
      })
      expect((await styleOf(control(page, 'default'), ['box-shadow']))['box-shadow']).toBe('none')
    })

    test(`the ${slug} outline turns pink on a real hover, and not while disabled`, async ({ page }) => {
      await openDemo(page, slug, 'states')
      await overrideTokens(page)
      const target = control(page, 'default')
      expect((await styleOf(target, ['border-top-color']))['border-top-color']).toBe('rgb(1, 2, 3)')
      await target.hover()
      expect((await styleOf(target, ['border-top-color']))['border-top-color']).toBe('rgb(4, 5, 6)')
      // A disabled control ignores hover. Playwright's hover waits for actionability, so it is forced.
      const disabled = control(page, 'disabled')
      await disabled.hover({ force: true })
      expect((await styleOf(disabled, ['border-top-color']))['border-top-color']).toBe(
        // The first control of the disabled cell is unchecked in a checkbox and a switch, and checked in a radio group.
        slug === 'radio-group' ? 'rgb(10, 11, 12)' : 'rgb(1, 2, 3)',
      )
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

    test(`REQ-024 AC2: a mouse click on the ${slug} draws no focus ring`, async ({ page }) => {
      await openDemo(page, slug, 'playground')
      const target = playgroundControl(page, slug)
      await target.click()
      await expect(target).toBeFocused()
      expect(await target.evaluate((el) => el.matches(':focus-visible'))).toBe(false)
      expect((await styleOf(target, ['outline-style']))['outline-style']).not.toBe('solid')
    })

    test(`REQ-027 AC2: Tab skips a disabled ${slug}`, async ({ page }) => {
      await openDemo(page, slug, 'playground')
      await setProps(page, { disabled: true })
      const target = playgroundControl(page, slug)
      await expect(target).toBeDisabled()
      await page.keyboard.press('Tab')
      await expect(target, 'a disabled control is skipped by Tab').not.toBeFocused()
    })

    test(`REQ-027 AC1: axe is clean in every state of the ${slug}`, async ({ page }) => {
      await openDemo(page, slug, 'states')
      await expect
        .poll(() => page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSTransition).length))
        .toBe(0)
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/states` })
      await openDemo(page, slug, 'playground')
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/playground` })
      await setProps(page, { disabled: true })
      await expect(playgroundControl(page, slug)).toBeDisabled()
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/playground disabled` })
    })
  })
}

// --------------------------------------------------------------------------------------------------------------- checkbox

test('REQ-027 AC2: Space toggles the checkbox, and Enter does not', async ({ page }) => {
  await openDemo(page, 'checkbox', 'playground')
  const target = playgroundControl(page, 'checkbox')
  await expect(target).toHaveAttribute('aria-checked', 'false')
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.press('Space')
  await expect(target).toHaveAttribute('aria-checked', 'true')
  await page.keyboard.press('Enter')
  await expect(target, 'Enter does not toggle a checkbox').toHaveAttribute('aria-checked', 'true')
  await page.keyboard.press('Space')
  await expect(target).toHaveAttribute('aria-checked', 'false')
  await page.keyboard.press('Tab')
  await expect(target, 'Tab leaves the checkbox').not.toBeFocused()
})

test('clicking the label toggles the checkbox', async ({ page }) => {
  await openDemo(page, 'checkbox', 'playground')
  const target = playgroundControl(page, 'checkbox')
  await page.getByText('Recibir avisos de lanzamientos').click()
  await expect(target).toHaveAttribute('aria-checked', 'true')
})

test('REQ-026: the checkbox states expose their value to assistive technology, and the mark is drawn', async ({
  page,
}) => {
  await openDemo(page, 'checkbox', 'states')
  const expected = { default: 'false', checked: 'true', indeterminate: 'mixed', disabled: 'false' } as const
  for (const [state, value] of Object.entries(expected))
    await expect(control(page, state), state).toHaveAttribute('aria-checked', value)
  // The checked box shows a check and the indeterminate box a minus: the state is not told by color alone (WCAG 1.4.1).
  await expect(control(page, 'checked').locator('[data-slot="icon"]')).toHaveClass(/i-ph:check-bold/)
  await expect(control(page, 'indeterminate').locator('[data-slot="icon"]')).toHaveClass(/i-ph:minus-bold/)
  await expect(control(page, 'default').locator('[data-slot="icon"]')).toHaveCount(0)
  // The disabled cell also shows a checked and disabled box.
  await expect(page.getByRole('checkbox', { name: 'Recibir avisos de ofertas' })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Recibir avisos de ofertas' })).toBeDisabled()
})

test('REQ-055: the checkbox playground follows the checked and indeterminate controls', async ({ page }) => {
  await openDemo(page, 'checkbox', 'playground')
  const target = playgroundControl(page, 'checkbox')
  await setProps(page, { checked: true })
  await expect(target).toHaveAttribute('aria-checked', 'true')
  await setProps(page, { indeterminate: true })
  await expect(target).toHaveAttribute('aria-checked', 'mixed')
  await setProps(page, { indeterminate: false, checked: false })
  await expect(target).toHaveAttribute('aria-checked', 'false')
})

// ------------------------------------------------------------------------------------------------------------- radio group

/**
 * Holds an arrow key until `target` has focus and is checked, then releases it. Reka UI checks a radio from a timer that runs
 * after focus reaches it, and only if an arrow key is still held, so a synthetic press that is released at once can end before
 * the check. A person holds a key for a moment, so this is the same input.
 */
async function arrowTo(page: Page, key: string, target: Locator) {
  await page.keyboard.down(key)
  await expect(target).toBeFocused()
  await expect(target).toBeChecked()
  await page.keyboard.up(key)
}
test('REQ-027 AC2: Tab enters the radio group once, and the up and down arrows move and select inside it', async ({
  page,
}) => {
  await openDemo(page, 'radio-group', 'playground')
  const radio = (name: string) => page.getByRole('radio', { name })
  const checked = page.getByRole('radio', { checked: true })
  await expect(page.getByRole('radiogroup')).toBeVisible()
  await expect(checked).toHaveCount(0)

  // One tab stop for the whole group: Tab enters the first radio, and the next Tab leaves the group.
  await page.keyboard.press('Tab')
  await expect(radio('Cartas')).toBeFocused()
  await arrowTo(page, 'ArrowDown', radio('Juegos de mesa'))
  await expect(radio('Juegos de mesa')).toBeChecked()
  await arrowTo(page, 'ArrowDown', radio('Figuras'))
  await expect(radio('Figuras')).toBeChecked()
  await expect(checked).toHaveCount(1)
  // The playground sets `loop`, so the group wraps from the last radio to the first, and back (as a native group does).
  await arrowTo(page, 'ArrowDown', radio('Cartas'))
  await expect(radio('Cartas')).toBeChecked()
  await arrowTo(page, 'ArrowUp', radio('Figuras'))
  await expect(radio('Figuras')).toBeChecked()
  await arrowTo(page, 'ArrowUp', radio('Juegos de mesa'))
  await expect(radio('Juegos de mesa')).toBeChecked()
  await arrowTo(page, 'ArrowUp', radio('Cartas'))
  await expect(radio('Cartas')).toBeChecked()
  await page.keyboard.press('Tab')
  await expect(radio('Cartas'), 'Tab leaves the group').not.toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(radio('Cartas'), 'Shift+Tab enters on the checked radio').toBeFocused()
})

test('REQ-027 AC2: in a horizontal radio group the left and right arrows move and select', async ({ page }) => {
  await openDemo(page, 'radio-group', 'playground')
  await setProps(page, { orientation: 'horizontal' })
  const radio = (name: string) => page.getByRole('radio', { name })
  await expect(page.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal')
  await page.keyboard.press('Tab')
  await expect(radio('Cartas')).toBeFocused()
  await arrowTo(page, 'ArrowRight', radio('Juegos de mesa'))
  await expect(radio('Juegos de mesa')).toBeChecked()
  await arrowTo(page, 'ArrowRight', radio('Figuras'))
  await expect(radio('Figuras')).toBeChecked()
  await arrowTo(page, 'ArrowRight', radio('Cartas'))
  await expect(radio('Cartas'), 'the group wraps from the last radio to the first').toBeChecked()
  await arrowTo(page, 'ArrowLeft', radio('Figuras'))
  await expect(radio('Figuras'), 'and back').toBeChecked()
})

test('REQ-027 AC2: Space selects the focused radio', async ({ page }) => {
  await openDemo(page, 'radio-group', 'playground')
  const first = page.getByRole('radio', { name: 'Cartas' })
  await page.keyboard.press('Tab')
  await expect(first).toBeFocused()
  await expect(first).not.toBeChecked()
  await page.keyboard.press('Space')
  await expect(first).toBeChecked()
})

test('the radio group states: one radio checked, the dot is drawn, and a disabled group keeps its choice', async ({
  page,
}) => {
  await openDemo(page, 'radio-group', 'states')
  await overrideTokens(page)
  await expect(cell(page, 'default').getByRole('radio', { checked: true })).toHaveCount(0)
  await expect(cell(page, 'checked').getByRole('radio', { checked: true })).toHaveCount(1)
  await expect(cell(page, 'disabled').getByRole('radio', { checked: true })).toHaveCount(1)
  await expect(cell(page, 'disabled').getByRole('radio').first()).toBeDisabled()
  // The dot is black on the pink fill, drawn by the checked foreground token.
  expect(
    await styleOf(control(page, 'checked').locator('[data-slot="indicator"]'), ['background-color'], '::after'),
    'the dot of the checked radio',
  ).toEqual({ 'background-color': 'rgb(16, 17, 18)' })
  // A radio is round by shape, not by the checkbox radius token.
  expect((await styleOf(control(page, 'checked'), ['border-top-left-radius']))['border-top-left-radius']).not.toBe(
    '11px',
  )
})

test('REQ-055: the radio group playground lays the options out in a row when orientation is horizontal', async ({
  page,
}) => {
  await openDemo(page, 'radio-group', 'playground')
  const [first, last] = [page.getByRole('radio', { name: 'Cartas' }), page.getByRole('radio', { name: 'Figuras' })]
  expect((await first.boundingBox())!.y).toBeLessThan((await last.boundingBox())!.y)
  await setProps(page, { orientation: 'horizontal' })
  await expect
    .poll(async () => Math.abs((await first.boundingBox())!.y - (await last.boundingBox())!.y))
    .toBeLessThan(4)
})

// ------------------------------------------------------------------------------------------------------------------ switch

test('REQ-027 AC2: Space toggles the switch, and the thumb moves', async ({ page }) => {
  await openDemo(page, 'switch', 'playground')
  const target = playgroundControl(page, 'switch')
  const thumb = target.locator('[data-slot="thumb"]')
  await expect(target).toHaveAttribute('aria-checked', 'false')
  const off = (await thumb.boundingBox())!.x
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.press('Space')
  await expect(target).toHaveAttribute('aria-checked', 'true')
  // The state is told by the thumb position, not by color alone (WCAG 1.4.1).
  await expect.poll(async () => (await thumb.boundingBox())!.x).toBeGreaterThan(off + 8)
  await page.keyboard.press('Space')
  await expect(target).toHaveAttribute('aria-checked', 'false')
  await page.keyboard.press('Tab')
  await expect(target, 'Tab leaves the switch').not.toBeFocused()
})

test('clicking the label toggles the switch', async ({ page }) => {
  await openDemo(page, 'switch', 'playground')
  await page.getByText('Avisos de lanzamientos').click()
  await expect(playgroundControl(page, 'switch')).toHaveAttribute('aria-checked', 'true')
})

test('the switch thumb follows the tokens: the neutral color off, the checked foreground on', async ({ page }) => {
  await openDemo(page, 'switch', 'states')
  await overrideTokens(page)
  const thumb = (state: string) => control(page, state).locator('[data-slot="thumb"]')
  expect(await styleOf(thumb('default'), ['background-color', 'box-shadow'])).toEqual({
    'background-color': 'rgb(1, 2, 3)',
    'box-shadow': 'none',
  })
  expect((await styleOf(thumb('checked'), ['background-color']))['background-color']).toBe('rgb(16, 17, 18)')
  await expect(control(page, 'checked')).toHaveAttribute('aria-checked', 'true')
  await expect(control(page, 'default')).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByRole('switch', { name: 'Avisos de ofertas' })).toBeChecked()
  await expect(page.getByRole('switch', { name: 'Avisos de ofertas' })).toBeDisabled()
})

test('REQ-055: the switch playground follows the checked control', async ({ page }) => {
  await openDemo(page, 'switch', 'playground')
  const target = playgroundControl(page, 'switch')
  await setProps(page, { checked: true })
  await expect(target).toHaveAttribute('aria-checked', 'true')
  await setProps(page, { checked: false })
  await expect(target).toHaveAttribute('aria-checked', 'false')
})
