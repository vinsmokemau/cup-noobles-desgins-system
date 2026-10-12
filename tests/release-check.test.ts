// T11.4 checks: scripts/release-check.ts is the 1.0 gate (REQ-018). Fixture roots live in
// tests/fixtures/release-check/{fail,pass}/: each has tokens, component docs, and foundation docs.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { releaseCheck } from '../scripts/release-check'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/release-check')
const script = join(root, 'scripts/release-check.ts')

const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' })

test('REQ-018 AC1: a stable component that reaches a tbd token through a chain fails the gate, and is listed', () => {
  const report = releaseCheck(join(fixtures, 'fail'), '0.1.0')
  // button -> color.text.muted (semantic) -> color.neutral.500 (primitive, tbd).
  assert.deepEqual(
    report.components.map((c) => ({ file: c.file, pending: c.pending })),
    [
      {
        file: 'docs/02-components/atoms/button.md',
        pending: [{ path: 'color.neutral.500', status: 'tbd', tbd: ['TBD-05'], via: ['button.fg'] }],
      },
    ],
  )
  assert.equal(report.stableComponents, 2, 'the draft card is not counted')
  assert.deepEqual(
    report.problems.map((p) => [p.file, p.rule]),
    [['docs/02-components/atoms/button.md', 'stable-component']],
  )
})

test('REQ-018 AC1: a draft component that reaches a tbd token does not block the gate', () => {
  const report = releaseCheck(join(fixtures, 'fail'), '0.1.0')
  assert.ok(!report.components.some((c) => c.slug === 'card'))
})

test('REQ-018 AC1: a derived-pending token blocks the gate the same way as a tbd token', () => {
  const report = releaseCheck(join(fixtures, 'derived-pending'), '0.1.0')
  assert.deepEqual(
    report.components.flatMap((c) => c.pending.map((p) => [p.path, p.status, p.tbd])),
    [['color.brand.pink', 'derived-pending', ['TBD-08']]],
  )
})

test('REQ-018 AC1: the gate passes on a fixture where every token is stable', () => {
  const report = releaseCheck(join(fixtures, 'pass'), '0.1.0')
  assert.deepEqual(report.problems, [])
  assert.deepEqual(report.components, [])
  assert.equal(report.stableComponents, 2)
})

test('REQ-018 AC2: a tbd foundation doc fails for 1.0.0 and passes for 0.x', () => {
  const zero = releaseCheck(join(fixtures, 'fail'), '0.9.0')
  assert.equal(zero.foundationGate, false)
  assert.deepEqual(
    zero.problems.map((p) => p.rule),
    ['stable-component'],
  )
  assert.deepEqual(zero.foundations, [{ file: 'docs/01-foundations/typography.md', status: 'tbd' }])

  const one = releaseCheck(join(fixtures, 'fail'), '1.0.0')
  assert.equal(one.foundationGate, true)
  assert.deepEqual(
    one.problems.map((p) => [p.file, p.rule]),
    [
      ['docs/02-components/atoms/button.md', 'stable-component'],
      ['docs/01-foundations/typography.md', 'foundation-tbd'],
    ],
  )

  assert.deepEqual(releaseCheck(join(fixtures, 'pass'), '1.0.0').problems, [])
})

test('REQ-018: `pnpm release:check` is a package script, and the CLI exits 1 on a failing root and 0 on a passing one', () => {
  const scripts = (JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { scripts: Record<string, string> })
    .scripts
  assert.equal(scripts['release:check'], 'node scripts/release-check.ts')

  const fail = run(join(fixtures, 'fail'))
  assert.equal(fail.status, 1)
  assert.match(fail.stderr, /docs\/02-components\/atoms\/button\.md {2}stable-component/)
  assert.match(fail.stderr, /color\.neutral\.500 {2}tbd TBD-05 {2}\(via button\.fg\)/)
  assert.match(fail.stderr, /1\.0\.0 is blocked \(REQ-018\)/)

  const pass = run(join(fixtures, 'pass'), '--version', '1.0.0')
  assert.equal(pass.status, 0, pass.stderr)
  assert.match(pass.stdout, /the 1\.0 gate passes/)

  const foundation = run(join(fixtures, 'fail'), '--version', '1.0.0')
  assert.equal(foundation.status, 1)
  assert.match(foundation.stderr, /docs\/01-foundations\/typography\.md {2}foundation-tbd/)
})

test('REQ-018: the real repository reports its stable components and foundation docs without error', () => {
  const report = releaseCheck(root)
  assert.ok(report.stableComponents > 0, 'the repository has stable component docs')
  // Every problem the gate raises names a doc and a rule; none is a crash or an empty list entry.
  for (const problem of report.problems) assert.ok(problem.file && problem.rule && problem.message)
})
