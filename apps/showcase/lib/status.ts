// T6.4 (REQ-057 AC2): the model of the /status dashboard. `reports/tbd-report.json` (written by `pnpm check:tbd`) is the
// only source of the counts and the lists; this file turns it into rows and links, with no Vue in it so the unit tests
// can run it. The doc routes come from the same list the rest of the site uses (doc-routes.ts).
import type { TbdReport } from '../../../scripts/check-tbd'
import type { DocEntry } from './doc-routes'

export type StatusReport = Pick<TbdReport, 'summary' | 'items' | 'callouts' | 'tokens' | 'drafts'>

/** The id of a token row on /tokens, which the status links point at. */
export const tokenAnchor = (path: string) => `token-${path}`

export interface DocLink {
  file: string
  to: string
}
export interface TokenLink {
  path: string
  to: string
}

export interface ItemRow {
  id: string
  item: string
  callouts: number
  docs: DocLink[]
  tokens: TokenLink[]
}

/** The route of a report file such as `docs/01-foundations/color.md`. `DESIGN.md` is the home page; anything else has none. */
export function routeOfFile(file: string, docs: DocEntry[]): string | undefined {
  if (file === 'DESIGN.md') return '/'
  return docs.find((doc) => `docs/${doc.file}` === file)?.route
}

export function docLink(file: string, docs: DocEntry[]): DocLink {
  return { file, to: routeOfFile(file, docs) ?? '/' }
}

export const tokenLink = (path: string): TokenLink => ({ path, to: `/tokens#${tokenAnchor(path)}` })

/** Every open item of §2.4 with the docs that carry its callout and the tokens that stand in for it. */
export function itemRows(report: StatusReport, docs: DocEntry[]): ItemRow[] {
  return report.items
    .filter((item) => !item.resolved)
    .map((item) => ({
      id: item.id,
      item: item.item,
      callouts: item.callouts,
      docs: [...new Set(report.callouts.filter((c) => c.id === item.id).map((c) => c.file))].map((file) =>
        docLink(file, docs),
      ),
      tokens: report.tokens.filter((t) => t.tbd.includes(item.id)).map((t) => tokenLink(t.path)),
    }))
}

/** The tokens that are not final: status `tbd` or `derived-pending`, each with the §2.4 items it names. */
export function pendingTokens(report: StatusReport, status: 'tbd' | 'derived-pending') {
  return report.tokens
    .filter((token) => token.status === status)
    .map((token) => ({ ...tokenLink(token.path), path: token.path, tbd: token.tbd }))
}
