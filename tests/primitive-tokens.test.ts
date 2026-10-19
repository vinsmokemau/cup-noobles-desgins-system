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
const TBD_FILES = ['space', 'radius', 'effect', 'z'].map((f) => `${f}.json`)
// Groups resolved by the owner since T3.2, each holding stable raw values from its ADR (§4.4 resolution, ADR-0008 §4).
const RESOLVED_FILES = {
  'focus.json': 'ADR-0009',
  'logo.json': 'ADR-0016',
  'border.json': 'ADR-0032',
  'motion.json': 'ADR-0032',
  'breakpoint.json': 'ADR-0035',
  'email.json': 'ADR-0038',
  'font.json': 'ADR-0046',
}

test('§4.1: tokens/primitive/ holds exactly the listed files', () => {
  assert.deepEqual(
    readdirSync(join(root, 'tokens/primitive')).sort(),
    ['_placeholder.json', 'color.json', ...TBD_FILES, ...Object.keys(RESOLVED_FILES)].sort(),
  )
})

test('ADR-0009: the focus primitives hold the owner values, stable, with the ADR as source', () => {
  const focus = inFile('focus.json').map((t) => [t.path, t.value, t.cn?.status, t.cn?.source])
  assert.deepEqual(focus, [
    ['focus.width.default', '3px', 'stable', 'ADR-0009'],
    ['focus.offset.default', '3px', 'stable', 'ADR-0009'],
    ['focus.style.default', 'solid', 'stable', 'ADR-0009'],
  ])
})

test('ADR-0016: the logo primitives hold the owner values, stable, with the ADR as source', () => {
  const logo = inFile('logo.json').map((t) => [t.path, t.value, t.cn?.status, t.cn?.source])
  assert.deepEqual(logo, [
    ['logo.rule.clearSpace', 0.25, 'stable', 'ADR-0016'],
    ['logo.rule.minHeight.icon', '64px', 'stable', 'ADR-0016'],
    ['logo.rule.minHeight.vertical', '80px', 'stable', 'ADR-0016'],
    ['logo.rule.minHeight.horizontal', '36px', 'stable', 'ADR-0016'],
  ])
})

test('ADR-0046 to ADR-0048: the font primitives hold the owner values, stable, with the ADR as source', () => {
  const font = inFile('font.json').map((t) => [t.path, css(t.value), t.cn?.status, t.cn?.source])
  const level = (group: string, values: (string | number)[], adr: string) =>
    ['h1', 'h2', 'h3', 'body', 'caption'].map((role, i) => [`font.${group}.${role}`, String(values[i]), 'stable', adr])
  assert.deepEqual(font, [
    ['font.family.display', "'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif", 'stable', 'ADR-0046'],
    ['font.family.body', 'Rubik, Arial, Helvetica, sans-serif', 'stable', 'ADR-0047'],
    ...level('size', ['2.5rem', '1.875rem', '1.375rem', '1rem', '0.8125rem'], 'ADR-0048'),
    ...level('lineHeight', ['2.75rem', '2.125rem', '1.625rem', '1.625rem', '1.125rem'], 'ADR-0048'),
    ...level('weight', [400, 400, 400, 400, 400], 'ADR-0048'),
    ...level('letterSpacing', ['0em', '0em', '0em', '0em', '0em'], 'ADR-0048'),
  ])
  // ADR-0046: labels are at least 14 px. ADR-0047: captions are at least 13 px, and the 300 weight is not used.
  const px = (name: string) => Number.parseFloat(String(tokens.find((t) => t.path === name)?.value)) * 16
  assert.ok(px('font.size.caption') >= 13)
  for (const name of ['font.size.h3', 'font.size.body']) assert.ok(px(name) >= 14, name)
})

test('ADR-0038: the email maximum width holds the owner value, stable, with the ADR as source', () => {
  const email = inFile('email.json').map((t) => [t.path, t.value, t.cn?.status, t.cn?.source])
  assert.deepEqual(email, [['email.width.max', '600px', 'stable', 'ADR-0038']])
})

test('REQ-011 AC1: the three brand colors are exact, stable primitives with their BR sources', () => {
  // T5.1 added the derived-pending shade tokens beside them (C-06); tests/nuxt-layer.test.ts checks those.
  const stable = inFile('color.json').filter((t) => t.cn?.status === 'stable')
  assert.deepEqual(
    inFile('color.json')
      .filter((t) => t.cn?.status !== 'stable')
      .map((t) => t.cn?.status),
    Array(22).fill('derived-pending'),
  )
  // ADR-0032 added the owner's neutral and signal colors, stable, beside the three brand ones.
  const brand = stable
    .filter((t) => t.cn?.source?.toString().startsWith('BR-'))
    .map((t) => [t.path, t.type, t.value, t.cn?.status, t.cn?.source])
  const owner = stable.filter((t) => t.cn?.source === 'ADR-0032').map((t) => [t.path, t.value])
  assert.deepEqual(owner, [
    ['color.neutral.white-soft', '#f5f5f5'],
    ['color.neutral.grey-light', '#bdbdbd'],
    ['color.neutral.grey-mid', '#8c8c8c'],
    ['color.neutral.grey-dark', '#5c5c5c'],
    ['color.neutral.grey-deep', '#3a3a3a'],
    ['color.signal.green', '#34d399'],
    ['color.signal.orange', '#ff9f43'],
    ['color.signal.red', '#ff5c5c'],
    ['color.signal.blue', '#5cc8ff'],
  ])
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
  // 38 rows in T3.2; ADR-0009 deleted the three focus placeholders (ADR-0006 policy 5, struck through in its table), and
  // ADR-0029 added the overlay backdrop amount.
  // ADR-0032 resolved TBD-11 and TBD-14, so the stroke width and the two motion placeholders are struck through in
  // ADR-0006 and deleted from _placeholder.json (policy 5).
  // ADR-0035 resolved TBD-13, so the five breakpoints and the container width are struck through and deleted too.
  // ADR-0046, ADR-0047, and ADR-0048 resolved TBD-01 to TBD-03, so the 17 typography placeholders are struck through too.
  assert.equal(rows.length, 36 - 3 - 6 - 17, 'every placeholder row in ADR-0006')
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
  const primitives = tokens.filter((t) => t.tier === 'primitive')
  const resolved = Object.keys(RESOLVED_FILES).flatMap(inFile)
  assert.equal(others.length + inFile('color.json').length + resolved.length + placeholders.size, primitives.length)

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
  const listed = tokens.filter((t) => t.cn?.status === 'tbd' || t.cn?.status === 'derived-pending')
  assert.deepEqual(
    report.tokens.map((t) => `${t.file} ${t.path} ${t.tbd.join(',')}`).sort(),
    listed.map((t) => `${t.file} ${t.path} ${(t.cn?.tbd as string[]).join(',')}`).sort(),
  )
  const derivedPending = tokens.filter((t) => t.cn?.status === 'derived-pending')
  const counts = Object.fromEntries(report.items.map((i) => [i.id, i.tokens]))
  const resolved = new Set(report.items.filter((i) => i.resolved).map((i) => i.id))
  assert.ok(resolved.has('TBD-16'), 'TBD-16 is resolved (ADR-0009)')
  for (let n = 3; n <= 16; n++) {
    const id = `TBD-${String(n).padStart(2, '0')}`
    // TBD-08 has no placeholder (ADR-0006): its tokens are the 22 derived-pending alias shades from T5.1 (C-06), and the
    // hover and pressed fills that read them (T7.2). A resolved item has no tbd tokens left (§4.4).
    if (id === 'TBD-08') assert.equal(counts[id], derivedPending.length)
    else if (resolved.has(id)) assert.equal(counts[id], 0)
    else assert.ok(counts[id]! > 0, `${id} has tokens`)
  }
  assert.equal(report.summary.tokens, tbd.length)
  assert.ok(derivedPending.length >= 22, 'the 22 alias shades are derived-pending')
  assert.equal(report.summary.derivedPendingTokens, derivedPending.length)
})
