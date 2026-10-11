// T10.4 end-to-end check of the reference email layout (REQ-043 AC1): the compiled HTML renders without horizontal scroll
// at 320 and 600 px. It reads packages/email/dist/reference.html, which `pnpm build:email` writes (`pnpm test:all` runs it
// before the end-to-end suite), and renders it in Chromium with `setContent`. It does not use the showcase site, so it
// belongs to the `functional` project and holds for any viewport the page sets itself. T10.5 adds the previews.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const file = fileURLToPath(new URL('../../../../packages/email/dist/reference.html', import.meta.url))

// Test content for the slots, in es-MX (ER-04). It is not copy of the system. The logo is an empty 4:1 SVG, because the
// header sets only the height of the image and a client needs a source to lay it out.
const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="144" height="36"/>')}`
const SLOTS: Record<string, string> = {
  home_url: 'https://example.com/',
  logo_url: LOGO,
  logo_alt: 'Cup Noobles',
  heading: 'Tu pedido está en camino',
  body: 'Hola, tu pedido salió de nuestro almacén y llegará en los próximos días. Puedes seguir cada paso desde el enlace de abajo.',
  card_title: 'Resumen del pedido',
  card_body: 'Tres artículos enviados a una sola dirección, con entrega estimada de lunes a miércoles.',
  card_footer: 'Si algo no es correcto, responde a este correo.',
  button_url: 'https://example.com/pedido',
  button_label: 'Ver mi pedido',
  footer_text: 'Recibiste este correo porque hiciste un pedido.',
  footer_link_url: 'https://example.com/ayuda',
  footer_link_label: 'Centro de ayuda',
}

const filled = () => {
  expect(existsSync(file), 'packages/email/dist/reference.html exists: run pnpm build:email first').toBe(true)
  return readFileSync(file, 'utf8').replace(/\{\{ ([a-z_]+) \}\}/g, (_match, slot: string) => {
    const value = SLOTS[slot]
    if (value === undefined) throw new Error(`the layout has a slot the test does not fill: ${slot}`)
    return value
  })
}

for (const width of [320, 600]) {
  test(`REQ-043 AC1: the reference layout has no horizontal scroll at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.setContent(filled(), { waitUntil: 'load' })
    const measured = await page.evaluate(() => {
      const root = document.documentElement
      const outside = [...document.body.querySelectorAll('*')]
        .filter((element) => element.getBoundingClientRect().right > root.clientWidth + 0.5)
        .map((element) => element.tagName.toLowerCase())
      return { clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, outside }
    })
    expect(measured.clientWidth).toBe(width)
    expect(measured.scrollWidth, 'the page is not wider than the viewport').toBeLessThanOrEqual(width)
    expect(measured.outside, 'no element reaches past the right edge').toEqual([])
  })
}

test('REQ-043 AC1: the layout shows every component, and its body is no wider than 600 px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.setContent(filled(), { waitUntil: 'load' })
  for (const text of [
    SLOTS.heading!,
    SLOTS.card_title!,
    SLOTS.button_label!,
    SLOTS.footer_text!,
    SLOTS.footer_link_label!,
  ]) {
    await expect(page.getByText(text)).toBeVisible()
  }
  await expect(page.getByRole('img', { name: SLOTS.logo_alt! })).toBeVisible()
  const widest = await page.evaluate(() =>
    Math.max(...[...document.querySelectorAll('table')].map((table) => table.getBoundingClientRect().width)),
  )
  expect(widest).toBeLessThanOrEqual(600)
})
