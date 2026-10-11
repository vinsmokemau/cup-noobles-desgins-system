// T9.3 checks: the three content docs (REQ-036, REQ-007, REQ-009). `check-docs` covers the headings, the frontmatter,
// and the `copy` tags (REQ-007 AC2); these tests cover what it can't: what each doc says, that the voice pairs are a
// draft until TBD-21 is approved, and that the formatting examples are what `Intl` really returns.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'
import { readDomainTerms } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SLUGS = ['voice-and-tone', 'microcopy', 'formatting'] as const
const docOf = (slug: string) => readFileSync(join(root, `docs/04-content/${slug}.md`), 'utf8')
const section = (text: string, heading: string) =>
  text.split(new RegExp(`^## ${heading}\\s*$`, 'm'))[1]?.split(/^## /m)[0] ?? ''
// The lines of every fenced block with this tag, in order.
const block = (text: string, tag: string) =>
  [...text.matchAll(new RegExp(`^\`\`\`${tag}\\n([\\s\\S]*?)^\`\`\``, 'gm'))].flatMap((m) =>
    m[1]!.split('\n').filter(Boolean),
  )

test('REQ-036: the three content docs exist, are written, and are not stubs', () => {
  for (const slug of SLUGS) {
    const { data } = readFrontmatter(docOf(slug))
    assert.equal(data?.layer, 'content', slug)
    assert.equal(data?.slug, slug)
    assert.doesNotMatch(docOf(slug), /Content pending/, `${slug} has no pending section`)
  }
})

test('REQ-009 AC1, AC2: the three content docs are drafts, because no ADR or owner approval covers them yet', () => {
  for (const slug of SLUGS) {
    assert.equal(readFrontmatter(docOf(slug)).data?.status, 'draft', slug)
    assert.doesNotMatch(docOf(slug), /Approved as stable/, `${slug} cites no approval`)
  }
})

test('REQ-036 AC1: voice-and-tone quotes the brand voice, BR-05 and BR-17, with their IDs', () => {
  const text = docOf('voice-and-tone')
  assert.match(text, /^> \*\*BR-05:\*\* /m)
  assert.match(text, /^> \*\*BR-17:\*\* /m)
  assert.deepEqual(readFrontmatter(text).data?.brandRules, ['BR-05', 'BR-06', 'BR-17'])
})

test('REQ-036 AC1: the "this, not that" pairs are a draft callout, and TBD-21 is open until the owner approves them', () => {
  const text = docOf('voice-and-tone')
  const pairs = section(text, "Do and don't")
  assert.match(pairs, /^> \*\*Draft:\*\* .*TBD-21/m, 'the pairs open with a draft callout naming TBD-21')
  assert.ok(pairs.indexOf('**Draft:**') < pairs.indexOf('| Voice attribute |'), 'the callout comes before the pairs')
  assert.equal([...pairs.matchAll(/^### .+, not .+$/gm)].length, 5, 'five pairs')
  assert.match(section(text, 'Open items'), /^> \*\*TBD \(TBD-21\):\*\* /m)
  assert.deepEqual(readFrontmatter(text).data?.tbd, ['TBD-21'])
})

test('REQ-036 AC2: microcopy covers button labels, error message structure, empty-state text, and confirmation text', () => {
  const text = docOf('microcopy')
  for (const heading of ['Button labels', 'Error messages', 'Empty-state text', 'Confirmation text'])
    assert.match(text, new RegExp(`^#### ${heading}\\s*$`, 'm'), heading)
  // Each of the four has a good example block right after its rules, so the examples are in `copy es-MX` blocks.
  const usage = section(text, 'Usage rules').split('### When not to use')[0]!
  const parts = usage.split(/^#### /m).slice(1)
  assert.equal(parts.length, 4)
  for (const part of parts) assert.match(part, /^```copy es-MX$/m, part.split('\n')[0])
})

test('REQ-036 AC3: formatting covers numbers, currency, dates, and times for es-MX with Intl, and says amounts are display-only', () => {
  const text = docOf('formatting')
  for (const api of ['Intl.NumberFormat', 'Intl.DateTimeFormat', 'es-MX']) assert.ok(text.includes(api), api)
  for (const heading of ['Numbers', 'Currency', 'Dates and times'])
    assert.match(text, new RegExp(`^#### ${heading}\\s*$`, 'm'), heading)
  assert.match(text, /Currency amounts are display-only\./)
})

test('REQ-036 AC3: formatting contains no commerce term', () => {
  const terms = readDomainTerms(root)
  assert.ok(terms.length > 0)
  const words = new Set(
    docOf('formatting')
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu),
  )
  for (const term of terms) assert.ok(!words.has(term), `formatting uses the commerce term "${term}"`)
})

test('REQ-036 AC3: every formatted example in formatting.md is what Intl returns for es-MX', () => {
  const instant = new Date('2026-10-11T20:30:00Z')
  const timeZone = 'America/Mexico_City'
  const number = (options: Intl.NumberFormatOptions, value: number) =>
    new Intl.NumberFormat('es-MX', options).format(value)
  const date = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('es-MX', { timeZone, ...options }).format(instant)
  const relative = new Intl.RelativeTimeFormat('es-MX', { numeric: 'auto' })
  const expected = [
    // Numbers
    number({}, 1234567),
    number({}, 1234567.891),
    number({ minimumFractionDigits: 2 }, 1234.5),
    number({ style: 'percent' }, 0.256),
    number({ style: 'percent', maximumFractionDigits: 1 }, 0.256),
    number({ notation: 'compact' }, 1234567),
    // Currency
    number({ style: 'currency', currency: 'MXN' }, 1234.5),
    number({ style: 'currency', currency: 'USD' }, 1234.5),
    // Dates and times
    date({ dateStyle: 'long' }),
    date({ dateStyle: 'medium' }),
    date({ dateStyle: 'short' }),
    date({ timeStyle: 'short' }),
    date({ dateStyle: 'long', timeStyle: 'short' }),
    relative.format(-1, 'day'),
    relative.format(3, 'day'),
    // Lists and plurals
    new Intl.ListFormat('es-MX', { type: 'conjunction' }).format(['dados', 'cartas', 'fichas']),
  ]
  // The runtime separates "2:30" and "p.m." with a no-break space, and the doc holds a plain one.
  const plain = (value: string) => value.replace(/\s+/g, ' ').trim()
  const documented = block(docOf('formatting'), 'copy es-MX').map(plain)
  for (const value of expected.map(plain)) assert.ok(documented.includes(value), `the doc shows "${value}"`)
  // The plural example is chosen with PluralRules, so the doc's two forms are its "one" and "other" categories.
  const rules = new Intl.PluralRules('es-MX')
  assert.deepEqual(
    [1, 3].map((n) => rules.select(n)),
    ['one', 'other'],
  )
  assert.ok(documented.includes('Revisa 1 campo') && documented.includes('Revisa 3 campos'))
})

test('REQ-007 AC2: every copy example is in a `copy es-MX` or `copy-bad es-MX` block, and each doc has both', () => {
  for (const slug of SLUGS) {
    const text = docOf(slug)
    for (const [line] of text.matchAll(/^```copy.*$/gm))
      assert.match(line, /^```copy(?:-bad)? es-MX$/, `${slug}: ${line}`)
    assert.ok(block(text, 'copy es-MX').length > 0, `${slug} has a good example`)
    assert.ok(block(text, 'copy-bad es-MX').length > 0, `${slug} has a bad example`)
  }
})
