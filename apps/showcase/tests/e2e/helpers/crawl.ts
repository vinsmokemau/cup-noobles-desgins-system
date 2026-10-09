// T5.4, T5.5: the route list and the link crawl, shared by the end-to-end specs.
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { APIRequestContext } from '@playwright/test'

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
  broken: string[]
}

/** Follows every internal link from `/`, the way a visitor would, and records the status of each page. */
export async function crawl(request: APIRequestContext): Promise<Crawl> {
  const pages = new Map<string, { status: number; html: string }>()
  const broken: string[] = []
  const queue = ['/']
  while (queue.length > 0) {
    const path = queue.shift()!
    if (pages.has(path)) continue
    const response = await request.get(path)
    const html = await response.text()
    pages.set(path, { status: response.status(), html })
    if (response.status() !== 200) {
      broken.push(`${path} -> ${response.status()}`)
      continue
    }
    for (const match of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
      const href = match[1]!.replaceAll('&amp;', '&')
      if (!href.startsWith('/') || href.startsWith('//')) continue
      const target = href.split(/[?#]/)[0]!
      if (target && !pages.has(target)) queue.push(target)
    }
  }
  return { pages, broken }
}
