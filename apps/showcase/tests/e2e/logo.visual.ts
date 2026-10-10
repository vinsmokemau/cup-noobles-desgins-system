// T7.9 (REQ-026 AC3): one baseline image per state of CnLogo, at 360, 768, and 1280 px, with the supplied logo files. Baselines are
// made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

test('REQ-026 AC3: every state of the logo matches its baseline', async ({ page }) => {
  await expectStateBaselines(page, 'logo', ['default'])
})
