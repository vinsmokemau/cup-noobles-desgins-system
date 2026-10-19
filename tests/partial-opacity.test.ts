// T13.2 checks (C-06, ADR-0055): the layer drops Nuxt UI's partial-opacity color classes from its generated themes, so no
// translucent brand color comes from a class. What needs a browser, the rendered classes and computed colors of every
// demo, is in apps/showcase/tests/e2e/partial-opacity.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import nuxtConfig from '../packages/nuxt/nuxt.config'
import { isPartialOpacity, stripPartialOpacity } from '../packages/nuxt/utils/partial-opacity'

test('C-06: a color utility with an opacity modifier is a partial opacity, and a size with a line height is not', () => {
  for (const className of [
    'hover:bg-primary/75',
    'active:bg-secondary/75',
    'outline-primary/25',
    'ring-primary/50',
    'bg-elevated/75',
    'bg-default/75',
    'data-[state=open]:bg-elevated/50',
    'hover:before:bg-elevated/50',
    'text-primary/75',
    'outline-inverted/25',
  ])
    assert.equal(isPartialOpacity(className), true, className)
  for (const className of [
    'bg-primary',
    'hover:bg-primary',
    'text-sm/6',
    'text-base/5',
    'leading-7',
    'opacity-75',
    'focus-visible:outline-3',
    'rounded-md',
  ])
    assert.equal(isPartialOpacity(className), false, className)
})

test('C-06: the strip removes only the partial-opacity classes of a generated theme and keeps the rest', () => {
  const source = `export default {
  "base": "outline-primary/25 focus-visible:outline-3 rounded-md text-sm/6",
  "list": ["hover:bg-primary/75", "transition-colors", "data-[state=open]:bg-elevated/50 text-default"],
  "class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary outline-primary/25"
}`
  assert.equal(
    stripPartialOpacity(source),
    `export default {
  "base": "focus-visible:outline-3 rounded-md text-sm/6",
  "list": ["", "transition-colors", "text-default"],
  "class": "text-inverted bg-primary disabled:bg-primary"
}`,
  )
  // A file with nothing to remove comes back unchanged.
  const clean = 'export default {\n  "base": "rounded-md text-sm/6"\n}'
  assert.equal(stripPartialOpacity(clean), clean)
})

test('C-06: the layer runs every generated Nuxt UI theme through the strip, and leaves the other templates alone', async () => {
  const hook = (nuxtConfig.hooks as Record<string, (app: { templates: unknown[] }) => void>)['app:templates']!
  assert.equal(typeof hook, 'function', 'the layer registers app:templates')
  const templates = [
    { filename: 'ui/button.ts', getContents: async () => '"class": "bg-primary hover:bg-primary/75"' },
    { filename: 'ui/prose/h1.ts', getContents: async () => '"class": "outline-primary/25 font-bold"' },
    { filename: 'ui.css', getContents: async () => '.x { color: bg-primary/75 }' },
    { filename: 'types/ui.d.ts' },
  ] as { filename: string; getContents?: (data: unknown) => Promise<string> }[]
  hook({ templates })
  assert.equal(await templates[0]!.getContents!({}), '"class": "bg-primary"')
  assert.equal(await templates[1]!.getContents!({}), '"class": "font-bold"')
  assert.equal(await templates[2]!.getContents!({}), '.x { color: bg-primary/75 }')
  assert.equal(templates[3]!.getContents, undefined)
})
