// T4.2 checks: docs/01-foundations/color.md documents the brand colors (REQ-011), the pure-black base (REQ-012), and
// the contrast rules (REQ-015), and its generated contrast block is exactly what check-contrast reports.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast } from '../scripts/check-contrast'
import { readFrontmatter } from '../scripts/check-docs'
import { prefixes, renderContrast } from '../scripts/sync-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const file = 'docs/01-foundations/color.md'
const text = readFileSync(join(root, file), 'utf8')
const lines = text.split(/\r?\n/)
const fm = readFrontmatter(text).data as Record<string, unknown>

// The lines between a block's markers, without the blank lines sync-docs puts around the table.
function block(format: string): { tokens: string; body: string[] } {
  const open = lines.findIndex((line) => line.startsWith('<!-- cn:generated ') && line.includes(`format="${format}"`))
  assert.ok(open >= 0, `color.md has a ${format} block`)
  const close = lines.findIndex((line, i) => i > open && line.startsWith('<!-- /cn:generated -->'))
  const tokens = lines[open]!.match(/tokens="([^"]*)"/)![1]!
  return { tokens, body: lines.slice(open + 1, close).filter((line) => line.trim() !== '') }
}

test('frontmatter: draft (TBD callouts keep it from stable), BR-01 to BR-03, TBD-04 to TBD-08, tokens `color`', () => {
  assert.equal(fm.status, 'draft')
  for (const id of ['BR-01', 'BR-02', 'BR-03']) assert.ok((fm.brandRules as string[]).includes(id), id)
  assert.deepEqual(fm.tbd, ['TBD-04', 'TBD-05', 'TBD-06', 'TBD-07', 'TBD-08'])
  assert.deepEqual(fm.tokens, ['color'])
})

test('Done when: the generated contrast block matches check-contrast output', () => {
  const { tokens, body } = block('contrast')
  const report = checkContrast(root)
  assert.deepEqual(report.problems, [])
  assert.deepEqual(body, renderContrast(report, prefixes(tokens)))
  // The block holds every pair and forbidden combination that touches a color token. Component pairs, such as the
  // button's, appear in a component's doc, and in this block only when their other side is a color token.
  const touchesColor = (path: string) => path.startsWith('color.')
  const shown =
    report.pairs.filter((pair) => touchesColor(pair.foreground) || touchesColor(pair.background)).length +
    report.forbidden.filter((pair) => touchesColor(pair.foreground) || touchesColor(pair.background)).length
  assert.equal(body.length - 2, shown)
})

test('REQ-015: the contrast block shows the SPEC.md §2.1 ratios and the three forbidden combinations', () => {
  const body = block('contrast').body.join('\n')
  assert.match(
    body,
    /`color\.brand\.primary` \(`#ef80ae`\) \| `color\.bg\.base` \(`#000000`\) \| text \| 8\.37:1 .*\| pass/,
  )
  assert.match(
    body,
    /`color\.brand\.secondary` \(`#fff488`\) \| `color\.bg\.base` \(`#000000`\) \| text \| 18\.55:1 .*\| pass/,
  )
  assert.match(
    body,
    /`color\.text\.inverted` \(`#000000`\) \| `color\.brand\.primary` \(`#ef80ae`\) \| text \| 8\.37:1/,
  )
  assert.match(body, /`#ffffff` \| `color\.brand\.pink` \(`#ef80ae`\) \| — \| 2\.51:1 \| — \| forbidden/)
  assert.match(
    body,
    /`color\.brand\.yellow` \(`#fff488`\) \| `color\.brand\.pink` \(`#ef80ae`\) \| — \| 2\.22:1 \| — \| forbidden/,
  )
  assert.match(body, /`#ffffff` \| `color\.brand\.yellow` \(`#fff488`\) \| — \| 1\.13:1 \| — \| forbidden/)
  // REQ-015 AC4: no pair with a tbd token passes.
  for (const row of body.split('\n').filter((row) => row.includes('tbd'))) assert.match(row, /\| unverified \(tbd: /)
})

test('REQ-011 and REQ-012: the generated table holds the three brand colors and their roles, stable', () => {
  const body = block('table').body.join('\n')
  for (const [path, cssVar, value] of [
    ['color.brand.pink', '--cn-color-brand-pink', '#ef80ae'],
    ['color.brand.yellow', '--cn-color-brand-yellow', '#fff488'],
    ['color.brand.black', '--cn-color-brand-black', '#000000'],
    ['color.brand.primary', '--cn-color-brand-primary', '#ef80ae'],
    ['color.brand.secondary', '--cn-color-brand-secondary', '#fff488'],
    ['color.bg.base', '--cn-color-bg-base', '#000000'],
  ])
    assert.ok(body.includes(`| \`${path}\` | \`${cssVar}\` | \`${value}\` | stable |`), path)
})

test('scope: the pure-black rule (BR-03), C-05, and C-06 are explained', () => {
  assert.match(text, /^### The pure-black rule$/m)
  assert.match(text, /"must stay pure black, not dark gray\."/)
  assert.match(text, /^### Card surfaces \(C-05\)$/m)
  assert.match(text, /^### Shades and tints \(C-06\)$/m)
})

test('scope: TBD callouts for TBD-04 through TBD-08', () => {
  for (const id of ['TBD-04', 'TBD-05', 'TBD-06', 'TBD-07', 'TBD-08'])
    assert.match(text, new RegExp(`^> \\*\\*TBD \\(${id}\\):\\*\\* `, 'm'), id)
})
