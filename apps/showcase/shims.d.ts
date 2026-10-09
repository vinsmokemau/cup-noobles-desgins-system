// T5.4: Nuxt Content's `queryCollection` is auto-imported, and its types are generated into .nuxt/ by `nuxt prepare`.
// The root typecheck runs without .nuxt/, so the part of it that the pages use is declared here.
// T6.1: the token build's JSON, imported by pages/tokens.vue. It is a build output, so it may not exist when the root
// typecheck runs; the shape is the one packages/tokens/build.ts writes (see lib/token-filter.ts).
// T7.1: `import.meta.glob` (lib/demo-registry.ts) is Vite's. Nuxt's generated types add it; the root typecheck runs
// without them.
/// <reference types="vite/client" />

declare module '*/tokens.flat.json' {
  const flat: Record<string, unknown>
  export default flat
}

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
  demos?: string[] | null
  body: { type: string; value: unknown[]; toc?: { links?: TocLink[] } }
}

interface DocQuery {
  path(path: string): DocQuery
  where(field: string, operator: '=', value: string): DocQuery
  first(): Promise<DocPage | null>
  all(): Promise<DocPage[]>
}

declare function queryCollection(collection: 'docs'): DocQuery

// T7.1: a compiler macro of Nuxt's pages module, which `nuxt prepare` types.
declare function definePageMeta(meta: { layout?: string | false }): void
