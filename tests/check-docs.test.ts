// T2.2 checks: scripts/check-docs.ts enforces REQ-002, REQ-003, REQ-004 AC2, REQ-007, REQ-008 AC1, and REQ-037.
// T4.1 adds REQ-006 AC2 (the brand-rule fixtures and the overview-doc test).
// Every rule has a passing and a failing fixture root in tests/fixtures/check-docs/<rule>/{pass,fail}/.
import { describe, test } from 'vitest'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brandRules, checkDocs, checkFile, compileSchema, requiredHeadings, TEMPLATE } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/check-docs')
const run = (rule: string, kind: 'pass' | 'fail') =>
  checkDocs(join(fixtures, rule, kind)).map((p) => `${p.file}:${p.line} ${p.rule}`)

// The expected failures of each failing fixture, as `file:line rule`.
const failures: Record<string, string[]> = {
  frontmatter: [
    'docs/06-governance/invalid.md:1 frontmatter', // no `updated`
    'docs/06-governance/invalid.md:5 frontmatter', // `level` on a governance doc (REQ-002 AC3)
    'docs/06-governance/invalid.md:6 frontmatter', // status `final` (REQ-002 AC2)
    'docs/06-governance/invalid.md:7 frontmatter', // lang `es-MX` (REQ-007 AC1)
    'docs/06-governance/no-frontmatter.md:1 frontmatter',
  ],
  exempt: ['docs/00-overview/brand-context-copy.md:1 frontmatter', 'docs/00-overview/brand-context-copy.md:3 hex'],
  headings: [
    'docs/00-overview/usage-rules.md:17 headings',
    'docs/06-governance/decisions/0001-extra.md:21 headings',
    'docs/06-governance/h1-mismatch.md:11 headings',
    'docs/06-governance/missing.md:17 headings',
    'docs/06-governance/out-of-order.md:17 headings',
  ],
  'not-applicable': ['docs/06-governance/deprecation.md:21 not-applicable'],
  'generated-block': [
    'docs/06-governance/versioning.md:17 generated-block', // stray close
    'docs/06-governance/versioning.md:22 generated-block', // nested open
    'docs/06-governance/versioning.md:25 generated-block', // never closed
  ],
  hex: [
    'DESIGN.md:3 hex',
    'docs/00-overview/principles.md:15 hex', // prose
    'docs/00-overview/principles.md:21 hex', // inline code
    'docs/00-overview/principles.md:26 hex', // a fence not tagged bad-example
    'docs/00-overview/principles.md:29 hex', // an HTML comment
  ],
  mdc: [
    'DESIGN.md:5 mdc',
    'DESIGN.md:6 mdc',
    'docs/06-governance/contribution.md:17 mdc',
    'docs/06-governance/contribution.md:19 mdc',
    'docs/06-governance/contribution.md:23 mdc', // inline :badge{…}
  ],
  'copy-locale': ['docs/04-content/microcopy.md:21 copy-locale', 'docs/04-content/microcopy.md:27 copy-locale'],
  'stable-callout': [
    'docs/06-governance/ownership.md:19 stable-callout', // > **Draft:**
    'docs/06-governance/ownership.md:23 stable-callout', // > **TBD (TBD-01):**
  ],
  slug: ['docs/06-governance/ownership.md:1 slug'],
  'brand-rule': [
    'DESIGN.md:3 brand-rule', // BR-42
    'docs/00-overview/principles.md:7 brand-rule', // frontmatter BR-18
    'docs/00-overview/principles.md:16 brand-rule', // BR-00
    'docs/00-overview/principles.md:18 brand-rule', // BR-06 quote, wrong text
    'docs/00-overview/principles.md:24 brand-rule', // BR-05 quote holding BR-06's text
    'docs/00-overview/principles.md:28 brand-rule', // BR-06 text without its ID
  ],
}

test('every fixture directory has an expectation, and every expectation has a fixture', () => {
  assert.deepEqual(readdirSync(fixtures).sort(), Object.keys(failures).sort())
})

describe.each(Object.entries(failures))('rule %s', (rule, expected) => {
  test('Done when: the passing fixture passes', () => {
    assert.deepEqual(run(rule, 'pass'), [])
  })
  test('Done when: the failing fixture fails, exactly where expected', () => {
    assert.deepEqual(run(rule, 'fail'), expected)
  })
})

test('REQ-002 AC1: a file that starts with a UTF-8 BOM fails (its frontmatter is hidden, ADR-0002)', () => {
  const doc = readFileSync(join(fixtures, 'frontmatter/pass/docs/06-governance/ownership.md'), 'utf8')
  const validate = compileSchema()
  assert.deepEqual(checkFile('docs/06-governance/ownership.md', doc, validate).problems, [])
  const { problems } = checkFile('docs/06-governance/ownership.md', String.fromCharCode(0xfeff) + doc, validate)
  assert.deepEqual(
    problems.map((p) => p.rule),
    ['frontmatter'],
  )
})

test('REQ-002 AC3: a component doc without `level` fails', () => {
  const path = 'docs/02-components/atoms/button.md'
  const doc = readFileSync(join(fixtures, 'headings/pass', path), 'utf8')
  const { problems } = checkFile(path, doc.replace(/^level: atom\r?\n/m, ''), compileSchema())
  assert.deepEqual(
    problems.map((p) => `${p.line} ${p.rule} ${p.message}`),
    ['1 frontmatter missing required field `level` (REQ-002)'],
  )
})

// §4.2, read from SPEC.md, so the table in check-docs.ts can't drift from the contract.
test('REQ-003 AC1: the required headings per layer match the SPEC.md §4.2 table', () => {
  const section = readFileSync(join(root, 'SPEC.md'), 'utf8')
    .split('### 4.2 Standard `.md` template')[1]!
    .split('### 4.3')[0]!
  const lines = section.split(/\r?\n/).filter((line) => line.startsWith('|'))
  const layers = lines[0]!
    .split('|')
    .slice(3, -1)
    .map((cell) => cell.trim())
  const rows = lines
    .filter((line) => /^\| \d+ \|/.test(line))
    .flatMap((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim())
      const required = layers.filter((_, i) => cells[i + 2] === '●')
      return cells[1]!
        .replace(/\s*\*\(.*\)\*$/, '')
        .split(' · ')
        .map((heading) => [heading, required] as const)
    })
  assert.deepEqual(
    TEMPLATE.map(([heading, required]) => [heading, [...required]]),
    rows.map(([heading, required]) => [heading, [...required]]),
  )
  assert.deepEqual(requiredHeadings('adr'), ['Context', 'Decision', 'Consequences'])
})

test('Done when: `pnpm check:docs` exists and runs this script', () => {
  const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts
  assert.match(scripts['check:docs'], /^node scripts\/check-docs\.ts(?: &&|$)/)
  assert.match(scripts.test, /pnpm check:docs/, 'pnpm test runs the docs checks (§0.3)')
})

test('the CLI exits 0 on a passing root and 1 on a failing root', () => {
  const cli = (dir: string) =>
    spawnSync(process.execPath, ['scripts/check-docs.ts', join(fixtures, dir)], { cwd: root, encoding: 'utf8' })
  const pass = cli('hex/pass')
  assert.equal(pass.status, 0, pass.stderr)
  const fail = cli('hex/fail')
  assert.equal(fail.status, 1)
  assert.match(fail.stderr, /^DESIGN\.md:3 {2}hex {2}/m)
})

test('REQ-006 AC2: the brand-rule check reads BR-01 to BR-17 from SPEC.md §2.1', () => {
  const rules = brandRules()
  assert.deepEqual(
    [...rules.keys()],
    Array.from({ length: 17 }, (_, i) => `BR-${String(i + 1).padStart(2, '0')}`),
  )
  assert.equal(rules.get('BR-06'), 'The UI is high-contrast, vibrant, and legible.')
})

// T4.1 Done when: every BR ID quoted in the overview docs matches §2.1 (the brand-rule check), and check:docs passes.
test('T4.1: the overview docs quote BR rules, and every quote matches SPEC.md §2.1', () => {
  const quotes = readdirSync(join(root, 'docs/00-overview'))
    .filter((file) => file.endsWith('.md') && file !== 'brand-context-source.md')
    .flatMap((file) =>
      readFileSync(join(root, 'docs/00-overview', file), 'utf8')
        .split(/\r?\n/)
        .flatMap((line) => line.match(/^> \*\*(BR-\d{2}):\*\*/)?.[1] ?? []),
    )
  for (const id of ['BR-04', 'BR-05', 'BR-06', 'BR-09', 'BR-14', 'BR-16', 'BR-17']) assert.ok(quotes.includes(id), id)
  assert.deepEqual(
    checkDocs(root).filter((p) => p.file.startsWith('docs/00-overview/')),
    [],
  )
})

test('the repository docs pass check-docs', () => {
  assert.deepEqual(checkDocs(root), [])
})
