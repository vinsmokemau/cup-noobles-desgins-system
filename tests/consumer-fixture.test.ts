// T5.2 checks: the consumer fixture adds at most 10 lines of config to the layer (REQ-071 AC1).
// T8.7 checks: it renders every component in the inventory (REQ-022 AC3), and the inventory equals the component docs
// (REQ-020 AC1, SPEC.md §4.10).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const LEVEL_DIRS = ['atoms', 'molecules', 'organisms']

interface ComponentDoc {
  file: string // relative to docs/02-components
  slug: string
  source: string
  implementation: string
}

// The component docs, from their frontmatter.
function componentDocs(): ComponentDoc[] {
  return LEVEL_DIRS.flatMap((dir) =>
    readdirSync(join(root, 'docs/02-components', dir))
      .filter((name) => name.endsWith('.md'))
      .sort()
      .map((name) => {
        const data = readFrontmatter(read(`docs/02-components/${dir}/${name}`)).data ?? {}
        const source = String(data.source)
        return {
          file: `${dir}/${name}`,
          slug: String(data.slug),
          source,
          implementation: String(source === 'custom' ? data.component : data.nuxtUi),
        }
      }),
  )
}

// The slugs in the SPEC.md §4.10 inventory table; one row can hold several, separated by `·`.
function specInventorySlugs(): string[] {
  const section = read('SPEC.md').split('### 4.10 Component inventory')[1]!.split('\n---')[0]!
  return section
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.startsWith('| Slug') && !line.startsWith('|---'))
    .flatMap((line) => line.split('|')[1]!.trim().split(' · '))
}

test('REQ-071 AC1: apps/consumer-fixture/nuxt.config.ts is 10 lines or fewer and extends the layer', () => {
  const config = read('apps/consumer-fixture/nuxt.config.ts')
  const lines = config.replace(/\n$/, '').split('\n').length
  assert.ok(lines <= 10, `nuxt.config.ts has ${lines} lines`)
  assert.match(config, /extends:\s*\['@vinsmokemau\/cup-noobles-nuxt'\]/)
})

test('REQ-020 AC1: every component doc is in the SPEC.md §4.10 inventory, and no inventory row lacks a doc', () => {
  const docs = componentDocs().map((doc) => doc.slug)
  assert.equal(docs.length, new Set(docs).size, 'a slug is used twice')
  assert.deepEqual([...docs].sort(), specInventorySlugs().sort())
  for (const doc of componentDocs()) assert.equal(doc.file.split('/')[1], `${doc.slug}.md`, `${doc.file}: file name`)
})

test('T8.7: the generated inventory block has one row per component doc, and each row links its doc', () => {
  const inventory = read('docs/02-components/inventory.md')
  const block = inventory.split('<!-- cn:generated format="inventory" -->')[1]!.split('<!-- /cn:generated -->')[0]!
  const rows = block
    .split('\n')
    .filter((line) => line.startsWith('| ['))
    .map((line) => line.split('|').map((cell) => cell.trim()))
  assert.deepEqual(
    rows.map((cells) => cells[1]!.match(/\]\(([^)]+)\)/)![1]).sort(),
    componentDocs()
      .map((doc) => doc.file)
      .sort(),
  )
  for (const cells of rows) {
    const file = cells[1]!.match(/\]\(([^)]+)\)/)![1]!
    const doc = componentDocs().find((d) => d.file === file)!
    assert.equal(cells[3], doc.source, `${file}: source`)
    assert.equal(cells[4], `\`${doc.implementation}\``, `${file}: implementation`)
  }
})

test('REQ-022 AC3: the fixture has one page per component in the inventory, and no other component page', () => {
  const pages = readdirSync(join(root, 'apps/consumer-fixture/pages/components'))
    .filter((name) => name.endsWith('.vue'))
    .map((name) => name.replace(/\.vue$/, ''))
  assert.deepEqual(
    pages.sort(),
    componentDocs()
      .map((doc) => doc.slug)
      .sort(),
  )
})

test('REQ-022 AC3: each fixture page renders its component, a Nuxt UI one or a `Cn*` one', () => {
  for (const doc of componentDocs()) {
    const page = read(`apps/consumer-fixture/pages/components/${doc.slug}.vue`)
    // A toast has no tag: it is shown by the `useToast()` composable, into the toaster of UApp.
    const marker = doc.implementation === 'UToast' ? 'useToast()' : `<${doc.implementation}`
    assert.ok(page.includes(marker), `${doc.slug}.vue renders no ${marker}`)
  }
})

test('REQ-022 AC3: the fixture carries no commerce code, and its index lists the pages without a copy of the list', () => {
  const terms = read('scripts/domain-terms.txt')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  assert.ok(terms.length > 0)
  const files = ['app.vue', 'nuxt.config.ts', 'pages/index.vue']
  for (const doc of componentDocs()) files.push(`pages/components/${doc.slug}.vue`)
  for (const file of files) {
    // `variant` is Nuxt UI's own styling prop (`variant="ghost"`, `{ variant: 'ghost' }`), not a commerce concept.
    const text = read(`apps/consumer-fixture/${file}`).replaceAll(/\bvariant(?:="[^"]*"|: '[^']*')/g, '')
    for (const term of terms) {
      // Whole words: the terms are English, and "Cartas" (cards) is not "cart".
      assert.doesNotMatch(text, new RegExp(`\\b${term}s?\\b`, 'i'), `${file} contains the domain term "${term}"`)
    }
  }
  assert.match(read('apps/consumer-fixture/pages/index.vue'), /import\.meta\.glob\('\.\/components\/\*\.vue'\)/)
})

test('T8.7: the fixture end-to-end test visits every component page with axe', () => {
  const spec = 'apps/consumer-fixture/tests/e2e/components.spec.ts'
  assert.ok(existsSync(join(root, spec)))
  const text = read(spec)
  assert.match(text, /expectNoA11yViolations|AxeBuilder/)
  assert.match(text, /docs\/02-components/)
})
