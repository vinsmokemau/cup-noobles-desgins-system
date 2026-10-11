// T5.2 (REQ-071 AC1): a generic consumer. Everything it adds to the layer's config fits on these lines.
// T8.7: a page needs a language and a title for assistive technology (axe `html-has-lang` and `document-title`).
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['@vinsmokemau/cup-noobles-nuxt'],
  app: { head: { title: 'Consumer fixture', htmlAttrs: { lang: 'es-MX' } } },
  compatibilityDate: '2026-09-28',
})
