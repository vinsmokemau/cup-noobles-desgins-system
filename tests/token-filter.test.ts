// T6.1 checks: the model behind the /tokens explorer (REQ-053 AC2). The browser checks are in
// apps/showcase/tests/e2e/tokens.spec.ts; these run the filter on a small fixed table, so the rules are pinned.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import {
  NO_STATUS,
  emptyFilters,
  filterRows,
  groupsOf,
  statusesOf,
  tiersOf,
  toRows,
  type FlatToken,
} from '../apps/showcase/lib/token-filter'

const token = (over: Partial<FlatToken>): FlatToken => ({
  cssVar: '--cn-x',
  raw: 'x',
  value: 'x',
  type: null,
  tier: 'primitive',
  status: 'stable',
  description: null,
  ...over,
})
const rows = toRows({
  'color.brand.pink': token({
    cssVar: '--cn-color-brand-pink',
    raw: '#ef80ae',
    value: '#ef80ae',
    description: 'Neon pink',
  }),
  'color.brand.primary': token({
    cssVar: '--cn-color-brand-primary',
    raw: '{color.brand.pink}',
    value: '#ef80ae',
    tier: 'semantic',
  }),
  'space.base': token({
    cssVar: '--cn-space-base',
    raw: '{placeholder.space}',
    value: '4px',
    status: 'tbd',
    tbd: ['TBD-09'],
  }),
  'z.modal': token({ cssVar: '--cn-z-modal', raw: 50, value: 50, status: null }),
})
const paths = (over: Partial<ReturnType<typeof emptyFilters>>) =>
  filterRows(rows, { ...emptyFilters(), ...over }).map((row) => row.path)

test('REQ-053 AC2: rows carry the group, the first path segment', () => {
  assert.deepEqual(
    rows.map((row) => row.group),
    ['color', 'color', 'space', 'z'],
  )
  assert.deepEqual(groupsOf(rows), ['color', 'space', 'z'])
  assert.deepEqual(tiersOf(rows), ['primitive', 'semantic'])
  assert.deepEqual(statusesOf(rows), ['stable', 'tbd', NO_STATUS])
})

test('REQ-053 AC2: no filter keeps every row', () => {
  assert.equal(paths({}).length, 4)
})

test('REQ-053 AC2: tier, group, and status filter, and they combine', () => {
  assert.deepEqual(paths({ tier: 'semantic' }), ['color.brand.primary'])
  assert.deepEqual(paths({ group: 'color' }), ['color.brand.pink', 'color.brand.primary'])
  assert.deepEqual(paths({ status: 'tbd' }), ['space.base'])
  assert.deepEqual(paths({ status: NO_STATUS }), ['z.modal'])
  assert.deepEqual(paths({ group: 'color', tier: 'primitive' }), ['color.brand.pink'])
  assert.deepEqual(paths({ group: 'space', tier: 'semantic' }), [])
})

test('REQ-053 AC2: the search covers path, variable, raw and resolved value, description, and TBD id, ignoring case', () => {
  assert.deepEqual(paths({ query: 'BRAND.PRIMARY' }), ['color.brand.primary'])
  assert.deepEqual(paths({ query: '--cn-space' }), ['space.base'])
  assert.deepEqual(paths({ query: '{color.brand.pink}' }), ['color.brand.primary'])
  assert.deepEqual(paths({ query: '4px' }), ['space.base'])
  assert.deepEqual(paths({ query: '50' }), ['z.modal'])
  assert.deepEqual(paths({ query: 'neon' }), ['color.brand.pink'])
  assert.deepEqual(paths({ query: 'tbd-09' }), ['space.base'])
})

test('REQ-053 AC2: every search term must match, in any order, and the search combines with the filters', () => {
  assert.deepEqual(paths({ query: 'pink ef80ae' }), ['color.brand.pink', 'color.brand.primary'])
  assert.deepEqual(paths({ query: 'ef80ae neon' }), ['color.brand.pink'])
  assert.deepEqual(paths({ query: 'ef80ae', tier: 'semantic' }), ['color.brand.primary'])
  assert.deepEqual(paths({ query: '   ' }).length, 4, 'blank search is no search')
  assert.deepEqual(paths({ query: 'nothing-matches' }), [])
})
