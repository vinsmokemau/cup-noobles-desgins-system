// T7.3 (REQ-026 AC3): one baseline image per state of the link, the icon, and the badge, at 360, 768, and 1280 px.
// Baselines are made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped. The
// baseline of the link's `focus-visible` is where its focus ring is seen to be distinct from the text (REQ-024 AC1).
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

const STATES: Record<string, string[]> = {
  link: ['default', 'hover', 'focus-visible', 'active', 'disabled'],
  icon: ['default'],
  badge: ['default'],
}

for (const [slug, states] of Object.entries(STATES)) {
  test(`REQ-026 AC3: every state of the ${slug} matches its baseline`, async ({ page }) => {
    await expectStateBaselines(page, slug, states)
  })
}
