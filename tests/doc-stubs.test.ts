// T2.3 checks: every doc in the SPEC.md §4.1 tree exists as a stub, and DESIGN.md groups them per REQ-001 AC4.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prose, readFrontmatter, scan } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const spec = read('SPEC.md')

// The .md files under docs/ in the §4.1 tree, read from SPEC.md so the test can't drift from the contract.
// `decisions/NNNN-*.md` is a pattern, not a file, so it is skipped.
function treeDocs(): string[] {
  const tree = spec.split('**Repository tree.**')[1]!.split('```')[1]!.split(/\r?\n/)
  const start = tree.findIndex((line) => /[├└]── docs\/$/.test(line.replace(/#.*$/, '').trimEnd()))
  const end = tree.findIndex((line, i) => i > start && /^[├└]── /.test(line))
  const dirs: string[] = []
  const files: string[] = []
  for (const line of tree.slice(start, end)) {
    const code = line.replace(/#.*$/, '')
    const entry = code.match(/^([│ ]*)[├└]── (\S+)(.*)$/)
    let rest = code
    if (entry) {
      dirs.length = entry[1]!.length / 4
      if (entry[2]!.endsWith('/')) {
        dirs.push(entry[2]!.slice(0, -1))
        rest = entry[3]!
      } else rest = `${entry[2]} ${entry[3]}`
    }
    for (const token of rest.split(/\s+/)) if (/^[\w-]+\.md$/.test(token)) files.push(`${dirs.join('/')}/${token}`)
  }
  return files.sort()
}

const docs = readdirSync(join(root, 'docs'), { recursive: true, encoding: 'utf8' })
  .map((path) => `docs/${path.replaceAll('\\', '/')}`)
  .filter((path) => path.endsWith('.md') && !path.startsWith('docs/06-governance/decisions/'))
  .sort()
const NOT_STUBS = ['docs/_template.md', 'docs/00-overview/brand-context-source.md']
const stubs = docs.filter((path) => !NOT_STUBS.includes(path))

test('Done when: the number of stubs equals the number of files listed in §4.1', () => {
  const listed = treeDocs()
  assert.ok(listed.includes('docs/02-components/atoms/sticker-frame.md'), 'continuation lines are parsed')
  assert.ok(listed.includes('docs/06-governance/decision-log.md'))
  assert.deepEqual(docs, listed, 'docs/ holds exactly the files in the §4.1 tree')
  assert.equal(stubs.length, listed.length - NOT_STUBS.length)
  assert.equal(stubs.length, 62)
})

const CALLOUT = /^> \*\*TBD:\*\* Content pending \((T\d+\.\d+)\)\.$/
const tasks = new Set([...spec.matchAll(/^- \[[ x]\] \*\*(T\d+\.\d+) — /gm)].map((m) => m[1]))

test.each(stubs)('%s is a stub: status tbd, and each section holds only the TBD callout', (path) => {
  const text = read(path)
  const fm = readFrontmatter(text)
  assert.equal(fm.data?.status, 'tbd')
  const lines = scan(path, text, fm.end, []).filter((line) => prose(line) && line.text.trim() !== '')
  const body = lines.slice(lines.findIndex((line) => line.text.startsWith('## ')))
  const sections: { heading: string; lines: string[] }[] = []
  for (const line of body) {
    if (/^#{2,3} /.test(line.text)) sections.push({ heading: line.text, lines: [] })
    else sections.at(-1)!.lines.push(line.text)
  }
  for (const { heading, lines } of sections) {
    // Usage rules holds only its two H3s (§4.2 row 6), and they hold the callout.
    if (heading === '## Usage rules') {
      assert.deepEqual(lines, [])
      continue
    }
    const [callout, ...rest] = lines
    const task = callout?.match(CALLOUT)?.[1]
    assert.ok(task && tasks.has(task), `a section starts with \`${callout}\`, not the callout for a §6 task`)
    // Owner decision (T2.3): the decision-log stub also links every ADR, for REQ-001 AC2.
    if (path === 'docs/06-governance/decision-log.md' && rest.length)
      for (const line of rest) assert.match(line, /^- \[[^\]]+\]\(decisions\/\d{4}-[\w-]+\.md\)$/)
    else assert.deepEqual(rest, [])
  }
})

test('REQ-001 AC2: the decision-log stub links every ADR file', () => {
  const log = read('docs/06-governance/decision-log.md')
  for (const adr of readdirSync(join(root, 'docs/06-governance/decisions')))
    assert.ok(log.includes(`](decisions/${adr})`), adr)
})

test('REQ-001 AC1: DESIGN.md exists at the repository root', () => {
  assert.ok(existsSync(join(root, 'DESIGN.md')))
})

test('REQ-001 AC4: DESIGN.md groups docs by layer, in order, with a one-line description per link', () => {
  const groups: [heading: string, folder: string][] = [
    ['## Overview', 'docs/00-overview/'],
    ['## Foundations', 'docs/01-foundations/'],
    ['## Components', 'docs/02-components/'],
    ['### Atoms', 'docs/02-components/atoms/'],
    ['### Molecules', 'docs/02-components/molecules/'],
    ['### Organisms', 'docs/02-components/organisms/'],
    ['## Patterns', 'docs/03-patterns/'],
    ['## Content', 'docs/04-content/'],
    ['## Email', 'docs/05-email/'],
    ['## Governance', 'docs/06-governance/'],
  ]
  const lines = read('DESIGN.md').split(/\r?\n/)
  assert.deepEqual(
    lines.filter((line) => /^#{2,3} /.test(line)),
    groups.map(([heading]) => heading),
  )
  let folder = ''
  const linked: string[] = []
  for (const line of lines) {
    const group = groups.find(([heading]) => heading === line)
    if (group) folder = group[1]
    const item = line.match(/^- \[[^\]]+\]\((docs\/[^)#]+)\): (.+)$/)
    if (line.startsWith('- ')) assert.ok(item, `\`${line}\` is a link with a one-line description`)
    if (!item) continue
    const rel = item[1]!.slice(folder.length)
    assert.ok(item[1]!.startsWith(folder) && !rel.includes('/'), `${item[1]} is listed under its own layer`)
    linked.push(item[1]!)
  }
  assert.deepEqual(
    linked.sort(),
    docs.filter((path) => path !== 'docs/_template.md'),
  )
})
