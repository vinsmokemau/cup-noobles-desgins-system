// T7.7 end-to-end checks of CnLogo (REQ-030, REQ-026, REQ-027, REQ-029). They run against the isolated demo pages, `states` and
// `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and 1280 px in logo.matrix.ts,
// and the baselines are in logo.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/atoms/logo.md', import.meta.url)),
  'utf8',
)
const PLACEHOLDER = 'Logo asset pending (TBD-17)'
const BLACK = 'rgb(0, 0, 0)'
// The placeholder neutral (TBD-05), `#90a1b9`. It is not a brand value; the test reads it only to prove which token the rule uses.
const NEUTRAL = 'rgb(144, 161, 185)'

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
  expect(listed).toEqual(['default'])
  await expectStateMatrix(page, 'logo', listed)
})

test('REQ-030 AC1, AC2: all three variants render the placeholder text', async ({ page }) => {
  await openDemo(page, 'logo', 'states')
  for (const variant of ['icon', 'vertical', 'horizontal']) {
    const logo = page.locator(`.cn-logo[data-variant="${variant}"][role="img"]`)
    await expect(logo, variant).toHaveCount(1)
    await expect(logo, variant).toContainText(PLACEHOLDER)
  }
  // Every logo shows the note and nothing else: no SVG, no image, no background image, so no logo is invented.
  for (const logo of await page.locator('.cn-logo').all()) {
    await expect(logo).toHaveText(PLACEHOLDER)
    await expect(logo.locator('svg, img, picture, canvas, video')).toHaveCount(0)
    expect(await logo.evaluate((el) => getComputedStyle(el).backgroundImage)).toBe('none')
  }
})

test('REQ-030 AC1, REQ-027: a named logo is an image with its label; a decorative one is hidden from assistive technology', async ({
  page,
}) => {
  await openDemo(page, 'logo', 'states')
  await expect(page.getByRole('img', { name: 'Cup Noobles, icono' })).toHaveCount(1)
  await expect(page.getByRole('img', { name: 'Cup Noobles, versión vertical' })).toHaveCount(1)
  await expect(page.getByRole('img', { name: 'Cup Noobles, versión horizontal' })).toHaveCount(1)
  // The placeholder note is never the accessible name, and the decorative logo is not in the accessibility tree at all.
  await expect(page.getByRole('img')).toHaveCount(3)
  const decorative = page.locator('.cn-logo[aria-hidden="true"]')
  await expect(decorative).toHaveCount(1)
  await expect(decorative).not.toHaveAttribute('role', /.*/)
  await expect(decorative).not.toHaveAttribute('aria-label', /.*/)
  await expect(page.locator('.cn-logo__placeholder:not([aria-hidden="true"])')).toHaveCount(0)
})

test('REQ-029 AC1: a logo has no focusable element and no tab stop', async ({ page }) => {
  await openDemo(page, 'logo', 'states')
  expect(
    await page
      .locator('.cn-logo, .cn-logo *')
      .evaluateAll((els) => els.filter((el) => (el as HTMLElement).tabIndex >= 0).length),
  ).toBe(0)
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.closest('.cn-logo') ?? null)).toBeNull()
})

test('the logo playground follows its controls, and the label is dropped when it is decorative', async ({ page }) => {
  await openDemo(page, 'logo', 'playground')
  const logo = page.locator('.cn-logo')
  await expect(logo).toHaveAttribute('data-variant', 'horizontal')
  await expect(page.getByRole('img', { name: 'Cup Noobles' })).toHaveCount(1)
  await setProps(page, { variant: 'icon', label: 'Cup Noobles, inicio' })
  await expect(logo).toHaveAttribute('data-variant', 'icon')
  await expect(page.getByRole('img', { name: 'Cup Noobles, inicio' })).toHaveCount(1)
  await expectNoA11yViolations(page, { label: 'logo playground, named' })
  await setProps(page, { decorative: true })
  await expect(logo).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('img')).toHaveCount(0)
  await expectNoA11yViolations(page, { label: 'logo playground, decorative' })
})

test('the logo rule reads its tokens: overriding them changes the placeholder', async ({ page }) => {
  await openDemo(page, 'logo', 'states')
  const first = page.locator('.cn-logo').first()
  const read = () =>
    first.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        background: style.backgroundColor,
        border: style.borderTopColor,
        width: style.borderTopWidth,
        color: style.color,
      }
    })
  expect(await read()).toEqual({ background: BLACK, border: NEUTRAL, width: '1px', color: NEUTRAL })
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-logo-placeholder-bg', 'rgb(13, 14, 15)')
    root.setProperty('--cn-logo-placeholder-border', 'rgb(1, 2, 3)')
    root.setProperty('--cn-logo-placeholder-fg', 'rgb(7, 8, 9)')
    root.setProperty('--cn-border-width-logo', '5px')
  })
  expect(await read()).toEqual({
    background: 'rgb(13, 14, 15)',
    border: 'rgb(1, 2, 3)',
    width: '5px',
    color: 'rgb(7, 8, 9)',
  })
})

test('REQ-027 AC1: axe is clean on both logo demos', async ({ page }) => {
  for (const demo of ['states', 'playground']) {
    await openDemo(page, 'logo', demo)
    await expectNoA11yViolations(page, { label: `/_demo/logo/${demo}` })
  }
})
