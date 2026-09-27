// T3.2 checks: the primitive token sources in tokens/primitive/ hold the brand colors (REQ-011 AC1), the ADR-0006
// placeholders, and a tbd token per undefined value (REQ-005 AC2, §4.4).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkTbd } from '../scripts/check-tbd'
import { checkTokens, PLACEHOLDER_FILE, type Token } from '../scripts/check-tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { tokens } = checkTokens(root)
const inFile = (file: string) => tokens.filter((t) => t.file === `tokens/primitive/${file}`)
const tbdIds = (text: string) => [...text.matchAll(/\bTBD-\d{2}\b/g)].map((m) => m[0])

// §4.1: the primitive files, and §4.7: every primitive group other than color is TBD in T3.2.
const TBD_FILES = ['font', 'space', 'radius', 'border', 'effect', 'motion', 'breakpoint', 'z'].map((f) => `${f}.json`)

test('§4.1: tokens/primitive/ holds exactly the listed files', () => {
  assert.deepEqual(
    readdirSync(join(root, 'tokens/primitive')).sort(),
    ['_placeholder.json', 'color.json', ...TBD_FILES].sort(),
  )
})

test('REQ-011 AC1: the three brand colors are exact, stable primitives with their BR sources', () => {
  const brand = inFile('color.json').map((t) => [t.path, t.type, t.value, t.cn?.status, t.cn?.source])
  assert.deepEqual(brand, [
    ['color.brand.pink', 'color', '#ef80ae', 'stable', 'BR-01'],
    ['color.brand.yellow', 'color', '#fff488', 'stable', 'BR-02'],
    ['color.brand.black', 'color', '#000000', 'stable', 'BR-03'],
  ])
})

// ADR-0006 §2: one table row per placeholder, `| \`path\` | \`value\` | source | stands in for | label |`.
function adrRows() {
  const adr = readFileSync(join(root, 'docs/06-governance/decisions/0006-placeholder-values.md'), 'utf8')
  return adr
    .split(/\r?\n/)
    .filter((line) => line.startsWith('| `placeholder.'))
    .map((line) => {
      const [path, value, , standsIn, label] = line.split(' | ').map((cell) => cell.replace(/^\| /, ''))
      return {
        path: path!.slice(1, -1).replace(/\.2xl$/, '.xxl'), // ADR-0006 policy 6: `2xl` fails REQ-017 AC2
        value: value!.slice(1, -1),
        tbd: tbdIds(standsIn!),
        label: label!.replace(/ \|$/, ''),
      }
    })
}

// The CSS form of a DTCG value, to compare with the ADR, which writes CSS. ADR-0006 policy 6 allows the split parts.
function css(value: unknown): string {
  if (Array.isArray(value) && value.every((v) => typeof v === 'number')) return `cubic-bezier(${value.join(', ')})`
  if (Array.isArray(value)) return value.map((name) => (/\s/.test(name) ? `'${name}'` : name)).join(', ')
  return String(value)
}

test('ADR-0006: _placeholder.json holds exactly the recorded values, each labeled and tbd', () => {
  const rows = adrRows()
  assert.equal(rows.length, 38, 'every placeholder row in ADR-0006')
  const placeholders = tokens.filter((t) => t.file === PLACEHOLDER_FILE)
  assert.deepEqual(placeholders.map((t) => t.path).sort(), rows.map((r) => r.path).sort())

  for (const row of rows) {
    const token = placeholders.find((t) => t.path === row.path)!
    assert.equal(row.label, 'not a brand value', row.path)
    assert.equal(css(token.value), row.value, row.path)
    assert.equal(token.cn?.status, 'tbd', row.path)
    assert.deepEqual(token.cn?.tbd, row.tbd, row.path)
    // ADR-0006 policy 2: the description starts with the label and names the TBD IDs it stands in for.
    assert.match(String(token.description), /^Placeholder, not a brand value\. /, row.path)
    assert.deepEqual(tbdIds(String(token.description)), row.tbd, row.path)
  }
})

test('REQ-005 AC2 and §4.4: every other primitive is tbd, references a placeholder, and names its TBD IDs', () => {
  const placeholders = new Set(tokens.filter((t) => t.file === PLACEHOLDER_FILE).map((t) => t.path))
  const others: Token[] = TBD_FILES.flatMap(inFile)
  for (const file of TBD_FILES) assert.ok(inFile(file).length, `${file} holds tokens`)
  assert.equal(others.length + inFile('color.json').length + placeholders.size, tokens.length)

  for (const token of others) {
    assert.equal(token.cn?.status, 'tbd', token.path)
    const ref = String(token.value).match(/^\{(placeholder\.[^{}]+)\}$/)?.[1]
    assert.ok(ref && placeholders.has(ref), `${token.path} references a placeholder`)
    const ids = token.cn?.tbd as string[]
    assert.ok(ids.length, token.path)
    for (const id of ids) assert.ok(String(token.description).includes(id), `${token.path} description names ${id}`)
    // A token stands in for a subset of what its placeholder stands in for.
    const placeholder = tokens.find((t) => t.path === ref)!
    for (const id of ids) assert.ok((placeholder.cn?.tbd as string[]).includes(id), `${token.path}: ${id}`)
  }
  assert.ok(existsSync(join(root, PLACEHOLDER_FILE)))
})

// Done when: `check:tokens` passes, and `check:tbd` lists every TBD-03 through TBD-16 token.
test('Done when: check-tokens passes, and check-tbd lists every tbd token with counts for TBD-03 to TBD-16', () => {
  assert.deepEqual(checkTokens(root).problems, [])
  const report = checkTbd(root)
  assert.deepEqual(report.problems, [])

  const tbd = tokens.filter((t) => t.cn?.status === 'tbd')
  assert.deepEqual(
    report.tokens.map((t) => `${t.file} ${t.path} ${t.tbd.join(',')}`).sort(),
    tbd.map((t) => `${t.file} ${t.path} ${(t.cn?.tbd as string[]).join(',')}`).sort(),
  )
  const counts = Object.fromEntries(report.items.map((i) => [i.id, i.tokens]))
  for (let n = 3; n <= 16; n++) {
    const id = `TBD-${String(n).padStart(2, '0')}`
    // TBD-08 has no placeholder (ADR-0006): its derived-pending alias shades arrive with the Nuxt UI theme (C-06).
    if (id === 'TBD-08') assert.equal(counts[id], 0)
    else assert.ok(counts[id]! > 0, `${id} has tokens`)
  }
  assert.equal(report.summary.tokens, tbd.length)
})
