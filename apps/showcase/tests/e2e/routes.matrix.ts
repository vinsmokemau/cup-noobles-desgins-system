// T5.5, T5.7: every route of the showcase, at 360, 768, and 1280 px (the three `w*` projects). One test per route, which
// loads the page once and runs the checks as named steps, one per acceptance criterion. Covers REQ-060 AC1 (axe),
// REQ-060 AC2 (skip link, landmarks, keyboard), REQ-061 AC1 (overflow at 360 px, checked at all three widths), and
// REQ-028 AC2 (target size). A step that fails does not stop the others, so one run reports every broken criterion; the
// failure names the route and the criterion of each step.
import { builtRoutes } from './helpers/crawl'
import { expect, test } from './helpers/test'
import { expectNoA11yViolations, expectNoHorizontalOverflow, expectTargetSize } from './helpers/a11y'
import { waitForPage } from './helpers/ready'

const routes = builtRoutes()
// The 404 page is not a file named index.html, so it is added by a path that has no page.
const missing = '/no-such-page'

test('the build has routes to audit', () => {
  expect(routes.length).toBeGreaterThan(20)
})

for (const route of [...routes, missing]) {
  test(`${route}: the route checks`, async ({ page, viewport }) => {
    const failures: string[] = []
    // Runs one check as a named step. The step title is the report's name for the criterion; the message of a failure
    // starts with the route, the width, and the criterion.
    const step = async (criterion: string, check: () => Promise<void>) => {
      try {
        await test.step(criterion, check)
      } catch (error) {
        failures.push(`${route} at ${viewport!.width} px, ${criterion}\n${(error as Error).message}`)
      }
    }

    const response = await page.goto(route)
    expect(response?.status()).toBe(route === missing ? 404 : 200)
    await waitForPage(page)

    await step('REQ-060 AC1: axe reports no violation', () => expectNoA11yViolations(page, { label: route }))
    await step('REQ-061 AC1: no horizontal overflow', () => expectNoHorizontalOverflow(page, route))
    await step('REQ-028 AC2: every target is at least 24 x 24 px', () => expectTargetSize(page, route))
    await step('REQ-060 AC2: the navigation is a landmark, in the sidebar or behind the menu button', async () => {
      if (viewport!.width >= 768) {
        await expect(page.getByRole('navigation', { name: 'Documentation' })).toBeVisible()
      } else {
        await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible()
      }
    })
    // Last, because it presses keys and moves the page to its main region.
    await step('REQ-060 AC2: one main landmark, one banner, and a skip link as the first Tab stop', async () => {
      await expect(page.getByRole('main')).toHaveCount(1)
      await expect(page.getByRole('banner')).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1 })).not.toHaveCount(0)
      await page.keyboard.press('Tab')
      const skip = page.getByRole('link', { name: 'Skip to content' })
      await expect(skip).toBeFocused()
      await expect(skip).toBeVisible()
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/#main-content$/)
    })

    expect(failures, `${failures.length} criteria failed`).toEqual([])
  })
}

// Tabbing through whole pages is slow, so the keyboard walk runs on one page per kind rather than on all of them.
const walked = ['/', '/foundations', '/foundations/color', '/components/button', '/governance/decisions', missing]

for (const route of walked) {
  test(`REQ-060 AC2: ${route} can be operated by keyboard alone, with no trap`, async ({ page }) => {
    await page.goto(route)
    // The 404 page is drawn by the client after it loads, so wait for it before the first Tab.
    await waitForPage(page)
    await expect(page.getByRole('main')).toBeVisible()
    const seen = new Set<string>()
    let previous = ''
    for (let stop = 0; stop < 400; stop++) {
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return null
        // A card's stretched link has no box of its own: a child spans the card, and the card shows the focus ring.
        const sized = (node: Element) => {
          const box = node.getBoundingClientRect()
          return box.width > 0 && box.height > 0
        }
        return {
          id: `${el.tagName}|${el.getAttribute('href') ?? ''}|${el.getAttribute('aria-label') ?? ''}|${(el.textContent ?? '').trim().slice(0, 30)}`,
          visible:
            getComputedStyle(el).visibility !== 'hidden' && (sized(el) || [...el.querySelectorAll('*')].some(sized)),
        }
      })
      // Focus leaving the document (to the browser UI) or coming back to the first stop ends the walk: no trap.
      if (!focus || seen.has(focus.id)) break
      expect(focus.visible, `${focus.id} takes focus but cannot be seen`).toBe(true)
      expect(focus.id, 'focus is stuck').not.toBe(previous)
      seen.add(focus.id)
      previous = focus.id
    }
    expect(seen.size, 'the page has focusable elements').toBeGreaterThan(1)
    expect(seen.size, 'the walk ended before the cap').toBeLessThan(400)
  })
}
