// T7.6 end-to-end checks of the progress bar, the skeleton, and the separator (REQ-020, REQ-026, REQ-027, REQ-029). They
// run against the isolated demo pages, `states` and `playground` of each, in the `functional` project at 1280 px. The same
// pages are audited at 360, 768, and 1280 px in progress-skeleton-separator.matrix.ts, reduced motion is checked in
// progress-skeleton-separator.reduced.ts, and the baselines are in progress-skeleton-separator.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const docOf = (slug: string) =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/02-components/atoms/${slug}.md`, import.meta.url)), 'utf8')
/** The `default`, `empty`, ... rows of the States table of a doc. */
const statesOf = (slug: string) => {
  const doc = docOf(slug)
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

const PINK = 'rgb(239, 128, 174)'
const BLACK = 'rgb(0, 0, 0)'
const CLEAR = 'rgba(0, 0, 0, 0)'
// The placeholder neutral (TBD-05), `#90a1b9`. It is not a brand value; the test reads it only to prove which token the rule uses.
const NEUTRAL = 'rgb(144, 161, 185)'

const cell = (page: Page, state: string) => page.locator(`[data-state="${state}"]:not([data-slot])`)
const bar = (page: Page, state: string) => cell(page, state).getByRole('progressbar')
const style = (target: Locator, properties: string[]) =>
  target.evaluate(
    (el, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)])),
    properties,
  )

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

// ------------------------------------------------------------------------------------------------------------ progress

test('REQ-026 AC1, AC2: the state matrices show exactly the states the docs list', async ({ page }) => {
  expect(statesOf('progress')).toEqual(['default', 'empty', 'complete', 'indeterminate'])
  expect(statesOf('skeleton')).toEqual(['default'])
  expect(statesOf('separator')).toEqual(['default'])
  for (const slug of ['progress', 'skeleton', 'separator']) await expectStateMatrix(page, slug, statesOf(slug))
})

test('Done when: the progress bar exposes its value, its range, and its name to assistive technology', async ({
  page,
}) => {
  await openDemo(page, 'progress', 'states')
  const expected = {
    default: { now: '62', name: 'Subiendo portada' },
    empty: { now: '0', name: 'Preparando archivo' },
    complete: { now: '100', name: 'Portada subida' },
  } as const
  for (const [state, { now, name }] of Object.entries(expected)) {
    const progress = bar(page, state)
    await expect(progress, state).toHaveAttribute('aria-valuenow', now)
    await expect(progress, state).toHaveAttribute('aria-valuemin', '0')
    await expect(progress, state).toHaveAttribute('aria-valuemax', '100')
    await expect(progress, state).toHaveAttribute('aria-label', name)
    await expect(page.getByRole('progressbar', { name }), `${state} has an accessible name`).toHaveCount(1)
  }
  // An indeterminate bar has no value, so assistive technology reads it as "unknown amount" (WCAG 4.1.2).
  const indeterminate = bar(page, 'indeterminate')
  await expect(indeterminate).not.toHaveAttribute('aria-valuenow', /.*/)
  await expect(indeterminate).toHaveAttribute('data-state', 'indeterminate')
  await expect(indeterminate).toHaveAttribute('aria-label', 'Procesando imagen')
})

test('the progress playground updates the value that assistive technology reads', async ({ page }) => {
  await openDemo(page, 'progress', 'playground')
  const progress = page.getByRole('progressbar', { name: 'Subiendo portada' })
  await expect(progress).toHaveAttribute('aria-valuenow', '62')
  await setProps(page, { value: 30 })
  await expect(progress).toHaveAttribute('aria-valuenow', '30')
  await setProps(page, { indeterminate: true })
  await expect(progress).not.toHaveAttribute('aria-valuenow', /.*/)
  await expectNoA11yViolations(page, { label: 'progress playground, indeterminate' })
})

test('ADR-0015: the progress track is a black pill with a neutral outline, and the fill is pink', async ({ page }) => {
  await openDemo(page, 'progress', 'states')
  const track = await style(bar(page, 'default'), [
    'background-color',
    'border-top-color',
    'border-top-style',
    'border-top-width',
    'border-top-left-radius',
  ])
  expect(track['background-color']).toBe(BLACK)
  expect(track['border-top-color']).toBe(NEUTRAL)
  expect(track['border-top-style']).toBe('solid')
  expect(track['border-top-width']).toBe('1px')
  expect(Number.parseFloat(track['border-top-left-radius']!)).toBeGreaterThan(100)
  const fill = cell(page, 'default').locator('[data-slot="indicator"]')
  expect((await style(fill, ['background-color']))['background-color']).toBe(PINK)
  // The empty bar shows only the track: the fill has moved fully out of it.
  const emptyFill = cell(page, 'empty').locator('[data-slot="indicator"]')
  const [fillBox, trackBox] = await Promise.all([emptyFill.boundingBox(), bar(page, 'empty').boundingBox()])
  expect(fillBox!.x + fillBox!.width).toBeLessThanOrEqual(trackBox!.x + 2)
})

test('the progress rules read their tokens: overriding them changes the bar', async ({ page }) => {
  await openDemo(page, 'progress', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-progress-bg', 'rgb(13, 14, 15)')
    root.setProperty('--cn-progress-border', 'rgb(1, 2, 3)')
    root.setProperty('--cn-progress-fill', 'rgb(7, 8, 9)')
    root.setProperty('--cn-border-width-progress', '5px')
  })
  const track = await style(bar(page, 'default'), ['background-color', 'border-top-color', 'border-top-width'])
  expect(track).toEqual({
    'background-color': 'rgb(13, 14, 15)',
    'border-top-color': 'rgb(1, 2, 3)',
    'border-top-width': '5px',
  })
  const fill = cell(page, 'default').locator('[data-slot="indicator"]')
  expect((await style(fill, ['background-color']))['background-color']).toBe('rgb(7, 8, 9)')
})

// ------------------------------------------------------------------------------------------------------------ skeleton

test('Done when: the skeleton is an outlined shape with no fill that fades while motion is allowed', async ({
  page,
}) => {
  await openDemo(page, 'skeleton', 'states')
  const lone = page.getByRole('status', { name: 'Cargando imagen' })
  const shape = await style(lone, [
    'background-color',
    'border-top-color',
    'border-top-style',
    'border-top-width',
    'animation-name',
    'animation-iteration-count',
  ])
  expect(shape['background-color']).toBe(CLEAR)
  expect(shape['border-top-color']).toBe(NEUTRAL)
  expect(shape['border-top-style']).toBe('solid')
  expect(shape['border-top-width']).toBe('1px')
  expect(shape['animation-name']).toBe('cn-skeleton-fade')
  expect(shape['animation-iteration-count']).toBe('infinite')
  const running = await lone.evaluate((el) => el.getAnimations().filter((a) => a.playState === 'running').length)
  expect(running).toBe(1)
})

test('a skeleton circle stays round: the theme radius sits below the utility classes', async ({ page }) => {
  await openDemo(page, 'skeleton', 'states')
  const circle = page.locator('.cn-skeleton.rounded-full').first()
  const radius = await circle.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
  expect(Number.parseFloat(radius)).toBeGreaterThan(1000)
})

test('REQ-027: the skeleton group is named once in es-MX, and the shapes inside it are hidden', async ({ page }) => {
  await openDemo(page, 'skeleton', 'states')
  const group = page.getByRole('status', { name: 'Cargando tarjeta' })
  await expect(group).toHaveAttribute('aria-busy', 'true')
  await expect(group.locator('[aria-hidden="true"]')).toHaveCount(3)
  // Nuxt UI's fixed English label stays on the hidden shapes, but nothing exposed to assistive technology carries it: the
  // accessibility tree has two named statuses and no alert.
  await expect(page.getByRole('status')).toHaveCount(2)
  await expect(page.getByRole('status', { name: 'loading' })).toHaveCount(0)
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('the skeleton rules read their tokens: overriding them changes the shape', async ({ page }) => {
  await openDemo(page, 'skeleton', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-skeleton-border', 'rgb(1, 2, 3)')
    root.setProperty('--cn-border-width-skeleton', '5px')
    root.setProperty('--cn-radius-skeleton', '11px')
  })
  const shape = await style(page.getByRole('status', { name: 'Cargando imagen' }), [
    'border-top-color',
    'border-top-width',
    'border-top-left-radius',
  ])
  expect(shape).toEqual({
    'border-top-color': 'rgb(1, 2, 3)',
    'border-top-width': '5px',
    'border-top-left-radius': '11px',
  })
})

// ---------------------------------------------------------------------------------------------------------- separator

test('the separator is announced by its orientation, and a decorative one is hidden', async ({ page }) => {
  await openDemo(page, 'separator', 'states')
  const horizontal = page.locator('[data-separator="horizontal"]')
  await expect(horizontal).toHaveAttribute('role', 'separator')
  await expect(horizontal).not.toHaveAttribute('aria-orientation', 'vertical')
  const vertical = page.locator('[data-separator="vertical"]')
  await expect(vertical).toHaveAttribute('role', 'none')
  await expect(page.getByRole('separator')).toHaveCount(2)
})

test('ADR-0015: the separator line is neutral, and the vertical one runs along the height of its row', async ({
  page,
}) => {
  await openDemo(page, 'separator', 'states')
  const line = page.locator('[data-separator="horizontal"] [data-slot="border"]')
  const horizontal = await style(line, ['border-top-color', 'border-top-style', 'border-top-width'])
  expect(horizontal).toEqual({ 'border-top-color': NEUTRAL, 'border-top-style': 'solid', 'border-top-width': '1px' })
  const [lineBox, rootBox] = await Promise.all([
    line.boundingBox(),
    page.locator('[data-separator="horizontal"]').boundingBox(),
  ])
  expect(lineBox!.width).toBeCloseTo(rootBox!.width, 0)
  const side = page.locator('[data-separator="vertical"] [data-slot="border"]')
  const vertical = await style(side, ['border-inline-start-color', 'border-inline-start-width', 'border-top-width'])
  expect(vertical).toEqual({
    'border-inline-start-color': NEUTRAL,
    'border-inline-start-width': '1px',
    'border-top-width': '0px',
  })
  const [sideBox, rowBox] = await Promise.all([
    side.boundingBox(),
    page.locator('[data-separator="vertical"]').boundingBox(),
  ])
  expect(sideBox!.height).toBeGreaterThan(sideBox!.width)
  expect(sideBox!.height).toBeCloseTo(rowBox!.height, 0)
})

test('the separator rules read their tokens: overriding them changes the line', async ({ page }) => {
  await openDemo(page, 'separator', 'states')
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-separator-color', 'rgb(1, 2, 3)')
    root.setProperty('--cn-border-width-separator', '5px')
  })
  const line = page.locator('[data-separator="horizontal"] [data-slot="border"]')
  expect(await style(line, ['border-top-color', 'border-top-width'])).toEqual({
    'border-top-color': 'rgb(1, 2, 3)',
    'border-top-width': '5px',
  })
})

test('the separator playground labels the line and switches orientation', async ({ page }) => {
  await openDemo(page, 'separator', 'playground')
  await expect(page.getByRole('separator')).toHaveCount(1)
  await setProps(page, { label: 'o' })
  await expect(page.getByRole('separator')).toContainText('o')
  await setProps(page, { orientation: 'vertical', label: '' })
  await expect(page.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  await setProps(page, { decorative: true })
  await expect(page.getByRole('separator')).toHaveCount(0)
  await expectNoA11yViolations(page, { label: 'separator playground, vertical' })
})

// ------------------------------------------------------------------------------------------------------------ keyboard

for (const slug of ['progress', 'skeleton', 'separator']) {
  test(`REQ-027 AC2: Tab skips the ${slug}, because it is not interactive`, async ({ page }) => {
    await openDemo(page, slug, 'states')
    await page.keyboard.press('Tab')
    const tag = await page.evaluate(() => document.activeElement?.tagName)
    expect(tag).toBe('BODY')
    expect(await page.locator('[data-state="default"]').locator('[tabindex]:not([tabindex="-1"])').count()).toBe(0)
  })
}
