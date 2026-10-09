// T7.3 end-to-end checks of the link, the icon, and the badge (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028). They run
// against the isolated demo pages, `states` and `playground` of each, in the `functional` project at 1280 px. The same
// pages are audited at 360, 768, and 1280 px in link-icon-badge.matrix.ts, and their baselines are in
// link-icon-badge.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { siteBase } from '../../lib/site'
import { expectNoA11yViolations, wcagTags } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const docOf = (slug: string) =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/02-components/atoms/${slug}.md`, import.meta.url)), 'utf8')
/** The `default`, `hover`, ... rows of the States table of a doc. */
const statesOf = (slug: string) => {
  const doc = docOf(slug)
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

const BLACK = 'rgb(0, 0, 0)'
const PINK = 'rgb(239, 128, 174)'
const YELLOW = 'rgb(255, 244, 136)'
const CLEAR = 'rgba(0, 0, 0, 0)'

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

// ---------------------------------------------------------------------------------------------------------------- link

const cell = (page: Page, state: string) => page.locator(`[data-state="${state}"]`)
const textLink = (page: Page, state: string) => cell(page, state).locator('[data-link="text"]')
const iconOnlyLink = (page: Page, state: string) => cell(page, state).locator('[data-link="icon-only"]')

test('REQ-026 AC1, AC2: the link state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf('link')).toEqual(['default', 'hover', 'focus-visible', 'active', 'disabled'])
  await expectStateMatrix(page, 'link', statesOf('link'))
  for (const state of statesOf('link')) {
    for (const kind of ['text', 'icon', 'icon-only'])
      await expect(cell(page, state).locator(`[data-link="${kind}"]`), `${kind} in ${state}`).toBeVisible()
  }
})

test('the link is brand pink and always underlined, in every state', async ({ page }) => {
  await openDemo(page, 'link', 'states')
  for (const state of statesOf('link').filter((s) => s !== 'disabled')) {
    const style = await styleOf(textLink(page, state), ['color', 'text-decoration-line'])
    expect(style, state).toEqual({ color: PINK, 'text-decoration-line': 'underline' })
  }
  expect((await styleOf(textLink(page, 'disabled'), ['text-decoration-line']))['text-decoration-line']).toBe(
    'underline',
  )
})

test('REQ-024 AC1: the link text color comes from the link tokens', async ({ page }) => {
  await openDemo(page, 'link', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-link-fg', 'rgb(1, 2, 3)')
    root.setProperty('--cn-link-fg-hover', 'rgb(4, 5, 6)')
    root.setProperty('--cn-link-fg-active', 'rgb(7, 8, 9)')
  })
  expect((await styleOf(textLink(page, 'default'), ['color'])).color).toBe('rgb(1, 2, 3)')
  expect((await styleOf(textLink(page, 'hover'), ['color'])).color).toBe('rgb(4, 5, 6)')
  expect((await styleOf(textLink(page, 'active'), ['color'])).color).toBe('rgb(7, 8, 9)')
  // The real pseudo-classes match the forced ones.
  const target = textLink(page, 'default')
  await target.hover()
  expect((await styleOf(target, ['color'])).color).toBe('rgb(4, 5, 6)')
  await page.mouse.down()
  expect((await styleOf(target, ['color'])).color).toBe('rgb(7, 8, 9)')
  await page.mouse.up()
})

test('REQ-024 AC1, AC2: the link shows the yellow focus ring on the keyboard, and not on a mouse click', async ({
  page,
}) => {
  await openDemo(page, 'link', 'playground')
  const target = page.getByRole('link', { name: 'Ver las reglas del torneo' })
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

test('REQ-024 AC2: a mouse click does not show the link focus ring', async ({ page }) => {
  await openDemo(page, 'link', 'states')
  // The click follows the link, so the check is on the focus state right after the press, before the route changes.
  const target = textLink(page, 'default')
  await target.hover()
  await page.mouse.down()
  expect((await styleOf(target, ['outline-style']))['outline-style']).not.toBe('solid')
  await page.mouse.up()
})

test('REQ-027 AC2: Tab focuses the link, Enter follows it, and a disabled link is skipped', async ({ page }) => {
  await openDemo(page, 'link', 'playground')
  const target = page.getByRole('link', { name: 'Ver las reglas del torneo' })
  await expect(target).toHaveAttribute('href', /.+/)

  await setProps(page, { disabled: true })
  const disabled = page.getByRole('link', { name: 'Ver las reglas del torneo' })
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled).not.toHaveAttribute('href')
  await page.keyboard.press('Tab')
  await expect(disabled, 'a disabled link is skipped by Tab').not.toBeFocused()
  await setProps(page, { disabled: false })
  await expect(target).not.toHaveAttribute('aria-disabled')

  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
  await page.keyboard.press('Enter')
  // The playground link goes to `/`, the home of the site.
  await expect.poll(() => new URL(page.url()).pathname).toBe(siteBase)
})

test('Done when: an icon-only link requires an accessible label, and axe fails without one', async ({ page }) => {
  await openDemo(page, 'link', 'playground')
  await setProps(page, { iconOnly: true, label: '' })
  const violations = async () =>
    (await new AxeBuilder({ page }).withTags(wcagTags).include('[data-testid="demo-root"]').analyze()).violations.map(
      (violation) => violation.id,
    )
  // No label: the link has no name, and axe reports `link-name` (WCAG 4.1.2).
  await expect.poll(violations).toContain('link-name')
  // With a label, the same link is named and clean.
  await setProps(page, { iconOnly: true, label: 'Buscar en el catálogo' })
  const named = page.getByRole('link', { name: 'Buscar en el catálogo' })
  await expect(named).toBeVisible()
  await expect.poll(violations).not.toContain('link-name')
  await expectNoA11yViolations(page, { include: '[data-testid="demo-root"]', label: 'the labeled icon-only link' })
  // The icon inside is hidden by Nuxt UI, so the name is the label alone.
  await expect(named.locator('[aria-hidden="true"]')).toHaveCount(1)
})

test('REQ-027 AC1: the icon-only links of the state matrix all have a name', async ({ page }) => {
  await openDemo(page, 'link', 'states')
  for (const state of statesOf('link')) {
    await expect(iconOnlyLink(page, state), state).toHaveAttribute('aria-label', 'Buscar en el catálogo')
  }
})

test('REQ-027 AC1: axe is clean in every state of the link', async ({ page }) => {
  await openDemo(page, 'link', 'states')
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSTransition).length))
    .toBe(0)
  await expectNoA11yViolations(page, { label: '/_demo/link/states' })
  await openDemo(page, 'link', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/link/playground' })
})

// ---------------------------------------------------------------------------------------------------------------- badge

// The badge is the element Nuxt UI marks as the base slot; its label sits in a span inside it.
const badge = (page: Page, label: string) =>
  cell(page, 'default')
    .locator('[data-slot="base"]')
    .filter({ has: page.getByText(label, { exact: true }) })
    .first()
const BADGE_PROPERTIES = ['color', 'background-color', 'border-top-color', 'border-top-style', 'box-shadow']

test('REQ-026 AC1, AC2: the badge state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf('badge')).toEqual(['default'])
  await expectStateMatrix(page, 'badge', statesOf('badge'))
})

test('BR-12, Done when: the badge has the primary, outline, and tag variants, with black labels on the fills', async ({
  page,
}) => {
  await openDemo(page, 'badge', 'states')
  expect(await styleOf(badge(page, 'Nuevo'), BADGE_PROPERTIES)).toMatchObject({
    color: BLACK,
    'background-color': PINK,
    'border-top-color': PINK,
    'border-top-style': 'solid',
  })
  expect(await styleOf(badge(page, 'Preventa'), BADGE_PROPERTIES)).toMatchObject({
    color: PINK,
    'background-color': CLEAR,
    'border-top-color': PINK,
    'border-top-style': 'solid',
    'box-shadow': 'none',
  })
  // The tag badge of the featured media card (BR-12) is the yellow variant.
  expect(await styleOf(badge(page, 'Juegos de mesa'), BADGE_PROPERTIES)).toMatchObject({
    color: BLACK,
    'background-color': YELLOW,
    'border-top-color': YELLOW,
    'border-top-style': 'solid',
  })
})

test('the badge radius and outline width come from the component tokens', async ({ page }) => {
  await openDemo(page, 'badge', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-radius-badge', '11px')
    root.setProperty('--cn-border-width-badge', '5px')
  })
  for (const label of ['Nuevo', 'Preventa', 'Juegos de mesa']) {
    const style = await styleOf(badge(page, label), ['border-top-left-radius', 'border-top-width'])
    expect(style, label).toEqual({ 'border-top-left-radius': '11px', 'border-top-width': '5px' })
  }
})

test('the badge is not interactive: it takes no focus and has no role', async ({ page }) => {
  await openDemo(page, 'badge', 'states')
  await expect(cell(page, 'default').locator('a, button, [tabindex]')).toHaveCount(0)
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toHaveCount(0)
})

test('REQ-055: the badge playground sets the variant, and the tag variant is the yellow one', async ({ page }) => {
  await openDemo(page, 'badge', 'playground')
  const target = page.locator('[data-slot="base"]')
  expect(await styleOf(target, ['background-color'])).toEqual({ 'background-color': PINK })
  await setProps(page, { variant: 'tag' })
  await expect(target).toHaveClass(/cn-badge--tag/)
  expect(await styleOf(target, ['background-color'])).toEqual({ 'background-color': YELLOW })
  await setProps(page, { variant: 'outline' })
  await expect(target).toHaveClass(/cn-badge--outline/)
  expect(await styleOf(target, ['background-color'])).toEqual({ 'background-color': CLEAR })
})

test('REQ-027 AC1: axe is clean for the badge', async ({ page }) => {
  await openDemo(page, 'badge', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/badge/states' })
  await openDemo(page, 'badge', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/badge/playground' })
})

// ----------------------------------------------------------------------------------------------------------------- icon

const icon = (page: Page, kind: string) => cell(page, 'default').locator(`[data-icon="${kind}"]`)

test('REQ-026 AC1, AC2: the icon state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf('icon')).toEqual(['default'])
  await expectStateMatrix(page, 'icon', statesOf('icon'))
})

test('UIcon hides itself from assistive technology, and a meaningful icon is an image with a name on its wrapper', async ({
  page,
}) => {
  await openDemo(page, 'icon', 'states')
  // No demo sets aria-hidden: Nuxt UI does, so a decorative icon needs nothing from the author.
  for (const kind of ['decorative', 'size-4', 'size-8'])
    await expect(icon(page, kind), kind).toHaveAttribute('aria-hidden', 'true')
  // The name goes on the wrapper; the icon inside it stays hidden.
  await expect(icon(page, 'meaningful')).toHaveAttribute('role', 'img')
  await expect(icon(page, 'meaningful')).toHaveAttribute('aria-label', 'Advertencia')
  await expect(icon(page, 'meaningful').locator('[aria-hidden="true"]')).toHaveCount(1)
  await expect(page.getByRole('img', { name: 'Advertencia' })).toHaveCount(1)
  // The decorative icons are not in the accessibility tree at all.
  await expect(cell(page, 'default').getByRole('img')).toHaveCount(1)
})

test('the icon takes its color from the text, and is not focusable', async ({ page }) => {
  await openDemo(page, 'icon', 'states')
  const onPage = await styleOf(icon(page, 'decorative'), ['color'])
  const text = await styleOf(icon(page, 'decorative').locator('xpath=..'), ['color'])
  expect(onPage.color).toBe(text.color)
  // On the pink fill the icon is black, the same as a label (SPEC.md section 2.1).
  expect((await styleOf(icon(page, 'on-pink').locator('span').first(), ['color'])).color).toBe(BLACK)
  await expect(cell(page, 'default').locator('[data-icon][tabindex]')).toHaveCount(0)
})

test('the icon size comes from its size class', async ({ page }) => {
  await openDemo(page, 'icon', 'states')
  for (const [kind, size] of [
    ['size-4', 16],
    ['size-8', 32],
  ] as const) {
    const box = await icon(page, kind).boundingBox()
    expect(box?.width, kind).toBe(size)
    expect(box?.height, kind).toBe(size)
  }
})

test('REQ-055: the icon playground names a meaningful icon, and hides a decorative one', async ({ page }) => {
  await openDemo(page, 'icon', 'playground')
  await expect(page.getByTestId('demo-root').locator('.iconify')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('img')).toHaveCount(0)
  await setProps(page, { label: 'Favoritos' })
  await expect(page.getByRole('img', { name: 'Favoritos' })).toBeVisible()
  await setProps(page, { label: '' })
  await expect(page.getByRole('img')).toHaveCount(0)
})

test('ADR-0012: every icon on the demo pages is a Phosphor Bold glyph, including the ones Nuxt UI draws itself', async ({
  page,
}) => {
  for (const [slug, demo] of [
    ['icon', 'states'],
    ['link', 'states'],
    ['badge', 'states'],
    ['button', 'states'],
  ] as const) {
    await openDemo(page, slug, demo)
    const classes = await page.locator('.iconify').evaluateAll((els) => els.map((el) => el.className))
    expect(classes.length, `${slug}: icons on the page`).toBeGreaterThan(0)
    for (const name of classes) expect(name, `${slug}`).toMatch(/i-ph:[a-z-]+-bold/)
  }
})

test('REQ-027 AC1: axe is clean for the icon', async ({ page }) => {
  await openDemo(page, 'icon', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/icon/states' })
  await openDemo(page, 'icon', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/icon/playground' })
})
