// T9.1 checks: the forms, feedback, and loading pattern docs and their composed demos (REQ-035, REQ-009, REQ-022). What
// needs a browser, such as axe at 360, 768, and 1280 px and the behavior of each demo, is in
// apps/showcase/tests/e2e/patterns.matrix.ts and patterns.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'
import { COMPOSED_DEMO } from '../apps/showcase/lib/demos'
import { scanDemos } from '../apps/showcase/lib/doc-scan'
import { findDemoDomainTerms, listFiles, readDomainTerms } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const SLUGS = ['forms', 'feedback', 'loading'] as const
const docOf = (slug: string) => read(`docs/03-patterns/${slug}.md`)
const demoOf = (slug: string) => read(`apps/showcase/demos/${slug}/composed.vue`)

test('the composed demo is named `composed`, the name the pattern page looks for', () => {
  assert.equal(COMPOSED_DEMO, 'composed')
})

test('REQ-035 AC1: the forms, feedback, and loading pattern docs exist and are written', () => {
  for (const slug of SLUGS) {
    const { data } = readFrontmatter(docOf(slug))
    assert.equal(data?.layer, 'pattern', slug)
    assert.equal(data?.slug, slug)
    assert.doesNotMatch(docOf(slug), /Content pending/, `${slug} has no pending section`)
  }
})

test('REQ-009 AC1: the pattern docs are drafts, and each one says its rules are not yet approved', () => {
  for (const slug of SLUGS) {
    assert.equal(readFrontmatter(docOf(slug)).data?.status, 'draft', slug)
    assert.match(docOf(slug), /^> \*\*Draft:\*\*/m, `${slug} has a draft callout`)
  }
})

test('REQ-035 AC2: each pattern doc lists the composed demo, the file exists, and the doc names its path', () => {
  for (const slug of SLUGS) {
    assert.deepEqual(readFrontmatter(docOf(slug)).data?.demos, [COMPOSED_DEMO], slug)
    assert.ok(existsSync(join(root, `apps/showcase/demos/${slug}/composed.vue`)), slug)
    assert.ok(docOf(slug).includes(`apps/showcase/demos/${slug}/composed.vue`), `${slug} doc names its demo`)
  }
})

test('REQ-055: the showcase registers the three composed demos from the docs, and each has no playground', () => {
  const demos = scanDemos(join(root, 'docs'), join(root, 'apps/showcase/demos'))
  for (const slug of SLUGS) assert.deepEqual(demos[slug], [COMPOSED_DEMO], slug)
})

// The components a demo may use are the ones the system documents: every component doc's `nuxtUi` or `component` name.
// `UForm` and `UToaster` are the two Nuxt UI parts without a doc of their own. `UForm` adds no visual design of its own,
// and `UToaster` is the viewport that the toast doc describes (T8.3).
const documented = new Set<string>(['UForm', 'UToaster'])
for (const file of listFiles(root, 'docs/02-components', /\.md$/)) {
  const data = readFrontmatter(read(file)).data as Record<string, unknown> | undefined
  for (const key of ['nuxtUi', 'component']) if (typeof data?.[key] === 'string') documented.add(data[key] as string)
}

test('REQ-035 AC2: a composed demo uses only documented design system components, and no hand-built primitive', () => {
  assert.ok(documented.has('UFormField') && documented.has('CnMediaCard'), 'the documented set is read')
  for (const slug of SLUGS) {
    const source = demoOf(slug)
    const tags = new Set([...source.matchAll(/<((?:U|Cn)[A-Z][A-Za-z0-9]*)[\s>/]/g)].map((m) => m[1]!))
    assert.ok(tags.size > 0, `${slug} uses components`)
    for (const tag of tags) assert.ok(documented.has(tag), `${slug}: <${tag}> has no component doc`)
    assert.doesNotMatch(source, /<(?:button|input|select|textarea|dialog|a)[\s>]/, `${slug}: no raw control`)
    assert.doesNotMatch(
      source,
      /role="(?:dialog|listbox|menu|tooltip)"|focus-trap/i,
      `${slug}: no hand-built primitive`,
    )
  }
})

test('REQ-022, REQ-035 AC2: the composed demos hold no domain term, and the check catches its fixture', () => {
  assert.deepEqual(findDemoDomainTerms(root), [])
  assert.deepEqual(
    findDemoDomainTerms(join(root, 'tests/fixtures/architecture/demo-terms'), readDomainTerms(root)).sort(),
    [
      'apps/showcase/demos/tile/composed.vue: "Payment" contains "payment"',
      'apps/showcase/demos/tile/composed.vue: "cart" contains "cart"',
    ].sort(),
  )
})

test('REQ-007: every copy example in a pattern doc is in an es-MX block', () => {
  for (const slug of SLUGS) {
    const fences = [...docOf(slug).matchAll(/^```(\S*)/gm)].map((m) => m[1]!).filter((tag) => tag.startsWith('copy'))
    assert.ok(fences.length >= 2, `${slug} has a good and a bad copy example`)
    for (const tag of fences) assert.match(tag, /^copy(?:-bad)?$/, tag)
    // A fence tag is the first word of the info string, so the locale is the second word: check the whole line.
    for (const [line] of docOf(slug).matchAll(/^```copy.*$/gm)) assert.match(line, /^```copy(?:-bad)? es-MX$/, line)
  }
})

test('REQ-016: a composed demo writes no raw color, length, or duration', () => {
  for (const slug of SLUGS) {
    const source = demoOf(slug)
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}\b/, `${slug}: hex`)
    assert.doesNotMatch(source, /\b(?:rgb|hsl)a?\(/, `${slug}: rgb or hsl`)
    assert.doesNotMatch(source, /\d\s*(?:px|rem|ms)\b/, `${slug}: length or duration`)
  }
})
