// T5.4, T5.5, T5.6: the route list and the link crawl, shared by the end-to-end specs and by the check of the deployed site.
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { APIRequestContext } from '@playwright/test'
import { siteBase } from '../../../lib/site'

const publicDir = fileURLToPath(new URL('../../../.output/public/', import.meta.url))

/** Every route of the static build, read from its files: the `index.html` of each folder, as `/a/b`. `/` comes first. */
export function builtRoutes(): string[] {
  const routes: string[] = []
  const walk = (relative: string) => {
    for (const entry of readdirSync(join(publicDir, relative), { withFileTypes: true })) {
      const path = relative ? `${relative}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('_')) walk(path)
      } else if (entry.name === 'index.html') routes.push(relative ? `/${relative}` : '/')
    }
  }
  walk('')
  return routes.sort((a, b) => a.localeCompare(b))
}

export interface Crawl {
  pages: Map<string, { status: number; html: string }>
  /** Pages that did not return 200, as `route -> status`. */
  broken: string[]
  /** Links and assets that point outside the subpath, or at a file that is not there, as `page: target`. */
  badTargets: string[]
  /** The assets the pages load, as paths under the subpath. */
  assets: Set<string>
}

/** The route of an internal URL (`/cup-noobles-desgins-system/a` -> `/a`), or undefined when it is not under the subpath. */
export function routeOf(href: string): string | undefined {
  const target = href.split(/[?#]/)[0]!
  if (target === siteBase.slice(0, -1) || target === siteBase) return '/'
  if (!target.startsWith(siteBase)) return undefined
  const route = `/${target.slice(siteBase.length)}`
  return route.length > 1 ? route.replace(/\/$/, '') : route
}

/** The URL the request context is asked for, `/a` -> `<base>/cup-noobles-desgins-system/a`. */
const urlOf = (route: string) => (route === '/' ? siteBase : `${siteBase.slice(0, -1)}${route}`)

/**
 * Follows every internal link from `/`, the way a visitor would, and records the status of each page. An internal link
 * or asset is one whose address starts with `/` or with the site's own origin; each must sit under the subpath and
 * answer 200 (REQ-050 AC3). Pass a request context whose `baseURL` is the origin: the local server or the deployed site.
 */
export async function crawl(request: APIRequestContext): Promise<Crawl> {
  const pages = new Map<string, { status: number; html: string }>()
  const broken: string[] = []
  const badTargets: string[] = []
  const assets = new Set<string>()
  const queue = ['/']
  while (queue.length > 0) {
    const route = queue.shift()!
    if (pages.has(route)) continue
    const response = await request.get(urlOf(route))
    const html = await response.text()
    pages.set(route, { status: response.status(), html })
    if (response.status() !== 200) {
      broken.push(`${route} -> ${response.status()}`)
      continue
    }
    for (const match of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
      const href = match[1]!.replaceAll('&amp;', '&')
      if (!href.startsWith('/') || href.startsWith('//')) continue
      const next = routeOf(href)
      if (next === undefined) badTargets.push(`${route}: ${href}`)
      else if (!pages.has(next)) queue.push(next)
    }
    for (const match of html.matchAll(/<(?:script|link|img|source)\b[^>]*?\s(?:src|href)="([^"]*)"/g)) {
      const src = match[1]!.replaceAll('&amp;', '&')
      if (!src.startsWith('/') || src.startsWith('//')) continue
      if (/<link\b[^>]*rel="(?:canonical|alternate)"/.test(match[0])) continue
      if (!src.startsWith(siteBase)) badTargets.push(`${route}: ${src}`)
      else assets.add(src.split(/[?#]/)[0]!)
    }
  }
  for (const asset of assets) {
    const response = await request.get(asset)
    if (response.status() !== 200) broken.push(`${asset} -> ${response.status()}`)
  }
  return { pages, broken, badTargets, assets }
}
