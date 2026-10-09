// T5.6 (REQ-050 AC3): the site works under the GitHub Pages subpath. This one spec runs twice: in the `functional`
// project against the local static build, and, through playwright.deployed.config.ts, against the deployed site after
// each deploy. It uses no browser, only HTTP requests, so the deploy job needs no Playwright browser download.
import { expect, test } from '@playwright/test'
import { siteBase } from '../../lib/site'
import { crawl } from './helpers/crawl'

test('the home page answers 200 under the subpath', async ({ playwright, baseURL }) => {
  const request = await playwright.request.newContext({ baseURL })
  const response = await request.get(siteBase)
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('Cup Noobles Design System')
  await request.dispose()
})

test('a path outside the subpath is not served, as on a project site', async ({ playwright, baseURL }) => {
  const request = await playwright.request.newContext({ baseURL })
  expect((await request.get('/foundations')).status()).toBe(404)
  await request.dispose()
})

test('the route crawl finds no broken internal link or asset under the subpath', async ({ playwright, baseURL }) => {
  test.setTimeout(240_000)
  const request = await playwright.request.newContext({ baseURL })
  const { pages, broken, badTargets, assets } = await crawl(request)
  await request.dispose()
  expect(broken, 'pages or assets that did not answer 200').toEqual([])
  expect(badTargets, 'links or assets that skip the subpath').toEqual([])
  expect(pages.size, 'the crawl reached the docs').toBeGreaterThan(20)
  expect(assets.size, 'the pages load scripts and styles').toBeGreaterThan(0)
})
