// T5.3 (REQ-051 AC1, ADR-0002 §2): Nuxt Content reads the repository's docs/ in place. The app holds no copy of any doc.
// The schema mirrors SPEC.md §4.3 for typed queries only; Content does not validate it (ADR-0002 §3), and
// `pnpm check:docs` is the gate.
import { fileURLToPath } from 'node:url'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        cwd: fileURLToPath(new URL('../../docs', import.meta.url)),
        include: '**/*.md',
        exclude: ['**/_template.md'],
      },
      schema: z.object({
        slug,
        layer: z.enum(['overview', 'foundation', 'component', 'pattern', 'content', 'email', 'governance', 'adr']),
        level: z.enum(['atom', 'molecule', 'organism']).optional(),
        source: z.enum(['nuxt-ui', 'custom']).optional(),
        nuxtUi: z.string().nullable().optional(),
        component: z.string().nullable().optional(),
        status: z.enum(['tbd', 'draft', 'stable', 'deprecated']),
        lang: z.literal('en'),
        brandRules: z.array(z.string()).optional(),
        tokens: z.array(z.string()).optional(),
        demos: z.array(slug).optional(),
        tbd: z.array(z.string()).optional(),
        related: z.array(slug).optional(),
        since: z.string(),
        updated: z.string(),
      }),
    }),
  },
})
