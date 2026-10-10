// T7.8 end-to-end checks of CnSparkle and CnStickerFrame (REQ-029, REQ-026, REQ-027, REQ-028). They run against the isolated
// demo pages, `states` and `playground`, in the `functional` project at 1280 px. The same pages are audited at 360, 768, and
// 1280 px in motifs.matrix.ts, reduced motion is in motifs.reduced.ts, and the baselines are in motifs.visual.ts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'
import { MESSAGE_PROPS } from '../../lib/demos'
import { expectNoA11yViolations } from './helpers/a11y'
import { expectStateMatrix, openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const docOf = (slug: string) =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/02-components/atoms/${slug}.md`, import.meta.url)), 'utf8')
const STATES = { sparkle: ['default', 'animated'], 'sticker-frame': ['default'] } as const

/** Sets props on the playground demo the way the component page does, with a message (ViewportFrame). */
async function setProps(page: Page, props: object) {
  await page.evaluate(([type, values]) => window.postMessage({ type, props: values }, window.location.origin), [
    MESSAGE_PROPS,
    props,
  ] as const)
}

for (const slug of ['sparkle', 'sticker-frame'] as const) {
  test(`REQ-026 AC1, AC2: the ${slug} state matrix shows exactly the states the doc lists`, async ({ page }) => {
    const doc = docOf(slug)
    const table = doc.slice(doc.indexOf('## States'), doc.indexOf('## Usage rules'))
    const listed = [...table.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]!)
    expect(listed).toEqual(STATES[slug])
    await expectStateMatrix(page, slug, listed)
  })
}

test('REQ-029 AC1, ADR-0017: every sparkle is aria-hidden, unnamed, and shows the supplied artwork', async ({
  page,
}) => {
  await openDemo(page, 'sparkle', 'states')
  const sparkles = page.locator('.cn-sparkle')
  await expect(sparkles).toHaveCount(2)
  for (const sparkle of await sparkles.all()) {
    await expect(sparkle).toHaveAttribute('aria-hidden', 'true')
    await expect(sparkle).toHaveAttribute('alt', '')
    await expect(sparkle).not.toHaveAttribute('role', /.+/)
    await expect(sparkle).not.toHaveAttribute('aria-label', /.+/)
    // The artwork is served either as its own file or, because it is small, as a data URI the bundler inlined.
    // Either way it is an image, so its shapes stay out of the accessibility tree (ADR-0017).
    const src = (await sparkle.getAttribute('src')) ?? ''
    expect(src).toMatch(/Sparkle-CN[^/]*\.svg$|^data:image\/svg\+xml[,;]/)
    if (src.startsWith('data:')) {
      const svg = decodeURIComponent(src.slice(src.indexOf(',') + 1))
      expect(svg).toContain('viewBox')
      expect(svg).toContain('#fff488') // the brand yellow survives the bundler untouched
    }
    // The artwork is actually decoded, not a broken image.
    expect(await sparkle.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
  }
  // The placeholder is gone, and the file is never inlined.
  await expect(page.getByText('Motif pending')).toHaveCount(0)
  await expect(page.locator('.cn-sparkle svg')).toHaveCount(0)
})

test('ADR-0017: a sparkle is as tall as the text beside it, and --sparkle-size overrides it', async ({ page }) => {
  await openDemo(page, 'sparkle', 'states')
  const sparkle = page.locator('[data-state="default"] .cn-sparkle')
  const fontSize = await sparkle.evaluate((el) => Number.parseFloat(getComputedStyle(el.parentElement!).fontSize))
  expect(await sparkle.evaluate((el) => Number.parseFloat(getComputedStyle(el).height))).toBeCloseTo(fontSize, 1)
  await sparkle.evaluate((el) => (el as HTMLElement).style.setProperty('--sparkle-size', '48px'))
  expect(await sparkle.evaluate((el) => Number.parseFloat(getComputedStyle(el).height))).toBeCloseTo(48, 1)
})

test('REQ-029 AC1: every sticker frame is aria-hidden and its content cannot take focus', async ({ page }) => {
  await openDemo(page, 'sticker-frame', 'states')
  const frames = page.locator('.cn-sticker-frame')
  await expect(frames).toHaveCount(3)
  for (const frame of await frames.all()) {
    await expect(frame).toHaveAttribute('aria-hidden', 'true')
    await expect(frame).toHaveAttribute('inert', '')
  }
  // Put a button and a link into a frame, the way a careless page would. Neither can be reached by Tab or by focus().
  await page.evaluate(() => {
    const frame = document.querySelector('.cn-sticker-frame')!
    frame.insertAdjacentHTML('beforeend', '<button id="inside-button">x</button><a id="inside-link" href="/">x</a>')
  })
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.activeElement?.closest('.cn-sticker-frame') ?? null)).toBeNull()
  }
  await page.evaluate(() => (document.getElementById('inside-button') as HTMLElement).focus())
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('inside-button')
})

test('REQ-029 AC1: neither motif has a focusable element or a tab stop', async ({ page }) => {
  for (const slug of ['sparkle', 'sticker-frame']) {
    await openDemo(page, slug, 'states')
    expect(
      await page
        .locator('.cn-sparkle, .cn-sparkle *, .cn-sticker-frame, .cn-sticker-frame *')
        .evaluateAll((els) => els.filter((el) => (el as HTMLElement).tabIndex >= 0).length),
      slug,
    ).toBe(0)
  }
})

test('REQ-029 AC2: with normal motion only an animated sparkle fades, slowly', async ({ page }) => {
  await openDemo(page, 'sparkle', 'states')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false)
  const still = page.locator('[data-state="default"] .cn-sparkle')
  const fading = page.locator('[data-state="animated"] .cn-sparkle')
  expect(await still.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  expect(await fading.evaluate((el) => getComputedStyle(el).animationName)).toBe('cn-sparkle-fade')
  // A full cycle is ten base durations, far slower than 3 flashes a second (REQ-029 AC3).
  const seconds = await fading.evaluate((el) => Number.parseFloat(getComputedStyle(el).animationDuration))
  expect(seconds).toBeGreaterThanOrEqual(1)
})

test('REQ-028 AC1: a sticker frame never grows wider than its container, whatever it wraps', async ({ page }) => {
  await openDemo(page, 'sticker-frame', 'states')
  const width = await page.evaluate(() => document.documentElement.clientWidth)
  for (const frame of await page.locator('.cn-sticker-frame').all()) {
    const box = await frame.boundingBox()
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
  }
  // The wide content is clipped by the frame instead of widening the page.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
})

test('the sparkle playground follows its control', async ({ page }) => {
  await openDemo(page, 'sparkle', 'playground')
  const sparkle = page.locator('.cn-sparkle')
  await expect(sparkle).not.toHaveAttribute('data-animated', 'true')
  await setProps(page, { animated: true })
  await expect(sparkle).toHaveAttribute('data-animated', 'true')
  await expectNoA11yViolations(page, { label: 'sparkle playground, animated' })
})

test('the sticker frame playground wraps each kind of content', async ({ page }) => {
  await openDemo(page, 'sticker-frame', 'playground')
  const frame = page.locator('.cn-sticker-frame')
  await expect(frame).toContainText('¡Nuevo ingreso!')
  await setProps(page, { content: 'long-word' })
  await expect(frame).toContainText('Superlargapalabra')
  await setProps(page, { content: 'wide' })
  await expect(frame).toContainText('Contenido más ancho')
  await expectNoA11yViolations(page, { label: 'sticker frame playground, wide' })
})

test('the motif rules read their tokens: overriding them changes the outline and the padding', async ({ page }) => {
  await openDemo(page, 'sticker-frame', 'states')
  const frame = page.locator('.cn-sticker-frame').first()
  await page.evaluate(() => {
    const root = document.documentElement.style
    root.setProperty('--cn-border-width-motif', '5px')
    root.setProperty('--cn-radius-motif', '9px')
  })
  const measured = await frame.evaluate((el) => {
    const style = getComputedStyle(el)
    return { border: style.borderTopWidth, radius: style.borderTopLeftRadius }
  })
  expect(measured).toEqual({ border: '5px', radius: '9px' })
})

test('REQ-027 AC1: axe is clean on every motif demo', async ({ page }) => {
  for (const slug of ['sparkle', 'sticker-frame']) {
    for (const demo of ['states', 'playground']) {
      await openDemo(page, slug, demo)
      await expectNoA11yViolations(page, { label: `/_demo/${slug}/${demo}` })
    }
  }
})
