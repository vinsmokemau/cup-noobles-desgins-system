// T5.5: the route list the accessibility matrix audits is the route list of the build, and a visitor can reach the docs
// in it. The sidebar lists the docs (REQ-052 AC2), so a doc built but linked from nowhere would escape the link crawl;
// the only pages a visitor reaches by typing rather than by link are the section indexes and the pages with no doc.
import { expect, test } from '@playwright/test'
import { builtRoutes, crawl } from './helpers/crawl'

test('REQ-060 AC1: every built route is audited, and every one that holds a doc is reachable by links', async ({
  playwright,
  baseURL,
}) => {
  const request = await playwright.request.newContext({ baseURL })
  const { pages, broken } = await crawl(request)
  await request.dispose()
  expect(broken).toEqual([])
  const built = builtRoutes()
  const reached = new Set([...pages.keys()].map((path) => path.replace(/(.)\/$/, '$1')))
  for (const route of reached) expect(built, `${route} is linked but not built`).toContain(route)
  const unlinked = built.filter((route) => !reached.has(route))
  // A section index is a route that other routes sit under (`/foundations`, `/governance/decisions`).
  const isIndex = (route: string) => built.some((other) => other.startsWith(`${route}/`))
  // These pages have no doc behind them (SPEC.md §4.6) and are not in DESIGN.md, so the sidebar does not list them.
  // Their links arrive with the pages' own tasks (T6.1, T6.4, T11.3).
  const noDoc = ['/tokens', '/status', '/changelog']
  expect(
    unlinked.filter((route) => !isIndex(route) && !noDoc.includes(route)),
    'docs that no link leads to',
  ).toEqual([])
})
