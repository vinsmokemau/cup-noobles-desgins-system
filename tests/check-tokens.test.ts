// T3.1 checks: scripts/check-tokens.ts enforces REQ-010 (DTCG, tiers), REQ-014 (metadata), REQ-017 (naming), and the
// §4.4 and ADR-0006 token rules. Fixture roots live in tests/fixtures/check-tokens/{pass,fail}/, each with a SPEC.md
// (for BR IDs) and an ADR directory (for ADR sources).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkTokens, cssVariable, SEGMENT } from '../scripts/check-tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/check-tokens')

test('the passing fixture passes: every DTCG type in use, all three tiers, placeholders, and TBD chains', () => {
  const report = checkTokens(join(fixtures, 'pass'))
  assert.deepEqual(report.problems, [])
  assert.equal(report.tokens.length, 26)
  assert.deepEqual(
    ['primitive', 'semantic', 'component'].map((tier) => report.tokens.filter((t) => t.tier === tier).length),
    [16, 6, 4],
  )
  // tokens/contrast-pairs.json holds pairs (REQ-015), not tokens, so it is not read as a source.
  assert.ok(!report.files.includes('tokens/contrast-pairs.json'))
  // DTCG: `$type` on a group is inherited by its tokens.
  assert.equal(report.tokens.find((t) => t.path === 'color.brand.pink')?.type, 'color')
})

test('the failing fixture fails, once per violation, exactly where expected', () => {
  const problems = checkTokens(join(fixtures, 'fail')).problems.map((p) => `${p.file} ${p.path} ${p.rule}`)
  const expected = [
    // REQ-010 AC1: JSON, file location, and DTCG structure.
    'tokens/primitive/broken.json  json',
    'tokens/extra/stray.json  tier',
    'tokens/primitive/array.json  structure',
    'tokens/primitive/structure.json  structure', // unknown group property `$foo`
    'tokens/primitive/structure.json shape.loose structure', // neither a group nor a token
    'tokens/primitive/structure.json shape.a.b structure', // `.` in a name
    'tokens/primitive/structure.json shape.nested structure', // unknown token property `$unit`
    'tokens/primitive/structure.json shape.parent structure', // a token containing a token
    'tokens/primitive/duplicate.json color.brand.pink structure', // defined twice
    'tokens/primitive/grouptoken.json color.brand structure', // a token where a group is
    // REQ-010 AC1: DTCG types and values.
    'tokens/primitive/values.json bogus type', // unknown group $type
    'tokens/primitive/values.json value.unknown type',
    'tokens/primitive/values.json value.object type', // untyped, not a JSON scalar
    'tokens/primitive/values.json value.banana value', // the ADR-0003 control build
    'tokens/primitive/values.json value.short value',
    'tokens/primitive/values.json value.unitless value',
    'tokens/primitive/values.json value.bezier value',
    'tokens/primitive/values.json value.weight value',
    'tokens/primitive/values.json value.border value',
    // REQ-010 AC1: references.
    'tokens/primitive/refs.json ref.missing reference',
    'tokens/primitive/refs.json ref.loop-a reference',
    'tokens/primitive/refs.json ref.loop-b reference',
    'tokens/primitive/refs.json loose-ref.embedded reference',
    'tokens/primitive/refs.json ref.mismatch type',
    // REQ-010 AC2 and AC3: tiers.
    'tokens/semantic/tiers.json sem.raw tier',
    'tokens/semantic/tiers.json sem.to-sem tier',
    'tokens/semantic/tiers.json sem.to-comp tier',
    'tokens/component/tiers.json comp.to-prim tier',
    'tokens/component/tiers.json comp.raw tier',
    // REQ-014 AC1 to AC3.
    'tokens/primitive/metadata.json meta.no-description metadata',
    'tokens/primitive/metadata.json meta.blank-description metadata',
    'tokens/primitive/metadata.json meta.no-extensions metadata',
    'tokens/primitive/metadata.json meta.bad-status metadata',
    'tokens/primitive/metadata.json meta.no-source source',
    'tokens/primitive/metadata.json meta.unknown-br source',
    'tokens/primitive/metadata.json meta.missing-adr source',
    // §4.4: $extensions.cn.tbd.
    'tokens/primitive/metadata.json meta.tbd-missing tbd',
    'tokens/primitive/metadata.json meta.tbd-bad-id tbd',
    'tokens/primitive/metadata.json meta.derived-wrong tbd',
    'tokens/primitive/metadata.json meta.stable-with-tbd tbd',
    // §4.4 and ADR-0006: placeholders.
    'tokens/primitive/_placeholder.json placeholder.stable placeholder',
    'tokens/primitive/_placeholder.json placeholder.alias placeholder',
    'tokens/primitive/_placeholder.json placeholder.unlabeled placeholder',
    'tokens/primitive/_placeholder.json outside placeholder',
    'tokens/primitive/tbd-values.json placeholder.stray placeholder',
    'tokens/primitive/tbd-values.json pending.raw placeholder',
    'tokens/primitive/tbd-values.json pending.brand-only placeholder',
    'tokens/primitive/tbd-values.json final.on-placeholder placeholder',
    // REQ-017 AC1 and AC2: naming.
    'tokens/primitive/naming.json Naming naming',
    'tokens/primitive/naming.json names.2xl naming',
    'tokens/primitive/naming.json names.snake_case naming',
    'tokens/primitive/naming.json names.brandAlias naming', // same CSS name as brand-alias (ADR-0008)
    'tokens/primitive/naming.json dash.a-b naming', // same CSS name as dash-a.b
  ]
  assert.deepEqual([...problems].sort(), [...expected].sort())
})

test('REQ-017 AC1 and ADR-0008: the DTCG path maps to --cn-{path-with-dashes}, with camelCase split', () => {
  assert.equal(cssVariable('color.bg.base'), '--cn-color-bg-base')
  assert.equal(cssVariable('font.lineHeight.h1'), '--cn-font-line-height-h1')
  assert.equal(cssVariable('color.brand.pink-400'), '--cn-color-brand-pink-400')
})

test('REQ-017 AC2: path segments are lowercase kebab-case or camelCase', () => {
  for (const ok of ['color', 'bg', 'pink-400', 'lineHeight', 'h1', 'brand-primary', 'fontFamily'])
    assert.match(ok, SEGMENT, ok)
  for (const bad of ['Color', '2xl', '500', 'snake_case', 'kebab-Case', '-lead', 'trail-', 'a--b', 'a b', ''])
    assert.doesNotMatch(bad, SEGMENT, bad)
})

// Done when: `pnpm check:tokens` passes on an empty token set.
test('Done when: an empty token set passes, and so does the repository', () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-tokens-'))
  try {
    for (const tier of ['primitive', 'semantic', 'component']) mkdirSync(join(dir, 'tokens', tier), { recursive: true })
    assert.deepEqual(checkTokens(dir), { files: [], tokens: [], problems: [] })
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
  assert.deepEqual(checkTokens(root).problems, [])
})

test('the CLI prints the counts and exits 1 on problems', () => {
  const cli = (kind: string) =>
    spawnSync(process.execPath, ['scripts/check-tokens.ts', join(fixtures, kind)], { cwd: root, encoding: 'utf8' })
  const pass = cli('pass')
  assert.equal(pass.status, 0, pass.stderr)
  assert.match(pass.stdout, /^check-tokens: 26 tokens in 5 files \(16 primitive, 6 semantic, 4 component\)\./)

  const fail = cli('fail')
  assert.equal(fail.status, 1)
  assert.match(fail.stderr, /^tokens\/primitive\/values\.json value\.banana {2}value {2}"banana" is not a valid color/m)
  assert.match(fail.stderr, /check-tokens: 53 problem\(s\)/)
})

test('§0.3: `pnpm check:tokens` runs check-tokens first, and `pnpm test` runs it', () => {
  const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts
  // T3.5 appends check-contrast (tests/check-contrast.test.ts).
  assert.match(scripts['check:tokens'], /^node scripts\/check-tokens\.ts(?: &&|$)/)
  assert.match(scripts.test, /&& pnpm check:tokens(?: |$)/)
})
