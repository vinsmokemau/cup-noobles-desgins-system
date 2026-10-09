// T7.2 checks: the button's tokens, theme, demos, and doc (REQ-023, REQ-024, REQ-026, REQ-016). What needs a browser,
// such as the computed label color, the keyboard, and axe, is in apps/showcase/tests/e2e/button.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import appConfig from '../packages/nuxt/app.config'
import { checkContrast } from '../scripts/check-contrast'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const doc = read('docs/02-components/atoms/button.md')
const css = read('packages/nuxt/assets/css/main.css')

// The rules of the button in main.css: from its first comment to the end of the file.
const buttonCss = css.slice(css.indexOf('T7.2 (REQ-023, REQ-024)') - 3)

test('REQ-023 AC2: the radius, the outline width, and the glow are component tokens that reference semantic tokens', () => {
  assert.deepEqual(problems, [])
  for (const [path, semantic] of [
    ['radius.button', 'radius.interactive'],
    ['border.width.button', 'border.width.interactive'],
    ['effect.glow.button', 'effect.glow.interactive'],
  ] as const) {
    const token = byPath.get(path)
    assert.equal(token?.tier, 'component', path)
    assert.equal(token?.value, `{${semantic}}`, path)
    assert.equal(byPath.get(semantic)?.tier, 'semantic', semantic)
    // Their values are TBD-10, TBD-11, and TBD-12, so they follow placeholders and are never stable.
    assert.equal(token?.cn?.status, 'tbd', path)
  }
})

test('REQ-023 AC2: the button rules read the component tokens (cn/no-raw-values lints the rest, REQ-016)', () => {
  for (const path of ['radius.button', 'border.width.button', 'effect.glow.button'])
    assert.ok(buttonCss.includes(`var(${cssVariable(path)})`), `${path} is read`)
  // Every token the rules read exists: a typo would silently drop a declaration.
  const names = new Set(tokens.map((t) => cssVariable(t.path)))
  for (const [, name] of buttonCss.matchAll(/var\((--cn-[a-z0-9-]+)\)/g))
    assert.ok(names.has(name!), `${name} is a token`)
})

test('REQ-023 AC3: the label on a pink fill is black, and the contrast pair is declared and passes', () => {
  assert.equal(checkContrast(root).problems.length, 0)
  const pair = checkContrast(root).pairs.find(
    (p) => p.foreground === 'button.primary.fg' && p.background === 'button.primary.bg',
  )
  assert.ok(pair, 'the pair is declared')
  assert.equal(pair.foregroundValue, '#000000')
  assert.equal(pair.backgroundValue, '#ef80ae')
  assert.equal(pair.result, 'pass')
  assert.equal(pair.ratio, 8.37)
  // Every label on a brand fill, in every state, and the ghost label on the page, are declared and verified.
  for (const [foreground, background] of [
    ['button.primary.fg', 'button.primary.bgHover'],
    ['button.primary.fg', 'button.primary.bgActive'],
    ['button.secondary.fg', 'button.secondary.bg'],
    ['button.secondary.fg', 'button.secondary.bgHover'],
    ['button.secondary.fg', 'button.secondary.bgActive'],
    ['button.ghost.fg', 'color.bg.base'],
    ['button.ghost.fgHover', 'button.ghost.bgHover'],
    ['button.ghost.fgHover', 'button.ghost.bgActive'],
  ]) {
    const found = checkContrast(root).pairs.find((p) => p.foreground === foreground && p.background === background)
    assert.equal(found?.result, 'pass', `${foreground} on ${background}`)
  }
})

test('REQ-024 AC1: the focus ring comes from the focus tokens, and it is an outline, not the glow', () => {
  for (const part of ['color', 'width', 'offset', 'style'])
    assert.equal(byPath.get(`button.focus.${part}`)?.value, `{focus.ring.${part}}`, part)
  const focus = buttonCss.slice(buttonCss.indexOf('.cn-button:is(:focus-visible'))
  assert.match(focus.slice(0, focus.indexOf('}')), /outline:[^;]*--cn-button-focus-width[^;]*--cn-button-focus-color/)
  assert.doesNotMatch(focus.slice(0, focus.indexOf('}')), /box-shadow/)
})

test('REQ-023 AC5: a disabled button has no glow', () => {
  assert.match(
    buttonCss,
    /\.cn-button:is\(:disabled, \[aria-disabled='true'\]\):not\(\.cn-button--loading\) \{\s*box-shadow: none;/,
  )
})

test('REQ-023 AC1: the theme maps the three brand variants to Nuxt UI props, and doc and theme agree', () => {
  const button = appConfig.ui.button
  assert.equal(button.slots.base, 'cn-button')
  assert.deepEqual(button.compoundVariants, [
    { color: 'primary', variant: 'solid', class: 'cn-button--primary' },
    { color: 'secondary', variant: 'solid', class: 'cn-button--secondary' },
    { color: 'primary', variant: 'ghost', class: 'cn-button--ghost' },
  ])
  assert.equal(button.variants.loading.true, 'cn-button--loading')
  const variants = doc.slice(doc.indexOf('## Variants'), doc.indexOf('## States'))
  for (const row of [
    '| `primary` | `color="primary" variant="solid"` |',
    '| `secondary` | `color="secondary" variant="solid"` |',
    '| `ghost` | `color="primary" variant="ghost"` |',
  ])
    assert.ok(variants.includes(row), row)
})

test('REQ-023 AC4, REQ-026 AC1: the doc lists the six states, and the state matrix demo shows the same six', () => {
  const states = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  const listed = [...states.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
  assert.deepEqual(listed, ['default', 'hover', 'focus-visible', 'active', 'disabled', 'loading'])
  const demo = read('apps/showcase/demos/button/states.vue')
  const shown = demo
    .match(/const states = \[([^\]]*)\]/)?.[1]
    ?.match(/'[a-z-]+'/g)
    ?.map((s) => s.slice(1, -1))
  assert.deepEqual(shown, listed)
})

test('the doc is a draft that lists its demos and names the tokens it renders', () => {
  const data = readFrontmatter(doc).data as Record<string, unknown>
  assert.equal(data.status, 'draft', 'TBD tokens keep the doc a draft')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.equal(data.source, 'nuxt-ui')
  assert.equal(data.nuxtUi, 'UButton')
  for (const id of ['TBD-08', 'TBD-10', 'TBD-11', 'TBD-12']) assert.ok((data.tbd as string[]).includes(id), id)
})

test('REQ-055: the playground controls are a valid schema that the playground demo declares as props', async () => {
  const { default: controls } = await import('../apps/showcase/demos/button/controls')
  const valid = assertControls(controls, 'controls.ts')
  const playground = read('apps/showcase/demos/button/playground.vue')
  for (const control of valid) assert.match(playground, new RegExp(`\\b${control.name}\\??:`), control.name)
})
