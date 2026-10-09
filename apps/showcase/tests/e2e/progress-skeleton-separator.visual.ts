// T7.6 (REQ-026 AC3): one baseline image per state of the progress bar, the skeleton, and the separator, at 360, 768, and
// 1280 px. Baselines are made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped.
// Playwright freezes CSS animations when it takes a screenshot, so the skeleton and the indeterminate bar are still.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

const STATES = {
  progress: ['default', 'empty', 'complete', 'indeterminate'],
  skeleton: ['default'],
  separator: ['default'],
}

for (const [slug, states] of Object.entries(STATES)) {
  test(`REQ-026 AC3: every state of the ${slug} matches its baseline`, async ({ page }) => {
    await expectStateBaselines(page, slug, states)
  })
}
