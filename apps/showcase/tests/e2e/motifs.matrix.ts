// T7.8: the demo pages of CnSparkle and CnStickerFrame at 360, 768, and 1280 px (the three `w*` projects): axe (REQ-027 AC1)
// and no horizontal overflow (REQ-028 AC1), which for the sticker frame includes content wider than the screen. Neither motif
// is interactive, so there is no target to measure (REQ-028 AC2). The checks that do not depend on the width are in
// motifs.spec.ts.
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { test } from './helpers/test'

for (const slug of ['sparkle', 'sticker-frame']) {
  for (const demo of ['states', 'playground']) {
    test(`/_demo/${slug}/${demo}: axe and overflow`, async ({ page, viewport }) => {
      await openDemo(page, slug, demo)
      const label = `/_demo/${slug}/${demo} at ${viewport!.width} px`
      await expectNoA11yViolations(page, { label })
      await expectNoHorizontalOverflow(page, label)
    })
  }
}
