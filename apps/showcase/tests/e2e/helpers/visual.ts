// T5.5: the visual regression setup (A-12, R-08). Baselines are stored in git under tests/e2e/__screenshots__/, one image
// per width, and change only through `pnpm test:visual:update`. Fonts render differently on each OS, so screenshots are
// asserted only where the baselines were made: the pinned Linux container CI runs in. On any other OS the check is
// skipped, never loosened.
import { expect, test, type Locator, type Page } from '@playwright/test'

export const visualEnabled = process.platform === 'linux'

/**
 * Waits until every icon on the page has been decoded and painted. An icon is a CSS mask whose image is a data URI, and
 * Chromium decodes it after the first paint, so a screenshot taken straight away can show a larger glyph as an empty box
 * (T7.3, ADR-0012). The glyphs are decoded here, then the page is given two frames to paint them.
 */
async function settleIcons(page: Page) {
  await page.evaluate(async () => {
    const urls = new Set<string>()
    for (const el of document.querySelectorAll<HTMLElement>('.iconify')) {
      const mask = getComputedStyle(el).maskImage
      const url = /^url\("(.*)"\)$/.exec(mask)?.[1]
      if (url) urls.add(url)
    }
    await Promise.all(
      [...urls].map((url) => {
        const image = new Image()
        image.src = url
        return image.decode().catch(() => undefined)
      }),
    )
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

/** Asserts that `target` (a page or one element) matches the stored baseline called `name` at this project's width. */
export async function expectVisual(target: Page | Locator, name: string) {
  test.skip(
    !visualEnabled,
    'Baselines are made in the pinned Linux container only (A-12). Run `pnpm test:visual:update` there.',
  )
  await settleIcons('page' in target && typeof target.page === 'function' ? target.page() : (target as Page))
  await expect(target).toHaveScreenshot(`${name}.png`)
}
