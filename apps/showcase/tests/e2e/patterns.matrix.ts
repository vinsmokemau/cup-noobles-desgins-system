// T9.1, T9.2: the composed demo pages of the seven patterns at 360, 768, and 1280 px (the three `w*`
// projects): axe (REQ-027 AC1), no horizontal overflow (REQ-028 AC1), and a target of at least 24 x 24 px (REQ-028 AC2).
// The behavior of each demo is in patterns.spec.ts. The responsive-behavior layouts are checked below, per width.
import { expectNoA11yViolations, expectNoHorizontalOverflow, expectTargetSize } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const SLUGS = ['forms', 'feedback', 'loading', 'navigation', 'empty-states', 'error-pages', 'responsive-behavior']

for (const slug of SLUGS) {
  test(`/_demo/${slug}/composed: axe, overflow, and target size`, async ({ page, viewport }) => {
    await openDemo(page, slug, 'composed')
    const label = `/_demo/${slug}/composed at ${viewport!.width} px`
    await expectNoA11yViolations(page, { label })
    await expectNoHorizontalOverflow(page, label)
    await expectTargetSize(page, label)
  })
}

// T9.2: the responsive-behavior pattern changes with the width, so each test reads the width of its project.
test('the card grid has one column at 360 px, two at 768 px, and three at 1280 px', async ({ page, viewport }) => {
  await openDemo(page, 'responsive-behavior', 'composed')
  const columns = await page
    .getByTestId('rwd-card')
    .evaluateAll((cards) => new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left))).size)
  expect(columns).toBe(viewport!.width === 360 ? 1 : viewport!.width === 768 ? 2 : 3)
})

test('the sidebar stacks below 768 px and sits beside the content from it', async ({ page, viewport }) => {
  await openDemo(page, 'responsive-behavior', 'composed')
  const side = await page.getByTestId('rwd-side').boundingBox()
  const content = await page.getByTestId('rwd-main').boundingBox()
  if (viewport!.width === 360) expect(content!.y).toBeGreaterThanOrEqual(side!.y + side!.height)
  else expect(Math.abs(content!.y - side!.y)).toBeLessThan(2)
})

test('the table scrolls inside its own region, which a keyboard can reach, and the page does not scroll', async ({
  page,
}) => {
  await openDemo(page, 'responsive-behavior', 'composed')
  const region = page.getByRole('region', { name: 'Tabla de mesas, con desplazamiento' })
  await region.focus()
  await expect(region).toBeFocused()
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
})
