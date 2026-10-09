// T6.4 checks: the model behind the /status dashboard (REQ-057 AC2). The browser checks are in
// apps/showcase/tests/e2e/status.spec.ts; these run the model on a small fixed report, so the rules are pinned.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import type { DocEntry } from '../apps/showcase/lib/doc-routes'
import { itemRows, pendingTokens, routeOfFile, tokenAnchor, type StatusReport } from '../apps/showcase/lib/status'

const docs: DocEntry[] = [
  { file: '01-foundations/color.md', path: '/01-foundations/color', route: '/foundations/color' },
]
const summary = {} as StatusReport['summary']
const report: StatusReport = {
  summary,
  items: [
    { id: 'TBD-01', item: 'one', resolved: false, adrs: [], callouts: 2, tokens: 1 },
    { id: 'TBD-02', item: 'two', resolved: true, adrs: ['ADR-0009'], callouts: 0, tokens: 0 },
    { id: 'TBD-03', item: 'three', resolved: false, adrs: [], callouts: 0, tokens: 0 },
  ],
  callouts: [
    { file: 'docs/01-foundations/color.md', line: 3, id: 'TBD-01', text: 'a' },
    { file: 'docs/01-foundations/color.md', line: 9, id: 'TBD-01', text: 'b' },
  ],
  tokens: [
    { file: 'tokens/x.json', path: 'color.a', status: 'tbd', tbd: ['TBD-01'] },
    { file: 'tokens/x.json', path: 'color.b', status: 'derived-pending', tbd: ['TBD-08'] },
  ],
  drafts: { docs: [], callouts: [] },
}

test('routeOfFile maps a report file to its route, and DESIGN.md to home', () => {
  assert.equal(routeOfFile('docs/01-foundations/color.md', docs), '/foundations/color')
  assert.equal(routeOfFile('DESIGN.md', docs), '/')
  assert.equal(routeOfFile('docs/nope.md', docs), undefined)
})

test('itemRows lists only open items, with each doc once and each token linked to its row', () => {
  const rows = itemRows(report, docs)
  assert.deepEqual(
    rows.map((row) => row.id),
    ['TBD-01', 'TBD-03'],
  )
  assert.deepEqual(rows[0]!.docs, [{ file: 'docs/01-foundations/color.md', to: '/foundations/color' }])
  assert.deepEqual(rows[0]!.tokens, [{ path: 'color.a', to: `/tokens#${tokenAnchor('color.a')}` }])
  assert.deepEqual([rows[1]!.docs, rows[1]!.tokens], [[], []])
})

test('pendingTokens splits tbd from derived-pending', () => {
  assert.deepEqual(
    pendingTokens(report, 'derived-pending').map((token) => token.path),
    ['color.b'],
  )
  assert.deepEqual(
    pendingTokens(report, 'tbd').map((token) => token.path),
    ['color.a'],
  )
})
