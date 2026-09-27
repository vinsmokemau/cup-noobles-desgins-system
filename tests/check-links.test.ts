// T2.3 checks: scripts/check-links.ts enforces REQ-001 AC2 (orphans) and AC3 (broken links and anchors).
// Fixture roots live in tests/fixtures/check-links/{pass,fail}/.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkLinks, slugify } from '../scripts/check-links'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/check-links')
const run = (kind: 'pass' | 'fail') => checkLinks(join(fixtures, kind)).map((p) => `${p.file}:${p.line} ${p.rule}`)

test('the passing fixture passes: anchors, repeated headings, references, root-relative links, ignored code', () => {
  assert.deepEqual(run('pass'), [])
})

test('the failing fixture fails, exactly where expected', () => {
  assert.deepEqual(run('fail'), [
    'DESIGN.md:4 broken-link', // missing file
    'DESIGN.md:5 broken-link', // wrong case: resolves only on a case-insensitive file system
    'DESIGN.md:6 broken-anchor', // missing anchor in another file
    'DESIGN.md:7 broken-anchor', // missing anchor in the same file
    'DESIGN.md:8 broken-link', // outside the root
    'DESIGN.md:12 broken-link', // reference definition
    'docs/06-governance/decisions/0002-second.md:1 orphan', // an ADR linked from DESIGN.md, not the decision log
    'docs/a.md:5 broken-anchor', // `usage-2` when there is only one "Usage"
    'docs/orphan.md:1 orphan',
  ])
})

test('slugify follows GitHub heading anchors', () => {
  assert.equal(slugify("Do and don't"), 'do-and-dont')
  assert.equal(slugify('Tokens and specs *(generated block)*'), 'tokens-and-specs-generated-block')
  assert.equal(slugify('Context · Decision · Consequences'), 'context--decision--consequences')
  assert.equal(slugify('The `copy es-MX` block'), 'the-copy-es-mx-block')
  assert.equal(slugify('ADR-0001: Nuxt UI [spike](x.md)'), 'adr-0001-nuxt-ui-spike')
  assert.equal(slugify('Tipografía y ñ'), 'tipografía-y-ñ')
})

test('`pnpm check:docs` runs check-links (§0.3: it validates links)', () => {
  const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts
  assert.equal(scripts['check:links'], 'node scripts/check-links.ts')
  assert.match(scripts['check:docs'], /&& pnpm check:links$/)
})

test('the CLI exits 0 on a passing root and 1 on a failing root', () => {
  const cli = (dir: string) =>
    spawnSync(process.execPath, ['scripts/check-links.ts', join(fixtures, dir)], { cwd: root, encoding: 'utf8' })
  const pass = cli('pass')
  assert.equal(pass.status, 0, pass.stderr)
  const fail = cli('fail')
  assert.equal(fail.status, 1)
  assert.match(fail.stderr, /^docs\/orphan\.md:1 {2}orphan {2}/m)
})

test('Done when: the repository has zero orphan docs and zero broken links', () => {
  assert.deepEqual(checkLinks(root), [])
})
