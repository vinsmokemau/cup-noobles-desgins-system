// T1.3 architecture tests. Each scanner runs on the real tree, which must be clean, and on a fixture tree
// under tests/fixtures/architecture/, which proves the scanner catches its violations.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  findDomainTerms,
  findForbiddenPrimitives,
  findMisnamedComponents,
  matchDomainTerm,
  readDomainTerms,
} from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = (name: string) => join(root, 'tests/fixtures/architecture', name)
const sorted = (list: string[]) => [...list].sort()

// REQ-021 AC1
test('REQ-021: every Vue file in packages/nuxt/components/ is named Cn*.vue', () => {
  assert.deepEqual(findMisnamedComponents(root), [])
})

test('REQ-021: the naming test catches its fixture violations', () => {
  assert.deepEqual(findMisnamedComponents(fixture('naming')), [
    'packages/nuxt/components/Button.vue',
    'packages/nuxt/components/media/cnBadge.vue',
  ])
})

// REQ-020 AC3
test('REQ-020 AC3: packages/nuxt/components/ implements no forbidden primitive or focus trap', () => {
  assert.deepEqual(findForbiddenPrimitives(root), [])
})

test('REQ-020 AC3: the primitive scan catches its fixture violations and allows composing Nuxt UI', () => {
  const dir = 'packages/nuxt/components'
  assert.deepEqual(findForbiddenPrimitives(fixture('primitives')), [
    `${dir}/CnFocusTrap.vue:7 hand-rolled focus trap`,
    `${dir}/CnHandRolledDialog.vue:3 forbidden role`,
    `${dir}/CnHandRolledDialog.vue:4 forbidden role`,
    `${dir}/CnHandRolledDialog.vue:7 forbidden role`,
    `${dir}/CnHandRolledDialog.vue:8 native <dialog>`,
    `${dir}/tooltip.ts:5 forbidden role`,
    `${dir}/tooltip.ts:3 focus-trap library`,
    `${dir}/tooltip.ts:6 focus-trap library`,
  ])
})

// REQ-022 AC1
test('REQ-022 AC1: scripts/domain-terms.txt contains the initial forbidden terms', () => {
  const initial = ['product', 'cart', 'order', 'price', 'stock', 'checkout']
  initial.push('sku', 'variant', 'preorder', 'shipping', 'payment')
  const terms = readDomainTerms(root)
  for (const term of initial) assert.ok(terms.includes(term), `${term} is missing`)
})

test('REQ-022 AC1: domain terms match whole words, joined words, and plurals', () => {
  const terms = readDomainTerms(root)
  assert.equal(matchDomainTerm('addToCart', terms), 'cart')
  assert.equal(matchDomainTerm('CheckOut', terms), 'checkout')
  assert.equal(matchDomainTerm('color.products.bg', terms), 'product')
  assert.equal(matchDomainTerm('--cn-border-width', terms), undefined)
  assert.equal(matchDomainTerm('ordered', terms), undefined)
})

test('REQ-022 AC1: no component, prop, slot, event, or token name in packages/ uses a domain term', () => {
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-022 AC1: the domain-term test catches its fixture violations', () => {
  const vue = 'packages/nuxt/components'
  const mjml = 'packages/email/src/components/order-summary.mjml'
  const findings = findDomainTerms(fixture('domain-terms'), readDomainTerms(root))
  assert.deepEqual(
    sorted(findings),
    sorted([
      `${vue}/CnOptions.vue: prop "sku" contains "sku"`,
      `${vue}/CnOptions.vue: event "paymentDone" contains "payment"`,
      `${vue}/CnOptions.vue: slot "CheckOut" contains "checkout"`,
      `${vue}/CnProductTile.vue: component "CnProductTile" contains "product"`,
      `${vue}/CnProductTile.vue: prop "unitPrice" contains "price"`,
      `${vue}/CnProductTile.vue: event "add-to-cart" contains "cart"`,
      `${vue}/CnProductTile.vue: prop "selectedVariant" contains "variant"`,
      `${vue}/CnProductTile.vue: slot "checkout" contains "checkout"`,
      `${vue}/CnProductTile.vue: token "--cn-color-stock-low" contains "stock"`,
      `${mjml}: component "order-summary" contains "order"`,
      `${mjml}: slot "preorder_date" contains "preorder"`,
      'tokens/component/tile.json: token "tile.shipping.bg" contains "shipping"',
    ]),
  )
})
