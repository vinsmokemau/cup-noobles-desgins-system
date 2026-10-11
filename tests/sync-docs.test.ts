// T3.6 checks: scripts/sync-docs.ts rewrites the generated blocks in the `table` and `contrast` formats (REQ-004 AC1),
// `--check` reports drift (REQ-004 AC3), and `pnpm test`, which CI runs through `pnpm test:all`, includes
// `pnpm sync:docs --check` (REQ-075 AC2). T8.7 adds the `inventory` format. Fixture roots live in
// tests/fixtures/sync-docs/{pass,fail,inventory}/; tests that write work on a copy in a temporary directory.
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

test('blocks in fenced code and the hash-locked brand source are left untouched', async () => {
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
})

// T8.7 (REQ-020 AC1, §4.10): the `inventory` format lists the component docs from their frontmatter.
const INVENTORY = 'docs/02-components/inventory.md'
test('T8.7: `inventory` blocks get one row per component doc, atoms then molecules then organisms', async () => {
  const dir = copy('inventory')
  const result = await syncDocs(dir)
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.drifted, [INVENTORY])
  const inventory = read(dir, INVENTORY)
  assert.ok(
    inventory.includes(
      [
        '<!-- cn:generated format="inventory" -->',
        '',
        '| Component | Level | Source | Implementation | Status | Open TBD items |',
        '|---|---|---|---|---|---|',
        '| [Button](atoms/button.md) | atom | nuxt-ui | `UButton` | stable | TBD-12, TBD-16 |',
        '| [Logo](atoms/logo.md) | atom | custom | `CnLogo` | stable | — |',
        '| [Card](molecules/card.md) | molecule | nuxt-ui | `UCard` | stable | — |',
        '| [Modal](organisms/modal.md) | organism | nuxt-ui | `UModal` | draft | TBD-15 |',
        '',
        '<!-- /cn:generated -->',
      ].join('\n'),
    ),
    inventory,
  )
  assert.doesNotMatch(inventory, /stale row/)
  assert.doesNotMatch(inventory, /Color/, 'a doc that is not a component is not listed')
  assert.doesNotMatch(inventory, /Doc title|_template/, 'the template is not a component')
  assert.match(inventory, /Hand-written notes after the block stay\./)
  assert.match(inventory, /```md\n<!-- cn:generated format="inventory" -->\n<!-- \/cn:generated -->\n```/)
})

test('T8.7: a second sync leaves the inventory unchanged, and --check fails when a component doc changes', () => {
  const dir = copy('inventory')
  assert.equal(run(dir).status, 0)
  assert.equal(run('--check', dir).status, 0)
  const synced = read(dir, INVENTORY)
  assert.equal(run(dir).status, 0)
  assert.equal(read(dir, INVENTORY), synced)

  const file = join(dir, 'docs/02-components/atoms/logo.md')
  writeFileSync(file, readFileSync(file, 'utf8').replace('status: stable', 'status: deprecated'))
  const drift = run('--check', dir)
  assert.equal(drift.status, 1)
  assert.match(drift.stderr, /^docs\/02-components\/inventory\.md {2}generated blocks are out of date/m)
  assert.equal(read(dir, INVENTORY), synced, '--check writes nothing')
  assert.equal(run(dir).status, 0)
  assert.match(
    read(dir, INVENTORY),
    /\| \[Logo\]\(atoms\/logo\.md\) \| atom \| custom \| `CnLogo` \| deprecated \| — \|/,
  )
}, 60_000)

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
    [
      'docs/blocks.md:3',
      'docs/blocks.md:6',
      'docs/blocks.md:9',
      'docs/blocks.md:12',
      'docs/no-components.md:3',
      'docs/unclosed.md:3',
    ],
  )
  const messages = result.problems.map((p) => p.message)
  assert.match(messages[0]!, /needs a `tokens` attribute/)
  assert.match(messages[1]!, /`format` must be one of table, contrast, inventory, not "swatches"/)
  assert.match(messages[2]!, /tokens="color\.nothing" matches no tokens/)
  assert.match(messages[3]!, /matches no contrast pairs or forbidden combinations/)
  assert.match(messages[4]!, /inventory block finds no component docs/)
  assert.match(messages[5]!, /never closed/)
  const cli = run(join(fixtures, 'fail'))
  assert.equal(cli.status, 1)
  assert.match(cli.stderr, /sync-docs: 6 problem\(s\)/)
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
