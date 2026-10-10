// T7.9: the demo pages of CnLogo at 360, 768, and 1280 px (the three `w*` projects): axe (REQ-027 AC1) and no horizontal
// overflow (REQ-028 AC1). A logo is not interactive, so there is no target to measure (REQ-028 AC2). The checks that do not
// depend on the width are in logo.spec.ts.
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { test } from './helpers/test'

for (const demo of ['states', 'playground']) {
  test(`/_demo/logo/${demo}: axe and overflow`, async ({ page, viewport }) => {
    await openDemo(page, 'logo', demo)
    const label = `/_demo/logo/${demo} at ${viewport!.width} px`
    await expectNoA11yViolations(page, { label })
    await expectNoHorizontalOverflow(page, label)
  })
}
