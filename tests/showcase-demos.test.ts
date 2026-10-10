// T7.1 checks: the pure logic of the component page infrastructure (REQ-055, REQ-026 AC2). The pages, the frame, the copy
// button, and the dummy demo run in a real browser: apps/showcase/tests/e2e/demos.spec.ts (`pnpm test:all`).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  assertControls,
  defaultValues,
  demoRoute,
  demoRoutes,
  splitAfterSections,
  VIEWPORTS,
  type Control,
} from '../apps/showcase/lib/demos'
import { prerenderRoutes } from '../apps/showcase/lib/doc-routes'
import { scanDemos } from '../apps/showcase/lib/doc-scan'

test('REQ-055 AC3: the viewports are the reference widths of A-09', () => {
  assert.deepEqual([...VIEWPORTS], [360, 768, 1280])
})

test('a demo has an isolated route, and the static build writes one for every listed demo', () => {
  assert.equal(demoRoute('button', 'states'), '/_demo/button/states')
  const demos = { button: ['states', 'playground'], link: ['states'] }
  assert.deepEqual(demoRoutes(demos), ['/_demo/button/states', '/_demo/button/playground', '/_demo/link/states'])
  const routes = prerenderRoutes([], demos)
  for (const route of demoRoutes(demos)) assert.ok(routes.includes(route), route)
  assert.deepEqual(demoRoutes({}), [])
})

test('REQ-055 AC1: each control starts at its default, or at the empty value of its type', () => {
  const controls: Control[] = [
    { name: 'label', type: 'string', default: 'Save' },
    { name: 'note', type: 'string' },
    { name: 'size', type: 'number' },
    { name: 'tone', type: 'select', options: ['calm', 'loud'] },
    { name: 'disabled', type: 'boolean' },
    { name: 'loading', type: 'boolean', default: true },
  ]
  assert.deepEqual(defaultValues(controls), {
    label: 'Save',
    note: '',
    size: 0,
    tone: 'calm',
    disabled: false,
    loading: true,
  })
})

test('a controls schema names each prop once, with a type and, for a select, options', () => {
  const ok = [
    { name: 'label', type: 'string', default: 'Save' },
    { name: 'tone', type: 'select', options: ['a', 'b'], default: 'b' },
  ]
  assert.equal(assertControls(ok, 'controls.ts'), ok)
  assert.throws(() => assertControls({}, 'controls.ts'), /must be an array/)
  assert.throws(() => assertControls([{ type: 'string' }], 'controls.ts'), /needs a prop name/)
  assert.throws(
    () => assertControls([{ name: 'a', type: 'color' }], 'controls.ts'),
    /use string, number, boolean, or select/,
  )
  assert.throws(
    () => assertControls([{ name: 'a', type: 'select' }], 'controls.ts'),
    /non-empty list of string options/,
  )
  assert.throws(
    () => assertControls([{ name: 'a', type: 'select', options: ['x'], default: 'y' }], 'controls.ts'),
    /non-option/,
  )
  assert.throws(() => assertControls([{ name: 'a', type: 'boolean', default: 'yes' }], 'controls.ts'), /not a boolean/)
  assert.throws(
    () =>
      assertControls(
        [
          { name: 'a', type: 'string' },
          { name: 'a', type: 'string' },
        ],
        'controls.ts',
      ),
    /repeats the prop "a"/,
  )
})

const h2 = (text: string) => ['h2', { id: text.toLowerCase().replaceAll(' ', '-') }, text]
const p = (text: string) => ['p', {}, text]

test('REQ-055: the body is cut where the States and Code reference sections end', () => {
  const body = [
    h2('Purpose'),
    p('a'),
    h2('States'),
    p('b'),
    ['h3', { id: 'sub' }, 'Sub'],
    p('c'),
    h2('Usage rules'),
    p('d'),
    h2('Code reference'),
    p('e'),
    h2('Open items'),
    p('f'),
  ]
  const segments = splitAfterSections(body, ['States', 'Code reference'])
  assert.equal(segments.length, 3)
  assert.deepEqual(
    segments.map((segment) => segment.panels),
    [['States'], ['Code reference'], []],
  )
  assert.deepEqual(
    segments.flatMap((segment) => segment.nodes),
    body,
    'no node is lost or moved',
  )
  assert.deepEqual(segments[0]!.nodes.at(-1), p('c'), 'the first piece ends with the States section')
  assert.deepEqual(segments[1]!.nodes[0], h2('Usage rules'))
  assert.deepEqual(segments[2]!.nodes[0], h2('Open items'))
})

test('a heading that ends the doc, or is missing, still gets its panel', () => {
  const last = [h2('Purpose'), p('a'), h2('Code reference'), p('b')]
  const atEnd = splitAfterSections(last, ['States', 'Code reference'])
  assert.deepEqual(atEnd.at(-1)!.panels, ['Code reference', 'States'])
  const none = splitAfterSections([p('only')], ['States'])
  assert.equal(none.length, 1)
  assert.deepEqual(none[0]!.panels, ['States'])
})

function fixture(frontmatter: string, files: string[]) {
  const root = mkdtempSync(join(tmpdir(), 'cn-scan-demos-'))
  mkdirSync(join(root, 'docs/02-components/atoms'), { recursive: true })
  writeFileSync(join(root, 'docs/02-components/atoms/dummy.md'), `---\nslug: dummy\n${frontmatter}\n---\n\n# Dummy\n`)
  for (const file of files) {
    mkdirSync(join(root, 'demos/dummy'), { recursive: true })
    writeFileSync(join(root, 'demos/dummy', file), '')
  }
  return root
}

test('REQ-055: the registry is driven by the frontmatter, and a listed demo with no file fails the build', () => {
  const ok = fixture('demos: [states, playground]', ['states.vue', 'playground.vue', 'controls.ts'])
  const none = fixture('title: Dummy', [])
  const missing = fixture('demos: [states, hover]', ['states.vue'])
  const noControls = fixture('demos: [playground]', ['playground.vue'])
  try {
    assert.deepEqual(scanDemos(join(ok, 'docs'), join(ok, 'demos')), { dummy: ['states', 'playground'] })
    assert.deepEqual(scanDemos(join(none, 'docs'), join(none, 'demos')), {})
    assert.throws(
      () => scanDemos(join(missing, 'docs'), join(missing, 'demos')),
      /demos\/dummy\/hover\.vue does not exist/,
    )
    assert.throws(
      () => scanDemos(join(noControls, 'docs'), join(noControls, 'demos')),
      /demos\/dummy\/controls\.ts does not exist/,
    )
  } finally {
    for (const root of [ok, none, missing, noControls]) rmSync(root, { recursive: true, force: true })
  }
})

test('the real docs list the demos that exist, so the real build has a demo route for each', () => {
  // T7.2 adds the button's, T7.3 the badge's, the icon's, and the link's, T7.4 the input's, the select's, and the textarea's, T7.5 the checkbox's, the radio group's, and the switch's, T7.6 the progress bar's, the separator's, and the skeleton's, T7.7 the logo's, and T7.8 the sparkle's and the sticker frame's. Each component task adds its own entry here, and no doc lists a demo that has no file.
  assert.deepEqual(
    scanDemos(join(import.meta.dirname, '../docs'), join(import.meta.dirname, '../apps/showcase/demos')),
    {
      badge: ['states', 'playground'],
      button: ['states', 'playground'],
      checkbox: ['states', 'playground'],
      icon: ['states', 'playground'],
      input: ['states', 'playground'],
      link: ['states', 'playground'],
      logo: ['states', 'playground'],
      progress: ['states', 'playground'],
      'radio-group': ['states', 'playground'],
      select: ['states', 'playground'],
      separator: ['states', 'playground'],
      skeleton: ['states', 'playground'],
      sparkle: ['states', 'playground'],
      'sticker-frame': ['states', 'playground'],
      switch: ['states', 'playground'],
      textarea: ['states', 'playground'],
    },
  )
})
