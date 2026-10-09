// T6.1 (REQ-053): the model of the /tokens explorer. `tokens.flat.json` is the only source (SPEC.md §4.5); this file
// turns it into rows and applies the filters and the text search, with no Vue in it so the unit tests can run it.

/** One entry of `packages/tokens` dist/json/tokens.flat.json, as packages/tokens/build.ts writes it. */
export interface FlatToken {
  cssVar: string
  /** What the source file wrote: a string or number, or a JSON array for a font stack or a cubic Bezier. */
  raw: string | number | (string | number)[]
  value: string | number | boolean
  type: string | null
  tier: string
  status: string | null
  description: string | null
  tbd?: string[]
  source?: string
}

export interface TokenRow extends FlatToken {
  path: string
  /** The first segment of the path: `color`, `font`, `space`, and so on (SPEC.md §4.7). */
  group: string
}

export interface TokenFilters {
  tier: string
  group: string
  status: string
  query: string
}

/** The value of an unset filter. */
export const ALL = 'all'
/** The filter value for a token that has no status at all. */
export const NO_STATUS = 'none'

/** The raw value as text: a string as written, anything else as JSON. */
export const rawText = (raw: FlatToken['raw']) => (typeof raw === 'string' ? raw : JSON.stringify(raw))

export const emptyFilters = (): TokenFilters => ({ tier: ALL, group: ALL, status: ALL, query: '' })

export function toRows(flat: Record<string, FlatToken>): TokenRow[] {
  return Object.entries(flat).map(([path, token]) => ({ ...token, path, group: path.split('.')[0]! }))
}

const statusOf = (row: TokenRow) => row.status ?? NO_STATUS

/** The distinct values of one column, in order of first appearance (the flat file is sorted). */
export function distinct(rows: TokenRow[], pick: (row: TokenRow) => string): string[] {
  return [...new Set(rows.map(pick))]
}
export const tiersOf = (rows: TokenRow[]) => distinct(rows, (row) => row.tier)
export const groupsOf = (rows: TokenRow[]) => distinct(rows, (row) => row.group)
export const statusesOf = (rows: TokenRow[]) => distinct(rows, statusOf)

/** Searchable text of a row: everything the table shows. */
const haystack = (row: TokenRow) =>
  [
    row.path,
    row.cssVar,
    rawText(row.raw),
    row.value,
    row.tier,
    statusOf(row),
    row.description ?? '',
    ...(row.tbd ?? []),
  ]
    .join('\n')
    .toLowerCase()

/** Every term must match somewhere in the row, in any order. Case does not matter. */
export function filterRows(rows: TokenRow[], filters: TokenFilters): TokenRow[] {
  const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean)
  return rows.filter((row) => {
    if (filters.tier !== ALL && row.tier !== filters.tier) return false
    if (filters.group !== ALL && row.group !== filters.group) return false
    if (filters.status !== ALL && statusOf(row) !== filters.status) return false
    if (terms.length === 0) return true
    const text = haystack(row)
    return terms.every((term) => text.includes(term))
  })
}
