// T4.3 checks: docs/01-foundations/typography.md quotes BR-07 to BR-09, sets out the BR-08 hierarchy and the typeface
// selection criteria, and (T13.1) is stable with the owner's choices: Titan One, Rubik, and the Balanced scale.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const text = readFileSync(join(root, 'docs/01-foundations/typography.md'), 'utf8')
const lines = text.split(/\r?\n/)
const fm = readFrontmatter(text).data as Record<string, unknown>

// The lines that sit outside generated blocks.
function prose(): { n: number; text: string }[] {
  const out: { n: number; text: string }[] = []
  let generated = false
  for (const [i, line] of lines.entries()) {
    if (line.startsWith('<!-- cn:generated ')) generated = true
    if (generated) {
      if (line.startsWith('<!-- /cn:generated -->')) generated = false
      continue
    }
    out.push({ n: i + 1, text: line })
  }
  return out
}

test('frontmatter: stable, BR-07 to BR-09, no TBD item left, tokens `font`', () => {
  assert.equal(fm.status, 'stable')
  assert.deepEqual(fm.brandRules, ['BR-07', 'BR-08', 'BR-09'])
  assert.deepEqual(fm.tbd, [])
  assert.deepEqual(fm.tokens, ['font'])
})

test('T13.1: a literal font-family declaration uses a token variable', () => {
  for (const { n, text: line } of prose()) {
    const decl = line.match(/font-family:\s*([^;]+)/)
    if (decl) assert.match(decl[1]!, /^var\(--cn-font-[\w-]+\)$/, `line ${n}`)
  }
})

test('T13.1: the doc names the typefaces, the scale, the fallback stack, and the hyphenation rule', () => {
  assert.match(text, /Titan One \(ADR-0046\)/)
  assert.match(text, /Rubik \(ADR-0047\)/)
  assert.match(text, /Balanced scale \(ADR-0048\)/)
  assert.match(text, /Arial Black behind Titan One, and Arial behind Rubik \(ADR-0058\)/)
  assert.match(text, /`hyphens: auto`/)
  assert.match(text, /^\| H1 \| 2\.5rem \(40 px\) \| 2\.75rem \(44 px\) \| 400 \| 0 \|$/m)
  assert.match(text, /^\| Caption \| 0\.8125rem \(13 px\) \| 1\.125rem \(18 px\) \| 400 \| 0 \|$/m)
})

test('T13.1: every row of the generated block is stable', () => {
  const rows = text.split('\n').filter((line) => /^\| `font\.[\w.]+` \|/.test(line))
  assert.equal(rows.length, 47)
  for (const row of rows) assert.match(row, /\| stable \|$/, row)
})

test('scope: BR-07 to BR-09 are quoted with their IDs', () => {
  for (const id of ['BR-07', 'BR-08', 'BR-09']) assert.match(text, new RegExp(`^> \\*\\*${id}:\\*\\* `, 'm'), id)
})

test('scope: the hierarchy H1, H2, H3, body, caption, each with its semantic tokens', () => {
  assert.match(text, /^### Hierarchy$/m)
  for (const [level, prefix] of [
    ['H1', 'h1'],
    ['H2', 'h2'],
    ['H3', 'h3'],
    ['Body', 'body'],
    ['Caption', 'caption'],
  ])
    assert.match(text, new RegExp(`^\\| ${level} \\| \`font\\.${prefix}\\.\\*\` \\|`, 'm'), level)
})

test('scope: the selection criteria cover a retro display sans, diacritics, web embedding, and email fallback', () => {
  const start = lines.indexOf('### Selection criteria')
  assert.ok(start >= 0)
  const section = lines.slice(start, lines.indexOf('## Usage rules')).join('\n')
  assert.match(section, /bold, retro display sans-serif/)
  assert.match(section, /Spanish diacritics.*áéíóú.*ñ.*¿.*¡/)
  assert.match(section, /license that covers web embedding/)
  assert.match(section, /email fallback behavior/)
})

test('scope: no TBD callout remains (REQ-037)', () => {
  assert.doesNotMatch(text, /^> \*\*TBD \(/m)
})
