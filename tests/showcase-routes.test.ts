// T5.4 checks: the route of every doc (REQ-051 AC2, REQ-052 AC1) and the link rewriting that makes the docs' file links
// work on the site. The static build and the browser checks run in `pnpm test:all` (build:showcase, test:e2e).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDesignNav } from '../apps/showcase/lib/design-nav'
import {
  DECISIONS_ROUTE,
  docRoute,
  prerenderRoutes,
  resolveDocLink,
  rewriteDocLinks,
  type DocEntry,
} from '../apps/showcase/lib/doc-routes'
import { demoRoutes } from '../apps/showcase/lib/demos'
import { scanDemos, scanDocs } from '../apps/showcase/lib/doc-scan'
import nuxtConfig from '../apps/showcase/nuxt.config'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(root, 'docs')

function* markdown(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) yield* markdown(join(dir, entry.name))
    else if (entry.name.endsWith('.md')) yield join(dir, entry.name)
  }
}

const docs = scanDocs(docsDir)
const byFile = (file: string) => docs.find((doc) => doc.file === file)

test('REQ-051 AC2: there is one route per doc, and no doc is left out except the template', () => {
  const onDisk = [...markdown(docsDir)].filter((file) => !file.endsWith('_template.md'))
  assert.ok(onDisk.length > 70, 'the repository has its docs')
  assert.equal(docs.length, onDisk.length)
  assert.equal(new Set(docs.map((doc) => doc.route)).size, docs.length, 'routes are unique')
  assert.equal(
    docs.some((doc) => doc.file === '_template.md'),
    false,
  )
})

test('REQ-052 AC1: the routes follow SPEC.md §4.6', () => {
  assert.equal(byFile('00-overview/glossary.md')?.route, '/overview/glossary')
  assert.equal(byFile('00-overview/brand-context-source.md')?.route, '/overview/brand-context-source')
  assert.equal(byFile('01-foundations/color.md')?.route, '/foundations/color')
  assert.equal(byFile('02-components/inventory.md')?.route, '/components')
  assert.equal(byFile('02-components/atoms/button.md')?.route, '/components/button')
  assert.equal(byFile('03-patterns/forms.md')?.route, '/patterns/forms')
  assert.equal(byFile('04-content/microcopy.md')?.route, '/content/microcopy')
  assert.equal(byFile('05-email/email-layouts.md')?.route, '/email/email-layouts')
  assert.equal(byFile('06-governance/decision-log.md')?.route, '/governance/decision-log')
  // An ADR's route uses its frontmatter slug, not its file name.
  assert.equal(
    byFile('06-governance/decisions/0002-nuxt-content-spike.md')?.route,
    `${DECISIONS_ROUTE}/adr-0002-nuxt-content-spike`,
  )
  assert.throws(() => docRoute('09-other/x.md', 'x'), /not in a layer folder/)
})

test('every DESIGN.md link maps to the same route as its doc (the sidebar and the pages agree)', () => {
  const links = parseDesignNav(readFileSync(join(root, 'DESIGN.md'), 'utf8')).flatMap((s) =>
    s.groups.flatMap((g) => g.links),
  )
  assert.ok(links.length > 50)
  for (const link of links) {
    assert.equal(byFile(link.doc.replace(/^docs\//, ''))?.route, link.to, link.doc)
  }
})

test('scanDocs fails when two docs share a route', () => {
  const fixture = join(root, 'tests/fixtures/showcase-routes/duplicate')
  assert.ok(existsSync(fixture))
  assert.throws(() => scanDocs(fixture), /both have the route \/foundations\/same/)
})

test('REQ-052 AC1: the static build prerenders the pages, every section index, and every doc route', () => {
  const demos = scanDemos(docsDir, join(root, 'apps/showcase/demos'))
  const routes = prerenderRoutes(docs, demos)
  const expected = [
    ...demoRoutes(demos),
    '/',
    '/tokens',
    '/status',
    '/changelog',
    '/foundations',
    '/components',
    '/patterns',
    '/content',
    '/email',
    '/governance',
    DECISIONS_ROUTE,
    ...docs.map((doc) => doc.route),
  ]
  assert.deepEqual([...routes].sort(), [...new Set(expected)].sort())
  assert.deepEqual([...(nuxtConfig.nitro?.prerender?.routes ?? [])].sort(), [...routes].sort())
  assert.equal(routes.includes('/overview'), false, 'SPEC.md §4.6 has no /overview index')
})

const entries: DocEntry[] = [
  { file: '00-overview/principles.md', path: '/00-overview/principles', route: '/overview/principles' },
  { file: '01-foundations/color.md', path: '/01-foundations/color', route: '/foundations/color' },
  { file: '02-components/atoms/button.md', path: '/02-components/atoms/button', route: '/components/button' },
]

test('resolveDocLink turns a relative .md link into a route and keeps the anchor', () => {
  const from = '00-overview/principles.md'
  assert.equal(resolveDocLink('../01-foundations/color.md', from, entries), '/foundations/color')
  assert.equal(resolveDocLink('../01-foundations/color.md#purpose', from, entries), '/foundations/color#purpose')
  assert.equal(resolveDocLink('../02-components/atoms/button.md', from, entries), '/components/button')
  assert.equal(resolveDocLink('../../DESIGN.md', from, entries), '/')
  assert.equal(resolveDocLink('../../DESIGN.md#components', from, entries), '/#components')
  assert.equal(resolveDocLink('principles.md', from, entries), '/overview/principles')
  // Nuxt Content drops the .md while parsing, so the same links arrive without it.
  assert.equal(resolveDocLink('../01-foundations/color', from, entries), '/foundations/color')
  assert.equal(resolveDocLink('../01-foundations/color#purpose', from, entries), '/foundations/color#purpose')
  assert.equal(resolveDocLink('../../DESIGN', from, entries), '/')
  assert.equal(resolveDocLink('principles', from, entries), '/overview/principles')
})

test('resolveDocLink leaves everything else alone', () => {
  const from = '00-overview/principles.md'
  assert.equal(resolveDocLink('https://example.com/a.md', from, entries), undefined)
  assert.equal(resolveDocLink('mailto:a@example.com', from, entries), undefined)
  assert.equal(resolveDocLink('#purpose', from, entries), undefined)
  assert.equal(resolveDocLink('../01-foundations/missing.md', from, entries), undefined)
  assert.equal(resolveDocLink('../../SPEC.md', from, entries), undefined)
  assert.equal(resolveDocLink('image.svg', from, entries), undefined)
  assert.equal(resolveDocLink('/foundations/color', from, entries), undefined, 'a route is already a route')
})

test('rewriteDocLinks rewrites nested links in a parsed tree and nothing else', () => {
  const tree: unknown[] = [
    [
      'p',
      {},
      'See ',
      ['a', { href: '../01-foundations/color.md#purpose' }, 'Color'],
      ' and ',
      ['a', { href: 'https://x.test/' }, 'X'],
    ],
    ['ul', {}, ['li', {}, ['strong', {}, ['a', { href: '../../DESIGN.md' }, 'Design']]]],
    'text',
  ]
  rewriteDocLinks(tree, '00-overview/principles.md', entries)
  assert.deepEqual(tree, [
    [
      'p',
      {},
      'See ',
      ['a', { href: '/foundations/color#purpose' }, 'Color'],
      ' and ',
      ['a', { href: 'https://x.test/' }, 'X'],
    ],
    ['ul', {}, ['li', {}, ['strong', {}, ['a', { href: '/' }, 'Design']]]],
    'text',
  ])
})

test('every relative .md link in the docs resolves to a route', () => {
  for (const doc of docs) {
    if (doc.file === '00-overview/brand-context-source.md') continue
    const text = readFileSync(join(docsDir, doc.file), 'utf8')
    for (const match of text.matchAll(/\]\(([^)\s]+\.md(?:#[^)\s]*)?)\)/g)) {
      const href = match[1]!
      if (/^https?:/.test(href)) continue
      assert.ok(resolveDocLink(href, doc.file, docs), `${doc.file}: ${href}`)
    }
  }
})
