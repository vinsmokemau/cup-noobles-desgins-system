// T5.3 (REQ-052 AC2): the sidebar is DESIGN.md. This file reads its headings and links in file order and maps each
// linked doc to its showcase route (SPEC.md §4.6). It is plain TypeScript with no Nuxt imports, so nuxt.config.ts
// and the unit tests can both use it.

export interface NavLink {
  label: string
  to: string
  /** The repository path DESIGN.md links to, such as `docs/01-foundations/color.md`. */
  doc: string
}

/** A `##` section of DESIGN.md. Links that sit under a `###` heading belong to that group; the rest have `title: null`. */
export interface NavSection {
  title: string
  groups: { title: string | null; links: NavLink[] }[]
}

/** The `docs/` folder of each layer, and the first segment of that layer's showcase routes. */
export const LAYERS: Record<string, string> = {
  '00-overview': 'overview',
  '01-foundations': 'foundations',
  '02-components': 'components',
  '03-patterns': 'patterns',
  '04-content': 'content',
  '05-email': 'email',
  '06-governance': 'governance',
}

/** Maps a doc path from DESIGN.md to its §4.6 route. Atoms, molecules, and organisms all sit under `/components`. */
export function docToRoute(doc: string): string {
  const match = /^docs\/(0\d-[a-z]+)\/(?:(?:atoms|molecules|organisms)\/)?([a-z0-9-]+)\.md$/.exec(doc)
  const section = match?.[1] ? LAYERS[match[1]] : undefined
  const slug = match?.[2]
  if (!section || !slug) throw new Error(`DESIGN.md links "${doc}", which has no showcase route`)
  // The inventory is the generated index of the component pages (§4.6, `/components`).
  if (section === 'components' && slug === 'inventory') return '/components'
  return `/${section}/${slug}`
}

export function parseDesignNav(markdown: string): NavSection[] {
  const sections: NavSection[] = []
  for (const line of markdown.split(/\r?\n/)) {
    const section = /^## (.+)$/.exec(line)
    if (section) {
      sections.push({ title: section[1]!.trim(), groups: [{ title: null, links: [] }] })
      continue
    }
    const group = /^### (.+)$/.exec(line)
    const current = sections.at(-1)
    if (group && current) {
      current.groups.push({ title: group[1]!.trim(), links: [] })
      continue
    }
    const link = /^- \[([^\]]+)\]\(([^)]+)\)/.exec(line)
    if (link && current) {
      current.groups.at(-1)!.links.push({ label: link[1]!, doc: link[2]!, to: docToRoute(link[2]!) })
    }
  }
  return sections
    .map((section) => ({ ...section, groups: section.groups.filter((g) => g.links.length > 0) }))
    .filter((section) => section.groups.length > 0)
}
