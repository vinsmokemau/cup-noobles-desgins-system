import { docsDir } from './docs-source'
import { validateDocs } from './guard'
import { interceptGeneratedBlocks } from './intercept'

export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  compatibilityDate: '2026-09-25',
  content: {
    // Node's built-in node:sqlite; avoids a native better-sqlite3 build.
    experimental: { sqliteConnector: 'native' }
  },
  hooks: {
    'content:file:beforeParse': (ctx) => {
      if (ctx.file.extension === '.md') {
        ctx.file.body = interceptGeneratedBlocks(ctx.file.body)
      }
    },
    'build:before': () => {
      // Nuxt Content 3.16.1 stores invalid frontmatter as-is, so the build enforces the schema.
      // SPIKE_NO_GUARD=1 is the control run in verify.mjs: it shows what Content does on its own.
      if (process.env.SPIKE_NO_GUARD) return
      const errors = validateDocs(docsDir)
      if (errors.length) {
        throw new Error(`[cn] Invalid frontmatter:\n${errors.join('\n')}`)
      }
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/search-sections.json']
    }
  }
})
