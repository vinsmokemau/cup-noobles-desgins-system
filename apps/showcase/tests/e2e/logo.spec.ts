// T7.9 end-to-end checks of CnLogo with the supplied logo files (REQ-030, REQ-026, REQ-027, ADR-0016). They run against the
// isolated demo pages, `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at 360,
// 768, and 1280 px in logo.matrix.ts, and the baselines are in logo.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/atoms/logo.md', import.meta.url)),
  'utf8',
)
// The owner values (ADR-0016): the minimum height of each variant, in px, and the clear space as a share of the height.
const MIN = { icon: 64, vertical: 80, horizontal: 36 } as const
const CLEAR_SPACE = 0.25
const FILE = { icon: 'Icon-CN', vertical: 'LogoVertical-CN', horizontal: 'LogoHorizontal-CN' } as const

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const box = (logo: Locator) =>
  logo.evaluate((el) => {
    const root = getComputedStyle(el)
    const image = getComputedStyle(el.querySelector('img')!)
    return {
      padding: Number.parseFloat(root.paddingTop),
      paddingLeft: Number.parseFloat(root.paddingLeft),
      height: Number.parseFloat(image.height),
    }
  })

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
  expect(listed).toEqual(['default'])
  await expectStateMatrix(page, 'logo', listed)
})

test('REQ-030 AC3: each variant renders its own supplied SVG file, loaded, as an image', async ({ page }) => {
  await openDemo(page, 'logo', 'states')
  for (const variant of ['icon', 'vertical', 'horizontal'] as const) {
    const image = page.locator(`.cn-logo[data-variant="${variant}"] img`).first()
    await expect(image, variant).toHaveAttribute('src', new RegExp(`${FILE[variant]}[^/]*\\.svg$`))
    expect(await image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), variant).toBe(true)
  }
  // The files are not inlined, and the component draws nothing of its own: the page holds no <svg> from the logos.
  await expect(page.locator('.cn-logo svg')).toHaveCount(0)
})

test('REQ-030 AC1, REQ-027: a named logo has its label as its name; a decorative one is hidden from assistive technology', async ({
  page,
}) => {
  await openDemo(page, 'logo', 'states')
  await expect(page.getByRole('img', { name: 'Cup Noobles, icono' })).toHaveCount(1)
  await expect(page.getByRole('img', { name: 'Cup Noobles, versión vertical' })).toHaveCount(1)
  await expect(page.getByRole('img', { name: 'Cup Noobles, versión horizontal' })).toHaveCount(1)
  await expect(page.getByRole('img')).toHaveCount(3)
  const decorative = page.locator('.cn-logo img[aria-hidden="true"]')
  await expect(decorative).toHaveCount(1)
  await expect(decorative).toHaveAttribute('alt', '')
})

test('ADR-0016: each logo shows at its minimum height, with a clear space of 25% of that height on every side', async ({
  page,
}) => {
  await openDemo(page, 'logo', 'states')
  for (const variant of ['icon', 'vertical', 'horizontal'] as const) {
    const measured = await box(page.locator(`.cn-logo[data-variant="${variant}"]`).first())
    expect(measured.height, `${variant} height`).toBeCloseTo(MIN[variant], 1)
    expect(measured.padding, `${variant} clear space above`).toBeCloseTo(MIN[variant] * CLEAR_SPACE, 1)
    expect(measured.paddingLeft, `${variant} clear space beside`).toBeCloseTo(MIN[variant] * CLEAR_SPACE, 1)
  }
})

test('ADR-0016: a page can make a logo larger, never smaller than its minimum, and the clear space follows the height', async ({
  page,
}) => {
  await openDemo(page, 'logo', 'states')
  const logo = page.locator('.cn-logo[data-variant="vertical"]').first()
  await logo.evaluate((el) => (el as HTMLElement).style.setProperty('--logo-height', '200px'))
  const larger = await box(logo)
  expect(larger.height).toBeCloseTo(200, 1)
  expect(larger.padding).toBeCloseTo(50, 1)
  await logo.evaluate((el) => (el as HTMLElement).style.setProperty('--logo-height', '10px'))
  const smaller = await box(logo)
  expect(smaller.height).toBeCloseTo(MIN.vertical, 1)
  expect(smaller.padding).toBeCloseTo(MIN.vertical * CLEAR_SPACE, 1)
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
  await expect(logo.locator('img')).toHaveAttribute('src', new RegExp(`${FILE.icon}[^/]*\\.svg$`))
  await expect(page.getByRole('img', { name: 'Cup Noobles, inicio' })).toHaveCount(1)
  await expectNoA11yViolations(page, { label: 'logo playground, named' })
  await setProps(page, { decorative: true })
  await expect(logo.locator('img')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('img')).toHaveCount(0)
  await expectNoA11yViolations(page, { label: 'logo playground, decorative' })
})

test('the logo rule reads its tokens: overriding them changes the size and the clear space', async ({ page }) => {
  await openDemo(page, 'logo', 'states')
  const logo = page.locator('.cn-logo[data-variant="icon"]').first()
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-logo-min-height-icon', '100px')
    root.setProperty('--cn-logo-clear-space', '0.5')
  })
  const measured = await box(logo)
  expect(measured.height).toBeCloseTo(100, 1)
  expect(measured.padding).toBeCloseTo(50, 1)
})

test('REQ-027 AC1: axe is clean on both logo demos', async ({ page }) => {
  for (const demo of ['states', 'playground']) {
    await openDemo(page, 'logo', demo)
    await expectNoA11yViolations(page, { label: `/_demo/logo/${demo}` })
  }
})
