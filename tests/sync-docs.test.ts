// T3.6 checks: scripts/sync-docs.ts rewrites the generated blocks in the `table` and `contrast` formats (REQ-004 AC1),
// `--check` reports drift (REQ-004 AC3), and `pnpm test`, which CI runs through `pnpm test:all`, includes
// `pnpm sync:docs --check` (REQ-075 AC2). Fixture roots live in tests/fixtures/sync-docs/{pass,fail}/; tests that
// write work on a copy in a temporary directory.
import { afterEach, test } from 'vitest'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast } from '../scripts/check-contrast'
import { matches, prefixes, renderContrast, syncDocs } from '../scripts/sync-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/sync-docs')
const script = join(root, 'scripts/sync-docs.ts')
const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' })

const temps: string[] = []
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true })
})
const copy = (name: string) => {
  const dir = mkdtempSync(join(tmpdir(), 'cn-sync-docs-test-'))
  temps.push(dir)
  cpSync(join(fixtures, name), dir, { recursive: true })
  return dir
}
const read = (dir: string, file: string) => readFileSync(join(dir, file), 'utf8')
const COLOR = 'docs/01-foundations/color.md'

test('a prefix matches its own path and every path below it, and a list takes spaces or commas', () => {
  assert.deepEqual(prefixes('color.brand, color.bg  focus'), ['color.brand', 'color.bg', 'focus'])
  assert.ok(matches('color.bg', ['color.bg']))
  assert.ok(matches('color.bg.base', ['color.bg']))
  assert.ok(!matches('color.bgx.base', ['color.bg']))
  assert.ok(!matches('color', ['color.bg']))
})

test('REQ-004 AC1: `table` blocks get one row per token, with its CSS variable, resolved value, and status', async () => {
  const dir = copy('pass')
  const result = await syncDocs(dir)
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.drifted, ['DESIGN.md', COLOR])
  const design = read(dir, 'DESIGN.md')
  assert.ok(
    design.includes(
      [
        '<!-- cn:generated tokens="color.text" format="table" -->',
        '',
        '| Token | CSS variable | Value | Status |',
        '|---|---|---|---|',
        '| `color.text.default` | `--cn-color-text-default` | `#90a1b9` | tbd (TBD-04) |',
        '| `color.text.inverted` | `--cn-color-text-inverted` | `#000000` | stable |',
        '',
        '<!-- /cn:generated -->',
      ].join('\n'),
    ),
    design,
  )
  const color = read(dir, COLOR)
  assert.match(color, /^\| `color\.bg\.base` \| `--cn-color-bg-base` \| `#000000` \| stable \|$/m)
  assert.match(color, /^\| `color\.brand\.primary` \| `--cn-color-brand-primary` \| `#ef80ae` \| stable \|$/m)
  assert.doesNotMatch(color, /stale row/)
  assert.equal(color.match(/^\| `color\./gm)?.length, 6 + 4, '6 table rows (color.brand, color.bg) and 4 pair rows')
  assert.match(color, /Hand-written notes after the block stay\./)
})

test('REQ-004 AC1: `contrast` blocks list the pairs and forbidden combinations with the check-contrast figures', async () => {
  const dir = copy('pass')
  await syncDocs(dir)
  const color = read(dir, COLOR)
  for (const line of [
    '| `color.brand.primary` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |',
    '| `color.brand.secondary` (`#fff488`) | `color.bg.base` (`#000000`) | large-text | 18.55:1 | 3.00:1 | pass |',
    '| `color.text.default` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.default`, `placeholder.color.neutral`) |',
  ])
    assert.ok(color.includes(`\n${line}\n`), line)

  // Forbidden combinations appear for the tokens they name; a literal side is shown as it is.
  const rows = renderContrast(checkContrast(join(fixtures, 'pass')), ['color.brand.pink'])
  assert.deepEqual(rows.slice(2), [
    '| `#ffffff` | `color.brand.pink` (`#ef80ae`) | — | 2.51:1 | — | forbidden |',
    '| `color.brand.yellow` (`#fff488`) | `color.brand.pink` (`#ef80ae`) | — | 2.22:1 | — | forbidden |',
  ])
})

test('blocks in fenced code, `inventory` blocks (T8.7), and the hash-locked brand source are left untouched', async () => {
  const dir = copy('pass')
  const result = await syncDocs(dir)
  assert.ok(!result.files.includes('docs/00-overview/brand-context-source.md'))
  assert.equal(
    read(dir, 'docs/00-overview/brand-context-source.md'),
    read(join(fixtures, 'pass'), 'docs/00-overview/brand-context-source.md'),
  )
  const color = read(dir, COLOR)
  assert.match(
    color,
    /```md\n<!-- cn:generated tokens="nothing\.here" format="table" -->\n<!-- \/cn:generated -->\n```/,
  )
  assert.match(color, /format="inventory" -->\nLeft as it is until T8\.7\.\n<!-- \/cn:generated -->/)
})

test('a file keeps its line endings', async () => {
  const dir = copy('pass')
  writeFileSync(join(dir, 'DESIGN.md'), read(dir, 'DESIGN.md').replaceAll('\n', '\r\n'))
  await syncDocs(dir)
  const design = read(dir, 'DESIGN.md')
  assert.match(design, /\| `color\.text\.inverted` .*\|\r\n/)
  assert.doesNotMatch(design, /[^\r]\n/)
})

test('malformed blocks are problems, and the command fails', async () => {
  const result = await syncDocs(join(fixtures, 'fail'), { check: true })
  assert.deepEqual(
    result.problems.map((p) => `${p.file}:${p.line}`),
    ['docs/blocks.md:3', 'docs/blocks.md:6', 'docs/blocks.md:9', 'docs/blocks.md:12', 'docs/unclosed.md:3'],
  )
  const messages = result.problems.map((p) => p.message)
  assert.match(messages[0]!, /needs a `tokens` attribute/)
  assert.match(messages[1]!, /`format` must be one of table, contrast, inventory, not "swatches"/)
  assert.match(messages[2]!, /tokens="color\.nothing" matches no tokens/)
  assert.match(messages[3]!, /matches no contrast pairs or forbidden combinations/)
  assert.match(messages[4]!, /never closed/)
  const cli = run(join(fixtures, 'fail'))
  assert.equal(cli.status, 1)
  assert.match(cli.stderr, /sync-docs: 5 problem\(s\)/)
})

// Done when: after a token value changes, `--check` fails; after running `pnpm sync:docs`, it passes; and running it
// on an in-sync tree leaves no diff.
test('Done when: a token value change fails --check until sync runs, and a second sync changes nothing', () => {
  const dir = copy('pass')
  assert.equal(run(dir).status, 0)
  const check = run('--check', dir)
  assert.equal(check.status, 0, check.stderr)
  assert.match(check.stdout, /2 files, 0 out of date/)

  const file = join(dir, 'tokens/primitive/_placeholder.json')
  writeFileSync(file, readFileSync(file, 'utf8').replace('#90a1b9', '#8899aa'))
  const before = [read(dir, 'DESIGN.md'), read(dir, COLOR)]
  const drift = run('--check', dir)
  assert.equal(drift.status, 1)
  assert.match(drift.stderr, /^DESIGN\.md {2}generated blocks are out of date/m)
  assert.match(drift.stderr, /^docs\/01-foundations\/color\.md {2}generated blocks are out of date/m)
  assert.deepEqual([read(dir, 'DESIGN.md'), read(dir, COLOR)], before, '--check writes nothing')

  assert.equal(run(dir).status, 0)
  assert.match(read(dir, 'DESIGN.md'), /`#8899aa`/)
  assert.equal(run('--check', dir).status, 0)

  const synced = [read(dir, 'DESIGN.md'), read(dir, COLOR)]
  assert.match(run(dir).stdout, /2 files, 0 updated/)
  assert.deepEqual([read(dir, 'DESIGN.md'), read(dir, COLOR)], synced, 'an in-sync tree is left byte for byte')
}, 60_000)

test('the repository docs are in sync', async () => {
  const result = await syncDocs(root, { check: true })
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.drifted, [])
})

test('§0.3 and REQ-075 AC2: `pnpm sync:docs` exists, and `pnpm test` (run by CI through test:all) checks it', () => {
  const { scripts } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  assert.equal(scripts['sync:docs'], 'node scripts/sync-docs.ts')
  assert.match(scripts.test, /&& pnpm sync:docs --check(?: &&|$)/)
  assert.match(scripts['test:all'], /^pnpm test\b/)
})
