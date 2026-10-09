// T7.1 end-to-end checks of the component page infrastructure (REQ-055 AC1-AC3, REQ-026 AC2). The real docs list no demo
// yet, so the infrastructure is proved with one dummy demo: a throwaway docs and demos tree is built into a temporary
// folder, served on its own port, and removed at the end. Nothing of it is left in the repository.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteBase } from '../../lib/site'
import { expectNoA11yViolations } from './helpers/a11y'
import { withBuildLock } from './helpers/build'
import { expectStateMatrix } from './helpers/states'
import { expect, test } from './helpers/test'
import { waitForPage } from './helpers/ready'

const appDir = fileURLToPath(new URL('../../', import.meta.url))
const port = 3201
const origin = `http://localhost:${port}`

const doc = [
  '---',
  'title: Dummy',
  'slug: dummy',
  'layer: component',
  'level: atom',
  'source: custom',
  'component: CnDummy',
  'status: draft',
  'lang: en',
  'demos: [states, playground]',
  'since: 0.1.0',
  'updated: 2026-10-09',
  '---',
  '',
  '# Dummy',
  '',
  '## Purpose',
  '',
  'The purpose text.',
  '',
  '## States',
  '',
  'The states text.',
  '',
  '## Usage rules',
  '',
  'The usage text.',
  '',
  '## Code reference',
  '',
  'The code reference text.',
  '',
  '## Open items',
  '',
  'The open items text.',
  '',
].join('\n')

// The states demo has a block that shows only from 768 px up, so the iframe's width decides the media query.
const states = `<template>
  <div>
    <div data-state="default"><button type="button">Default</button></div>
    <div data-state="disabled"><button type="button" disabled>Disabled</button></div>
    <p class="probe">Wide layout</p>
  </div>
</template>

<style>
.probe {
  display: none;
}
@media (min-width: 768px) {
  .probe {
    display: block;
  }
}
</style>
`

const playground = `<script setup lang="ts">
defineProps<{ label?: string; tone?: string; disabled?: boolean }>()
</script>

<template>
  <button type="button" :data-tone="tone" :disabled="disabled">{{ label }}</button>
</template>
`

const controls = `export default [
  { name: 'label', type: 'string', default: 'Press me' },
  { name: 'tone', type: 'select', options: ['calm', 'loud'], default: 'calm' },
  { name: 'disabled', type: 'boolean', default: false },
]
`

let root: string
let server: ChildProcess | undefined

// One build, one server, shared by the tests below, so this file runs in order in one worker.
test.describe.configure({ mode: 'serial' })
test.use({ baseURL: origin, permissions: ['clipboard-read', 'clipboard-write'] })

test.beforeAll(async () => {
  // The build may wait for the other spec's build (see `withBuildLock`).
  test.setTimeout(1_200_000)
  root = mkdtempSync(join(tmpdir(), 'cn-fixture-demos-'))
  mkdirSync(join(root, 'docs/02-components/atoms'), { recursive: true })
  mkdirSync(join(root, 'demos/dummy'), { recursive: true })
  writeFileSync(
    join(root, 'DESIGN.md'),
    '# Fixture\n\n## Components\n\n- [Dummy](docs/02-components/atoms/dummy.md): a dummy.\n',
  )
  writeFileSync(join(root, 'docs/02-components/atoms/dummy.md'), doc)
  writeFileSync(join(root, 'demos/dummy/states.vue'), states)
  writeFileSync(join(root, 'demos/dummy/playground.vue'), playground)
  writeFileSync(join(root, 'demos/dummy/controls.ts'), controls)

  const out = join(root, 'out')
  const nuxt = join(appDir, 'node_modules/nuxt/bin/nuxt.mjs')
  const result = await withBuildLock(() =>
    spawnSync(process.execPath, [nuxt, 'generate'], {
      cwd: appDir,
      env: { ...process.env, CN_DOCS_ROOT: root, CN_DEMOS_ROOT: join(root, 'demos'), CN_OUT_DIR: out },
      encoding: 'utf8',
    }),
  )
  expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0)

  server = spawn(process.execPath, ['tests/serve-static.mjs'], {
    cwd: appDir,
    env: { ...process.env, PORT: String(port), CN_SERVE_DIR: join(out, 'public') },
    stdio: 'ignore',
  })
  for (let attempt = 0; attempt < 50; attempt++) {
    const ready = await fetch(`${origin}${siteBase}`).then(
      (response) => response.ok,
      () => false,
    )
    if (ready) return
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error('the fixture server did not start')
})

test.afterAll(() => {
  server?.kill()
  if (root) rmSync(root, { recursive: true, force: true })
})

const matrix = (page: import('@playwright/test').Page) => page.getByTestId('state-matrix')
const playgroundPanel = (page: import('@playwright/test').Page) => page.getByTestId('playground')

test('REQ-055 AC1: the dummy demo shows the state matrix, the playground, and the code, after their sections', async ({
  page,
}) => {
  await page.goto('/components/dummy')
  await waitForPage(page)
  await expect(matrix(page).getByRole('heading', { name: 'State matrix' })).toBeVisible()
  await expect(matrix(page).locator('iframe')).toBeVisible()
  await expect(playgroundPanel(page).getByRole('heading', { name: 'Playground' })).toBeVisible()
  await expect(playgroundPanel(page).locator('iframe')).toBeVisible()
  // One control per entry of controls.ts: a string, a select, and a boolean.
  await expect(playgroundPanel(page).getByRole('textbox', { name: 'label' })).toHaveValue('Press me')
  await expect(playgroundPanel(page).getByRole('combobox', { name: 'tone' })).toBeVisible()
  await expect(playgroundPanel(page).getByRole('switch', { name: 'disabled' })).toBeVisible()
  await expect(page.getByTestId('code-block')).toHaveCount(2)

  // SPEC.md §4.5: the matrix follows "States", the playground follows "Code reference", and the text stays in order.
  const order = await page.locator('article').evaluate((article) => {
    const marks = [
      'The states text.',
      'State matrix',
      'The usage text.',
      'The code reference text.',
      'Playground',
      'The open items text.',
    ]
    const text = article.textContent ?? ''
    return marks.map((mark) => text.indexOf(mark))
  })
  expect(
    order.every((index) => index >= 0),
    `all marks are in the page: ${order}`,
  ).toBe(true)
  expect(order, 'the panels sit after their sections').toEqual([...order].sort((a, b) => a - b))
})

test('REQ-055 AC2: the copied code equals the demo file, and so does the code shown', async ({ page }) => {
  await page.goto('/components/dummy')
  await waitForPage(page)
  for (const [panel, file] of [
    [matrix(page), 'states.vue'],
    [playgroundPanel(page), 'playground.vue'],
  ] as const) {
    const expected = readFileSync(join(root, 'demos/dummy', file), 'utf8')
    await expect(panel.getByTestId('code-source')).toHaveText(expected, { useInnerText: false })
    await panel.getByTestId('code-copy').click()
    await expect(panel.getByRole('status')).toHaveText('Copied')
    // The Windows clipboard turns each line feed into CRLF, so the line endings are compared as line feeds.
    const copied = (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')
    expect(copied, `${file} copied`).toBe(expected)
  }
})

test('REQ-055 AC3: the iframe width changes the media query result', async ({ page }) => {
  await page.goto('/components/dummy')
  await waitForPage(page)
  const frame = matrix(page).locator('iframe')
  const probe = matrix(page).frameLocator('iframe').locator('.probe')
  for (const [width, visible] of [
    [360, false],
    [768, true],
    [1280, true],
    [360, false],
  ] as const) {
    await matrix(page)
      .getByRole('button', { name: `${width} px` })
      .click()
    await expect(matrix(page).getByRole('button', { name: `${width} px` })).toHaveAttribute('aria-pressed', 'true')
    await expect(frame).toHaveAttribute('data-width', String(width))
    expect((await frame.boundingBox())?.width, `iframe at ${width}`).toBe(width)
    if (visible) await expect(probe, `probe at ${width}`).toBeVisible()
    else await expect(probe, `probe at ${width}`).toBeHidden()
  }
})

test('REQ-055 AC1: a playground control changes the demo', async ({ page }) => {
  await page.goto('/components/dummy')
  await waitForPage(page)
  const panel = playgroundPanel(page)
  const button = panel.frameLocator('iframe').getByRole('button')
  await expect(button).toHaveText('Press me')
  await expect(button).toHaveAttribute('data-tone', 'calm')
  await expect(button).toBeEnabled()

  await panel.getByRole('textbox', { name: 'label' }).fill('Hello')
  await expect(button).toHaveText('Hello')
  await panel.getByRole('switch', { name: 'disabled' }).click()
  await expect(button).toBeDisabled()
  await panel.getByRole('combobox', { name: 'tone' }).click()
  await page.getByRole('option', { name: 'loud' }).click()
  await expect(button).toHaveAttribute('data-tone', 'loud')
})

test('REQ-027 AC1: the component page, with all three panels, has no axe violation', async ({ page }) => {
  await page.goto('/components/dummy')
  await waitForPage(page)
  await expectNoA11yViolations(page, { label: '/components/dummy' })
})

test('REQ-026 AC2: the state matrix helper opens the isolated demo and checks its states', async ({ page }) => {
  expect(await expectStateMatrix(page, 'dummy', ['default', 'disabled'])).toEqual(['default', 'disabled'])
  await expect(expectStateMatrix(page, 'dummy', ['default', 'hover'])).rejects.toThrow(/different states/)
  await expect(page.getByTestId('demo-root')).toBeVisible()
})

test('a demo the doc does not list has no page', async ({ page }) => {
  const response = await page.goto('/_demo/dummy/other')
  expect(response?.status()).toBe(404)
})
