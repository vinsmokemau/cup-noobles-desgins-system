// T7.2 end-to-end checks of the button (REQ-023, REQ-024, REQ-026, REQ-027, REQ-028, REQ-029). They run against the two
// isolated demo pages, `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at
// 360, 768, and 1280 px in button.matrix.ts, and their baselines are in button.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations, expectNoHorizontalOverflow, expectTargetSize } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/atoms/button.md', import.meta.url)),
  'utf8',
)
const stateTable = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
const STATES = [...stateTable.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)

// The three brand variants of the matrix, by their labels.
const PRIMARY = 'Continuar'
const SECONDARY = 'Volver'
const GHOST = 'Cancelar'

const BLACK = 'rgb(0, 0, 0)'
const PINK = 'rgb(239, 128, 174)'
const YELLOW = 'rgb(255, 244, 136)'
const CLEAR = 'rgba(0, 0, 0, 0)'

const cell = (page: Page, state: string) => page.locator(`[data-state="${state}"]`)
const button = (page: Page, state: string, label: string) => cell(page, state).getByRole('button', { name: label })

type Style = Record<string, string>
// Nuxt UI fades colors in over a short transition, so a style read right after a state change is a blend of the two
// states. This waits for the element's transitions to end first (the spinner's animation is not a transition).
const styleOf = (target: Locator, properties: string[]): Promise<Style> =>
  target.evaluate(async (el, names) => {
    const running = el.getAnimations().filter((animation) => animation instanceof CSSTransition)
    await Promise.all(running.map((animation) => animation.finished.catch(() => undefined)))
    return Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)]))
  }, properties)

/** Resolves once no color transition is running, so axe reads the colors a person sees and not a blend of two states. */
const transitionsDone = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSTransition).length))
    .toBe(0)

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

/** Gives the glow, the radius, and the outline width test values through the tokens' own variables. */
async function setTokens(page: Page) {
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-effect-glow-button', '0 0 9px 2px rgb(1, 2, 3)')
    root.setProperty('--cn-radius-button', '11px')
    root.setProperty('--cn-border-width-button', '5px')
  })
}
const GLOW = 'rgb(1, 2, 3) 0px 0px 9px 2px'

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(STATES).toEqual(['default', 'hover', 'focus-visible', 'active', 'disabled', 'loading'])
  await expectStateMatrix(page, 'button', STATES)
  for (const state of STATES) {
    for (const label of [PRIMARY, SECONDARY, GHOST])
      await expect(button(page, state, label), `${label} in ${state}`).toBeVisible()
  }
})

test('REQ-023 AC3, Done when: the label on a brand fill is black, in every state', async ({ page }) => {
  await openDemo(page, 'button', 'states')
  for (const state of STATES) {
    const primary = await styleOf(button(page, state, PRIMARY), ['color', 'background-color'])
    expect(primary, `primary in ${state}`).toEqual({ color: BLACK, 'background-color': PINK })
    const secondary = await styleOf(button(page, state, SECONDARY), ['color', 'background-color'])
    expect(secondary, `secondary in ${state}`).toEqual({ color: BLACK, 'background-color': YELLOW })
  }
  // The ghost button has no fill. Its label is pink on the page, and turns black over the pink fill on hover.
  expect(await styleOf(button(page, 'default', GHOST), ['color', 'background-color'])).toEqual({
    color: PINK,
    'background-color': CLEAR,
  })
  expect(await styleOf(button(page, 'hover', GHOST), ['color', 'background-color'])).toEqual({
    color: BLACK,
    'background-color': PINK,
  })
})

test('REQ-023 AC2: the rounded corners, the thick outline, and the glow come from the component tokens', async ({
  page,
}) => {
  await openDemo(page, 'button', 'states')
  const properties = [
    'border-top-left-radius',
    'border-top-width',
    'border-top-style',
    'border-top-color',
    'box-shadow',
  ]
  // As built, the tokens are placeholders: the glow is `none` (TBD-12).
  const placeholder = await styleOf(button(page, 'default', PRIMARY), properties)
  expect(placeholder['border-top-style']).toBe('solid')
  expect(placeholder['border-top-color']).toBe(PINK)
  expect(placeholder['box-shadow']).toBe('none')
  // Change only the tokens' variables, and every part follows: the button holds no value of its own.
  await setTokens(page)
  for (const label of [PRIMARY, SECONDARY, GHOST]) {
    const styled = await styleOf(button(page, 'default', label), properties)
    expect(styled['border-top-left-radius'], `${label} radius`).toBe('11px')
    expect(styled['border-top-width'], `${label} outline width`).toBe('5px')
    expect(styled['box-shadow'], `${label} glow`).toContain(GLOW)
  }
})

test('REQ-023 AC5, Done when: a disabled button has no glow, and is still disabled to assistive technology', async ({
  page,
}) => {
  await openDemo(page, 'button', 'states')
  await setTokens(page)
  for (const label of [PRIMARY, SECONDARY, GHOST]) {
    const disabled = button(page, 'disabled', label)
    expect((await styleOf(disabled, ['box-shadow']))['box-shadow'], `${label} disabled`).toBe('none')
    await expect(disabled).toBeDisabled()
    // The accessibility tree reports it as disabled, not just styled.
    await expect(cell(page, 'disabled').getByRole('button', { name: label, disabled: true })).toHaveCount(1)
    // The same button enabled has the glow, so the test above can tell the two apart.
    expect((await styleOf(button(page, 'default', label), ['box-shadow']))['box-shadow']).toContain(GLOW)
  }
  // A loading button is busy, not unavailable: it keeps its glow.
  expect((await styleOf(button(page, 'loading', PRIMARY), ['box-shadow']))['box-shadow']).toContain(GLOW)
})

test('REQ-023 AC4: a forced state looks like the real one', async ({ page }) => {
  await openDemo(page, 'button', 'states')
  const properties = ['color', 'background-color', 'border-top-color']
  // The ghost button changes on hover and on press, so it shows whether the forced selectors match the real ones.
  const hoverForced = await styleOf(button(page, 'hover', GHOST), properties)
  const activeForced = await styleOf(button(page, 'active', GHOST), properties)
  const target = button(page, 'default', GHOST)
  expect(await styleOf(target, properties)).not.toEqual(hoverForced)
  await target.hover()
  expect(await styleOf(target, properties)).toEqual(hoverForced)
  await page.mouse.down()
  expect(await styleOf(target, properties)).toEqual(activeForced)
  await page.mouse.up()
})

test('REQ-024 AC1, Done when: focus-visible shows the focus ring, which is not the glow', async ({ page }) => {
  await openDemo(page, 'button', 'playground')
  await setTokens(page)
  const target = page.getByRole('button', { name: PRIMARY })
  const ring = ['outline-style', 'outline-width', 'outline-color', 'outline-offset', 'box-shadow']
  const before = await styleOf(target, ring)
  expect(before['outline-style']).toBe('none')
  expect(before['box-shadow']).toContain(GLOW)

  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  const focused = await styleOf(target, ring)
  expect(focused['outline-style']).toBe('solid')
  expect(focused['outline-width']).toBe('3px')
  expect(focused['outline-color']).toBe(YELLOW)
  expect(focused['outline-offset']).toBe('3px')
  // The glow is untouched: the ring is something else on top of it, drawn with the outline.
  expect(focused['box-shadow']).toBe(before['box-shadow'])
  expect(focused['outline-color']).not.toBe(PINK)
})

test('REQ-024 AC2: a mouse click does not show the focus ring', async ({ page }) => {
  await openDemo(page, 'button', 'playground')
  const target = page.getByRole('button', { name: PRIMARY })
  await target.click()
  await expect(target).toBeFocused()
  expect((await styleOf(target, ['outline-style']))['outline-style']).not.toBe('solid')
  // The keyboard shows it again.
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  expect((await styleOf(target, ['outline-style']))['outline-style']).toBe('solid')
})

test('REQ-027 AC2, Done when: Tab, Enter, and Space work, and a disabled or loading button is skipped', async ({
  page,
}) => {
  await openDemo(page, 'button', 'playground')
  const target = page.getByRole('button', { name: PRIMARY })
  await target.evaluate((el) => {
    const counter = { clicks: 0 }
    ;(window as unknown as { counter: typeof counter }).counter = counter
    el.addEventListener('click', () => counter.clicks++)
  })
  const clicks = () => page.evaluate(() => (window as unknown as { counter: { clicks: number } }).counter.clicks)

  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.press('Enter')
  expect(await clicks(), 'Enter activates').toBe(1)
  await page.keyboard.press('Space')
  expect(await clicks(), 'Space activates').toBe(2)

  for (const props of [{ disabled: true }, { loading: true }]) {
    await setProps(page, props)
    await expect(target).toBeDisabled()
    await target.evaluate((el) => (el as HTMLElement).blur())
    await page.keyboard.press('Tab')
    await expect(target, `${Object.keys(props)[0]} is skipped by Tab`).not.toBeFocused()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    expect(await clicks(), `${Object.keys(props)[0]} ignores the keys`).toBe(2)
    await setProps(page, { disabled: false, loading: false })
    await expect(target).toBeEnabled()
  }
})

test('REQ-023 AC1, AC5: the playground sets the variant and the states; a loading button is marked busy', async ({
  page,
}) => {
  await openDemo(page, 'button', 'playground')
  const target = page.getByRole('button', { name: PRIMARY })
  expect(await styleOf(target, ['background-color'])).toEqual({ 'background-color': PINK })
  await setProps(page, { variant: 'secondary' })
  await expect(target).toHaveClass(/cn-button--secondary/)
  expect(await styleOf(target, ['background-color'])).toEqual({ 'background-color': YELLOW })
  await setProps(page, { variant: 'ghost' })
  await expect(target).toHaveClass(/cn-button--ghost/)
  expect(await styleOf(target, ['background-color'])).toEqual({ 'background-color': CLEAR })
  await setProps(page, { loading: true })
  await expect(target).toHaveAttribute('aria-busy', 'true')
  await expect(target).toBeDisabled()
  await setProps(page, { loading: false })
  await expect(target).not.toHaveAttribute('aria-busy')
})

test('REQ-027 AC1, Done when: axe is clean in every state', async ({ page }) => {
  await openDemo(page, 'button', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/button/states' })
  // The real hover and the real keyboard focus are states too, and axe reads the styles they set.
  await button(page, 'default', GHOST).hover()
  await transitionsDone(page)
  await expectNoA11yViolations(page, { label: '/_demo/button/states, ghost hovered' })
  await button(page, 'default', PRIMARY).focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(button(page, 'default', PRIMARY)).toBeFocused()
  await transitionsDone(page)
  await expectNoA11yViolations(page, { label: '/_demo/button/states, primary focused' })

  await openDemo(page, 'button', 'playground')
  for (const props of [
    { variant: 'primary' },
    { variant: 'secondary' },
    { variant: 'ghost' },
    { disabled: true },
    { disabled: false, loading: true },
  ]) {
    await setProps(page, props)
    // Let Vue draw the new props, then let the color transition end, so axe reads the colors a person sees.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    await transitionsDone(page)
    await expectNoA11yViolations(page, { label: `/_demo/button/playground ${JSON.stringify(props)}` })
  }
})

test('REQ-028 AC1, AC2: no overflow, and every size is at least 24 x 24 px', async ({ page }) => {
  await openDemo(page, 'button', 'states')
  await expectNoHorizontalOverflow(page, '/_demo/button/states')
  await expectTargetSize(page, '/_demo/button/states')
  await openDemo(page, 'button', 'playground')
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
    await setProps(page, { size })
    await expect(page.getByRole('button', { name: PRIMARY })).toBeVisible()
    await expectTargetSize(page, `/_demo/button/playground, size ${size}`)
  }
})

test('REQ-029 AC2: the loading spinner spins, and stops under reduced motion', async ({ page }) => {
  const spinner = () => page.locator('[data-state="loading"] [data-slot="leadingIcon"]').first()
  await openDemo(page, 'button', 'states')
  await expect(spinner()).toBeAttached()
  expect((await styleOf(spinner(), ['animation-name']))['animation-name']).not.toBe('none')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect((await styleOf(spinner(), ['animation-name']))['animation-name']).toBe('none')
})

test('REQ-055: the component page shows the matrix and the playground controls for the button', async ({ page }) => {
  await page.goto('/components/button')
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()
  await expect(page.getByTestId('state-matrix').locator('iframe')).toBeVisible()
  const playground = page.getByTestId('playground')
  await expect(playground.locator('iframe')).toBeVisible()
  await expect(playground.getByRole('combobox', { name: 'variant' })).toBeVisible()
  await expect(playground.getByRole('combobox', { name: 'size' })).toBeVisible()
  await expect(playground.getByRole('textbox', { name: 'label' })).toHaveValue(PRIMARY)
  await expect(playground.getByRole('switch', { name: 'disabled' })).toBeVisible()
  await expect(playground.getByRole('switch', { name: 'loading' })).toBeVisible()
  await expectNoA11yViolations(page, { label: '/components/button' })
})
