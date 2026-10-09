// T7.4: the demo pages of the input, the textarea, and the select at 360, 768, and 1280 px (the three `w*` projects): axe
// (REQ-027 AC1), no horizontal overflow (REQ-028 AC1), and a target of at least 24 x 24 px (REQ-028 AC2). The checks that do
// not depend on the width are in text-fields.spec.ts.
import { expectNoA11yViolations, expectNoHorizontalOverflow, expectTargetSize } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { test } from './helpers/test'

for (const slug of ['input', 'textarea', 'select']) {
  for (const demo of ['states', 'playground']) {
    test(`/_demo/${slug}/${demo}: axe, overflow, and target size`, async ({ page, viewport }) => {
      await openDemo(page, slug, demo)
      const label = `/_demo/${slug}/${demo} at ${viewport!.width} px`
      await expectNoA11yViolations(page, { label })
      await expectNoHorizontalOverflow(page, label)
      await expectTargetSize(page, label)
    })
  }
}
