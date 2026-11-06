// T15.18 end-to-end checks of the skip link and its main region (DSR-14, REQ-020, REQ-024, REQ-026, REQ-027, REQ-028, REQ-060
// AC2, ADR-0072). The keyboard checks run on the real showcase layout, which uses the components, and the state checks on the
// isolated demo pages, in the `functional` project at 1280 px; they set the width themselves where a check depends on it. The
// same demo pages are audited at 360, 768, and 1280 px in molecules.matrix.ts, and the baselines are in skip-link.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { waitForHydration } from './helpers/ready'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test, withBase } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/atoms/skip-link.md', import.meta.url)),
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

const box = (target: Locator) =>
  target.evaluate((el) => {
    const { x, y, width, height } = el.getBoundingClientRect()
    return { x, y, width, height }
  })

/** True when the link is above the top edge of the page, where it is hidden. */
const isHidden = async (target: Locator) => {
  const { y, height } = await box(target)
  return y + height <= 0
}

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'focus-visible'])
  await expectStateMatrix(page, 'skip-link', statesOf())
})

test('Done when: Tab reveals the link as the first focusable element, Enter moves focus to the main region, and the link hides again', async ({
  page,
}) => {
  await page.goto('/')
  await waitForHydration(page)
  const skip = page.getByRole('link', { name: 'Skip to content' })
  // Hidden until it receives keyboard focus: it is above the top edge of the page, and still in the page.
  await expect(skip).toBeAttached()
  expect(await isHidden(skip), 'the link is hidden before it has focus').toBe(true)
  // The first focusable element of the page.
  const first = await page.evaluate(() => {
    const tabbable = [...document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')]
    return tabbable.find((el) => el.tabIndex >= 0 && !el.closest('[inert], [hidden]'))?.className ?? ''
  })
  expect(first).toContain('cn-skip-link')
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  expect(await isHidden(skip), 'the link is shown on keyboard focus').toBe(false)
  const shown = await box(skip)
  expect(shown.y).toBeGreaterThanOrEqual(0)
  expect(shown.x).toBeGreaterThanOrEqual(0)
  // Enter follows the link and moves keyboard focus to the main region, not just the scroll position.
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main-content$/)
  const main = page.getByRole('main')
  await expect(main).toBeFocused()
  expect(await main.getAttribute('tabindex')).toBe('-1')
  // Focus left the link, so it is hidden again, and the next Tab goes into the content, not back into the header.
  expect(await isHidden(skip), 'the link is hidden again once focus leaves it').toBe(true)
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.closest('header, [role="banner"]') !== null)).toBe(false)
  await expect(skip).not.toBeFocused()
})

test('REQ-024 AC1: the shown link has the pink fill, black text, the thick outline, and the yellow ring of ADR-0009', async ({
  page,
}) => {
  await page.goto('/')
  await waitForHydration(page)
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  const style = await skip.evaluate((el) => {
    const s = getComputedStyle(el)
    return {
      background: s.backgroundColor,
      color: s.color,
      outlineColor: s.outlineColor,
      outlineWidth: s.outlineWidth,
      outlineOffset: s.outlineOffset,
      outlineStyle: s.outlineStyle,
      borderWidth: s.borderTopWidth,
      position: s.position,
    }
  })
  expect(style.background).toBe('rgb(239, 128, 174)')
  expect(style.color).toBe('rgb(0, 0, 0)')
  expect(style.outlineColor).toBe('rgb(255, 244, 136)')
  expect(style.outlineWidth).toBe('3px')
  expect(style.outlineOffset).toBe('3px')
  expect(style.outlineStyle).toBe('solid')
  expect(style.borderWidth).toBe('3px')
  expect(style.position).toBe('fixed')
})

test('REQ-028, Done when: the shown link is at least 44 px tall at 360 px and does not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  await waitForHydration(page)
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  const { width, height, x } = await box(skip)
  expect(height, 'the shown link is at least 44 px tall').toBeGreaterThanOrEqual(44)
  expect(width, 'the shown link is at least 44 px wide').toBeGreaterThanOrEqual(44)
  expect(x + width, 'the shown link fits in 360 px').toBeLessThanOrEqual(360)
  await expectNoHorizontalOverflow(page, 'the showcase at 360 px with the skip link shown')
})

test('Done when: the link is in the server-rendered HTML, before the header, and works with no JavaScript', async ({
  browser,
  request,
}) => {
  const response = await request.get(withBase('/'))
  expect(response.status()).toBe(200)
  const html = await response.text()
  const link = html.indexOf('class="cn-skip-link"')
  expect(link, 'the skip link is in the HTML the server sends').toBeGreaterThan(-1)
  expect(html.slice(link, link + 120)).toContain('href="#main-content"')
  expect(html.indexOf('<header')).toBeGreaterThan(link)
  expect(html).toMatch(/<main id="main-content" tabindex="-1" class="cn-main/)
  // With JavaScript turned off, the reveal and the jump still work: they are CSS and a real link.
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } })
  try {
    const bare = await context.newPage()
    await bare.goto(withBase('/'))
    const skip = bare.getByRole('link', { name: 'Skip to content' })
    expect(await isHidden(skip)).toBe(true)
    await bare.keyboard.press('Tab')
    await expect(skip).toBeFocused()
    expect(await isHidden(skip)).toBe(false)
    await bare.keyboard.press('Enter')
    await expect(bare).toHaveURL(/#main-content$/)
    await expect(bare.getByRole('main')).toBeFocused()
  } finally {
    await context.close()
  }
})

test('REQ-060 AC2: a mouse click on the page does not reveal the link, because it shows on :focus-visible only', async ({
  page,
}) => {
  await page.goto('/')
  await waitForHydration(page)
  await page.mouse.click(700, 400)
  expect(await isHidden(page.getByRole('link', { name: 'Skip to content' }))).toBe(true)
})

test('REQ-026: in the matrix the default cell hides the link and the focus-visible cell shows it over the header', async ({
  page,
}) => {
  await openDemo(page, 'skip-link', 'states')
  const hidden = page.locator('[data-state="default"] .cn-skip-link')
  const shown = page.locator('[data-state="focus-visible"] .cn-skip-link')
  const stage = page.locator('[data-state="focus-visible"]')
  const area = await box(stage)
  const away = await box(hidden)
  expect(away.y + away.height, 'the hidden link is above its stage').toBeLessThanOrEqual(area.y)
  const link = await box(shown)
  expect(link.y).toBeGreaterThanOrEqual(area.y)
  expect(link.y + link.height).toBeLessThanOrEqual(area.y + area.height)
  expect(link.height).toBeGreaterThanOrEqual(44)
  await expect(shown).toHaveText('Saltar al contenido')
})

test('REQ-027 AC2: in the playground the label and the shown state follow the controls, and Enter moves focus to the target', async ({
  page,
}) => {
  await openDemo(page, 'skip-link', 'playground')
  const skip = page.getByRole('link', { name: 'Saltar al contenido' })
  await expect(skip).toHaveAttribute('href', '#contenido')
  expect(await isHidden(skip)).toBe(false)
  await setProps(page, { label: 'Ir al contenido', shown: false })
  const renamed = page.getByRole('link', { name: 'Ir al contenido' })
  await expect(renamed).toBeAttached()
  expect(await isHidden(renamed)).toBe(true)
  await page.keyboard.press('Tab')
  await expect(renamed).toBeFocused()
  expect(await isHidden(renamed)).toBe(false)
  await page.keyboard.press('Enter')
  await expect(page.locator('#contenido')).toBeFocused()
})

test('REQ-027 AC1: the demo pages have no axe violations, with the link hidden and shown', async ({ page }) => {
  for (const demo of ['states', 'playground']) {
    await openDemo(page, 'skip-link', demo)
    await expectNoA11yViolations(page, { label: `/_demo/skip-link/${demo}` })
  }
})
