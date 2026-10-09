// T6.5 (REQ-062 AC1, REQ-052): the home page. Every expected number is read from its own source on disk, by a route
// other than the page's: the version from the layer's package.json, the tokens from tokens.flat.json, the components
// from the files under docs/02-components, and the open items from the TBD items of tbd-report.json.
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test, withBase } from './helpers/test'

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))
const json = <T>(relative: string) => JSON.parse(readFileSync(path(relative), 'utf8')) as T

const { version } = json<{ version: string }>('../../../../packages/nuxt/package.json')
const flat = json<Record<string, unknown>>('../../../../packages/tokens/dist/json/tokens.flat.json')
const report = json<{ summary: { openItems: number }; items: { resolved: boolean }[] }>(
  '../../../../reports/tbd-report.json',
)
const componentDocs = ['atoms', 'molecules', 'organisms'].flatMap((level) =>
  readdirSync(path(`../../../../docs/02-components/${level}`)).filter((name) => name.endsWith('.md')),
)

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('REQ-062 AC1: the home page shows the package version, and the header shows the same one', async ({ page }) => {
  await expect(page.getByTestId('home-version')).toHaveText(`v${version}`)
  await expect(page.getByTestId('version')).toHaveText(`v${version}`)
})

test('REQ-062 AC1: the token count equals the number of tokens in tokens.flat.json', async ({ page }) => {
  expect(Object.keys(flat).length).toBeGreaterThan(0)
  await expect(page.getByTestId('home-tokens')).toHaveText(String(Object.keys(flat).length))
})

test('REQ-062 AC1: the component count equals the number of component docs', async ({ page }) => {
  expect(componentDocs.length).toBeGreaterThan(0)
  await expect(page.getByTestId('home-components')).toHaveText(String(componentDocs.length))
})

test('REQ-062 AC1: the open-TBD count equals the open items of tbd-report.json, and links to /status', async ({
  page,
}) => {
  const open = report.items.filter((item) => !item.resolved).length
  expect(open).toBe(report.summary.openItems)
  expect(open).toBeGreaterThan(0)
  await expect(page.getByTestId('home-open-tbd')).toHaveText(String(open))
  await expect(page.getByRole('link', { name: 'See what is open' })).toHaveAttribute('href', withBase('/status'))
})

test('REQ-052: a card per DESIGN.md section leads to a real page', async ({ page, request }) => {
  const design = readFileSync(path('../../../../DESIGN.md'), 'utf8')
  const sections = [...design.matchAll(/^## (.+)$/gm)].map((match) => match[1]!.trim())
  const cards = page.getByTestId('layer-card')
  await expect(cards).toHaveCount(sections.length)
  const hrefs = await cards.evaluateAll((els) => els.map((el) => el.getAttribute('href')!))
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200)
})
