// T5.1: the @vinsmokemau/cup-noobles-nuxt layer. It registers Nuxt UI (pinned to 4.11.2, ADR-0001 §1), loads the
// token CSS through main.css, and forces dark mode (REQ-031, ADR-0001 §4). Visual styling lives only here (C-03).
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions } from '@nuxt/ui'

// `nuxt prepare` writes this augmentation into .nuxt/; the root typecheck runs without it, so it is declared here.
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ui?: ModuleOptions
  }
}

export default defineNuxtConfig({
  // SPEC.md §4.1 keeps app.config.ts, assets/, and components/ at the package root, not in Nuxt 4's app/.
  srcDir: '.',
  modules: ['@nuxt/ui'],
  css: [fileURLToPath(new URL('./assets/css/main.css', import.meta.url))],
  ui: {
    // Without @nuxtjs/color-mode, no color-mode toggle component is registered and useColorMode() reports
    // { forced: true } (ADR-0001 §4).
    colorMode: false,
    // @nuxt/fonts would fetch a default typeface; the display and body families are TBD-01 and TBD-02.
    fonts: false,
  },
  app: {
    head: {
      // Rendered by the server, so the dark variables apply before any JavaScript runs (ADR-0001 §4).
      htmlAttrs: { class: 'dark' },
    },
  },
  compatibilityDate: '2026-09-28',
})
