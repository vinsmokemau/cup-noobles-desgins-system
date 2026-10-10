// T8.1 (REQ-026 AC3): one baseline image per state of the form field and the card, at 360, 768, and 1280 px. Baselines are
// made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped. The baseline of the form
// field's `error` state is where the message and its icon are seen under the control, and the card's baseline is where the
// pink outline and dividers are seen on the black page.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

const STATES = {
  'form-field': ['default', 'hover', 'focus-visible', 'disabled', 'error'],
  card: ['default'],
}

for (const [slug, states] of Object.entries(STATES)) {
  test(`REQ-026 AC3: every state of the ${slug} matches its baseline`, async ({ page }) => {
    await expectStateBaselines(page, slug, states)
  })
}
