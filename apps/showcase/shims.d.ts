// T5.4: Nuxt Content's `queryCollection` is auto-imported, and its types are generated into .nuxt/ by `nuxt prepare`.
// The root typecheck runs without .nuxt/, so the part of it that the pages use is declared here.
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

interface DocPage {
  path: string
  title: string
  status: 'tbd' | 'draft' | 'stable' | 'deprecated' | null
  layer: string | null
  source: 'nuxt-ui' | 'custom' | null
  level: 'atom' | 'molecule' | 'organism' | null
  slug: string | null
  body: { type: string; value: unknown[]; toc?: { links?: TocLink[] } }
}

interface DocQuery {
  path(path: string): DocQuery
  where(field: string, operator: '=', value: string): DocQuery
  first(): Promise<DocPage | null>
  all(): Promise<DocPage[]>
}

declare function queryCollection(collection: 'docs'): DocQuery
