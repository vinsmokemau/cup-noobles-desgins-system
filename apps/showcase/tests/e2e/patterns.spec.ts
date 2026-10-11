// T9.1 and T9.2 end-to-end checks of the seven patterns (REQ-035 AC2, REQ-027, REQ-009). They run against the
// isolated `composed` demo pages and against the pattern pages, in the `functional` project at 1280 px. The same demo
// pages are audited at 360, 768, and 1280 px in patterns.matrix.ts.
import type { Page } from '@playwright/test'
import { expectNoA11yViolations } from './helpers/a11y'
import { waitForPage } from './helpers/ready'
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

// Six are stable (ADR-0033, ADR-0034). Responsive behavior stays a draft while TBD-13 is open (REQ-009, REQ-037).
const STABLE = ['forms', 'feedback', 'loading', 'navigation', 'empty-states', 'error-pages']
const DRAFT = ['responsive-behavior']

test.describe('the pattern pages', () => {
  for (const slug of [...STABLE, ...DRAFT]) {
    test(`REQ-035 AC2: /patterns/${slug} shows its composed demo, with the right status, and no axe violation`, async ({
      page,
    }) => {
      await page.goto(`/patterns/${slug}`)
      await waitForPage(page)
      await expect(page.getByTestId('status-banner')).toHaveCount(STABLE.includes(slug) ? 0 : 1)
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

test.describe('navigation', () => {
  test('the header marks the current page, and no other link', async ({ page }) => {
    await openDemo(page, 'navigation', 'composed')
    const main = page.getByRole('navigation', { name: 'Principal' })
    await expect(main.getByRole('link', { name: 'Eventos' })).toHaveAttribute('aria-current', 'page')
    await expect(main.getByRole('link', { name: 'Juegos' })).not.toHaveAttribute('aria-current')
    await expect(page.locator('[aria-current="page"]')).toHaveCount(3) // the header link, the breadcrumb's current page, and the current page number
  })

  test('the breadcrumb ends on the current page, and the current page number is named', async ({ page }) => {
    await openDemo(page, 'navigation', 'composed')
    const crumbs = page.getByRole('navigation', { name: 'Ruta de navegación' })
    await expect(crumbs.getByRole('link', { name: 'Inicio' })).toBeVisible()
    await expect(crumbs.getByRole('link', { name: 'Noche de juegos' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    await expectNoA11yViolations(page, { label: '/_demo/navigation/composed' })
  })

  test('the arrow keys move between tabs', async ({ page }) => {
    await openDemo(page, 'navigation', 'composed')
    await page.getByRole('tab', { name: 'Reglas' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Mesas' })).toBeFocused()
  })
})

test.describe('empty states', () => {
  test('first use explains the list and offers one action, and the action fills the list', async ({ page }) => {
    await openDemo(page, 'empty-states', 'composed')
    const state = page.getByTestId('empty-first-use')
    await expect(state.getByRole('heading', { name: 'Aún no tienes partidas' })).toBeVisible()
    await expect(state.getByRole('button')).toHaveCount(1)
    await expectNoA11yViolations(page, { label: '/_demo/empty-states/composed, first use' })

    await state.getByRole('button', { name: 'Crear partida' }).click()
    await expect(page.getByTestId('empty-first-use')).toHaveCount(0)
    await expect(page.getByRole('list', { name: 'Partidas' }).getByRole('listitem')).toHaveCount(3)
  })

  test('a search with no match names the search, announces it, and one action clears it', async ({ page }) => {
    await openDemo(page, 'empty-states', 'composed')
    await page.getByRole('button', { name: 'Crear partida' }).click()
    await page.getByRole('textbox', { name: 'Buscar partida' }).fill('xyz')

    const state = page.getByTestId('empty-no-results')
    await expect(state.getByRole('status')).toContainText('Sin resultados para «xyz»')
    await expectNoA11yViolations(page, { label: '/_demo/empty-states/composed, no results' })

    await state.getByRole('button', { name: 'Limpiar búsqueda' }).click()
    await expect(page.getByTestId('empty-no-results')).toHaveCount(0)
    await expect(page.getByRole('list', { name: 'Partidas' }).getByRole('listitem')).toHaveCount(3)
  })
})

test.describe('error pages', () => {
  test('both pages have the four parts: a status, one h1, a sentence, and one action, with no technical detail', async ({
    page,
  }) => {
    await openDemo(page, 'error-pages', 'composed')
    await expect(page.getByTestId('error-page')).toHaveCount(2)
    await expect(page.getByTestId('error-status')).toHaveText(['404', '500'])
    await expect(page.getByRole('heading', { level: 1 })).toHaveText([
      'No encontramos esta página',
      'Algo salió mal de nuestro lado',
    ])
    for (const region of await page.getByRole('region').all()) {
      await expect(region.getByRole('link')).toHaveCount(1)
    }
    await expect(page.locator('body')).not.toContainText(/stack|exception|undefined|at \w+\.\w+/i)
    await expectNoA11yViolations(page, { label: '/_demo/error-pages/composed' })
  })
})
