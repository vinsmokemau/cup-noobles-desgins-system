// T7.6: the demo pages of the progress bar, the skeleton, and the separator at 360, 768, and 1280 px (the three `w*`
// projects): axe (REQ-027 AC1) and no horizontal overflow (REQ-028 AC1). None of the three is interactive, so there is no
// target to measure (REQ-028 AC2). The checks that do not depend on the width are in progress-skeleton-separator.spec.ts.
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { test } from './helpers/test'

for (const slug of ['progress', 'skeleton', 'separator']) {
  for (const demo of ['states', 'playground']) {
    test(`/_demo/${slug}/${demo}: axe and overflow`, async ({ page, viewport }) => {
      await openDemo(page, slug, demo)
      const label = `/_demo/${slug}/${demo} at ${viewport!.width} px`
      await expectNoA11yViolations(page, { label })
      await expectNoHorizontalOverflow(page, label)
    })
  }
}
