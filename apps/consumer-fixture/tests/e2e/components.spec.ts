// T8.7 (REQ-022 AC3, REQ-071 AC1, REQ-027 AC1): the fixture visits every component in the inventory, at 360 and 1280 px,
// with axe clean and no horizontal overflow. The inventory is the component docs, so a new doc without a fixture page
// fails here, and tests/consumer-fixture.test.ts checks the same on the files. The overlays are audited again while open.
// The shared assertions are the showcase's (T5.5), so both apps are held to the same bar.
import { expect, test, type Page } from '@playwright/test'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expectNoA11yViolations, expectNoHorizontalOverflow } from '../../../showcase/tests/e2e/helpers/a11y'
import { waitForHydration } from '../../../showcase/tests/e2e/helpers/ready'

const components = fileURLToPath(new URL('../../../../docs/02-components/', import.meta.url))
const slugs = ['atoms', 'molecules', 'organisms'].flatMap((level) =>
  readdirSync(`${components}${level}`)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, '')),
)

// What opens on a page, after it has loaded. The toggle of the header shows below the `lg` breakpoint only.
const open: Record<string, (page: Page, width: number) => Promise<void>> = {
  modal: async (page) => {
    await page.getByRole('button', { name: 'Apartar lugar' }).click()
    await expect(page.getByRole('dialog', { name: 'Confirmar lugar' })).toBeVisible()
  },
  slideover: async (page) => {
    await page.getByRole('button', { name: 'Abrir filtros' }).click()
    await expect(page.getByRole('dialog', { name: 'Filtros' })).toBeVisible()
  },
  toast: async (page) => {
    await page.getByRole('button', { name: 'Mostrar aviso' }).click()
    await expect(page.getByText('Cambios guardados')).toBeVisible()
  },
  tooltip: async (page) => {
    // The tooltip opens on keyboard focus, so the focus arrives by Tab, as it does for a person.
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Guardar' })).toBeFocused()
    // Reka keeps a visually hidden `role="tooltip"` copy for assistive technology, so the visible bubble is found by text.
    await expect(page.getByText('Guardar los cambios').locator('visible=true').first()).toBeVisible()
  },
  'site-header': async (page, width) => {
    if (width >= 1024) return
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menú' })).toBeVisible()
  },
}

test('the index links one page per component in the inventory', async ({ page }) => {
  await page.goto('/')
  await waitForHydration(page)
  const links = page.getByRole('navigation', { name: 'Componentes' }).getByRole('link')
  const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))
  expect(hrefs.sort()).toEqual(slugs.map((slug) => `/components/${slug}`).sort())
  await expectNoA11yViolations(page, { label: '/' })
})

for (const width of [360, 1280]) {
  test.describe(`at ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } })

    for (const slug of slugs) {
      test(`${slug}: renders, and axe is clean`, async ({ page }) => {
        const path = `/components/${slug}`
        await page.goto(path)
        await waitForHydration(page)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expectNoA11yViolations(page, { label: path })
        await expectNoHorizontalOverflow(page, path)
      })
    }

    for (const [slug, show] of Object.entries(open)) {
      test(`${slug}: axe is clean while it is open`, async ({ page }) => {
        const path = `/components/${slug}`
        await page.goto(path)
        await waitForHydration(page)
        await show(page, width)
        await expectNoA11yViolations(page, { label: `${path} (open)` })
      })
    }
  })
}
