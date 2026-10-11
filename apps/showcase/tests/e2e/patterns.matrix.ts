// T9.1: the composed demo pages of the forms, feedback, and loading patterns at 360, 768, and 1280 px (the three `w*`
// projects): axe (REQ-027 AC1), no horizontal overflow (REQ-028 AC1), and a target of at least 24 x 24 px (REQ-028 AC2).
// The behavior of each demo is in patterns.spec.ts.
import { expectNoA11yViolations, expectNoHorizontalOverflow, expectTargetSize } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { test } from './helpers/test'

for (const slug of ['forms', 'feedback', 'loading']) {
  test(`/_demo/${slug}/composed: axe, overflow, and target size`, async ({ page, viewport }) => {
    await openDemo(page, slug, 'composed')
    const label = `/_demo/${slug}/composed at ${viewport!.width} px`
    await expectNoA11yViolations(page, { label })
    await expectNoHorizontalOverflow(page, label)
    await expectTargetSize(page, label)
  })
}
