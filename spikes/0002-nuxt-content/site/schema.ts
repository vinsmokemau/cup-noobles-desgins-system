import { z } from '@nuxt/content'

// Frontmatter schema from SPEC.md §4.3. The real one is docs/_schema/frontmatter.schema.json (T2.1).
export const frontmatter = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  layer: z.enum(['overview', 'foundation', 'component', 'pattern', 'content', 'email', 'governance', 'adr']),
  level: z.enum(['atom', 'molecule', 'organism']).optional(),
  source: z.enum(['nuxt-ui', 'custom']).optional(),
  nuxtUi: z.string().optional(),
  component: z.string().nullable().optional(),
  status: z.enum(['tbd', 'draft', 'stable', 'deprecated']),
  lang: z.literal('en'),
  brandRules: z.array(z.string()).default([]),
  tokens: z.array(z.string()).default([]),
  demos: z.array(z.string()).default([]),
  tbd: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  since: z.string(),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})
