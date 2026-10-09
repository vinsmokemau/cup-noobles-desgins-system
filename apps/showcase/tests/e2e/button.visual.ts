// T7.2 (REQ-023 AC4, REQ-026 AC3): one baseline image per state of the button, at 360, 768, and 1280 px. Baselines are made
// and compared in the pinned Linux container only (A-12), so on any other OS this is skipped. The baseline of
// `focus-visible` is where the focus ring is seen to be distinct from the glow (REQ-024 AC1).
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

test('REQ-026 AC3: every state of the button matches its baseline', async ({ page }) => {
  await expectStateBaselines(page, 'button', ['default', 'hover', 'focus-visible', 'active', 'disabled', 'loading'])
})
