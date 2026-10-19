// T10.1 checks: docs/05-email/email-foundations.md has the six sections REQ-040 AC1 lists, and every fallback in its
// map names a token that exists in email-tokens.json (REQ-040 AC2). `check-docs` covers the headings, the frontmatter,
// and the hex rule; these tests cover what it can't: which sections the doc has, which tokens it names, and that the
// doc stays a draft until the owner approves it (REQ-009, REQ-037).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from '../scripts/check-docs'
import { flatTokens } from './lib/flat-tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const text = readFileSync(join(root, 'docs/05-email/email-foundations.md'), 'utf8')
const section = (heading: string, level = 2) =>
  text
    .split(new RegExp(`^${'#'.repeat(level)} ${heading}\\s*$`, 'm'))[1]
    ?.split(new RegExp(`^#{1,${level}} `, 'm'))[0] ?? ''

test('REQ-040 AC1: the doc has a section for each of the six client limitations', () => {
  for (const heading of [
    'Font fallback stack',
    'Glow fallback',
    'Radius tolerance',
    'Dark-mode inversion',
    'Images-off behavior',
    'Maximum width',
  ]) {
    assert.ok(section(heading, 3).trim().length > 0, `${heading} has content`)
  }
  assert.doesNotMatch(text, /Content pending/, 'no section is still pending')
})

test('REQ-040 AC1: the glow fallback is a solid thick border, and the dark-mode section names both brand colors', () => {
  const glow = section('Glow fallback', 3)
  assert.match(glow, /solid/)
  assert.match(glow, /`border\.width\.button`/)
  assert.match(glow, /box-shadow/)
  const dark = section('Dark-mode inversion', 3)
  assert.match(dark, /`color\.brand\.black`/)
  assert.match(dark, /`color\.brand\.primary`/)
  assert.match(dark, /BR-03/)
  assert.match(dark, /BR-01/)
})

test('REQ-040 AC1: images-off behavior covers alt text and a text fallback for the logo', () => {
  const images = section('Images-off behavior', 3)
  assert.match(images, /`alt`/)
  assert.match(images, /text fallback/)
  assert.match(images, /logo/i)
})

test('REQ-040 AC1, A-08: the maximum width is 600 px, chosen by the owner in ADR-0038', () => {
  assert.match(section('Maximum width', 3), /600 px/)
  assert.match(section('Maximum width', 3), /A-08/)
  assert.match(section('Maximum width', 3), /ADR-0038/)
  assert.match(section('Maximum width', 3), /`layout\.email\.width\.max`/)
  assert.match(text, /^- 0\.1\.0 — Maximum width of 600 px chosen by the owner[^\n]* — ADR-0038$/m)
  const adr = readFileSync(join(root, 'docs/06-governance/decisions/0038-email-maximum-width.md'), 'utf8')
  assert.match(adr, /The owner chose A, 600 px/)
})

test('REQ-040 AC2: every token in the fallback map exists in email-tokens.json', async () => {
  const flat = await flatTokens<unknown>()
  const map = section('Fallback map', 3)
  const rows = map
    .split('\n')
    .filter((line) => /^\| /.test(line) && !/^\|---/.test(line))
    .slice(1)
  assert.ok(rows.length >= 10, 'the map lists the fallbacks')
  for (const row of rows) {
    const cells = row.split('|').map((cell) => cell.trim())
    const tokens = [...cells[2]!.matchAll(/`([^`]+)`/g)].map((m) => m[1]!)
    assert.ok(tokens.length > 0, `row "${cells[1]}" names a token`)
    for (const token of tokens) assert.ok(token in flat, `"${token}" (${cells[1]}) is a token`)
  }
})

test('REQ-040 AC2: every token the doc names in a code span is in email-tokens.json', async () => {
  const flat = await flatTokens<unknown>()
  const prose = text.replace(/<!-- cn:generated[\s\S]*?<!-- \/cn:generated -->/g, '').replace(/```[\s\S]*?```/g, '')
  const names = [...prose.matchAll(/`([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9-]+)+)`/g)].map((m) => m[1]!)
  // Dotted names in code spans that are not token paths: file names and the build file.
  const files = new Set(['email-tokens.json', 'build.ts'])
  const tokens = [...new Set(names)].filter((name) => !files.has(name) && !/\.(json|ts|md)$/.test(name))
  assert.ok(tokens.length >= 10)
  for (const token of tokens) assert.ok(token in flat, `"${token}" is a token`)
})

test('REQ-009, REQ-037: the doc is a draft with its TBD items listed, and carries no hex literal or typeface name', () => {
  const data = readFrontmatter(text).data as Record<string, unknown>
  assert.equal(data.status, 'draft')
  // ADR-0039: the owner approved the rules, so no Draft callout remains; the doc stays a draft until the owner moves it to stable.
  assert.doesNotMatch(text, /^> \*\*Draft:\*\*/m)
  assert.match(text, /^- 0\.1\.0 — Rules approved by the owner[^\n]* — ADR-0039$/m)
  assert.equal(data.layer, 'email')
  // T13.1: TBD-01 and TBD-03 are resolved (ADR-0046, ADR-0048), so their callouts are gone.
  // T13.2: TBD-12 is resolved (ADR-0051), so its callouts are gone; email keeps its solid border in place of the glow.
  // T13.3: TBD-10 is resolved (ADR-0050), so the doc lists no TBD item and has no callout.
  assert.deepEqual(data.tbd, [])
  assert.doesNotMatch(section('Open items'), /TBD-(?:09|10)/)
  assert.ok(!(data.tbd as string[]).includes('TBD-12'))
  assert.doesNotMatch(text, /\*\*TBD \(TBD-12\)/)
  const prose = text.replace(/<!-- cn:generated[\s\S]*?<!-- \/cn:generated -->/g, '')
  assert.doesNotMatch(prose, /#[0-9a-fA-F]{3,8}\b/)
  // ADR-0004 names the MJML default; the doc may say "MJML default font", never the family itself.
  assert.doesNotMatch(prose, /\b(?:Ubuntu|Roboto|Segoe)\b/)
  // T13.1 (ADR-0058): the fallback stack section is the one place the doc names the fallback families.
  const stackSection = section('Font fallback stack', 3)
  assert.match(stackSection, /'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif/)
  assert.match(stackSection, /Rubik, Arial, Helvetica, sans-serif/)
  const outside = prose.replace(stackSection, '').replace(section('Changelog'), '')
  assert.doesNotMatch(outside, /\b(?:Helvetica|Arial)\b/)
})
