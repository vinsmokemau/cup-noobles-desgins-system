// T6.3 (REQ-054, SPEC.md §4.5 mechanic 2): reads the token prefixes of a doc's generated blocks, so the showcase can swap a
// `table` block for the rich preview of the same tokens. It is plain TypeScript with no Nuxt imports. Markers inside
// fenced code are not blocks, the same as in sync-docs and check-docs.
const OPEN = /^<!-- cn:generated\b(.*)-->\s*$/
const FENCE = /^\s*(```|~~~)/

const attribute = (source: string, name: string) => new RegExp(`\\b${name}="([^"]*)"`).exec(source)?.[1]

/** The token path prefixes of every `table` block in `markdown`, in order, without repeats. */
export function tableBlockPrefixes(markdown: string): string[] {
  const found = new Set<string>()
  let fence: string | null = null
  for (const line of markdown.split(/\r?\n/)) {
    const mark = FENCE.exec(line)?.[1]
    if (mark) fence = fence === null ? mark : fence === mark ? null : fence
    if (fence !== null) continue
    const open = OPEN.exec(line)
    if (!open) continue
    const source = open[1] ?? ''
    if (attribute(source, 'format') !== 'table') continue
    for (const prefix of (attribute(source, 'tokens') ?? '').split(/[\s,]+/).filter(Boolean)) found.add(prefix)
  }
  return [...found]
}
