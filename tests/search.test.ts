// T11.1 checks: the pure logic of the global search (REQ-056). The shortcut, the palette, and the navigation to a page and
// an anchor run in a real browser: apps/showcase/tests/e2e/search.spec.ts (`pnpm test:all`).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scanDocs } from '../apps/showcase/lib/doc-scan'
import type { DocEntry } from '../apps/showcase/lib/doc-routes'
import {
  buildGroups,
  pageItems,
  SEARCH_DATA_FILE,
  sectionItems,
  tokenItems,
  type SearchData,
} from '../apps/showcase/lib/search'
import type { FlatToken } from '../apps/showcase/lib/token-filter'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const docs: DocEntry[] = [
  { file: '01-foundations/color.md', path: '/01-foundations/color', route: '/foundations/color' },
  { file: '02-components/atoms/button.md', path: '/02-components/atoms/button', route: '/components/button' },
  {
    file: '02-components/molecules/media-card.md',
    path: '/02-components/molecules/media-card',
    route: '/components/media-card',
  },
  {
    file: '00-overview/brand-context-source.md',
    path: '/00-overview/brand-context-source',
    route: '/overview/brand-context-source',
  },
]

const data: SearchData = {
  pages: [
    { path: '/01-foundations/color', title: 'Color', layer: 'foundation', level: null, nuxtUi: null, component: null },
    {
      path: '/02-components/atoms/button',
      title: 'Button',
      layer: 'component',
      level: 'atom',
      nuxtUi: 'UButton',
      component: null,
    },
    {
      path: '/02-components/molecules/media-card',
      title: 'Media card',
      layer: 'component',
      level: 'molecule',
      nuxtUi: null,
      component: 'CnMediaCard',
    },
    {
      path: '/00-overview/brand-context-source',
      title: 'Cup Noobles — Design Context',
      layer: null,
      level: null,
      nuxtUi: null,
      component: null,
    },
  ],
  sections: [
    { id: '/01-foundations/color', title: 'Color', titles: [], level: 1 },
    { id: '/01-foundations/color#color', title: 'Color', titles: [], level: 1 },
    { id: '/01-foundations/color#the-pure-black-rule', title: 'The pure-black rule', titles: ['Color'], level: 3 },
    { id: '/02-components/atoms/button#variants', title: 'Variants', titles: ['Button'], level: 2 },
    { id: '/gone/page#heading', title: 'Heading of a page that is not a doc', titles: [], level: 2 },
  ],
}

const flat = {
  'color.brand.primary': {
    cssVar: '--cn-color-brand-primary',
    raw: '#ef80ae',
    value: '#ef80ae',
    type: 'color',
    tier: 'semantic',
    status: null,
    description: null,
  },
  'button.primary.bg': {
    cssVar: '--cn-button-primary-bg',
    raw: '{color.brand.primary}',
    value: '#ef80ae',
    type: 'color',
    tier: 'component',
    status: null,
    description: null,
  },
} satisfies Record<string, FlatToken>

test('REQ-056 AC1: every doc is a page result at its route, found by its title', () => {
  const items = pageItems(data, docs)
  assert.equal(items.length, docs.length)
  assert.deepEqual(
    items.map((item) => item.to),
    ['/components/button', '/components/media-card', '/foundations/color', '/overview/brand-context-source'],
  )
  assert.equal(items.find((item) => item.to === '/foundations/color')!.label, 'Color')
})

test('REQ-056 AC1: a component page is found by its component name, Nuxt UI or custom', () => {
  const items = pageItems(data, docs)
  assert.equal(items.find((item) => item.to === '/components/button')!.suffix, 'UButton')
  assert.equal(items.find((item) => item.to === '/components/media-card')!.suffix, 'CnMediaCard')
  assert.equal(items.find((item) => item.to === '/foundations/color')!.suffix, undefined)
})

test('REQ-056: the brand source has no frontmatter title, so it uses the fixed one the site shows', () => {
  const brand = pageItems(data, docs).find((item) => item.to === '/overview/brand-context-source')!
  assert.equal(brand.label, 'Brand context source')
})

test('REQ-056 AC1, AC2: a heading is a section result that links to its route and its anchor', () => {
  const items = sectionItems(data, docs)
  assert.deepEqual(
    items.map((item) => [item.label, item.to, item.suffix]),
    [
      ['The pure-black rule', '/foundations/color#the-pure-black-rule', 'Color'],
      ['Variants', '/components/button#variants', 'Button'],
    ],
  )
})

test('REQ-056: the page title sections and the sections of an unknown page are left out', () => {
  const labels = sectionItems(data, docs).map((item) => item.label)
  assert.ok(!labels.includes('Color'), 'the title is the page result, not a section')
  assert.ok(!labels.includes('Heading of a page that is not a doc'))
})

test('REQ-056 AC1, AC2: a token path is a result that links to its row on /tokens', () => {
  assert.deepEqual(
    tokenItems(flat).map((item) => [item.label, item.to]),
    [
      ['button.primary.bg', '/tokens#token-button.primary.bg'],
      ['color.brand.primary', '/tokens#token-color.brand.primary'],
    ],
  )
})

test('REQ-056: with nothing typed only the pages are listed, and with a query every group is', () => {
  const groups = buildGroups(data, docs, flat)
  assert.deepEqual(
    groups.map((group) => group.id),
    ['pages', 'sections', 'tokens'],
  )
  const count = (id: string, query: string) => {
    const group = groups.find((g) => g.id === id)!
    return group.postFilter(query, group.items).length
  }
  assert.equal(count('pages', ''), 4)
  assert.equal(count('sections', ''), 0)
  assert.equal(count('tokens', '   '), 0)
  assert.equal(count('sections', 'rule'), 2)
  assert.equal(count('tokens', 'color'), 2)
})

test('REQ-056 AC2: every real doc has exactly one page result, at the route the site serves', () => {
  const real = scanDocs(join(root, 'docs'))
  const items = pageItems({ pages: [], sections: [] }, real)
  assert.equal(items.length, real.length, 'one result per doc')
  assert.equal(new Set(items.map((item) => item.to)).size, items.length, 'no two results share a route')
  assert.ok(items.every((item) => item.to.startsWith('/')))
})

test('the search data is a file under the site, so a static host can serve it', () => {
  assert.equal(SEARCH_DATA_FILE, 'search-sections.json')
})
