// T15.2 checks: CnKeyValueList, its tokens, theme rules, demos, doc, and ADR (DSR-02, REQ-020, REQ-021, REQ-022, REQ-026,
// ADR-0065). What needs a browser, such as the stacked layout, the columns, the overflow, and axe, is in
// apps/showcase/tests/e2e/key-value-list.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast } from '../scripts/check-contrast'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'
import { findDomainTerms, findForbiddenPrimitives, findMisnamedComponents, listFiles } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const css = read('packages/nuxt/assets/css/main.css').replace(/\r\n/g, '\n')
// From the T15.2 comment to the T8.5 comment, which is the next block in the file.
const ownCss = css.slice(css.indexOf('T15.2 (REQ-020'), css.indexOf('T8.5 (REQ-020')).replace(/^[\s\S]*?\*\//, '')
const component = read('packages/nuxt/components/CnKeyValueList.vue')
const template = component.slice(component.indexOf('<template>'))
const docPath = 'docs/02-components/molecules/key-value-list.md'
const doc = read(docPath)
const data = readFrontmatter(doc).data as Record<string, unknown>

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: CnKeyValueList is named Cn*, hand-rolls no primitive, and uses no domain term', () => {
  assert.ok(
    listFiles(root, 'packages/nuxt/components', /\.vue$/).includes('packages/nuxt/components/CnKeyValueList.vue'),
  )
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-020 AC1, AC2: the doc is a custom molecule that says why it is custom, and it is stable', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'molecule')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnKeyValueList')
  assert.equal(data.status, 'stable')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.deepEqual(data.tbd, [])
  assert.match(doc, /\*\*Why custom:\*\* Nuxt UI has no equivalent\./)
  assert.match(doc, /UTable/)
})

test('ADR-0065: the choice is recorded, names what was checked, and is in the decision log', () => {
  const adr = read('docs/06-governance/decisions/0065-key-value-list-custom.md')
  assert.match(adr, /# ADR-0065: The key-value list is a custom component/)
  assert.match(adr, /`UTable`/)
  assert.match(adr, /no description list|No component renders a description list/)
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0065-key-value-list-custom\.md\)/)
  assert.match(doc, /ADR-0065/)
})

test('the Nuxt UI check holds: no component of the pinned version renders a description list', () => {
  // ADR-0065 rests on this. If a Nuxt UI release adds one, this test fails and the decision is reviewed (C-01).
  const store = join(root, 'node_modules/.pnpm')
  const installed = readdirSync(store).filter((name) => name.startsWith('@nuxt+ui@'))
  assert.ok(installed.length > 0, '@nuxt/ui is installed')
  for (const name of installed) {
    const folder = join(store, name, 'node_modules/@nuxt/ui/dist/runtime/components')
    const files = readdirSync(folder).filter((file) => file.endsWith('.vue'))
    assert.ok(files.length > 0, `${name} has components`)
    for (const file of files) {
      const text = readFileSync(join(folder, file), 'utf8')
      assert.doesNotMatch(text, /<d[ltd]\b|\bh\('d[ltd]'|\bas="d[ltd]"/, `${name}/${file}`)
    }
  }
})

test('REQ-020 AC2, A-11: the list is a description list of items, holds no text of its own, and has a value slot', () => {
  assert.match(component, /label: string/)
  assert.match(component, /value: string/)
  assert.match(component, /items: Item\[\]/)
  assert.match(component, /value\?\(props: \{ item: Item; index: number \}\): unknown/)
  // <dl> with a <dt> and a <dd> in a <div> per row, built only from the items.
  assert.match(template, /<dl v-if="items\.length" class="cn-key-value-list">/)
  assert.match(template, /<div v-for="\(item, index\) in items" :key="index" class="cn-key-value-list__row">/)
  assert.match(template, /<dt class="cn-key-value-list__label">\{\{ item\.label \}\}<\/dt>/)
  assert.match(template, /<slot name="value" :item="item" :index="index">\{\{ item\.value \}\}<\/slot>/)
  assert.ok(template.indexOf('<dt') < template.indexOf('<dd'))
  // No text node of its own, and nothing focusable, no role, no aria attribute.
  assert.doesNotMatch(template, />\s*[A-Za-zÁ-ú][^<{]*</)
  assert.doesNotMatch(template, /<(a|button|input|select|textarea)\b|tabindex|role=|aria-/)
  // Nuxt UI is not needed, so the list adds no dependency on a primitive.
  assert.doesNotMatch(template, /<U[A-Z]/)
})

test('ADR-0065: the tokens reference semantic tokens, are stable, and open no TBD item', () => {
  assert.deepEqual(problems, [])
  for (const [path, value, type] of [
    ['keyValueList.bg', '{color.bg.base}', 'color'],
    ['keyValueList.label', '{color.text.muted}', 'color'],
    ['keyValueList.value', '{color.text.default}', 'color'],
    ['keyValueList.divider.color', '{color.border.default}', 'color'],
    ['keyValueList.divider.width', '{border.width.interactive}', 'dimension'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, value, path)
    assert.equal(token?.type, type, path)
    assert.equal(token?.cn?.status, 'stable', path)
  }
})

test('REQ-016: the rules read only tokens that exist, use the spacing scale, and draw no glow, fill, or raw value', () => {
  assert.ok(ownCss.includes('.cn-key-value-list {'), 'the T15.2 rules are found')
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'keyValueList.bg',
    'keyValueList.label',
    'keyValueList.value',
    'keyValueList.divider.color',
    'keyValueList.divider.width',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  // The spacing is the md step between rows, and the sm step between a stacked label and value (ADR-0049).
  const row = ownCss.slice(ownCss.indexOf('.cn-key-value-list__row {')).split('\n}')[0]!
  assert.match(row, /gap: var\(--cn-space-sm\)/)
  assert.match(row, /padding-block: var\(--cn-space-md\)/)
  assert.doesNotMatch(ownCss, /\d+(px|rem|em|ms)\b|#[0-9a-f]{3,8}\b/i)
  assert.doesNotMatch(ownCss, /effect-glow|box-shadow|animation|transition|@keyframes/)
  // At 360 px a row has one column. From the `md` breakpoint it has two, one third and two thirds (ADR-0035).
  assert.match(row, /grid-template-columns: minmax\(0, 1fr\);/)
  assert.match(row, /@variant md \{\s*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 2fr\);/)
  // Long words break inside their column.
  assert.match(ownCss, /\.cn-key-value-list__label \{[^}]*overflow-wrap: anywhere;/)
  assert.match(ownCss, /\.cn-key-value-list__value \{[^}]*overflow-wrap: anywhere;/)
})

test('REQ-015: the pairs are declared and pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, usage] of [
    ['keyValueList.label', 'text'],
    ['keyValueList.value', 'text'],
    ['keyValueList.divider.color', 'ui'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === 'keyValueList.bg')
    assert.equal(pair?.result, 'pass', foreground)
    assert.equal(pair?.usage, usage, foreground)
  }
})

test('REQ-026 AC1, AC2: the doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = ['default', 'empty']
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  assert.deepEqual(
    [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]),
    expected,
  )
  const demo = read('apps/showcase/demos/key-value-list/states.vue')
  const shown = demo
    .match(/const states = \[([^\]]*)\]/)?.[1]
    ?.match(/'[a-z-]+'/g)
    ?.map((s) => s.slice(1, -1))
  assert.deepEqual(shown, expected)
  // The non-interactive states are explained, not listed.
  assert.match(doc, /no hover, focus-visible, active, or disabled state/)
})

test('REQ-007, A-11: the demos use es-MX example copy with no forbidden domain word', () => {
  const terms = read('scripts/domain-terms.txt').split(/\s+/).filter(Boolean)
  for (const file of ['states.vue', 'playground.vue', 'controls.ts']) {
    const text = read(`apps/showcase/demos/key-value-list/${file}`)
      .toLowerCase()
      .replaceAll(/\bvariant="[^"]*"/g, '')
    for (const term of terms)
      assert.doesNotMatch(text.replace(/\/\/.*$/gm, ''), new RegExp(`\\b${term}\\b`), `${file}: ${term}`)
  }
})

test('the playground controls match the demo props, and DESIGN.md and the inventory list the doc', async () => {
  const valid = assertControls((await import('../apps/showcase/demos/key-value-list/controls')).default, 'controls.ts')
  const playground = read('apps/showcase/demos/key-value-list/playground.vue')
  for (const control of valid) assert.match(playground, new RegExp(`\\b${control.name}\\??:`), control.name)
  assert.match(read('DESIGN.md'), /\(docs\/02-components\/molecules\/key-value-list\.md\)/)
  assert.match(
    read('docs/02-components/inventory.md'),
    /\| \[Key-value list\]\(molecules\/key-value-list\.md\) \| molecule \| custom \| `CnKeyValueList` \| stable \| — \|/,
  )
})

test('a minor changeset for the layer exists (§4.8)', () => {
  const changeset = read('.changeset/key-value-list.md')
  for (const name of ['tokens', 'nuxt', 'email'])
    assert.match(changeset, new RegExp(`'@vinsmokemau/cup-noobles-${name}': minor`))
  assert.match(changeset, /CnKeyValueList/)
})
