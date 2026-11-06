// T15.18 (REQ-026 AC3): one baseline image per state of CnSkipLink, at 360, 768, and 1280 px: hidden above the header, and shown
// over it. Baselines are made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

test('REQ-026 AC3: every state of the skip link matches its baseline', async ({ page }) => {
  await expectStateBaselines(page, 'skip-link', ['default', 'focus-visible'])
})
