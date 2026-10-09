// T7.1 (REQ-055, REQ-026 AC2, AC3): the demo registry's pure logic. A component doc lists its demos in the frontmatter
// (`demos: [states, playground]`), and each one is a file at `apps/showcase/demos/<slug>/<name>.vue` (SPEC.md §4.5,
// mechanic 3). It is plain TypeScript with no Nuxt or Vite imports, so nuxt.config.ts, the pages, and the unit tests share it.
// Reading the files and globbing them is in doc-scan.ts and demo-registry.ts.

/** The reference viewports (A-09). The iframe is this wide, so the demo's media queries respond (REQ-055 AC3). */
export const VIEWPORTS = [360, 768, 1280] as const

/** The demo that shows every state of the component. Each state is an element marked `data-state="<state>"`. */
export const STATES_DEMO = 'states'

/** The demo whose props the playground controls set. It declares a prop for each control (`controls.ts`). */
export const PLAYGROUND_DEMO = 'playground'

/** The heading after which the state matrix appears, and the one after which the playground appears (SPEC.md §4.5). */
export const STATES_HEADING = 'States'
export const PLAYGROUND_HEADING = 'Code reference'

/** Parent and demo page talk by `postMessage`, because the demo runs in an iframe. */
export const MESSAGE_PROPS = 'cn-demo-props'
export const MESSAGE_HEIGHT = 'cn-demo-height'

/** The isolated route of a demo (SPEC.md §4.6). Its path starts with `_`, so the route crawl and the route matrix skip it. */
export const demoRoute = (slug: string, name: string) => `/_demo/${slug}/${name}`

/** The routes of every demo, for the static build. `demos` maps a doc slug to the names its frontmatter lists. */
export function demoRoutes(demos: Record<string, string[]>): string[] {
  return Object.entries(demos).flatMap(([slug, names]) => names.map((name) => demoRoute(slug, name)))
}

interface ControlBase {
  /** The name of the prop of the playground demo that this control sets. */
  name: string
}

/** One entry of a `controls.ts` file: the prop name, its type, and, for a select, its options (T7.1 scope). */
export type Control =
  | (ControlBase & { type: 'string'; default?: string })
  | (ControlBase & { type: 'number'; default?: number; min?: number; max?: number; step?: number })
  | (ControlBase & { type: 'boolean'; default?: boolean })
  | (ControlBase & { type: 'select'; options: string[]; default?: string })

export type ControlValue = string | number | boolean

/** The value each control starts with: its `default`, or the empty value of its type (the first option for a select). */
export function defaultValues(controls: Control[]): Record<string, ControlValue> {
  const values: Record<string, ControlValue> = {}
  for (const control of controls) {
    if (control.type === 'select') values[control.name] = control.default ?? control.options[0] ?? ''
    else if (control.type === 'string') values[control.name] = control.default ?? ''
    else if (control.type === 'number') values[control.name] = control.default ?? 0
    else values[control.name] = control.default ?? false
  }
  return values
}

/** Throws a message that names `where` when `controls` is not a valid controls schema. Returns it typed otherwise. */
export function assertControls(controls: unknown, where: string): Control[] {
  if (!Array.isArray(controls)) throw new Error(`${where}: controls must be an array`)
  const seen = new Set<string>()
  for (const [index, control] of controls.entries()) {
    const at = `${where}: control ${index}`
    if (!control || typeof control !== 'object') throw new Error(`${at} must be an object`)
    const { name, type, options, default: value } = control as Record<string, unknown>
    if (typeof name !== 'string' || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) throw new Error(`${at} needs a prop name`)
    if (seen.has(name)) throw new Error(`${at} repeats the prop "${name}"`)
    seen.add(name)
    if (type !== 'string' && type !== 'number' && type !== 'boolean' && type !== 'select') {
      throw new Error(`${at} ("${name}") has the type "${String(type)}"; use string, number, boolean, or select`)
    }
    if (type === 'select') {
      if (!Array.isArray(options) || options.length === 0 || options.some((option) => typeof option !== 'string')) {
        throw new Error(`${at} ("${name}") is a select and needs a non-empty list of string options`)
      }
      if (value !== undefined && !options.includes(value)) throw new Error(`${at} ("${name}") defaults to a non-option`)
    } else if (value !== undefined && typeof value !== type) {
      throw new Error(`${at} ("${name}") has a default that is not a ${type}`)
    }
  }
  return controls as Control[]
}

/** A node of Nuxt Content's minimark tree: `[tag, props, ...children]`, or a string. */
export type MinimarkNode = unknown

const textOf = (node: MinimarkNode): string =>
  typeof node === 'string' ? node : Array.isArray(node) ? node.slice(2).map(textOf).join('') : ''

export interface BodySegment {
  nodes: MinimarkNode[]
  /** The headings whose section ends this segment: the panels for those headings follow it. */
  panels: string[]
}

/**
 * Cuts a doc body where the sections named in `headings` end (SPEC.md §4.5: the state matrix follows "States", the
 * playground follows "Code reference"). Each segment lists the headings it closes. A heading the doc does not have is
 * added to the last segment, so its panel is still shown.
 */
export function splitAfterSections(nodes: MinimarkNode[], headings: string[]): BodySegment[] {
  const segments: BodySegment[] = [{ nodes: [], panels: [] }]
  let open: string | undefined
  const placed = new Set<string>()
  const close = () => {
    if (open === undefined) return
    segments.at(-1)!.panels.push(open)
    placed.add(open)
    segments.push({ nodes: [], panels: [] })
    open = undefined
  }
  for (const node of nodes) {
    if (Array.isArray(node) && node[0] === 'h2') {
      close()
      const title = textOf(node)
      if (headings.includes(title) && !placed.has(title)) open = title
    }
    segments.at(-1)!.nodes.push(node)
  }
  if (open !== undefined) {
    segments.at(-1)!.panels.push(open)
    placed.add(open)
  }
  segments.at(-1)!.panels.push(...headings.filter((heading) => !placed.has(heading)))
  return segments
}
