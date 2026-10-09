// T5.6: `test` and `expect` for the showcase specs. The site is served under the GitHub Pages subpath (REQ-050 AC3), but
// the specs name routes the way the app does, `/foundations/color`. This `test` opens a route that starts with `/`
// under the subpath, so the specs stay readable and a route is never opened without it.
import { expect, test as base } from '@playwright/test'
import { siteBase } from '../../../lib/site'

/** The URL path of an app route, `/foundations` -> `/cup-noobles-desgins-system/foundations`. */
export const withBase = (route: string) => (route === '/' ? siteBase : `${siteBase.slice(0, -1)}${route}`)

export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page)
    page.goto = (url, options) => goto(url.startsWith('/') ? withBase(url) : url, options)
    await use(page)
  },
})

export { expect }
