// T5.3 checks: the showcase scaffold. The sidebar comes from DESIGN.md (REQ-052 AC2), the docs are read in place
// (REQ-051 AC1, ADR-0002 §2), and the app extends the layer (REQ-059 AC1) without a color-mode toggle (REQ-031 AC1).
// The static build and the browser checks run in `pnpm test:all` (build:showcase, test:e2e).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { parse as parseYaml } from 'yaml'
import { docToRoute, parseDesignNav } from '../apps/showcase/lib/design-nav'
import nuxtConfig from '../apps/showcase/nuxt.config'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const showcase = join(root, 'apps/showcase')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const nav = parseDesignNav(read('DESIGN.md'))
const links = nav.flatMap((section) => section.groups.flatMap((group) => group.links))

function* files(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.nuxt', '.output', '.data'].includes(entry.name)) continue
    if (entry.isDirectory()) yield* files(join(dir, entry.name))
    else yield join(dir, entry.name)
  }
}

test('REQ-051 AC1: no .md file exists under apps/showcase', () => {
  const markdown = [...files(showcase)].filter((file) => file.endsWith('.md'))
  assert.deepEqual(markdown, [])
})

test('REQ-051 AC1: content.config.ts reads the repository docs/ in place and skips the template', () => {
  const config = read('apps/showcase/content.config.ts')
  // T5.4: CN_DOCS_ROOT only moves the docs for the fixture-doc test (REQ-051 AC3); the default is the repository's docs/.
  assert.match(config, /fileURLToPath\(new URL\('\.\.\/\.\.\/docs', import\.meta\.url\)\)/)
  assert.match(config, /cwd: docsDir/)
  assert.match(config, /exclude: \['\*\*\/_template\.md'\]/)
  assert.equal(existsSync(join(showcase, 'content')), false, 'ADR-0002: no content directory is needed')
})

test('ADR-0002 §1: @nuxt/content is pinned to 3.16.1 and uses the native SQLite connector', () => {
  const pkg = JSON.parse(read('apps/showcase/package.json'))
  assert.equal(pkg.dependencies['@nuxt/content'], '3.16.1')
  assert.deepEqual(nuxtConfig.content, { experimental: { sqliteConnector: 'native' } })
  assert.deepEqual(nuxtConfig.modules, ['@nuxt/content'])
})

test('REQ-059 AC1: the showcase extends the design system layer and is linted for raw values (REQ-016)', async () => {
  assert.deepEqual(nuxtConfig.extends, ['@vinsmokemau/cup-noobles-nuxt'])
  const pkg = JSON.parse(read('apps/showcase/package.json'))
  assert.equal(pkg.dependencies['@vinsmokemau/cup-noobles-nuxt'], 'workspace:*')
  const eslint = new ESLint({ cwd: root })
  const config = await eslint.calculateConfigForFile(join(showcase, 'layouts/default.vue'))
  assert.equal(config.rules?.['cn/no-raw-values']?.[0], 2, 'cn/no-raw-values is an error in apps/showcase')
})

test('REQ-031 AC1: the showcase adds no color mode or toggle of its own', () => {
  const sources = [...files(showcase)].filter((f) => /\.(vue|ts)$/.test(f) && !f.includes(`${join(showcase, 'tests')}`))
  for (const file of sources) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /UColorMode|useColorMode|@nuxtjs\/color-mode/, file)
  }
})

test('REQ-052 AC2: the sidebar model follows DESIGN.md: every link, in file order', () => {
  const hrefs = [...read('DESIGN.md').matchAll(/^- \[[^\]]+\]\((docs\/[^)]+)\)/gm)].map((m) => m[1])
  assert.ok(hrefs.length > 50, 'DESIGN.md links the docs')
  assert.deepEqual(
    links.map((link) => link.doc),
    hrefs,
  )
  assert.deepEqual(
    nav.map((section) => section.title),
    [...read('DESIGN.md').matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    'the sections follow the ## headings',
  )
  assert.deepEqual(
    nav.find((section) => section.title === 'Components')?.groups.map((group) => group.title),
    [null, 'Atoms', 'Molecules', 'Organisms'],
  )
})

test('REQ-052 AC2: every sidebar link maps to a unique SPEC.md §4.6 route whose last segment is the doc slug', () => {
  assert.equal(new Set(links.map((link) => link.to)).size, links.length, 'routes are unique')
  for (const link of links) {
    assert.ok(existsSync(join(root, link.doc)), `${link.doc} exists`)
    assert.match(link.to, /^\/(overview|foundations|components|patterns|content|email|governance)(\/[a-z0-9-]+)?$/)
    if (link.to === '/components') continue // the inventory is the index of the component pages
    // The brand source has no frontmatter (§4.3); its route is fixed by §4.6.
    if (link.doc.endsWith('brand-context-source.md')) {
      assert.equal(link.to, '/overview/brand-context-source')
      continue
    }
    const frontmatter = parseYaml(/^---\r?\n([\s\S]*?)\r?\n---/.exec(read(link.doc))?.[1] ?? '') as { slug?: string }
    assert.equal(link.to.split('/').at(-1), frontmatter.slug, `${link.doc}: route ends in the frontmatter slug`)
  }
})

test('docToRoute maps the layers, the component levels, and the inventory; it rejects unknown paths', () => {
  assert.equal(docToRoute('docs/00-overview/glossary.md'), '/overview/glossary')
  assert.equal(docToRoute('docs/01-foundations/color.md'), '/foundations/color')
  assert.equal(docToRoute('docs/02-components/atoms/button.md'), '/components/button')
  assert.equal(docToRoute('docs/02-components/molecules/card.md'), '/components/card')
  assert.equal(docToRoute('docs/02-components/organisms/modal.md'), '/components/modal')
  assert.equal(docToRoute('docs/02-components/inventory.md'), '/components')
  assert.equal(docToRoute('docs/06-governance/decision-log.md'), '/governance/decision-log')
  assert.throws(() => docToRoute('docs/09-other/x.md'), /no showcase route/)
  assert.throws(() => docToRoute('README.md'), /no showcase route/)
})

test('the root scripts build the showcase and run its end-to-end tests inside test:all', () => {
  const scripts = JSON.parse(read('package.json')).scripts
  assert.equal(scripts['build:showcase'], 'pnpm --filter showcase generate')
  assert.match(scripts['test:e2e'], /showcase/)
  assert.match(scripts['test:all'], /build:showcase/)
})
