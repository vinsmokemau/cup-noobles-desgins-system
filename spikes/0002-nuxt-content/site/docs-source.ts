import { fileURLToPath } from 'node:url'

// The Markdown lives outside the app, one level up (stands in for ../../docs in apps/showcase).
// SPIKE_DOCS_DIR lets verify.mjs point the same app at a directory holding an invalid doc.
export const docsDir = process.env.SPIKE_DOCS_DIR || fileURLToPath(new URL('../docs', import.meta.url))
