import { defineCollection, defineContentConfig } from '@nuxt/content'
import { docsDir } from './docs-source'
import { frontmatter } from './schema'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        cwd: docsDir,
        include: '**/*.md',
        exclude: ['**/_template.md']
      },
      // Content uses this for the table columns and typed queries; it does not enforce it.
      schema: frontmatter
    })
  }
})
