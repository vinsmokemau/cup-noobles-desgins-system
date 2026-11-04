// T15.14 (DSR-12, ADR-0070): the `2xl` size of the checkbox and the radio group. Every row is at least 44 px tall, and the
// label fills the row, so a tap on the text toggles the control. Runs at 360, 768, and 1280 px (the three `w*` projects).
// The axe and overflow checks of the same cells are in choice-controls.matrix.ts, because the cell is in the states demo.
import type { Page } from '@playwright/test'
import { expectNoHorizontalOverflow } from './helpers/a11y'
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const MIN = 44

for (const slug of ['checkbox', 'radio-group'] as const) {
  const cell = (page: Page) => page.locator('[data-state="touch-target"]:not([data-slot])')

  test(`/_demo/${slug}/states: every label of the touch-target cell is at least ${MIN} px tall`, async ({
    page,
    viewport,
  }) => {
    await openDemo(page, slug, 'states')
    const labels = cell(page).locator('label')
    const count = await labels.count()
    expect(count, 'the cell has labels').toBeGreaterThan(1)
    for (let i = 0; i < count; i++) {
      const box = (await labels.nth(i).boundingBox())!
      expect(box.height, `label ${i} at ${viewport!.width} px`).toBeGreaterThanOrEqual(MIN)
    }
    await expectNoHorizontalOverflow(page, `/_demo/${slug}/states at ${viewport!.width} px`)
  })

  test(`/_demo/${slug}/states: a click on the label text toggles the ${slug} control`, async ({ page }) => {
    await openDemo(page, slug, 'states')
    if (slug === 'checkbox') {
      const box = cell(page).getByRole('checkbox', { name: 'Nendoroid (2)' })
      await expect(box).not.toBeChecked()
      await cell(page).locator('label', { hasText: 'Nendoroid (2)' }).click()
      await expect(box).toBeChecked()
    } else {
      const radio = cell(page).getByRole('radio', { name: 'L', exact: true })
      await expect(radio).not.toBeChecked()
      await cell(page).locator('label', { hasText: /^L$/ }).click()
      await expect(radio).toBeChecked()
    }
  })

  test(`/_demo/${slug}/states: the visible control stays the size of xl`, async ({ page }) => {
    await openDemo(page, slug, 'states')
    const control = cell(page).locator('button[data-slot="base"]').first()
    const reference = page
      .locator('[data-state="default"]:not([data-slot])')
      .locator('button[data-slot="base"]')
      .first()
    const a = (await control.boundingBox())!
    const b = (await reference.boundingBox())!
    expect(a.width).toBe(b.width)
    expect(a.height).toBe(b.height)
  })
}
