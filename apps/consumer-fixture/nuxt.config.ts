// T5.2 (REQ-071 AC1): a generic consumer. Everything it adds to the layer's config fits on these lines.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['@vinsmokemau/cup-noobles-nuxt'],
  compatibilityDate: '2026-09-28',
})
