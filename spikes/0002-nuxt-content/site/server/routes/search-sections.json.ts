import { queryCollectionSearchSections } from '@nuxt/content/server'

// Prerendered to a static file: one entry per heading section, for a client-side search UI.
export default defineEventHandler(event => queryCollectionSearchSections(event, 'docs'))
