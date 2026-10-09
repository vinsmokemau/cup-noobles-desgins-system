// T5.5: the visual regression setup (A-12, R-08). Baselines are stored in git under tests/e2e/__screenshots__/, one image
// per width, and change only through `pnpm test:visual:update`. Fonts render differently on each OS, so screenshots are
// asserted only where the baselines were made: the pinned Linux container CI runs in. On any other OS the check is
// skipped, never loosened.
import { expect, test, type Locator, type Page } from '@playwright/test'

export const visualEnabled = process.platform === 'linux'

/** Asserts that `target` (a page or one element) matches the stored baseline called `name` at this project's width. */
export async function expectVisual(target: Page | Locator, name: string) {
  test.skip(
    !visualEnabled,
    'Baselines are made in the pinned Linux container only (A-12). Run `pnpm test:visual:update` there.',
  )
  await expect(target).toHaveScreenshot(`${name}.png`)
}
