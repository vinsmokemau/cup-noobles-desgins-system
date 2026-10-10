// T2.4 checks: scripts/check-tbd.ts enforces the §4.4 TBD convention, REQ-005, REQ-009 AC1 (draft listing),
// and REQ-073 AC2. Fixture roots live in tests/fixtures/check-tbd/{pass,fail}/, each with its own SPEC.md.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkTbd } from '../scripts/check-tbd'
import { prose, readFrontmatter, scan } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/check-tbd')

test('the passing fixture passes, and the report lists callouts, tokens, content-pending items, and drafts', () => {
  const report = checkTbd(join(fixtures, 'pass'))
  assert.deepEqual(report.problems, [])
  assert.deepEqual(report.callouts, [
    {
      file: 'docs/01-foundations/color.md',
      line: 11,
      id: 'TBD-02',
      text: 'The neutral scale is not defined. Owner input needed.',
    },
    {
      file: 'docs/01-foundations/color.md',
      line: 17,
      id: 'TBD-03',
      text: 'Stroke widths are not defined. Owner input needed.',
    },
  ])
  assert.deepEqual(report.contentPending, [
    { file: 'DESIGN.md', line: 3, task: 'T1.1' },
    { file: 'docs/01-foundations/color.md', line: 30, task: 'T2.1' },
  ])
  // REQ-005 AC2 and AC3: every token with status `tbd` (and `derived-pending`) is listed with its file, path, and
  // the TBD IDs in its `$extensions.cn.tbd` (§4.4, T3.2).
  assert.deepEqual(report.tokens, [
    { file: 'tokens/primitive/color.json', path: 'color.brand.pink-400', status: 'derived-pending', tbd: ['TBD-08'] },
    { file: 'tokens/primitive/color.json', path: 'color.neutral.500', status: 'tbd', tbd: ['TBD-02'] },
    { file: 'tokens/semantic/border.json', path: 'border.width.default', status: 'tbd', tbd: ['TBD-02', 'TBD-03'] },
  ])
  // REQ-009 AC1: draft docs and `> **Draft:**` callouts are listed.
  assert.deepEqual(report.drafts, {
    docs: [{ file: 'docs/01-foundations/color.md' }],
    callouts: [
      { file: 'docs/01-foundations/color.md', line: 13, text: 'Use pink for the single main action per view.' },
    ],
  })
  // T3.2: the report counts tokens per TBD item; a token naming two items counts for both.
  assert.deepEqual(
    report.items.map((i) => [i.id, i.resolved, i.adrs, i.callouts, i.tokens]),
    [
      ['TBD-01', true, ['ADR-0001'], 0, 0],
      ['TBD-02', false, [], 1, 2],
      ['TBD-03', false, [], 1, 1],
      ['TBD-08', false, [], 0, 1],
    ],
  )
  assert.deepEqual(report.summary, {
    openItems: 3,
    resolvedItems: 1,
    callouts: 2,
    tokens: 2,
    derivedPendingTokens: 1,
    contentPending: 2,
    draftDocs: 1,
    draftCallouts: 1,
    problems: 0,
  })
})

test('the failing fixture fails, exactly where expected', () => {
  assert.deepEqual(
    checkTbd(join(fixtures, 'fail')).problems.map((p) => `${p.file}:${p.line} ${p.rule}`),
    [
      'docs/01-foundations/effects.md:4 unknown-id', // frontmatter `tbd: [TBD-98]`
      'docs/01-foundations/effects.md:11 unknown-id', // Done when: TBD-99 fails the check
      'docs/01-foundations/effects.md:13 resolved-callout', // §4.4: the callout is removed on resolution
      'docs/01-foundations/effects.md:15 unknown-task', // T9.9 is not in §6
      'docs/01-foundations/effects.md:17 callout', // `> **TBD:**` without "Content pending"
      'docs/01-foundations/effects.md:19 callout', // TBD-3 is not a TBD-NN ID
      'docs/01-foundations/effects.md:21 callout', // `> **Draft**` without its colon
      'SPEC.md:7 missing-adr', // REQ-073 AC2: resolved row with no ADR
      'SPEC.md:8 missing-adr', // resolved row naming an ADR file that does not exist
      'SPEC.md:19 missing-adr', // REQ-073 AC2: decided OD with no ADR
      'tokens/component/broken.json:1 token-file',
      'tokens/primitive/ids.json:6 unknown-id', // T3.2: `$extensions.cn.tbd` names TBD-99, not in §2.4
      'tokens/primitive/ids.json:11 resolved-token', // T3.2: `$extensions.cn.tbd` names the resolved TBD-01
    ],
  )
})

test('the CLI writes the report, prints the open count, and exits 1 on problems', () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-tbd-'))
  try {
    const cli = (kind: string) => {
      const out = join(dir, `${kind}.json`)
      const run = spawnSync(process.execPath, ['scripts/check-tbd.ts', join(fixtures, kind), '--out', out], {
        cwd: root,
        encoding: 'utf8',
      })
      return { ...run, report: JSON.parse(readFileSync(out, 'utf8')) }
    }
    const pass = cli('pass')
    assert.equal(pass.status, 0, pass.stderr)
    assert.match(pass.stdout, /^check-tbd: 3 open TBD items \(2 callouts, 2 tbd tokens\)/)
    assert.match(pass.stdout, /^check-tbd: tokens per item: TBD-02 2, TBD-03 1, TBD-08 1$/m)
    assert.equal(pass.report.summary.problems, 0)

    const fail = cli('fail')
    assert.equal(fail.status, 1)
    assert.match(fail.stderr, /^docs\/01-foundations\/effects\.md:11 {2}unknown-id {2}.*TBD-99/m)
    assert.match(fail.stderr, /^tokens\/primitive\/ids\.json:6 {2}unknown-id {2}token `space\.base`.*TBD-99/m)
    assert.equal(fail.report.problems.length, 13, 'the report is written even when the check fails')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('§0.3: `pnpm check:tbd` runs check-tbd, and `pnpm test` runs it', () => {
  const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts
  assert.equal(scripts['check:tbd'], 'node scripts/check-tbd.ts')
  assert.match(scripts.test, /&& pnpm check:tbd(?: |$)/)
})

test('.gitignore keeps reports/tbd-report.json out of git (§4.1)', () => {
  assert.match(readFileSync(join(root, '.gitignore'), 'utf8'), /^reports\/\*$/m)
})

// Done when: the report lists every stub's TBD callouts, and the repository passes.
test('Done when: the repository passes, and the report lists every callout in every doc', () => {
  const report = checkTbd(root)
  assert.deepEqual(report.problems, [])

  const docs = readdirSync(join(root, 'docs'), { recursive: true, encoding: 'utf8' })
    .map((path) => `docs/${path.replaceAll('\\', '/')}`)
    .filter((path) => path.endsWith('.md') && path !== 'docs/00-overview/brand-context-source.md')
  const expected: string[] = []
  for (const file of ['DESIGN.md', ...docs]) {
    const text = readFileSync(join(root, file), 'utf8')
    const end = file === 'DESIGN.md' ? 0 : readFrontmatter(text).end
    for (const line of scan(file, text, end, []).filter(prose))
      if (/^ {0,3}> \*\*TBD/.test(line.text)) expected.push(`${file}:${line.n}`)
  }
  const listed = [...report.callouts, ...report.contentPending].map((c) => `${c.file}:${c.line}`)
  assert.deepEqual(listed.sort(), expected.sort())
  assert.ok(report.contentPending.length > 0)
  // TBD-01 to TBD-21, minus the items the owner has resolved since T2.4, each through an existing ADR (§4.4).
  const resolved = report.items.filter((i) => i.resolved)
  assert.deepEqual(
    resolved.map((i) => `${i.id} ${i.adrs.join(',')}`),
    ['TBD-16 ADR-0009', 'TBD-17 ADR-0016', 'TBD-19 ADR-0012'],
  )
  assert.equal(report.summary.openItems, 21 - resolved.length, 'every other §2.4 item is open')
})

test('REQ-073 AC2: every decided OD in SPEC.md names an existing ADR', () => {
  const spec = readFileSync(join(root, 'SPEC.md'), 'utf8')
  const decided = spec.split(/\r?\n/).filter((line) => /^\| OD-\d{2} \|.*\*\*Decided\b/.test(line))
  assert.equal(decided.length, 9)
  for (const line of decided) assert.match(line, /\bADR-\d{4}\b/, line.slice(0, 8))
})
