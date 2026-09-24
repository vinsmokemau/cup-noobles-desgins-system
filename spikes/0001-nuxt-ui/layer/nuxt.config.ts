// Spike stand-in for packages/nuxt: extends Nuxt UI, loads the CSS, forces dark mode.
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],
  ui: {
    // Disabling @nuxtjs/color-mode removes every color-mode toggle component and
    // replaces useColorMode() with a stub that reports { forced: true } (REQ-031).
    colorMode: false,
    // Keep the spike offline and brand-neutral: no font provider (TBD-01).
    fonts: false
  },
  app: {
    head: {
      // Dark mode is forced by rendering the class on the server, so there is no flash.
      htmlAttrs: { class: 'dark' }
    }
  }
})
