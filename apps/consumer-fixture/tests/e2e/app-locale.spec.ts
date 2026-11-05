// T15.16 (DSR-13, ER-04): the built-in text of Nuxt UI is Spanish in an app that renders CnApp, and a consumer can still choose
// another locale. The page sets no label: every close button below gets its name from the `es` locale. These tests run
// against the build with the workspace layer (playwright.config.ts), because the installed layer is the last published one.
import { expect, test } from '@playwright/test'
import { expectNoA11yViolations } from '../../../showcase/tests/e2e/helpers/a11y'
import { waitForHydration } from '../../../showcase/tests/e2e/helpers/ready'

test.use({ baseURL: 'http://localhost:3101' })

for (const width of [360, 768, 1280]) {
  test.describe(`at ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } })

    test.beforeEach(async ({ page }) => {
      await page.goto('/components/app')
      await waitForHydration(page)
    })

    test('DSR-13: the close button of an alert is announced in Spanish', async ({ page }) => {
      // Before anything opens, the alert's is the only close button on the page.
      await expect(page.getByRole('button', { name: 'Cerrar', exact: true })).toHaveCount(1)
      await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(0)
    })

    test('DSR-13: the close button of a modal is announced in Spanish', async ({ page }) => {
      await page.getByRole('button', { name: 'Abrir ventana' }).click()
      const dialog = page.getByRole('dialog', { name: 'Confirmar lugar' })
      await expect(dialog.getByRole('button', { name: 'Cerrar', exact: true })).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toHaveCount(0)
      await expectNoA11yViolations(page, { label: `/components/app (modal) at ${width} px` })
    })

    test('DSR-13: the close button of a slideover is announced in Spanish', async ({ page }) => {
      await page.getByRole('button', { name: 'Abrir filtros' }).click()
      const dialog = page.getByRole('dialog', { name: 'Filtros' })
      await expect(dialog.getByRole('button', { name: 'Cerrar', exact: true })).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toHaveCount(0)
      await expectNoA11yViolations(page, { label: `/components/app (slideover) at ${width} px` })
    })

    test('DSR-13: the close button of a toast is announced in Spanish', async ({ page }) => {
      await page.getByRole('button', { name: 'Mostrar aviso' }).click()
      await expect(page.getByText('Cambios guardados', { exact: true }).first()).toBeVisible()
      const toast = page.getByRole('region', { name: /Notifications/ }).first()
      await expect(toast.getByRole('button', { name: 'Cerrar', exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(0)
      await expectNoA11yViolations(page, { label: `/components/app (toast) at ${width} px` })
    })

    test('DSR-13: another locale can still be set, and the whole app follows it', async ({ page }) => {
      await page.goto('/components/app?locale=en')
      await waitForHydration(page)
      await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1)
      await page.getByRole('button', { name: 'Abrir filtros' }).click()
      const dialog = page.getByRole('dialog', { name: 'Filtros' })
      await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Cerrar', exact: true })).toHaveCount(0)
      await expectNoA11yViolations(page, { label: `/components/app?locale=en (slideover) at ${width} px` })
    })
  })
}

test('DSR-13: the page language and the Spanish default do not depend on JavaScript for the first paint of the page', async ({
  request,
}) => {
  const html = await (await request.get('/components/app')).text()
  expect(html).toContain('lang="es-MX"')
  // The alert is rendered by the server, with its close button already in Spanish.
  expect(html).toMatch(/aria-label="Cerrar"/)
  expect(html).not.toMatch(/aria-label="Close"/)
})
