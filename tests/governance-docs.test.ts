// T11.2 checks: the five governance docs (REQ-072 AC1 and AC2, REQ-073 AC1). `check-docs` covers the headings and the
// frontmatter, and `check-links` covers the links and the orphans (REQ-001 AC2); these tests cover what they can't:
// that every ADR is indexed in order, what each doc says, and that no doc is a stub or claims an approval it lacks.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SLUGS = ['ownership', 'versioning-and-releases', 'contribution', 'deprecation', 'decision-log'] as const
const docOf = (slug: string) => readFileSync(join(root, `docs/06-governance/${slug}.md`), 'utf8')
const section = (text: string, heading: string) =>
  text.split(new RegExp(`^## ${heading}\\s*$`, 'm'))[1]?.split(/^## /m)[0] ?? ''

test('T11.2: the five governance docs exist, are written, and are governance-layer drafts', () => {
  for (const slug of SLUGS) {
    const { data } = readFrontmatter(docOf(slug))
    assert.equal(data?.layer, 'governance', slug)
    assert.equal(data?.slug, slug)
    assert.equal(data?.status, 'draft', `${slug} awaits owner approval (REQ-009 AC2)`)
    assert.doesNotMatch(docOf(slug), /Content pending/, `${slug} has no pending section`)
    assert.doesNotMatch(docOf(slug), /Approved as stable/, `${slug} claims no approval it lacks`)
  }
})

test('REQ-073 AC1 and REQ-001 AC2: the decision log indexes every ADR, once, in number order', () => {
  const adrs = readdirSync(join(root, 'docs/06-governance/decisions')).sort()
  const index = docOf('decision-log')
    .split(/^### Index\s*$/m)[1]!
    .split(/^## /m)[0]!
  const linked = [...index.matchAll(/\]\(decisions\/(\d{4}-[\w-]+\.md)\)/g)].map((m) => m[1]!)
  assert.deepEqual(linked, adrs)
  assert.equal(adrs[0], '0000-adr-template.md')
})

test('REQ-072 AC1: deprecation states the marking, the development-only warning, and the minor and major rule', () => {
  const policy = section(docOf('deprecation'), 'Policy and process')
  assert.match(policy, /Is marked `deprecated`/)
  assert.match(policy, /warning in development/)
  assert.match(policy, /never warns in production/)
  assert.match(policy, /at least one minor release/)
  assert.match(policy, /only in a major release/)
  assert.match(policy, /`\$extensions\.cn\.status` is `deprecated`/)
})

test('REQ-072 AC2: deprecation and versioning both require a migration note in CHANGELOG.md', () => {
  assert.match(section(docOf('deprecation'), 'Policy and process'), /migration note.*`CHANGELOG\.md`/s)
  assert.match(section(docOf('versioning-and-releases'), 'Policy and process'), /migration note/)
})

test('SPEC §4.8, REQ-070: versioning-and-releases states lockstep, the three packages, the flow, and the gate', () => {
  const policy = section(docOf('versioning-and-releases'), 'Policy and process')
  for (const name of ['tokens', 'nuxt', 'email'])
    assert.match(policy, new RegExp(`@vinsmokemau/cup-noobles-${name}`), name)
  assert.match(policy, /in lockstep/)
  assert.match(policy, /pnpm changeset/)
  assert.match(policy, /"Version packages" pull request/)
  assert.match(policy, /pnpm release:check/)
  for (const group of ['Breaking', 'Added', 'Changed', 'Deprecated', 'Fixed']) assert.match(policy, new RegExp(group))
})

test('T11.2 scope: contribution is spec first, in the order ADR or spec change, then task, then code', () => {
  const policy = section(docOf('contribution'), 'Policy and process')
  const order = ['**Decide.**', '**Task.**', '**Code and docs.**'].map((step) => policy.indexOf(step))
  assert.ok(
    order.every((at) => at >= 0),
    'the three steps exist',
  )
  assert.deepEqual(
    [...order].sort((a, b) => a - b),
    order,
    'the steps are in order',
  )
  assert.match(policy, /ADR, or with a change to `SPEC\.md`/)
  assert.match(policy, /decisions\/NNNN-title\.md/)
})

test('A-01: ownership names a single maintainer and the decisions that need the owner', () => {
  const text = docOf('ownership')
  assert.match(section(text, 'Purpose'), /A-01/)
  assert.match(section(text, 'Purpose'), /no review board/)
  assert.match(section(text, 'Policy and process'), /not a designer/)
  assert.match(section(text, 'Policy and process'), /`1\.0\.0` release \(REQ-018\)/)
})
