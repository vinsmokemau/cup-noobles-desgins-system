// T6.3 (REQ-054 AC2, AC3, AC4): the model of the previews on the foundation pages, for every token type but color (color is
// lib/color-preview.ts). `tokens.flat.json` is the only source (SPEC.md §4.5), and a doc picks its previews with the
// `tokens` attribute of its generated blocks. No value is written here: a preview paints itself with `var(--cn-*)`.
import type { FlatToken } from './token-filter'

export type PreviewKind = 'type' | 'space' | 'radius' | 'stroke' | 'glow' | 'elevation' | 'motion'

/** The sections of the previews, in the order the page shows them. */
export const SECTIONS: { kind: PreviewKind; title: string; note: string }[] = [
  { kind: 'type', title: 'Typography', note: 'Each specimen is set in its own tokens.' },
  { kind: 'space', title: 'Spacing', note: 'Each bar is as wide as its token.' },
  { kind: 'stroke', title: 'Stroke width', note: 'Each line is as thick as its token.' },
  { kind: 'radius', title: 'Radius', note: 'Each box has the corner radius of its token.' },
  { kind: 'glow', title: 'Glow', note: 'Each box carries its token as a glow. A glow of none shows nothing.' },
  {
    kind: 'elevation',
    title: 'Elevation',
    note: 'Each box carries its token as a shadow. The base is pure black (BR-03), so a black shadow cannot show on it.',
  },
  { kind: 'motion', title: 'Motion', note: 'Play runs the demo with the duration and easing tokens.' },
]

/** The type roles of the BR-08 hierarchy, in order. */
export const TYPE_ROLES = ['h1', 'h2', 'h3', 'body', 'caption'] as const
const TYPE_PROPS = ['family', 'size', 'weight', 'lineHeight', 'letterSpacing'] as const

/** The sample copy of a specimen. It is an example, not brand copy, and it is es-MX (A-06). */
export const SPECIMEN_LOCALE = 'es-MX'
export const DIACRITICS = 'áéíóú ñ ¿¡'
export const SPECIMEN_TEXT: Record<(typeof TYPE_ROLES)[number], string> = {
  h1: `Ramen gamer ${DIACRITICS}`,
  h2: `Torneo de cartas ${DIACRITICS}`,
  h3: `Mazo del día ${DIACRITICS}`,
  body: `Prepara tu mazo, elige tu dado y juega toda la noche. ${DIACRITICS}`,
  caption: `Ejemplo de texto auxiliar ${DIACRITICS}`,
}

export interface PreviewToken {
  path: string
  cssVar: string
  value: string
}

export interface Preview {
  /** Unique on the page, and safe as a DOM id. */
  id: string
  kind: PreviewKind
  label: string
  tokens: PreviewToken[]
  /** The worst status of the tokens: tbd, then derived-pending, then the first one found. */
  status: string | null
  /** The TBD ids behind the tokens, without repeats. */
  tbd: string[]
  /** Specimens: the role. Motion: the shared key of the duration and the easing. */
  role?: string
}

const matches = (path: string, prefixes: string[]) =>
  prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`))

const ORDER = ['tbd', 'derived-pending']

/** tbd beats derived-pending, which beats anything else: one open token makes the whole preview open. */
export function aggregateStatus(statuses: (string | null)[]): string | null {
  for (const status of ORDER) if (statuses.includes(status)) return status
  return statuses.find((status) => status !== null) ?? null
}

function preview(kind: PreviewKind, label: string, entries: [string, FlatToken][], role?: string): Preview {
  const id = `preview-${kind}-${entries[0]![0].replaceAll('.', '-')}`
  return {
    id,
    kind,
    label,
    role,
    tokens: entries.map(([path, token]) => ({ path, cssVar: token.cssVar, value: String(token.value) })),
    status: aggregateStatus(entries.map(([, token]) => token.status)),
    tbd: [...new Set(entries.flatMap(([, token]) => token.tbd ?? []))].sort(),
  }
}

/**
 * The previews for the tokens that `prefixes` select (the `tokens` attribute of a doc's generated blocks), grouped by
 * `SECTIONS` order. Color tokens are skipped, and so is any token with no preview kind (a z-index, a focus ring).
 */
export function toPreviews(flat: Record<string, FlatToken>, prefixes: string[]): Preview[] {
  const picked = Object.entries(flat).filter(([path]) => matches(path, prefixes))
  const byPath = new Map(picked)
  const out: Preview[] = []

  for (const role of TYPE_ROLES) {
    const entries: [string, FlatToken][] = []
    for (const prop of TYPE_PROPS) {
      const path = `font.${role}.${prop}`
      const token = byPath.get(path)
      if (token) entries.push([path, token])
    }
    if (entries.length > 0)
      out.push(preview('type', role === 'body' || role === 'caption' ? role : role.toUpperCase(), entries, role))
  }
  for (const [path, token] of picked) {
    if (path.startsWith('space.')) out.push(preview('space', path, [[path, token]]))
    else if (path.startsWith('border.width.')) out.push(preview('stroke', path, [[path, token]]))
    else if (path.startsWith('radius.')) out.push(preview('radius', path, [[path, token]]))
    else if (path.startsWith('effect.glow.')) out.push(preview('glow', path, [[path, token]]))
    else if (path.startsWith('effect.elevation.') || path.startsWith('effect.shadow.'))
      out.push(preview('elevation', path, [[path, token]]))
  }
  // A motion demo needs a duration and an easing; they pair by their last segment (`default`).
  for (const [path, token] of picked) {
    if (!path.startsWith('motion.duration.')) continue
    const key = path.slice('motion.duration.'.length)
    const easing = byPath.get(`motion.easing.${key}`)
    if (easing)
      out.push(
        preview(
          'motion',
          `motion.*.${key}`,
          [
            [path, token],
            [`motion.easing.${key}`, easing],
          ],
          key,
        ),
      )
  }

  const rank = new Map(SECTIONS.map((section, index) => [section.kind, index]))
  return out.sort((a, b) => rank.get(a.kind)! - rank.get(b.kind)!)
}

/** The sections that have at least one preview, with their previews. */
export function toSections(previews: Preview[]) {
  return SECTIONS.map((section) => ({ ...section, previews: previews.filter((p) => p.kind === section.kind) })).filter(
    (section) => section.previews.length > 0,
  )
}

/** The CSS variable of a token path inside a preview. */
export function cssVarOf(preview: Preview, path: string): string {
  const found = preview.tokens.find((token) => token.path === path)
  if (!found) throw new Error(`${path} is not in ${preview.id}`)
  return found.cssVar
}

/** A specimen's inline style: one `var()` per type property, with the property it sets. */
export function specimenStyle(preview: Preview): Record<string, string> {
  const role = preview.role!
  const get = (prop: (typeof TYPE_PROPS)[number]) => {
    const token = preview.tokens.find((t) => t.path === `font.${role}.${prop}`)
    return token ? `var(${token.cssVar})` : ''
  }
  const style: Record<string, string> = {}
  const map: Record<(typeof TYPE_PROPS)[number], string> = {
    family: 'fontFamily',
    size: 'fontSize',
    weight: 'fontWeight',
    lineHeight: 'lineHeight',
    letterSpacing: 'letterSpacing',
  }
  for (const prop of TYPE_PROPS) {
    const value = get(prop)
    if (value) style[map[prop]] = value
  }
  return style
}
