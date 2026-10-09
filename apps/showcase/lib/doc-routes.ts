// T5.4 (REQ-051 AC2, REQ-052 AC1): the route of every doc, read from disk. A doc's route is its section (from its
// folder) and its frontmatter slug (SPEC.md §4.3, §4.6). It is plain TypeScript with no Nuxt imports, so nuxt.config.ts,
// the pages (which run in the browser too), and the unit tests all use the same code. Reading docs/ is in doc-scan.ts.
import { LAYERS } from './design-nav'

export interface DocEntry {
  /** Path relative to `docs/`, with forward slashes, such as `01-foundations/color.md`. */
  file: string
  /** The Nuxt Content path of the doc, such as `/01-foundations/color` (ADR-0002 §2). */
  path: string
  /** The showcase route (SPEC.md §4.6). */
  route: string
}

/** Pages with their own file under `pages/`, or no doc behind them. Their content is written by later tasks. */
export const STATIC_ROUTES = ['/', '/tokens', '/status', '/changelog']

/** Sections that have an index page (SPEC.md §4.6). `/overview` has none, and `/components` is the inventory doc. */
export const INDEX_SECTIONS = ['foundations', 'components', 'patterns', 'content', 'email', 'governance']

export const DECISIONS_ROUTE = '/governance/decisions'

/** SPEC.md §4.3: the brand source has no frontmatter, so the showcase shows it under a fixed title. */
export const FIXED_TITLES: Record<string, string> = {
  '00-overview/brand-context-source.md': 'Brand context source',
}

/** The route of the doc at `file`. A doc without a slug (the brand source) uses its file name. */
export function docRoute(file: string, slug: string | undefined): string {
  const [folder, ...rest] = file.split('/')
  const section = folder ? LAYERS[folder] : undefined
  if (!section || rest.length === 0) throw new Error(`docs/${file} is not in a layer folder`)
  const segment = slug ?? file.split('/').at(-1)!.replace(/\.md$/, '')
  if (section === 'components' && file.endsWith('/inventory.md')) return '/components'
  if (section === 'governance' && rest[0] === 'decisions') return `${DECISIONS_ROUTE}/${segment}`
  return `/${section}/${segment}`
}

/** Every route the static build writes: the pages, the section indexes, and one route per doc. */
export function prerenderRoutes(docs: DocEntry[]): string[] {
  const routes = new Set(STATIC_ROUTES)
  for (const doc of docs) {
    routes.add(doc.route)
    const section = doc.route.split('/')[1]
    if (section && INDEX_SECTIONS.includes(section)) routes.add(`/${section}`)
    if (doc.route.startsWith(`${DECISIONS_ROUTE}/`)) routes.add(DECISIONS_ROUTE)
  }
  return [...routes]
}

const OUTSIDE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i

/** Resolves `target` against the folder of `from`. A result that leaves docs/ starts with `..`. */
function resolveFrom(from: string, target: string): string {
  const parts = from.split('/').slice(0, -1)
  for (const part of target.split('/')) {
    if (part === '' || part === '.') continue
    if (part !== '..') parts.push(part)
    else if (parts.length > 0 && parts.at(-1) !== '..') parts.pop()
    else parts.push('..')
  }
  return parts.join('/')
}

/**
 * The showcase route for a link in a doc. Docs link each other by file (`../01-foundations/color.md#purpose`), which
 * is right on the repository host and wrong on the site. Nuxt Content drops the `.md` while it parses
 * (`../01-foundations/color#purpose`), so both forms are resolved. Returns undefined when the link is not a doc link.
 */
export function resolveDocLink(href: string, fromFile: string, docs: DocEntry[]): string | undefined {
  if (OUTSIDE.test(href) || href.startsWith('/')) return undefined
  const [target = '', ...hash] = href.split('#')
  const file = resolveFrom(fromFile, target.replace(/\.md$/, ''))
  const suffix = hash.length > 0 ? `#${hash.join('#')}` : ''
  if (file === '../DESIGN') return `/${suffix}`
  const doc = docs.find((entry) => entry.file === `${file}.md`)
  return doc ? `${doc.route}${suffix}` : undefined
}

/** Rewrites the doc links in a parsed Markdown tree (Nuxt Content's minimark nodes) in place. */
export function rewriteDocLinks(nodes: unknown[], fromFile: string, docs: DocEntry[]): void {
  for (const node of nodes) {
    if (!Array.isArray(node)) continue
    const [tag, props] = node as [unknown, unknown]
    if (tag === 'a' && props && typeof props === 'object' && typeof (props as { href?: unknown }).href === 'string') {
      const next = resolveDocLink((props as { href: string }).href, fromFile, docs)
      if (next) (props as { href: string }).href = next
    }
    rewriteDocLinks(node.slice(2), fromFile, docs)
  }
}
