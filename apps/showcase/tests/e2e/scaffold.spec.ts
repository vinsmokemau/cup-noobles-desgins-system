// T5.3 end-to-end checks on the static build: the sidebar follows DESIGN.md (REQ-052 AC2), the sidebar collapses into
// a slideover below md (REQ-061 AC2), the header shows the version, and the page has a skip link and no color-mode
// toggle (REQ-031 AC1, REQ-060 AC2 groundwork; the full audit is T5.5).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseDesignNav } from '../../lib/design-nav'
import { expect, test, withBase } from './helpers/test'

const repoFile = (path: string) => readFileSync(fileURLToPath(new URL(`../../../../${path}`, import.meta.url)), 'utf8')
const expected = parseDesignNav(repoFile('DESIGN.md')).flatMap((section) =>
  section.groups.flatMap((group) => group.links),
)
const layerVersion = (JSON.parse(repoFile('packages/nuxt/package.json')) as { version: string }).version

test('REQ-052 AC2: the sidebar lists every DESIGN.md link, in DESIGN.md order', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const links = page.locator('aside nav a')
  await expect(links).toHaveCount(expected.length)
  expect(await links.evaluateAll((els) => els.map((a) => a.getAttribute('href')))).toEqual(
    expected.map((l) => withBase(l.to)),
  )
  expect(await links.allInnerTexts()).toEqual(expected.map((l) => l.label))
})

test('REQ-061 AC2: below md the sidebar is hidden and the same menu opens in a slideover', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  await expect(page.locator('aside')).toBeHidden()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const links = dialog.locator('nav a')
  await expect(links).toHaveCount(expected.length)
  expect(await links.evaluateAll((els) => els.map((a) => a.getAttribute('href')))).toEqual(
    expected.map((l) => withBase(l.to)),
  )
})

test('from md up the slideover toggle is hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden()
})

test('the header shows the layer package version', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('version')).toHaveText(`v${layerVersion}`)
})

test('the first Tab stop is a skip link that moves focus to the main region', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main-content$/)
  await expect(page.getByRole('main')).toBeVisible()
})

test('REQ-031 AC1: the page is dark and has no color-mode toggle', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)')
  await expect(page.getByRole('button', { name: /color|theme|dark mode|light mode/i })).toHaveCount(0)
})
