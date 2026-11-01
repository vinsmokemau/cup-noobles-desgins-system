// T15.3 end-to-end checks of the image gallery (REQ-020, REQ-024, REQ-026, REQ-027, REQ-028, REQ-029, ADR-0056, ADR-0057,
// ADR-0066). They run against the isolated demo pages, `states` and `playground`, in the `functional` project at 1280 px, and set
// the width themselves where a check depends on it. The same pages are audited at 360, 768, and 1280 px in
// molecules.matrix.ts, and the baselines are in molecules.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations, expectNoHorizontalOverflow } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const doc = readFileSync(
  fileURLToPath(new URL('../../../../docs/02-components/molecules/image-gallery.md', import.meta.url)),
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

const YELLOW = 'rgb(255, 244, 136)'
const PINK = 'rgb(239, 128, 174)'
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

const gallery = (page: Page) => page.getByRole('region', { name: 'Fotos de ejemplo' })
const previous = (page: Page) => page.getByRole('button', { name: 'Imagen anterior', exact: true })
const next = (page: Page) => page.getByRole('button', { name: 'Imagen siguiente', exact: true })
const dot = (page: Page, position: number) =>
  page.getByRole('button', { name: `Ir a la imagen ${position}`, exact: true })
const current = (page: Page) => page.locator('.cn-image-gallery__dot[aria-current="true"]')
// The position of the picture that shows: the frame whose left edge is at the left edge of the gallery.
const shown = (page: Page) =>
  page.locator('.cn-image-gallery__frame').evaluateAll((frames) => {
    const viewport = frames[0]!.closest('[data-slot="viewport"]')!.getBoundingClientRect()
    const index = frames.findIndex((frame) => Math.abs(frame.getBoundingClientRect().left - viewport.left) < 2)
    return index + 1
  })

test('REQ-026 AC1, AC2: the state matrix shows exactly the states the doc lists', async ({ page }) => {
  expect(statesOf()).toEqual(['default', 'hover', 'focus-visible', 'selected', 'disabled', 'error', 'empty'])
  await expectStateMatrix(page, 'image-gallery', statesOf())
})

test('REQ-020: the gallery is a named carousel region of slides, over UCarousel, with one dot for each picture', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  const region = gallery(page)
  await expect(region).toHaveAttribute('aria-roledescription', 'carousel')
  await expect(region.locator('[role="group"][aria-roledescription="slide"]')).toHaveCount(3)
  await expect(page.getByRole('group', { name: 'Imágenes' }).getByRole('button')).toHaveCount(3)
  await expect(current(page)).toHaveCount(1)
  await expect(dot(page, 1)).toHaveAttribute('aria-current', 'true')
  await expect(dot(page, 2)).not.toHaveAttribute('aria-current')
  await expect(page.locator('.cn-image-gallery__frame img')).toHaveCount(3)
  await expect(page.locator('.cn-image-gallery__frame img').first()).toHaveAttribute(
    'alt',
    'Un dado de veinte caras dorado',
  )
})

test('REQ-029 AC1, ADR-0066: nothing in the gallery speaks English, because every name comes from the props', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  const names = await page
    .locator('.cn-image-gallery button')
    .evaluateAll((all) => all.map((el) => el.getAttribute('aria-label')))
  expect(names).toEqual([
    'Imagen anterior',
    'Ir a la imagen 1',
    'Ir a la imagen 2',
    'Ir a la imagen 3',
    'Imagen siguiente',
  ])
  // The only text in the gallery is the position for a screen reader, and it is set from the props too.
  expect(await page.locator('.cn-image-gallery').innerText()).toBe('Imagen 1 de 3')
})

test('REQ-027 AC2: Tab goes to the gallery, then the dots, then next, and skips the disabled previous control', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  await page.keyboard.press('Tab')
  await expect(gallery(page)).toBeFocused()
  await expect(previous(page)).toBeDisabled()
  await page.keyboard.press('Tab')
  await expect(dot(page, 1)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dot(page, 2)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dot(page, 3)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(next(page)).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dot(page, 3)).toBeFocused()
})

test('REQ-027 AC2: Arrow Right and Arrow Left on the gallery change the picture, and the dot follows', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  await gallery(page).focus()
  expect(await shown(page)).toBe(1)
  await page.keyboard.press('ArrowRight')
  await expect(dot(page, 2)).toHaveAttribute('aria-current', 'true')
  await expect.poll(() => shown(page)).toBe(2)
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => shown(page)).toBe(3)
  await expect(dot(page, 3)).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('ArrowLeft')
  await expect.poll(() => shown(page)).toBe(2)
  await expect(current(page)).toHaveCount(1)
})

test('REQ-027 AC2: Enter and Space on the controls and the dots show the picture, and aria-current follows', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  await next(page).focus()
  await page.keyboard.press('Enter')
  await expect(dot(page, 2)).toHaveAttribute('aria-current', 'true')
  await expect.poll(() => shown(page)).toBe(2)
  await page.keyboard.press('Space')
  await expect(dot(page, 3)).toHaveAttribute('aria-current', 'true')
  await previous(page).focus()
  await page.keyboard.press('Space')
  await expect(dot(page, 2)).toHaveAttribute('aria-current', 'true')
  await dot(page, 1).focus()
  await page.keyboard.press('Enter')
  await expect(dot(page, 1)).toHaveAttribute('aria-current', 'true')
  await expect.poll(() => shown(page)).toBe(1)
  await dot(page, 3).focus()
  await page.keyboard.press('Space')
  await expect.poll(() => shown(page)).toBe(3)
})

test('REQ-027 AC2: the previous control is disabled on the first picture and the next on the last, and Tab skips them', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  await expect(previous(page)).toBeDisabled()
  await expect(next(page)).toBeEnabled()
  await dot(page, 3).click()
  await expect(next(page)).toBeDisabled()
  await expect(previous(page)).toBeEnabled()
  await dot(page, 3).focus()
  await page.keyboard.press('Tab')
  await expect(next(page)).not.toBeFocused()
})

test('REQ-027 AC1: a screen reader is told the position each time the picture changes', async ({ page }) => {
  await openDemo(page, 'image-gallery', 'playground')
  const live = page.locator('.cn-image-gallery [aria-live="polite"]')
  await expect(live).toHaveText('Imagen 1 de 3')
  await next(page).click()
  await expect(live).toHaveText('Imagen 2 de 3')
  expect(await live.evaluate((el) => el.classList.contains('sr-only'))).toBe(true)
})

test('REQ-024 AC1, AC2: the gallery and a dot show the yellow ring on the keyboard only, and it is not the glow', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  const ring = ['outline-style', 'outline-width', 'outline-color', 'outline-offset', 'box-shadow']
  const frame = page.locator('.cn-carousel')
  await page.keyboard.press('Tab')
  await expect(gallery(page)).toBeFocused()
  expect(await styleOf(frame, ring)).toEqual({
    'outline-style': 'solid',
    'outline-width': '3px',
    'outline-color': YELLOW,
    'outline-offset': '3px',
    'box-shadow': 'none',
  })
  await page.keyboard.press('Tab')
  await expect(dot(page, 1)).toBeFocused()
  expect(await styleOf(dot(page, 1), ring)).toEqual({
    'outline-style': 'solid',
    'outline-width': '3px',
    'outline-color': YELLOW,
    'outline-offset': '3px',
    'box-shadow': 'none',
  })
  // A mouse click does not show the ring.
  await dot(page, 3).click()
  expect((await styleOf(dot(page, 3), ring))['outline-style']).not.toBe('solid')
  await page.locator('.cn-image-gallery__frame').first().click({ force: true })
  expect((await styleOf(frame, ring))['outline-style']).not.toBe('solid')
})

test('REQ-016: the frame, the dots, and the ring come from the tokens', async ({ page }) => {
  await openDemo(page, 'image-gallery', 'playground')
  const frame = page.locator('.cn-carousel')
  expect(
    await styleOf(frame, [
      'border-top-color',
      'border-top-width',
      'border-top-style',
      'background-color',
      'box-shadow',
    ]),
  ).toEqual({
    'border-top-color': PINK,
    'border-top-width': '3px',
    'border-top-style': 'solid',
    'background-color': 'rgb(0, 0, 0)',
    'box-shadow': 'none',
  })
  // A current dot is filled pink, a dot that is not current is hollow with a neutral outline.
  expect(await styleOf(dot(page, 1), ['background-color', 'border-top-color'])).toEqual({
    'background-color': PINK,
    'border-top-color': PINK,
  })
  const hollow = await styleOf(dot(page, 2), ['background-color', 'border-top-color', 'border-top-width'])
  expect(hollow['background-color']).toBe('rgba(0, 0, 0, 0)')
  expect(hollow['border-top-color']).not.toBe(PINK)
  expect(hollow['border-top-width']).toBe('3px')
  await dot(page, 2).hover()
  expect((await styleOf(dot(page, 2), ['border-top-color']))['border-top-color']).toBe(PINK)

  await page.evaluate(() => {
    const style = document.documentElement.style
    style.setProperty('--cn-image-gallery-highlight', 'rgb(1, 2, 3)')
    style.setProperty('--cn-image-gallery-bg', 'rgb(4, 5, 6)')
    style.setProperty('--cn-radius-image-gallery', '9px')
    style.setProperty('--cn-border-width-image-gallery', '5px')
    style.setProperty('--cn-image-gallery-dot-current', 'rgb(7, 8, 9)')
  })
  expect(
    await styleOf(frame, ['border-top-color', 'background-color', 'border-top-left-radius', 'border-top-width']),
  ).toEqual({
    'border-top-color': 'rgb(1, 2, 3)',
    'background-color': 'rgb(4, 5, 6)',
    'border-top-left-radius': '9px',
    'border-top-width': '5px',
  })
  expect((await styleOf(dot(page, 1), ['background-color']))['background-color']).toBe('rgb(7, 8, 9)')
})

test('ADR-0056: every picture shows whole in a 4:3 frame, never cropped, at 360, 768, and 1280 px', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  for (const [source, width, height] of [
    ['3:2', 300, 200],
    ['5:7', 250, 350],
    ['1:1', 300, 300],
  ] as const) {
    await setProps(page, { source })
    for (const viewport of [360, 768, 1280]) {
      await page.setViewportSize({ width: viewport, height: 900 })
      const frame = page.locator('.cn-image-gallery__frame').first()
      const picture = frame.locator('img')
      await expect(picture).toBeVisible()
      const ratio = await frame.evaluate((el) => el.clientWidth / el.clientHeight)
      expect(ratio).toBeGreaterThan(4 / 3 - 0.03)
      expect(ratio).toBeLessThan(4 / 3 + 0.03)
      const fit = await picture.evaluate((el: HTMLImageElement) => {
        const style = getComputedStyle(el)
        const natural = el.naturalWidth / el.naturalHeight
        const boxRatio = el.clientWidth / el.clientHeight
        // With `contain`, the drawn picture keeps its own shape and fits inside the box on one side.
        const drawnWidth = boxRatio > natural ? el.clientHeight * natural : el.clientWidth
        const drawnHeight = boxRatio > natural ? el.clientHeight : el.clientWidth / natural
        return { fit: style.objectFit, drawnWidth, drawnHeight }
      })
      expect(fit.fit, `${source} at ${viewport} px`).toBe('contain')
      expect(fit.drawnWidth / fit.drawnHeight).toBeCloseTo(width / height, 2)
    }
  }
})

test('ADR-0057: a missing picture and a picture that fails to load show the brand d20, decorative, in the same frame', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  for (const source of ['missing', 'broken']) {
    await setProps(page, { source })
    const images = page.locator('.cn-image-gallery__frame img')
    await expect(images).toHaveCount(3)
    for (const image of await images.all()) {
      await expect(image).toHaveClass(/cn-image-gallery__image--fallback/)
      await expect(image).toHaveAttribute('src', /D20-CN/)
      await expect(image).toHaveAttribute('alt', '')
      await expect(image).toHaveAttribute('aria-hidden', 'true')
      expect(await image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
    }
    const ratio = await page
      .locator('.cn-image-gallery__frame')
      .first()
      .evaluate((el) => el.clientWidth / el.clientHeight)
    expect(ratio).toBeGreaterThan(4 / 3 - 0.03)
    expect(ratio).toBeLessThan(4 / 3 + 0.03)
    await expectNoA11yViolations(page, { label: `/_demo/image-gallery/playground (${source})` })
  }
})

test('REQ-025 AC2: a decorative picture has an empty alt and is hidden from assistive technology', async ({ page }) => {
  await openDemo(page, 'image-gallery', 'playground')
  await setProps(page, { decorative: true })
  const images = page.locator('.cn-image-gallery__frame img')
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('alt', '')
    await expect(image).toHaveAttribute('aria-hidden', 'true')
  }
  await expectNoA11yViolations(page, { label: '/_demo/image-gallery/playground (decorative)' })
})

test('REQ-026: no pictures renders nothing, and one picture shows the frame and no controls', async ({ page }) => {
  await openDemo(page, 'image-gallery', 'states')
  await expect(page.locator('[data-state="empty"] .cn-image-gallery')).toHaveCount(0)
  await expect(page.locator('[data-state="empty"] *')).toHaveCount(0)
  await openDemo(page, 'image-gallery', 'playground')
  await setProps(page, { count: 0 })
  await expect(page.locator('.cn-image-gallery')).toHaveCount(0)
  await setProps(page, { count: 1 })
  await expect(page.locator('.cn-image-gallery__frame')).toHaveCount(1)
  await expect(page.locator('.cn-image-gallery button')).toHaveCount(0)
  await setProps(page, { count: 5 })
  await expect(page.locator('.cn-image-gallery__dot')).toHaveCount(5)
})

test('REQ-029 AC2: the picture changes at once under reduced motion, and it slides otherwise', async ({ page }) => {
  const offset = () =>
    page.evaluate(
      () =>
        new Promise<number>((resolve) =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const frames = document.querySelectorAll('.cn-image-gallery__frame')
              const viewport = frames[0]!.closest('[data-slot="viewport"]')!.getBoundingClientRect()
              resolve(Math.abs(frames[1]!.getBoundingClientRect().left - viewport.left))
            }),
          ),
        ),
    )
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page, 'image-gallery', 'playground')
  await next(page).click()
  expect(await offset(), 'a picture slides in when motion is allowed').toBeGreaterThan(5)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDemo(page, 'image-gallery', 'playground')
  await next(page).click()
  expect(await offset(), 'the picture is in place at once under reduced motion').toBeLessThan(2)
  await gallery(page).focus()
  await page.keyboard.press('ArrowRight')
  await expect(dot(page, 3)).toHaveAttribute('aria-current', 'true')
})

test('REQ-028 AC2: a dot is at least 24 x 24 px, and so is every other control', async ({ page }) => {
  await openDemo(page, 'image-gallery', 'playground')
  for (const control of await page.locator('.cn-image-gallery button').all()) {
    const size = await box(control)
    expect(size.width).toBeGreaterThanOrEqual(24)
    expect(size.height).toBeGreaterThanOrEqual(24)
  }
  const size = await box(dot(page, 1))
  expect(Math.round(size.width)).toBe(24)
  expect(Math.round(size.height)).toBe(24)
})

test('REQ-028 AC1: the controls sit inside the container, and many dots wrap, at 360, 768, and 1280 px', async ({
  page,
}) => {
  await openDemo(page, 'image-gallery', 'playground')
  await setProps(page, { count: 5 })
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await expectNoHorizontalOverflow(page, `/_demo/image-gallery/playground at ${width} px`)
    const root = await box(page.locator('.cn-image-gallery'))
    for (const control of await page.locator('.cn-image-gallery button').all()) {
      const size = await box(control)
      expect(size.x, `${width} px`).toBeGreaterThanOrEqual(root.x - 1)
      expect(size.x + size.width, `${width} px`).toBeLessThanOrEqual(root.x + root.width + 1)
    }
    const frame = await box(page.locator('.cn-carousel'))
    expect(Math.round(frame.width)).toBe(Math.round(root.width))
  }
})

test('REQ-027 AC1: axe is clean on both demos, and on a gallery at its last picture', async ({ page }) => {
  await openDemo(page, 'image-gallery', 'states')
  await expectNoA11yViolations(page, { label: '/_demo/image-gallery/states' })
  await openDemo(page, 'image-gallery', 'playground')
  await expectNoA11yViolations(page, { label: '/_demo/image-gallery/playground' })
  await dot(page, 3).click()
  await expectNoA11yViolations(page, { label: '/_demo/image-gallery/playground (last picture)' })
})
