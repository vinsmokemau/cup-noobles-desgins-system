// T4.3 checks: docs/01-foundations/typography.md quotes BR-07 to BR-09, sets out the BR-08 hierarchy and the typeface
// selection criteria, keeps TBD-01 to TBD-03 as callouts (REQ-005), and names no font family outside a TBD callout.
// Owner decision (T4.3): the ADR-0006 placeholder stack inside the generated `font` block is allowed, because every one
// of those rows is marked tbd.
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

// CSS generic families are keywords, not typefaces; BR-07 itself says "sans-serif".
const GENERIC = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'math',
  'emoji',
  'fangsong',
])
const placeholder = JSON.parse(readFileSync(join(root, 'tokens/primitive/_placeholder.json'), 'utf8'))
const stack = placeholder.placeholder.font.family.sans.$value as string[]
// Every family in the placeholder stack, plus the MJML default stack from ADR-0004.
const FAMILIES = [...new Set([...stack, 'Ubuntu', 'Helvetica', 'Arial'])].filter((name) => !GENERIC.has(name))

// The lines that sit outside TBD callouts and outside generated blocks.
function prose(): { n: number; text: string }[] {
  const out: { n: number; text: string }[] = []
  let generated = false
  let callout = false
  for (const [i, line] of lines.entries()) {
    if (line.startsWith('<!-- cn:generated ')) generated = true
    if (generated) {
      if (line.startsWith('<!-- /cn:generated -->')) generated = false
      continue
    }
    if (!line.startsWith('>')) callout = false
    else if (/^> \*\*TBD \(TBD-\d{2}\):\*\* /.test(line)) callout = true
    else if (line.trim() === '>') callout = false
    if (!callout) out.push({ n: i + 1, text: line })
  }
  return out
}

test('frontmatter: draft, BR-07 to BR-09, TBD-01 to TBD-03, tokens `font`', () => {
  assert.equal(fm.status, 'draft')
  assert.deepEqual(fm.brandRules, ['BR-07', 'BR-08', 'BR-09'])
  assert.deepEqual(fm.tbd, ['TBD-01', 'TBD-02', 'TBD-03'])
  assert.deepEqual(fm.tokens, ['font'])
})

test('Done when: no font family name appears outside a TBD callout', () => {
  assert.ok(FAMILIES.length >= 10, 'the placeholder stack was read')
  for (const { n, text: line } of prose()) {
    for (const name of FAMILIES) assert.ok(!line.includes(name), `line ${n} names the font family ${name}`)
    // A literal font-family declaration must use a token variable.
    const decl = line.match(/font-family:\s*([^;]+)/)
    if (decl) assert.match(decl[1]!, /^var\(--cn-font-[\w-]+\)$/, `line ${n}`)
  }
})

test('owner decision: placeholder families appear only in tbd rows of the generated block', () => {
  const rows = lines.filter((line) => stack.some((name) => !GENERIC.has(name) && line.includes(name)))
  assert.ok(rows.length > 0)
  for (const row of rows) assert.match(row, /^\| `font\.[\w.]+` \| .* \| tbd \(TBD-0[12]\) \|$/)
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

test('scope: TBD callouts for TBD-01 through TBD-03', () => {
  for (const id of ['TBD-01', 'TBD-02', 'TBD-03'])
    assert.match(text, new RegExp(`^> \\*\\*TBD \\(${id}\\):\\*\\* `, 'm'), id)
})
