// T15.18 checks: CnSkipLink and CnMain, their tokens, theme rules, demos, doc, and ADR (DSR-14, REQ-020, REQ-021, REQ-022,
// REQ-026, REQ-028, REQ-060, ADR-0072). What needs a browser, such as the reveal on keyboard focus, the move of focus to the main
// region, the 44 px target, the server-rendered link, and axe, is in apps/showcase/tests/e2e/skip-link.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
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
// From the T15.18 comment to the end of the file, which is where its block is.
const ownCss = css.slice(css.indexOf('T15.18 (REQ-020')).replace(/^[\s\S]*?\*\//, '')
const link = read('packages/nuxt/components/CnSkipLink.vue').replace(/\r\n/g, '\n')
const main = read('packages/nuxt/components/CnMain.vue').replace(/\r\n/g, '\n')
const linkTemplate = link.slice(link.indexOf('<template>'))
const mainTemplate = main.slice(main.indexOf('<template>'))
const docPath = 'docs/02-components/atoms/skip-link.md'
const doc = read(docPath)
const data = readFrontmatter(doc).data as Record<string, unknown>

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: both components are named Cn*, hand-roll no primitive, and use no domain term', () => {
  const files = listFiles(root, 'packages/nuxt/components', /\.vue$/)
  assert.ok(files.includes('packages/nuxt/components/CnSkipLink.vue'))
  assert.ok(files.includes('packages/nuxt/components/CnMain.vue'))
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-020 AC1, AC2: the doc is a custom atom that says why it is custom, and it is stable', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'atom')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnSkipLink')
  assert.equal(data.status, 'stable')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.deepEqual(data.tokens, ['skipLink'])
  assert.deepEqual(data.tbd, [])
  assert.match(doc, /\*\*Why custom:\*\* Nuxt UI has no skip link\./)
  assert.match(doc, /`ULink`/)
  assert.match(doc, /ADR-0072/)
})

test('ADR-0072: the choice is recorded, names the three options and the owner choice, and is in the decision log', () => {
  const adr = read('docs/06-governance/decisions/0072-skip-link-and-main.md')
  assert.match(adr, /# ADR-0072: A skip link, CnSkipLink, with a companion CnMain/)
  assert.match(adr, /\*\*A\.\*\*[\s\S]*\*\*B\.\*\*[\s\S]*\*\*C\.\*\*/)
  assert.match(adr, /The owner chose \*\*B\*\*/)
  assert.match(adr, /tabindex="-1"/)
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0072-skip-link-and-main\.md\)/)
})

test('REQ-020, A-11: CnSkipLink is a real link to `#target`, takes its text from `label`, and holds no text of its own', () => {
  assert.match(link, /label: string/)
  assert.doesNotMatch(link, /label\?: string/, 'the label is required')
  assert.match(link, /target\?: string/)
  assert.match(link, /\{ target: 'main' \}/)
  assert.match(linkTemplate, /<a class="cn-skip-link" :href="`#\$\{target\}`">\{\{ label \}\}<\/a>/)
  // No hardcoded copy, and no script needed: the reveal is CSS.
  assert.doesNotMatch(linkTemplate, />\s*[A-Za-zÁ-ú][^<{]*</)
  assert.doesNotMatch(linkTemplate, /@click|v-on|onMounted|<U[A-Z]/)
})

test('REQ-027: CnMain is the main landmark, with an id that defaults to the link target and a tabindex of -1', () => {
  assert.match(main, /id\?: string/)
  assert.match(main, /\{ id: 'main' \}/)
  assert.match(mainTemplate, /<main :id="id" tabindex="-1" class="cn-main">\s*<slot \/>\s*<\/main>/)
  assert.doesNotMatch(mainTemplate, />\s*[A-Za-zÁ-ú][^<{]*</)
})

test('ADR-0072: the tokens reference existing tokens, are stable, and open no TBD item', () => {
  assert.deepEqual(problems, [])
  for (const [path, value, type] of [
    ['skipLink.bg', '{color.brand.primary}', 'color'],
    ['skipLink.fg', '{color.text.inverted}', 'color'],
    ['skipLink.border.color', '{color.brand.primary}', 'color'],
    ['skipLink.border.width', '{border.width.interactive}', 'dimension'],
    ['skipLink.radius', '{radius.interactive}', 'dimension'],
    ['skipLink.z', '{effect.zIndex.toast}', 'number'],
    ['skipLink.focus.color', '{focus.ring.color}', 'color'],
    ['skipLink.focus.width', '{focus.ring.width}', 'dimension'],
    ['skipLink.focus.offset', '{focus.ring.offset}', 'dimension'],
    ['skipLink.focus.style', '{focus.ring.style}', 'strokeStyle'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, value, path)
    assert.equal(token?.type, type, path)
    assert.equal(token?.cn?.status, 'stable', path)
  }
})

test('REQ-016, REQ-024: the rules read only tokens that exist, hide the link until :focus-visible, and use the ADR-0009 ring', () => {
  assert.ok(ownCss.includes('.cn-skip-link {'), 'the T15.18 rules are found')
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of ownCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g)) assert.ok(names.has(name!), `${name} is a token`)
  for (const path of [
    'skipLink.bg',
    'skipLink.fg',
    'skipLink.border.color',
    'skipLink.border.width',
    'skipLink.radius',
    'skipLink.z',
    'skipLink.focus.color',
    'skipLink.focus.width',
    'skipLink.focus.offset',
    'skipLink.focus.style',
  ])
    assert.ok(ownCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  assert.doesNotMatch(ownCss, /\d+(px|rem|em|ms)\b|#[0-9a-f]{3,8}\b/i)
  assert.doesNotMatch(ownCss, /effect-glow|box-shadow|animation|transition|@keyframes/)
  // 44 px tall (the storefront's CR-36), fixed at the top, hidden above the page, and shown on :focus-visible, never :focus.
  const rule = ownCss.slice(ownCss.indexOf('.cn-skip-link {')).split('\n}')[0]!
  assert.match(rule, /@apply min-h-11;/)
  assert.match(rule, /position: fixed;/)
  assert.match(rule, /transform: translateY\(/)
  assert.match(
    ownCss,
    /\.cn-skip-link:focus-visible,\s*\.cn-skip-link\[data-cn-state='focus-visible'\] \{\s*transform: none;/,
  )
  assert.doesNotMatch(ownCss, /\.cn-skip-link:focus\b(?!-visible)/)
  assert.doesNotMatch(
    ownCss,
    /display: none|visibility: hidden/,
    'the link stays in the tab order and the accessibility tree',
  )
})

test('REQ-015: the pairs are declared and pass', () => {
  const report = checkContrast(root)
  assert.equal(report.problems.length, 0)
  for (const [foreground, background, usage] of [
    ['skipLink.fg', 'skipLink.bg', 'text'],
    ['skipLink.border.color', 'color.bg.base', 'ui'],
    ['skipLink.focus.color', 'color.bg.base', 'ui'],
  ] as const) {
    const pair = report.pairs.find((p) => p.foreground === foreground && p.background === background)
    assert.equal(pair?.result, 'pass', foreground)
    assert.equal(pair?.usage, usage, foreground)
  }
})

test('REQ-026 AC1, AC2: the doc lists the states, and its state matrix demo shows the same ones', () => {
  const expected = ['default', 'focus-visible']
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  assert.deepEqual(
    [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]),
    expected,
  )
  const demo = read('apps/showcase/demos/skip-link/states.vue')
  const shown = demo
    .match(/const states = \[([^\]]*)\]/)?.[1]
    ?.match(/'[a-z-]+'/g)
    ?.map((s) => s.slice(1, -1))
  assert.deepEqual(shown, expected)
})

test('REQ-060 AC2: the showcase uses the layer components in place of its own skip link', () => {
  const layout = read('apps/showcase/layouts/default.vue')
  assert.match(layout, /<CnSkipLink label="Skip to content" target="main-content" \/>/)
  assert.match(layout, /<CnMain id="main-content"/)
  assert.doesNotMatch(layout, /sr-only|focus:not-sr-only|<main\b/)
})

test('REQ-007, A-11: the demos use es-MX example copy with no forbidden domain word', () => {
  const terms = read('scripts/domain-terms.txt').split(/\s+/).filter(Boolean)
  for (const file of ['states.vue', 'playground.vue', 'controls.ts']) {
    const text = read(`apps/showcase/demos/skip-link/${file}`)
      .toLowerCase()
      .replaceAll(/\bvariant="[^"]*"/g, '')
    for (const term of terms)
      assert.doesNotMatch(text.replace(/\/\/.*$/gm, ''), new RegExp(`\\b${term}\\b`), `${file}: ${term}`)
  }
})

test('the playground controls match the demo props, and DESIGN.md and the inventory list the doc', async () => {
  const valid = assertControls((await import('../apps/showcase/demos/skip-link/controls')).default, 'controls.ts')
  const playground = read('apps/showcase/demos/skip-link/playground.vue')
  for (const control of valid) assert.match(playground, new RegExp(`\\b${control.name}\\??:`), control.name)
  assert.match(read('DESIGN.md'), /\(docs\/02-components\/atoms\/skip-link\.md\)/)
  assert.match(
    read('docs/02-components/inventory.md'),
    /\| \[Skip link\]\(atoms\/skip-link\.md\) \| atom \| custom \| `CnSkipLink` \| stable \| — \|/,
  )
})

test('using-the-system.md tells an app where the link and the main region go', () => {
  const using = read('docs/00-overview/using-the-system.md')
  assert.match(using, /<CnSkipLink label="Saltar al contenido" \/>/)
  assert.match(using, /<CnMain>/)
  assert.match(using, /tabindex="-1"/)
  assert.match(using, /\(\.\.\/02-components\/atoms\/skip-link\.md\)/)
})

test('a minor changeset for the layer exists (§4.8)', () => {
  // Once the "Version packages" pull request has consumed the changeset, its text lives in the changelog.
  if (!existsSync(join(root, '.changeset/cn-skip-link.md'))) {
    assert.match(read('CHANGELOG.md'), /CnSkipLink/)
    return
  }
  const changeset = read('.changeset/cn-skip-link.md')
  for (const name of ['tokens', 'nuxt', 'email'])
    assert.match(changeset, new RegExp(`'@vinsmokemau/cup-noobles-${name}': minor`))
  assert.match(changeset, /CnSkipLink/)
  assert.match(changeset, /CnMain/)
})
