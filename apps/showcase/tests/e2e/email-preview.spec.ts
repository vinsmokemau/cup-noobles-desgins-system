// T10.5 end-to-end checks of the email previews (REQ-058). Each `/email/*` page shows the compiled files of
// packages/email/dist in a sandboxed iframe, with a 320 and 600 px toggle (AC1), and "Copy HTML" copies the exact text of
// the file (AC2). The expected text is read from the file on disk, which `pnpm build:email` writes before the showcase
// is generated (`pnpm test:all`), so the check compares the page with the file and not with itself.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { EMAIL_PREVIEWS, EMAIL_WIDTHS } from '../../lib/email-previews'
import { expectNoA11yViolations } from './helpers/a11y'
import { waitForPage } from './helpers/ready'
import { expect, test } from './helpers/test'

const compiled = (name: string) => {
  const file = fileURLToPath(new URL(`../../../../packages/email/dist/${name}.html`, import.meta.url))
  expect(existsSync(file), `packages/email/dist/${name}.html exists: run pnpm build:email first`).toBe(true)
  return readFileSync(file, 'utf8')
}

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

const pages = Object.entries(EMAIL_PREVIEWS).map(([slug, names]) => ({ route: `/email/${slug}`, names }))

for (const { route, names } of pages) {
  test(`REQ-058 AC1: ${route} shows one sandboxed preview per compiled email, with the file as its document`, async ({
    page,
  }) => {
    await page.goto(route)
    await waitForPage(page)
    const previews = page.getByTestId('email-preview')
    await expect(previews).toHaveCount(names.length)
    for (const name of names) {
      const frame = page.locator(`[data-email="${name}"] iframe`)
      await expect(frame, name).toHaveCount(1)
      const sandbox = (await frame.getAttribute('sandbox')) ?? undefined
      expect(sandbox, `${name} has a sandbox attribute`).toBeDefined()
      expect(sandbox!.split(/\s+/), `${name} lets no script run`).not.toContain('allow-scripts')
      expect(sandbox!.split(/\s+/), `${name} cannot navigate the page`).not.toContain('allow-top-navigation')
      expect(await frame.getAttribute('srcdoc'), `${name} renders the compiled file`).toBe(compiled(name))
      expect(await frame.getAttribute('title'), `${name} has an accessible name`).toBeTruthy()
    }
    await expectNoA11yViolations(page, { label: route })
  })
}

test('REQ-058 AC1: the width toggle sets the frame to 320 and to 600 px, and the layout fits both', async ({
  page,
}) => {
  await page.goto('/email/email-layouts')
  await waitForPage(page)
  const preview = page.locator('[data-email="reference"]')
  const frame = preview.locator('iframe')
  await expect(preview.getByRole('button', { name: '320 px' })).toHaveAttribute('aria-pressed', 'true')
  for (const width of [...EMAIL_WIDTHS, EMAIL_WIDTHS[0]]) {
    await preview.getByRole('button', { name: `${width} px` }).click()
    await expect(preview.getByRole('button', { name: `${width} px` })).toHaveAttribute('aria-pressed', 'true')
    await expect(frame).toHaveAttribute('data-width', String(width))
    expect((await frame.boundingBox())?.width).toBe(width)
    // The email inside the frame is no wider than the frame (REQ-043 AC1), as the frame measures it.
    const inside = await frame.evaluate((element) => {
      const root = (element as HTMLIFrameElement).contentDocument!.documentElement
      return { client: root.clientWidth, scroll: root.scrollWidth }
    })
    expect(inside.client, `the frame document is ${width} px wide`).toBe(width)
    expect(inside.scroll, 'no horizontal scroll inside the frame').toBeLessThanOrEqual(width)
  }
})

test('REQ-058 AC2: "Copy HTML" copies the exact content of the compiled file', async ({ page }) => {
  // Windows turns LF into CRLF when text goes through the system clipboard, so the string the page hands to
  // `writeText` is recorded and compared byte for byte, and the clipboard is compared with line endings normalized.
  await page.addInitScript(() => {
    const written: string[] = []
    ;(window as unknown as { __written: string[] }).__written = written
    const original = navigator.clipboard.writeText.bind(navigator.clipboard)
    navigator.clipboard.writeText = (text: string) => {
      written.push(text)
      return original(text)
    }
  })
  const lastWritten = () => page.evaluate(() => (window as unknown as { __written: string[] }).__written.at(-1))
  const clipboard = async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')

  await page.goto('/email/email-components')
  await waitForPage(page)
  for (const name of EMAIL_PREVIEWS['email-components']!) {
    const preview = page.locator(`[data-email="${name}"]`)
    await preview.getByRole('button', { name: 'Copy HTML' }).click()
    await expect(preview.getByRole('status')).toHaveText('Copied')
    expect(await lastWritten(), `${name} writes the file`).toBe(compiled(name))
    expect(await clipboard(), `${name} copies the file`).toBe(compiled(name))
  }
  await page.goto('/email/email-layouts')
  await waitForPage(page)
  await page.getByRole('button', { name: 'Copy HTML' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Copied' })).toHaveCount(1)
  expect(await lastWritten()).toBe(compiled('reference'))
  expect(await clipboard()).toBe(compiled('reference'))
})

test('the copied file keeps its slot placeholders and holds no script', () => {
  const html = compiled('reference')
  expect(html).toMatch(/\{\{ [a-z_]+ \}\}/)
  expect(html).not.toMatch(/<script\b/i)
})
