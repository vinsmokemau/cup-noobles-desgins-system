// T7.4 (REQ-026 AC3): one baseline image per state of the input, the textarea, and the select, at 360, 768, and 1280 px.
// Baselines are made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped. The
// baseline of `focus-visible` is where the focus ring is seen to be distinct from the outline (REQ-024 AC1), and the
// baseline of `error` is where the message and its icon are seen under the field.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

const STATES = ['default', 'hover', 'focus-visible', 'disabled', 'error']

for (const slug of ['input', 'textarea', 'select']) {
  test(`REQ-026 AC3: every state of the ${slug} matches its baseline`, async ({ page }) => {
    await expectStateBaselines(page, slug, STATES)
  })
}
