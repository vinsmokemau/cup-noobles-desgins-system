// T5.3: the showcase extends the design system's own layer (REQ-059 AC1). The sidebar and the version are read at
// build time from DESIGN.md and from the layer's package.json, so the app keeps no copy of either.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions } from '@nuxt/content'
import { parseDesignNav } from './lib/design-nav'

// `nuxt prepare` writes this augmentation into .nuxt/; the root typecheck runs without it, so it is declared here.
declare module 'nuxt/schema' {
  interface NuxtConfig {
    content?: Partial<ModuleOptions>
    nitro?: { prerender?: { crawlLinks?: boolean; routes?: string[] } }
  }
}

const repoFile = (path: string) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8')

export default defineNuxtConfig({
  extends: ['@vinsmokemau/cup-noobles-nuxt'],
  modules: ['@nuxt/content'],
  content: {
    // ADR-0002 §1: Node's built-in SQLite, so no native module is compiled.
    experimental: { sqliteConnector: 'native' },
  },
  runtimeConfig: {
    public: {
      version: (JSON.parse(repoFile('packages/nuxt/package.json')) as { version: string }).version,
      nav: parseDesignNav(repoFile('DESIGN.md')),
    },
  },
  nitro: {
    // The doc routes are written in T5.4. Until then the sidebar links point at pages that do not exist yet, so the
    // generator must not follow them.
    prerender: { crawlLinks: false, routes: ['/'] },
  },
  compatibilityDate: '2026-09-28',
})
