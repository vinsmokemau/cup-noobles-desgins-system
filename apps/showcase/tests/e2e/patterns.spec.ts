// T9.1 end-to-end checks of the forms, feedback, and loading patterns (REQ-035 AC2, REQ-027, REQ-009). They run against the
// isolated `composed` demo pages and against the pattern pages, in the `functional` project at 1280 px. The same demo
// pages are audited at 360, 768, and 1280 px in patterns.matrix.ts.
import type { Page } from '@playwright/test'
import { expectNoA11yViolations } from './helpers/a11y'
import { waitForPage } from './helpers/ready'
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const SLUGS = ['forms', 'feedback', 'loading'] as const

test.describe('the pattern pages', () => {
  for (const slug of SLUGS) {
    test(`REQ-035 AC2: /patterns/${slug} shows its composed demo, as a draft, with no axe violation`, async ({
      page,
    }) => {
      await page.goto(`/patterns/${slug}`)
      await waitForPage(page)
      await expect(page.getByTestId('status-banner')).toContainText('Status: draft')
      const panel = page.getByTestId('composed-demo')
      await expect(panel.getByRole('heading', { name: 'Composed demo' })).toBeVisible()
      await expect(panel.locator('iframe')).toBeVisible()
      await expect(panel.getByTestId('code-block')).toHaveCount(1)
      // The panel follows "Code reference" and comes before "Open items".
      const order = await page.locator('article').evaluate((article) => {
        const text = article.textContent ?? ''
        return ['Code reference', 'Composed demo', 'Open items'].map((mark) => text.lastIndexOf(mark))
      })
      expect(order, 'the panel sits after Code reference').toEqual([...order].sort((a, b) => a - b))
      expect(order.every((index) => index >= 0)).toBe(true)
      await expectNoA11yViolations(page, { label: `/patterns/${slug}` })
    })
  }
})

test.describe('forms', () => {
  const nameField = (page: Page) => page.getByRole('textbox', { name: /^Nombre/ })
  const emailField = (page: Page) => page.getByRole('textbox', { name: /^Correo electrónico/ })

  test('a pristine form shows no error and no summary', async ({ page }) => {
    await openDemo(page, 'forms', 'composed')
    await expect(page.getByRole('alert')).toHaveCount(0)
    await expect(page.getByText('Escribe tu nombre.')).toHaveCount(0)
    // Help text is shown until there is an error.
    await expect(page.getByText('Lo usamos solo para responderte.')).toBeVisible()
  })

  test('a failed submit shows the summary, a message under each field, and moves focus to the first one', async ({
    page,
  }) => {
    await openDemo(page, 'forms', 'composed')
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()

    await expect(page.getByRole('alert')).toContainText('Revisa 3 campos')
    for (const message of [
      'Escribe tu nombre.',
      'Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.',
      'Elige un tema.',
    ]) {
      await expect(page.getByText(message)).toBeVisible()
    }
    await expect(nameField(page)).toBeFocused()
    await expect(nameField(page)).toHaveAttribute('aria-invalid', 'true')
    await expect(emailField(page)).toHaveAttribute('aria-invalid', 'true')
    // The error replaces the help text, so the help is gone while the error is shown.
    await expect(page.getByText('Lo usamos solo para responderte.')).toHaveCount(0)
    await expectNoA11yViolations(page, { label: '/_demo/forms/composed with errors' })
  })

  test('the person fixes the fields and the form is sent', async ({ page }) => {
    await openDemo(page, 'forms', 'composed')
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect(page.getByRole('alert')).toBeVisible()

    await nameField(page).fill('Ana Torres')
    await emailField(page).fill('ana@ejemplo.mx')
    await page.getByRole('combobox', { name: /^Tema/ }).click()
    await page.getByRole('option', { name: 'Un evento' }).click()
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()

    await expect(page.getByRole('status')).toContainText('Mensaje enviado')
    await expect(page.getByRole('alert')).toHaveCount(0)
    await expect(nameField(page)).toHaveCount(0)
    await expectNoA11yViolations(page, { label: '/_demo/forms/composed after sending' })
  })
})

test.describe('feedback', () => {
  const section = (page: Page, id: string) => page.locator(`section[aria-labelledby="feedback-${id}"]`)

  test('the four kinds are on the page, each with a heading', async ({ page }) => {
    await openDemo(page, 'feedback', 'composed')
    for (const heading of ['Banner', 'Aviso en línea', 'Toast', 'Diálogo']) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    }
  })

  test('the banner and the inline alert close with their labelled button, and come back on request', async ({
    page,
  }) => {
    await openDemo(page, 'feedback', 'composed')
    const banner = section(page, 'banner')
    await expect(banner.getByRole('status')).toContainText('Mantenimiento el sábado')
    await banner.getByRole('button', { name: 'Cerrar aviso' }).click()
    await expect(banner.getByRole('status')).toHaveCount(0)
    await banner.getByRole('button', { name: 'Mostrar banner' }).click()
    await expect(banner.getByRole('status')).toBeVisible()

    const inline = section(page, 'inline')
    await expect(inline).toContainText('Tu sesión termina pronto')
    await inline.getByRole('button', { name: 'Cerrar aviso' }).click()
    await expect(inline).not.toContainText('Tu sesión termina pronto')
  })

  test('the toast reports the result of an action', async ({ page }) => {
    await openDemo(page, 'feedback', 'composed')
    await section(page, 'toast').getByRole('button', { name: 'Guardar cambios' }).click()
    await expect(page.locator('[data-slot="title"]', { hasText: 'Cambios guardados' })).toBeVisible()
    await expect(page.locator('[data-slot="description"]', { hasText: 'Tu perfil ya está actualizado.' })).toBeVisible()
  })

  test('the dialog asks for a decision: focus moves in, Escape closes it, and focus returns to the opener', async ({
    page,
  }) => {
    await openDemo(page, 'feedback', 'composed')
    const opener = section(page, 'dialog').getByRole('button', { name: 'Borrar borrador' })
    await opener.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleName('Borrar borrador')
    await expect(dialog).toHaveAccessibleDescription('No podrás recuperarlo después.')
    await expect
      .poll(() => page.evaluate(() => !!document.querySelector('[role="dialog"]')?.contains(document.activeElement)))
      .toBe(true)
    await expectNoA11yViolations(page, { label: '/_demo/feedback/composed with the dialog open' })

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(opener).toBeFocused()
  })
})

test.describe('loading', () => {
  test('the skeleton group is announced once: one status with a label, and every shape hidden', async ({ page }) => {
    await openDemo(page, 'loading', 'composed')
    const group = page.getByRole('status', { name: 'Cargando perfil' })
    await expect(group).toHaveAttribute('aria-busy', 'true')
    await expect(group.locator('[aria-hidden="true"]')).toHaveCount(3)
    // The finished content is shown beside it, so the shapes can be compared with what they replace.
    await expect(page.getByText('Ana Torres')).toBeVisible()
  })

  test('the loading button keeps its label, is busy and disabled while it runs, and comes back', async ({ page }) => {
    await openDemo(page, 'loading', 'composed')
    const button = page.getByRole('button', { name: 'Guardar cambios' })
    await expect(button).toBeEnabled()
    await expect(button).not.toHaveAttribute('aria-busy', 'true')

    await button.click()
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button).toHaveAccessibleName('Guardar cambios')

    await expect(button).toBeEnabled()
    await expect(button).not.toHaveAttribute('aria-busy', 'true')
  })

  test('a known amount has a value, and an unknown amount has none', async ({ page }) => {
    await openDemo(page, 'loading', 'composed')
    await expect(page.getByRole('progressbar', { name: 'Subiendo portada' })).toHaveAttribute('aria-valuenow', '62')
    await expect(page.getByRole('progressbar', { name: 'Procesando imagen' })).not.toHaveAttribute('aria-valuenow')
  })
})
