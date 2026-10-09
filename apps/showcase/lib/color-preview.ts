// T6.2 (REQ-054 AC1, AC4): the model of the color previews on /foundations/color. `tokens.flat.json` is the only source
// (SPEC.md §4.5). The ratio comes from scripts/contrast.ts, the same math `check-contrast` runs, so a swatch and
// `pnpm check:tokens` never disagree.
import { MINIMUMS, contrastRatio, round } from '../../../scripts/contrast.ts'
import type { FlatToken } from './token-filter'

/** The token every swatch is measured against (REQ-054 AC1). */
export const BASE = 'color.bg.base'
/** A swatch passes at the WCAG AA minimum for text. UI parts only need 3:1, so a pass here is also a pass for them. */
export const MINIMUM = MINIMUMS.text

/**
 * `pass` and `fail` are measured. `unverified` is a tbd token: its value is a placeholder, so it never passes
 * (REQ-015 AC4, the same rule `check-contrast` applies). `reference` is the base itself.
 */
export type Verdict = 'pass' | 'fail' | 'unverified' | 'reference'

export interface Swatch {
  path: string
  cssVar: string
  /** The resolved color, as the token build wrote it. */
  value: string
  tier: string
  status: string | null
  description: string | null
  /** The TBD ids behind a tbd or derived-pending token. */
  tbd: string[]
  /** The ratio against the base, rounded to 2 decimals. Null for a tbd token, whose value is a placeholder. */
  ratio: number | null
  verdict: Verdict
}

/** One swatch per `color.*` token, in the order of the flat file. */
export function toSwatches(flat: Record<string, FlatToken>): Swatch[] {
  const base = flat[BASE]
  if (!base || typeof base.value !== 'string') throw new Error(`${BASE} is not a color token`)
  return Object.entries(flat)
    .filter(([path]) => path.split('.')[0] === 'color')
    .map(([path, token]) => {
      const value = String(token.value)
      const tbd = token.status === 'tbd'
      const measured = tbd || path === BASE ? null : contrastRatio(value, base.value as string)
      const verdict: Verdict =
        path === BASE ? 'reference' : measured === null ? 'unverified' : measured >= MINIMUM ? 'pass' : 'fail'
      const ratio = measured === null ? null : round(measured)
      return {
        path,
        cssVar: token.cssVar,
        value,
        tier: token.tier,
        status: token.status,
        description: token.description,
        tbd: token.tbd ?? [],
        ratio,
        verdict,
      }
    })
}

export const ratioText = (ratio: number) => `${ratio.toFixed(2)}:1`
