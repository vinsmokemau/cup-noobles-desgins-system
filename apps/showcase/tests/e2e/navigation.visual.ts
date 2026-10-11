// T8.4 (REQ-026 AC3): one baseline image per state of the tabs, the breadcrumb, and the pagination, at 360, 768, and 1280 px.
// Baselines are made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped. The tabs'
// `selected` baseline is where the pink underline is seen on the neutral rule, and the pagination's is where the pink chip is
// seen among the outlined pages.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

const STATES = {
  tabs: ['default', 'hover', 'focus-visible', 'selected', 'disabled'],
  breadcrumb: ['default', 'hover', 'focus-visible'],
  pagination: ['default', 'hover', 'focus-visible', 'selected', 'disabled'],
}

for (const [slug, states] of Object.entries(STATES)) {
  test(`REQ-026 AC3: every state of the ${slug} matches its baseline`, async ({ page }) => {
    await expectStateBaselines(page, slug, states)
  })
}
