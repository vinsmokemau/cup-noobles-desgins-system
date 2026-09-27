// T3.3 checks: the semantic token sources in tokens/semantic/ (REQ-011 AC2, REQ-012 AC1), the declared contrast pairs
// (REQ-015 AC1), and the forbidden combinations from SPEC.md §2.1 (REQ-015 AC3).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkTokens } from '../scripts/check-tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { tokens, problems } = checkTokens(root)
const byPath = new Map(tokens.map((t) => [t.path, t]))
const semantic = tokens.filter((t) => t.tier === 'semantic')
const readJson = (file: string): unknown => JSON.parse(readFileSync(join(root, file), 'utf8'))

// Follows whole-value references down to a raw value.
function resolveValue(path: string, seen = new Set<string>()): unknown {
  const token = byPath.get(path)
  assert.ok(token, `${path} is a token`)
  assert.ok(!seen.has(path), `${path} is not circular`)
  const alias = typeof token.value === 'string' ? token.value.match(/^\{([^{}]+)\}$/)?.[1] : undefined
  return alias === undefined ? token.value : resolveValue(alias, seen.add(path))
}

// The type of a token, following references for tokens that inherit no `$type`.
function typeOf(path: string): string | undefined {
  const token = byPath.get(path)!
  if (token.type) return token.type
  const alias = typeof token.value === 'string' ? token.value.match(/^\{([^{}]+)\}$/)?.[1] : undefined
  return alias && typeOf(alias)
}

test('§4.1: tokens/semantic/ holds exactly the listed files', () => {
  assert.deepEqual(
    readdirSync(join(root, 'tokens/semantic')).sort(),
    ['color.json', 'effect.json', 'focus.json', 'font.json', 'layout.json'].sort(),
  )
})

test('REQ-011 AC2: color.brand.primary, color.brand.secondary, and color.bg.base reference the brand primitives', () => {
  const refs = ['color.brand.primary', 'color.brand.secondary', 'color.bg.base'].map((path) => {
    const token = byPath.get(path)!
    return [path, token.tier, token.value, token.cn?.status]
  })
  assert.deepEqual(refs, [
    ['color.brand.primary', 'semantic', '{color.brand.pink}', 'stable'],
    ['color.brand.secondary', 'semantic', '{color.brand.yellow}', 'stable'],
    ['color.bg.base', 'semantic', '{color.brand.black}', 'stable'],
  ])
})

test('REQ-012 AC1: color.bg.base resolves to exactly #000000', () => {
  assert.equal(resolveValue('color.bg.base'), '#000000')
})

test('SPEC.md §2.1: labels on primary and secondary fills resolve to black', () => {
  assert.equal(resolveValue('color.text.inverted'), '#000000')
})

test('§4.4: every semantic token is stable with a brand reference, or tbd over a placeholder with its TBD IDs', () => {
  assert.deepEqual(problems, [])
  for (const token of semantic) {
    const value = resolveValue(token.path)
    if (token.cn?.status === 'stable') {
      assert.ok(['#ef80ae', '#fff488', '#000000'].includes(value as string), `${token.path} resolves to a brand hex`)
    } else {
      assert.equal(token.cn?.status, 'tbd', token.path)
      for (const id of token.cn?.tbd as string[])
        assert.ok(String(token.description).includes(id), `${token.path} description names ${id}`)
    }
  }
})

interface Pair {
  foreground: string
  background: string
  usage: string
}

test('REQ-015 AC1: contrast-pairs.json lists valid pairs, and every semantic color token is in at least one', () => {
  const pairs = readJson('tokens/contrast-pairs.json') as Pair[]
  assert.ok(Array.isArray(pairs) && pairs.length)
  const keys = new Set<string>()
  for (const pair of pairs) {
    assert.deepEqual(Object.keys(pair).sort(), ['background', 'foreground', 'usage'])
    assert.ok(['text', 'large-text', 'ui'].includes(pair.usage), `${JSON.stringify(pair)} usage`)
    for (const path of [pair.foreground, pair.background]) {
      assert.equal(byPath.get(path)?.tier, 'semantic', `${path} is a semantic token`)
      assert.equal(typeOf(path), 'color', `${path} is a color`)
    }
    const key = `${pair.foreground} ${pair.background} ${pair.usage}`
    assert.ok(!keys.has(key), `${key} is listed once`)
    keys.add(key)
  }

  const paired = new Set(pairs.flatMap((p) => [p.foreground, p.background]))
  const colors = semantic.filter((t) => typeOf(t.path) === 'color').map((t) => t.path)
  assert.ok(colors.includes('focus.ring.color'))
  for (const path of colors) assert.ok(paired.has(path), `${path} appears in a contrast pair`)
})

test('SPEC.md §2.1: the passing brand pairs are declared, and black labels sit on the pink and yellow fills', () => {
  const pairs = readJson('tokens/contrast-pairs.json') as Pair[]
  const has = (foreground: string, background: string, usage: string) =>
    pairs.some((p) => p.foreground === foreground && p.background === background && p.usage === usage)
  for (const usage of ['text', 'ui']) {
    assert.ok(has('color.brand.primary', 'color.bg.base', usage), `pink on black, ${usage}`)
    assert.ok(has('color.brand.secondary', 'color.bg.base', usage), `yellow on black, ${usage}`)
  }
  assert.ok(has('color.text.inverted', 'color.brand.primary', 'text'))
  assert.ok(has('color.text.inverted', 'color.brand.secondary', 'text'))
})

test('REQ-015 AC3: contrast-forbidden.json lists exactly the failing combinations from SPEC.md §2.1', () => {
  const forbidden = readJson('tokens/contrast-forbidden.json') as { foreground: string; background: string }[]
  // A token path resolves to its value; `#ffffff` is the white of §2.1, which no brand token holds.
  const color = (ref: string) => (ref.startsWith('#') ? ref : resolveValue(ref))
  const combos = forbidden.map((f) => `${String(color(f.foreground))} on ${String(color(f.background))}`)
  assert.deepEqual(combos.sort(), [
    '#ef80ae on #fff488', // pink on yellow: "Yellow on pink (either direction)"
    '#fff488 on #ef80ae', // yellow on pink
    '#ffffff on #ef80ae', // white on pink
    '#ffffff on #fff488', // white on yellow
  ])
  for (const f of forbidden) {
    for (const ref of [f.foreground, f.background].filter((r) => !r.startsWith('#')))
      assert.equal(byPath.get(ref)?.cn?.status, 'stable', `${ref} is a stable brand token`)
    assert.match(String((f as { reason?: unknown }).reason), /SPEC\.md §2\.1/)
  }
})

// Done when: `color.bg.base` resolves to `#000000` in a unit test, and every semantic color token appears in at least
// one pair. Both are proven above; this names the tokens the semantic tier adds, so a missing file fails loudly.
test('Done when: the semantic color, font, effect, focus, and layout groups exist', () => {
  const groups = new Set(semantic.map((t) => t.path.split('.')[0]))
  assert.deepEqual([...groups].sort(), ['color', 'effect', 'focus', 'font', 'layout'])
  for (const role of ['h1', 'h2', 'h3', 'body', 'caption'])
    for (const part of ['family', 'size', 'lineHeight', 'weight', 'letterSpacing'])
      assert.ok(byPath.has(`font.${role}.${part}`), `font.${role}.${part}`)
})
