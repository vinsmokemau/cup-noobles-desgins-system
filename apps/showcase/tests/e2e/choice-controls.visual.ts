// T7.5 (REQ-026 AC3): one baseline image per state of the checkbox, the radio group, and the switch, at 360, 768, and 1280 px.
// Baselines are made and compared in the pinned Linux container only (A-12), so on any other OS this is skipped. The baseline
// of `focus-visible` is where the focus ring is seen to be distinct from the outline (REQ-024 AC1), and the baseline of
// `checked` is where the pink fill and the black mark are seen.
import { expectStateBaselines } from './helpers/states'
import { test } from './helpers/test'

const STATES = {
  checkbox: ['default', 'hover', 'focus-visible', 'checked', 'indeterminate', 'disabled'],
  'radio-group': ['default', 'hover', 'focus-visible', 'checked', 'disabled'],
  switch: ['default', 'hover', 'focus-visible', 'checked', 'disabled'],
}

for (const [slug, states] of Object.entries(STATES)) {
  test(`REQ-026 AC3: every state of the ${slug} matches its baseline`, async ({ page }) => {
    await expectStateBaselines(page, slug, states)
  })
}
