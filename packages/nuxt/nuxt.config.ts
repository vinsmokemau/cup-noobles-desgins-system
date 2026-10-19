// T5.1: the @vinsmokemau/cup-noobles-nuxt layer. It registers Nuxt UI (pinned to 4.11.2, ADR-0001 §1), loads the
// token CSS through main.css, and forces dark mode (REQ-031, ADR-0001 §4). Visual styling lives only here (C-03).
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions } from '@nuxt/ui'
import { stripPartialOpacity } from './utils/partial-opacity'

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
    // @nuxt/fonts would fetch a default typeface. Titan One and Rubik are self-hosted by assets/css/main.css (ADR-0046, ADR-0047).
    fonts: false,
  },
  app: {
    head: {
      // Rendered by the server, so the dark variables apply before any JavaScript runs (ADR-0001 §4).
      htmlAttrs: { class: 'dark' },
    },
  },
  hooks: {
    // T13.2 (C-06, ADR-0055): the generated Nuxt UI themes (`ui/*.ts`) lose their partial-opacity color classes, such as
    // `hover:bg-primary/75`. Those make translucent brand colors, which the owner approved only for the glow (ADR-0051).
    'app:templates'(app) {
      for (const template of app.templates) {
        const { getContents } = template
        if (!/^ui\/.+\.ts$/.test(template.filename ?? '') || !getContents) continue
        template.getContents = async (data) => stripPartialOpacity(await getContents(data))
      }
    },
  },
  compatibilityDate: '2026-09-28',
})
