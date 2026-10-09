// T6.4 (REQ-057 AC2): the /status dashboard. Every expected number and link comes from reports/tbd-report.json and the
// doc list, both read from disk, so an item added to the sources shows up in these checks without an edit here.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { scanDocs } from '../../lib/doc-scan'
import { routeOfFile } from '../../lib/status'
import { expect, test, withBase } from './helpers/test'

interface Report {
  summary: {
    openItems: number
    tokens: number
    derivedPendingTokens: number
    draftDocs: number
    contentPending: number
    draftCallouts: number
  }
  items: { id: string; resolved: boolean; callouts: number; tokens: number }[]
  callouts: { file: string; id: string }[]
  tokens: { path: string; status: string; tbd: string[] }[]
  drafts: { docs: { file: string }[] }
}
const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
const report = JSON.parse(read('../../../../reports/tbd-report.json')) as Report
const flat = JSON.parse(read('../../../../packages/tokens/dist/json/tokens.flat.json')) as Record<string, unknown>
const docs = scanDocs(fileURLToPath(new URL('../../../../docs', import.meta.url)))
const open = report.items.filter((item) => !item.resolved)

test.beforeEach(async ({ page }) => {
  await page.goto('/status')
})

test('REQ-057 AC2: every count equals the one in tbd-report.json', async ({ page }) => {
  const s = report.summary
  expect(s.openItems).toBeGreaterThan(0)
  for (const [id, value] of [
    ['open-items', s.openItems],
    ['tbd-tokens', s.tokens],
    ['derived-pending-tokens', s.derivedPendingTokens],
    ['draft-docs', s.draftDocs],
    ['content-pending', s.contentPending],
    ['draft-callouts', s.draftCallouts],
  ] as const)
    await expect(page.getByTestId(`count-${id}`), id).toHaveText(String(value))
})

test('REQ-057 AC2: the page lists every open TBD item, every draft doc, and every derived-pending token', async ({
  page,
}) => {
  const ids = await page.getByTestId('item-row').evaluateAll((els) => els.map((el) => el.getAttribute('data-id')))
  expect(ids).toEqual(open.map((item) => item.id))
  await expect(page.getByTestId('draft-doc')).toHaveCount(report.summary.draftDocs)
  await expect(page.getByTestId('derived-token')).toHaveCount(report.summary.derivedPendingTokens)
  await expect(page.getByTestId('tbd-token')).toHaveCount(report.summary.tokens)
})

test('REQ-057 AC2: each item links to the docs that name it and shows its token count', async ({ page }) => {
  for (const item of open) {
    const row = page.locator(`[data-testid="item-row"][data-id="${item.id}"]`)
    const files = [...new Set(report.callouts.filter((c) => c.id === item.id).map((c) => c.file))]
    const hrefs = await row.getByTestId('item-doc').evaluateAll((els) => els.map((el) => el.getAttribute('href')))
    expect(hrefs, `${item.id} docs`).toEqual(files.map((file) => withBase(routeOfFile(file, docs)!)))
    if (item.tokens > 0) await expect(row.getByTestId('item-token-count'), item.id).toHaveText(String(item.tokens))
    // An item that no doc and no token names has nothing to link to, and the page says so.
    if (item.callouts === 0) await expect(row.getByTestId('item-no-doc'), item.id).toBeVisible()
    if (item.tokens === 0) await expect(row.getByTestId('item-no-token'), item.id).toBeVisible()
  }
})

test('REQ-057 AC2: every doc link and token link on the page leads to a real page and a real token row', async ({
  page,
  request,
}) => {
  const hrefs = await page
    .locator('main a[href]')
    .evaluateAll((els) => [...new Set(els.map((el) => el.getAttribute('href')!))])
  const tokenHrefs = hrefs.filter((href) => href.includes('/tokens#'))
  const docHrefs = hrefs.filter((href) => href.startsWith(withBase('/')) && !href.includes('#'))
  expect(tokenHrefs.length).toBeGreaterThan(0)
  expect(docHrefs.length).toBeGreaterThan(0)
  for (const href of docHrefs) expect((await request.get(href)).status(), href).toBe(200)
  for (const href of tokenHrefs) {
    const path = decodeURIComponent(href.split('#token-')[1]!)
    expect(flat, `${href} names no token`).toHaveProperty([path])
  }
  // One real navigation, to prove the anchor lands on its row.
  const first = report.tokens[0]!.path
  await page.goto(`/tokens#token-${first}`)
  await expect(page.locator(`[data-testid="token-row"][data-path="${first}"]`)).toBeAttached()
})
