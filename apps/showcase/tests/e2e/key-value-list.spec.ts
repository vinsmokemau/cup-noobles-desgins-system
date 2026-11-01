// T15.2 end-to-end checks of the key-value list (REQ-020, REQ-026, REQ-027, REQ-028, ADR-0065). They run against the isolated
// demo pages, `states` and `playground`, in the `functional` project at 1280 px, and set the width themselves where a check
// depends on it. The same pages are audited at 360, 768, and 1280 px in molecules.matrix.ts, and the baselines are in
// molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/key-value-list.md', import.meta.url)),
  'utf8',
)
const statesOf = () => {
  const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
  return [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
}

async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

const styleOf = (target: Locator, properties: string[]) =>
  target.evaluate(
    (el, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(el).getPropertyValue(name)])),
    properties,
  )

const box = (target: Locator) =>
  target.evaluate((el) => {
    const { x, y, width, height } = el.getBoundingClientRect()
    return { x, y, width, height }
  })

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'empty'])
  await expectStateMatrix(page, 'key-value-list', statesOf())
})

test('REQ-020: the list is a description list, with a term and a definition in each row', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'states')
  const list = page.locator('[data-state="default"] [data-list="text"]')
  expect(await list.evaluate((el) => el.tagName)).toBe('DL')
  const rows = list.locator('.cn-key-value-list__row')
  await expect(rows).toHaveCount(3)
  // Each row is a <div> that holds one <dt> and one <dd>, in that order, and nothing else.
  const shape = await rows.evaluateAll((all) =>
    all.map((row) => [row.tagName, ...[...row.children].map((c) => c.tagName)]),
  )
  expect(shape).toEqual([
    ['DIV', 'DT', 'DD'],
    ['DIV', 'DT', 'DD'],
    ['DIV', 'DT', 'DD'],
  ])
  await expect(list.locator('dt')).toHaveText(['Jugadores', 'Duración', 'Edad recomendada'])
  await expect(list.locator('dd')).toHaveText(['2 a 4', '30 minutos', '8 años en adelante'])
  // Chromium exposes a description list with its terms and definitions: three in this list and one in the slot list.
  await expect(page.getByRole('term')).toHaveCount(4)
  await expect(page.getByRole('definition')).toHaveCount(4)
})

test('REQ-020: the value slot draws a value as a badge, and the label stays text', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'states')
  const list = page.locator('[data-state="default"] [data-list="slot"]')
  await expect(list.locator('dt')).toHaveText(['Idioma'])
  await expect(list.locator('dd [data-slot="base"]')).toHaveText(['Español'])
})

test('REQ-026: a list with no rows renders nothing', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'states')
  await expect(page.locator('[data-state="empty"] .cn-key-value-list')).toHaveCount(0)
  await expect(page.locator('[data-state="empty"] dl')).toHaveCount(0)
  await openDemo(page, 'key-value-list', 'playground')
  await setProps(page, { rows: 0 })
  await expect(page.locator('.cn-key-value-list')).toHaveCount(0)
  await setProps(page, { rows: 4 })
  await expect(page.locator('.cn-key-value-list__row')).toHaveCount(4)
})

test('REQ-027 AC2: the list has no keyboard interaction, and Tab skips it', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'playground')
  const list = page.locator('.cn-key-value-list')
  await expect(list.locator('a, button, input, select, textarea, [tabindex]')).toHaveCount(0)
  await page.keyboard.press('Tab')
  expect(await list.evaluate((el) => el.contains(document.activeElement))).toBe(false)
  // The list adds no role and no aria attribute of its own.
  expect(
    await list.evaluate((el) => el.getAttributeNames().filter((n) => n === 'role' || n.startsWith('aria-'))),
  ).toEqual([])
})

test('REQ-027 AC1: a badge as a value and a very long value pass axe', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'playground')
  await setProps(page, { badge: true, longValue: true, rows: 6 })
  await expect(page.locator('.cn-key-value-list__row')).toHaveCount(6)
  await expectNoA11yViolations(page, { label: '/_demo/key-value-list/playground (badge, long value)' })
})

test('REQ-016: the colors and the line come from the tokens, and the last row has no line', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'playground')
  const rows = page.locator('.cn-key-value-list__row')
  const label = page.locator('.cn-key-value-list__label').first()
  const value = page.locator('.cn-key-value-list__value').first()
  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-key-value-list-label', 'rgb(1, 2, 3)')
    style.setProperty('--cn-key-value-list-value', 'rgb(4, 5, 6)')
    style.setProperty('--cn-key-value-list-divider-color', 'rgb(7, 8, 9)')
    style.setProperty('--cn-key-value-list-divider-width', '5px')
  })
  expect((await styleOf(label, ['color'])).color).toBe('rgb(1, 2, 3)')
  expect((await styleOf(value, ['color'])).color).toBe('rgb(4, 5, 6)')
  expect(await styleOf(rows.first(), ['border-bottom-color', 'border-bottom-width', 'border-bottom-style'])).toEqual({
    'border-bottom-color': 'rgb(7, 8, 9)',
    'border-bottom-width': '5px',
    'border-bottom-style': 'solid',
  })
  expect((await styleOf(rows.last(), ['border-bottom-style']))['border-bottom-style']).toBe('none')
  // The list sits on the black page with no fill of its own, and no glow.
  expect(await styleOf(page.locator('.cn-key-value-list'), ['background-color', 'box-shadow'])).toEqual({
    'background-color': 'rgb(0, 0, 0)',
    'box-shadow': 'none',
  })
})

test('REQ-028: at 360 px a row stacks, and from 768 px the label and the value sit side by side', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'playground')
  const label = page.locator('.cn-key-value-list__label').first()
  const value = page.locator('.cn-key-value-list__value').first()
  const list = page.locator('.cn-key-value-list')

  await page.setViewportSize({ width: 360, height: 800 })
  let [l, v, all] = [await box(label), await box(value), await box(list)]
  expect(v.y, 'the value is under the label at 360 px').toBeGreaterThanOrEqual(l.y + l.height)
  expect(Math.round(v.x)).toBe(Math.round(l.x))
  expect(Math.round(v.width)).toBe(Math.round(all.width))

  for (const width of [768, 1280]) {
    await page.setViewportSize({ width, height: 800 })
    ;[l, v, all] = [await box(label), await box(value), await box(list)]
    expect(Math.round(v.y), `the value is beside the label at ${width} px`).toBe(Math.round(l.y))
    expect(v.x).toBeGreaterThan(l.x + l.width - 1)
    // The label takes one third of the row and the value two thirds, less the gap between them.
    expect(v.width / l.width).toBeCloseTo(2, 0)
    expect(l.width + v.width).toBeLessThanOrEqual(all.width)
  }
})

test('REQ-028 AC1: a very long value breaks inside its column at 360, 768, and 1280 px', async ({ page }) => {
  await openDemo(page, 'key-value-list', 'playground')
  await setProps(page, { longValue: true })
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 })
    await expectNoHorizontalOverflow(page, `/_demo/key-value-list/playground (long value) at ${width} px`)
    const value = await box(page.locator('.cn-key-value-list__value').first())
    const list = await box(page.locator('.cn-key-value-list'))
    expect(value.x + value.width).toBeLessThanOrEqual(list.x + list.width + 1)
  }
})
