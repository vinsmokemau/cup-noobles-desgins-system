// T5.5: the shared accessibility and layout assertions (REQ-060 AC1, REQ-061 AC1, REQ-028 AC1). The component tasks
// (T7.x onward) import these, so every demo page is held to the same bar as the routes.
import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

// WCAG 2.2 level AA (A-10): axe tags every rule with the first level and version that introduced it.
export const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

export interface A11yOptions {
  /** A CSS selector to audit instead of the whole page, for example one demo. */
  include?: string
  /** Names the thing under audit in the failure message. */
  label?: string
}

/** Fails with every axe violation, its rule, and the elements it hit. Never disable a rule here; fix the cause. */
export async function expectNoA11yViolations(page: Page, { include, label = page.url() }: A11yOptions = {}) {
  const builder = new AxeBuilder({ page }).withTags(wcagTags)
  if (include) builder.include(include)
  const { violations } = await builder.analyze()
  const report = violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help}\n` +
      violation.nodes.map((node) => `    ${node.target.join(' ')}\n      ${node.failureSummary}`).join('\n'),
  )
  expect(report, `axe violations on ${label}`).toEqual([])
}

/** The page is no wider than the viewport (REQ-061 AC1, REQ-028 AC1). */
export async function expectNoHorizontalOverflow(page: Page, label = page.url()) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  expect(scrollWidth, `horizontal overflow on ${label}`).toBeLessThanOrEqual(innerWidth)
}

/**
 * Every visible interactive target is at least 24 x 24 CSS px (WCAG 2.2 SC 2.5.8, REQ-028 AC2). A link inside a
 * sentence is exempt, as the criterion allows. Returns nothing; fails with the offenders.
 */
export async function expectTargetSize(page: Page, label = page.url()) {
  const small = await page.evaluate(() => {
    const targets = document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [role="button"]')
    return [...targets]
      .filter((el) => {
        const box = el.getBoundingClientRect()
        if (box.width === 0 || box.height === 0) return false
        if (el.closest('.sr-only') || getComputedStyle(el).display === 'inline') return false
        return box.width < 24 || box.height < 24
      })
      .map(
        (el) =>
          `${el.tagName.toLowerCase()} "${(el.textContent ?? el.getAttribute('aria-label') ?? '').trim().slice(0, 40)}"`,
      )
  })
  expect(small, `targets under 24 x 24 px on ${label}`).toEqual([])
}
