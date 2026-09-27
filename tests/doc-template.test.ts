// T2.1 checks: docs/_template.md carries every heading from SPEC.md §4.2, in order, with guidance comments (REQ-003).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const template = read('docs/_template.md')

// The §4.2 table, read from SPEC.md: one row per heading, with the layers that require it.
const specRows = () => {
  const section = read('SPEC.md').split('### 4.2 Standard `.md` template')[1]!.split('### 4.3')[0]!
  const lines = section.split(/\r?\n/).filter((line) => line.startsWith('|'))
  const layers = lines[0]!
    .split('|')
    .slice(3, -1)
    .map((cell) => cell.trim())
  return lines
    .filter((line) => /^\| \d+ \|/.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim())
      const heading = cells[1]!.replace(/\s*\*\(.*\)\*$/, '')
      return { heading, layers: layers.filter((_, i) => cells[i + 2] === '●') }
    })
}

// Row 14 (Context · Decision · Consequences) is three H2 headings, as in the ADR template.
const expand = (heading: string) => heading.split(' · ')

test('§4.2 table has 16 rows', () => {
  assert.equal(specRows().length, 16)
})

test('REQ-003: the template has all 16 §4.2 headings, as H2, in order', () => {
  const h2s = [...template.matchAll(/^## (.+)$/gm)].map((match) => match[1])
  assert.deepEqual(
    h2s,
    specRows().flatMap((row) => expand(row.heading)),
  )
})

test('the H1 equals the frontmatter title', () => {
  const title = template.match(/^title: (.+)$/m)?.[1]
  const h1s = [...template.matchAll(/^# (.+)$/gm)].map((match) => match[1])
  assert.deepEqual(h1s, [title])
})

test('Usage rules has the When to use and When not to use H3s', () => {
  const usage = template.split('## Usage rules')[1]!.split(/^## /m)[0]!
  assert.deepEqual(
    [...usage.matchAll(/^### (.+)$/gm)].map((match) => match[1]),
    ['When to use', 'When not to use'],
  )
})

test('every heading is followed by a guidance comment naming the layers that require it', () => {
  const sections = template.split(/^## /m).slice(1)
  const required = new Map(specRows().flatMap((row) => expand(row.heading).map((h) => [h, row.layers] as const)))
  for (const section of sections) {
    const heading = section.split(/\r?\n/)[0]!
    const body = section.slice(heading.length).trim()
    assert.ok(body.startsWith('<!--'), `${heading} has no guidance comment`)
    const named = body.match(/Required for: ([a-z, ]+)\./)?.[1]?.split(', ')
    assert.deepEqual(named, required.get(heading), `${heading} names the wrong layers`)
  }
})

test('the template introduces no hex color literal (REQ-004 AC2)', () => {
  assert.doesNotMatch(template, /#[0-9a-fA-F]{3,8}\b/)
})
