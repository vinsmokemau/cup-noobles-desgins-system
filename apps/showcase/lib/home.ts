// T6.5 (REQ-062 AC1, REQ-052, SPEC.md §4.6): the model of the home page. The component count and the layer cards come
// from the frontmatter of the docs (§4.5: the component inventory's source is the component docs); the token count and
// the open-TBD count are read by the page from tokens.flat.json and tbd-report.json. No Vue in this file, so the unit
// tests can run it.
import { LAYERS, type NavSection } from './design-nav'
import { INDEX_SECTIONS } from './doc-routes'

/** What the home page needs from one doc. The brand source has no frontmatter, so `layer` and `status` may be absent. */
export interface DocMeta {
  /** Path relative to `docs/`, such as `02-components/atoms/button.md`. */
  file: string
  layer?: string
  status?: string
}

/** The value of a top-level `key:` in the frontmatter of `markdown`, or undefined when there is none. */
export function frontmatterValue(markdown: string, key: string): string | undefined {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown)?.[1]
  return frontmatter ? new RegExp(`^${key}:\\s*(\\S+)\\s*$`, 'm').exec(frontmatter)?.[1] : undefined
}

/** The number of component docs (`layer: component`), which is the number of components in the system. */
export const componentCount = (metas: DocMeta[]): number => metas.filter((meta) => meta.layer === 'component').length

export interface LayerCard {
  title: string
  to: string
  docs: number
  /** Doc count per status, such as `{ tbd: 4, draft: 1 }`. A doc with no status is not counted here. */
  statuses: Record<string, number>
}

/** One card per `##` section of DESIGN.md, in file order, with the docs of that layer and their statuses. */
export function layerCards(metas: DocMeta[], nav: NavSection[]): LayerCard[] {
  return nav.flatMap((section): LayerCard[] => {
    const first = section.groups[0]?.links[0]
    const segment = first?.to.split('/')[1]
    const folder = Object.keys(LAYERS).find((key) => LAYERS[key] === segment)
    if (!first || !segment || !folder) return []
    const inLayer = metas.filter((meta) => meta.file.startsWith(`${folder}/`))
    const statuses: Record<string, number> = {}
    for (const meta of inLayer) if (meta.status) statuses[meta.status] = (statuses[meta.status] ?? 0) + 1
    // `/overview` has no index page (§4.6), so its card opens the first doc DESIGN.md lists.
    return [
      {
        title: section.title,
        to: INDEX_SECTIONS.includes(segment) ? `/${segment}` : first.to,
        docs: inLayer.length,
        statuses,
      },
    ]
  })
}
