// T5.3: the showcase extends the design system's own layer (REQ-059 AC1). The sidebar and the version are read at
// build time from DESIGN.md and from the layer's package.json, so the app keeps no copy of either.
// T5.4: the route of every doc is read from docs/ at build time too, and every route is prerendered.
//
// CN_DOCS_ROOT and CN_OUT_DIR exist for the fixture-doc test (REQ-051 AC3): they point the build at a throwaway
// docs tree and write the static output somewhere else, so the real build is left alone.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions } from '@nuxt/content'
import { parseDesignNav } from './lib/design-nav'
import { prerenderRoutes } from './lib/doc-routes'
import { scanDemos, scanDocMeta, scanDocs, scanPreviewBlocks } from './lib/doc-scan'
import { siteBase } from './lib/site'

// `nuxt prepare` writes this augmentation into .nuxt/; the root typecheck runs without it, so it is declared here.
declare module 'nuxt/schema' {
  interface NuxtConfig {
    content?: Partial<ModuleOptions>
    nitro?: { prerender?: { crawlLinks?: boolean; routes?: string[] }; output?: { dir?: string; publicDir?: string } }
  }
}

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
const docsRoot = process.env.CN_DOCS_ROOT ?? repoRoot
const read = (root: string, path: string) => readFileSync(join(root, path), 'utf8')
const docs = scanDocs(join(docsRoot, 'docs'))
const outDir = process.env.CN_OUT_DIR
// T7.1: the demos folder. CN_DEMOS_ROOT points the demo-infrastructure test at a throwaway one, as CN_DOCS_ROOT does for docs.
const demosDir = process.env.CN_DEMOS_ROOT ?? fileURLToPath(new URL('./demos', import.meta.url))
const demos = scanDemos(join(docsRoot, 'docs'), demosDir)

export default defineNuxtConfig({
  extends: ['@vinsmokemau/cup-noobles-nuxt'],
  modules: ['@nuxt/content'],
  content: {
    // ADR-0002 §1: Node's built-in SQLite, so no native module is compiled.
    experimental: { sqliteConnector: 'native' },
    // The default code theme paints comments #676e95 on black, 4.24:1 (WCAG 1.4.3 needs 4.5:1). This one is built for
    // contrast. It is a syntax theme for code samples, not a brand color; the site is dark-only (A-02).
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-dark-high-contrast',
            dark: 'github-dark-high-contrast',
            light: 'github-dark-high-contrast',
          },
        },
      },
    },
  },
  // The docs are in English (ER-10), and a page needs a language for screen readers (WCAG 3.1.1, axe `html-has-lang`).
  // T5.6 (REQ-050 AC3): GitHub Pages serves a project site under the repository name, so every link and asset is
  // prefixed with it. `lib/site.ts` holds the same value for the tests and the deploy workflow.
  app: { baseURL: siteBase, head: { htmlAttrs: { lang: 'en' } } },
  runtimeConfig: {
    public: {
      version: (JSON.parse(read(repoRoot, 'packages/nuxt/package.json')) as { version: string }).version,
      nav: parseDesignNav(read(docsRoot, 'DESIGN.md')),
      docs,
      // T6.5: the layer and status of every doc, which the home page counts.
      docMeta: scanDocMeta(join(docsRoot, 'docs')),
      // T6.3: the token prefixes of each foundation doc's generated tables, which pick its previews.
      previewBlocks: scanPreviewBlocks(join(docsRoot, 'docs')),
      // T7.1: the demos each component doc lists, by doc slug.
      demos,
    },
  },
  nitro: {
    // Every route is listed, so a broken link in a doc cannot add or hide a page. The route crawl test finds broken links.
    prerender: { crawlLinks: false, routes: prerenderRoutes(docs, demos) },
    ...(outDir ? { output: { dir: outDir, publicDir: join(outDir, 'public') } } : {}),
  },
  // T7.1: the demo registry reads the demo files through this alias (lib/demo-registry.ts).
  alias: { '#demos': demosDir },
  compatibilityDate: '2026-09-28',
})
