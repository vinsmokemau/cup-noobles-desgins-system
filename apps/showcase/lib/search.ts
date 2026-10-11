// T11.1 (REQ-056, ADR-0002 §5): the model of the global search. Three sources feed it and the app keeps no copy of any:
// the pages and sections that Nuxt Content prerenders to /search-sections.json (server/routes/search-sections.json.ts),
// the doc routes of nuxt.config.ts, and `tokens.flat.json`. This file turns them into the groups of Nuxt UI's
// `UContentSearch`, with no Vue in it so the unit tests can run it.
import { tokenAnchor } from './status'
import { FIXED_TITLES, type DocEntry } from './doc-routes'
import type { FlatToken } from './token-filter'

/** Where the showcase serves the search data, under the app's base URL. */
export const SEARCH_DATA_FILE = 'search-sections.json'

/**
 * How the palette matches. A query has to look like the whole of a title, heading, token path, or component name (a near
 * match, so one typo is forgiven). Nuxt UI's default also splits the query into words and matches any one of them, which
 * makes "zzqx-no-such-thing" match every "no" in the docs, so that is off. Each group shows at most 20 rows.
 */
export const SEARCH_FUSE = {
  resultLimit: 20,
  fuseOptions: { ignoreLocation: true, threshold: 0.1, useTokenSearch: false },
} as const

/** The frontmatter of one doc that the search needs, as `queryCollection` returns it. */
export interface SearchPage {
  /** The Nuxt Content path, such as `/01-foundations/color` (ADR-0002 §2). */
  path: string
  title: string
  layer: string | null
  level: 'atom' | 'molecule' | 'organism' | null
  /** The Nuxt UI component a doc themes, such as `UButton`. */
  nuxtUi: string | null
  /** The custom component a doc describes, such as `CnMediaCard`. */
  component: string | null
}

/** One heading of a doc, as `queryCollectionSearchSections` returns it (`id` is `<content path>#<heading id>`). */
export interface SearchSection {
  id: string
  title: string
  /** The headings above this one, outermost first. */
  titles: string[]
  /** 1 for the page title, 2 for an `h2`, and so on. */
  level: number
}

export interface SearchData {
  pages: SearchPage[]
  sections: SearchSection[]
}

/** One result row of the palette. The fields are the ones `UCommandPalette` reads. */
export interface PaletteItem {
  label: string
  /** The path that leads to this row, such as the page a heading is on. */
  prefix?: string
  /** Searched text, shown after the label: a component name, or a page title. */
  suffix?: string
  to: string
  icon: string
}

export interface PaletteGroup {
  id: 'pages' | 'sections' | 'tokens'
  label: string
  items: PaletteItem[]
  /** With no query typed, the group is left out so the list is the doc titles only. */
  postFilter: (query: string, items: PaletteItem[]) => PaletteItem[]
}

const LAYER_LABELS: Record<string, string> = {
  overview: 'Overview',
  foundation: 'Foundations',
  component: 'Components',
  pattern: 'Patterns',
  content: 'Content',
  email: 'Email',
  governance: 'Governance',
  adr: 'Decisions',
}

const ICONS = { page: 'i-ph-file-bold', section: 'i-ph-hash-bold', token: 'i-ph-star-bold' } as const

const onlyWhenTyping = (query: string, items: PaletteItem[]) => (query.trim() === '' ? [] : items)

/** The title a doc shows on the site: the brand source has no frontmatter title, so it has a fixed one. */
const titleOf = (doc: DocEntry, page: SearchPage | undefined) => FIXED_TITLES[doc.file] ?? page?.title ?? doc.route

/** The doc a search result belongs to, from the Nuxt Content path of the page or of the heading (`/a/b#c` -> `/a/b`). */
const docOf = (contentPath: string, docs: DocEntry[]) => {
  const base = contentPath.split('#')[0]
  return docs.find((doc) => doc.path === base)
}

/**
 * Pages: one row per doc, found by title or by component name. A component doc lists its component (`UButton`,
 * `CnMediaCard`) as the suffix, so a query for the component finds its page. Sorted in route order.
 */
export function pageItems(data: SearchData, docs: DocEntry[]): PaletteItem[] {
  const pages = new Map(data.pages.map((page) => [page.path, page]))
  return docs
    .filter((doc) => doc.route !== '/')
    .map((doc): PaletteItem => {
      const page = pages.get(doc.path)
      const component = page?.component ?? page?.nuxtUi ?? undefined
      return {
        label: titleOf(doc, page),
        ...(component ? { suffix: component } : {}),
        ...(page?.layer && LAYER_LABELS[page.layer] ? { prefix: `${LAYER_LABELS[page.layer]} >` } : {}),
        to: doc.route,
        icon: ICONS.page,
      }
    })
    .sort((a, b) => a.to.localeCompare(b.to))
}

/**
 * Sections: one row per heading below the title. The anchor is the heading id Nuxt Content wrote, so the link lands
 * on the heading that the page renders. The page title is the suffix, so a query that names the page finds its headings.
 */
export function sectionItems(data: SearchData, docs: DocEntry[]): PaletteItem[] {
  const pages = new Map(data.pages.map((page) => [page.path, page]))
  const items: PaletteItem[] = []
  for (const section of data.sections) {
    const hash = section.id.split('#')[1]
    if (!hash || section.level < 2) continue
    const doc = docOf(section.id, docs)
    if (!doc) continue
    const title = titleOf(doc, pages.get(doc.path))
    items.push({ label: section.title, suffix: title, to: `${doc.route}#${hash}`, icon: ICONS.section })
  }
  return items
}

/** Tokens: one row per token path, linked to its row on `/tokens` (the anchor the status page uses too). */
export function tokenItems(flat: Record<string, FlatToken>): PaletteItem[] {
  return Object.keys(flat)
    .sort((a, b) => a.localeCompare(b))
    .map((path): PaletteItem => ({ label: path, to: `/tokens#${tokenAnchor(path)}`, icon: ICONS.token }))
}

export function buildGroups(data: SearchData, docs: DocEntry[], flat: Record<string, FlatToken>): PaletteGroup[] {
  return [
    { id: 'pages', label: 'Pages', items: pageItems(data, docs), postFilter: (_query, items) => items },
    { id: 'sections', label: 'Sections', items: sectionItems(data, docs), postFilter: onlyWhenTyping },
    { id: 'tokens', label: 'Tokens', items: tokenItems(flat), postFilter: onlyWhenTyping },
  ]
}
