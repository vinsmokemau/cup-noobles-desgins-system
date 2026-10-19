// T6.3 (REQ-054 AC2, AC3, AC4): the previews on the foundation pages. Expected tokens come from tokens.flat.json on disk,
// and the pages are the ones whose generated blocks name them, so a token added to the sources shows up in these checks
// without an edit here.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'
import { DIACRITICS } from '../../lib/token-preview'
import { expect, test } from './helpers/test'

interface Flat {
  cssVar: string
  value: string
  status: string | null
  tbd?: string[]
}
const flat = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../../../../packages/tokens/dist/json/tokens.flat.json', import.meta.url)),
    'utf8',
  ),
) as Record<string, Flat>

const card = (page: Page, label: string) => page.locator(`[data-testid="preview"][data-label="${label}"]`)

test('REQ-054 AC2: typography has a specimen per role, set in its tokens, with the Spanish diacritics', async ({
  page,
}) => {
  await page.goto('/foundations/typography')
  const roles = { H1: 'h1', H2: 'h2', H3: 'h3', body: 'body', caption: 'caption' }
  for (const [label, role] of Object.entries(roles)) {
    const specimen = card(page, label).getByTestId('specimen')
    await expect(specimen, label).toContainText(DIACRITICS)
    await expect(specimen, label).toHaveAttribute('lang', 'es-MX')
    const style = await specimen.evaluate((el) => {
      const css = getComputedStyle(el)
      return { size: css.fontSize, weight: css.fontWeight, height: css.lineHeight }
    })
    const px = (rem: string) => `${Number.parseFloat(rem) * 16}px`
    expect(style.size, label).toBe(px(flat[`font.${role}.size`]!.value))
    expect(style.weight, label).toBe(String(flat[`font.${role}.weight`]!.value))
    expect(style.height, label).toBe(px(flat[`font.${role}.lineHeight`]!.value))
  }
})

test('REQ-054 AC2: the page text includes the literal sample string', async ({ page }) => {
  await page.goto('/foundations/typography')
  await expect(page.getByTestId('previews-type')).toContainText('áéíóú ñ ¿¡')
})

test('REQ-054 AC3: spacing is a bar as wide as its token', async ({ page }) => {
  await page.goto('/foundations/spacing')
  const width = await card(page, 'space.base')
    .getByTestId('space-bar')
    .evaluate((el) => el.getBoundingClientRect().width)
  expect(width).toBe(Number.parseFloat(flat['space.base']!.value) * 16)
})

test('REQ-054 AC3: radius boxes carry their radius and stroke lines their thickness', async ({ page }) => {
  await page.goto('/foundations/shape')
  for (const name of ['radius.sm', 'radius.md', 'radius.lg']) {
    const radius = await card(page, name)
      .getByTestId('radius-box')
      .evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
    expect(radius, name).toBe(`${Number.parseFloat(flat[name]!.value) * 16}px`)
  }
  const stroke = await card(page, 'border.width.default')
    .getByTestId('stroke-line')
    .evaluate((el) => getComputedStyle(el).borderTopWidth)
  expect(stroke).toBe(flat['border.width.default']!.value)
})

test('REQ-054 AC3: glow and elevation are sample boxes carrying their token as a shadow', async ({ page }) => {
  await page.goto('/foundations/effects')
  // effect.glow.default, effect.glow.interactive, and the button's effect.glow.button (T7.2).
  await expect(page.getByTestId('previews-glow').getByTestId('shadow-box')).toHaveCount(3)
  await expect(page.getByTestId('previews-elevation').getByTestId('shadow-box')).toHaveCount(2)
  const none = await card(page, 'effect.glow.default')
    .getByTestId('shadow-box')
    .evaluate((el) => getComputedStyle(el).boxShadow)
  expect(none).toBe('none')
  const shadow = await card(page, 'effect.shadow.overlay')
    .getByTestId('shadow-box')
    .evaluate((el) => getComputedStyle(el).boxShadow)
  expect(shadow).toContain('rgba(0, 0, 0, 0.1)')
})

test('REQ-054 AC3: the motion demo plays on demand and moves, when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/foundations/motion')
  const dot = page.getByTestId('motion-dot').first()
  const left = () => dot.evaluate((el) => el.getBoundingClientRect().left)
  const start = await left()
  // It waits to be played: nothing moves by itself.
  await page.waitForTimeout(400)
  expect(await left()).toBe(start)
  await page.getByTestId('motion-play').first().click()
  await expect.poll(left).toBeGreaterThan(start + 20)
  await expect(page.getByTestId('motion-note').first()).toHaveText('At the end. Play again to go back.')
  await page.getByTestId('motion-play').first().click()
  await expect.poll(left).toBe(start)
})

test('REQ-054 AC3: the motion demo does not move under reduced motion, and says so', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/foundations/motion')
  const dot = page.getByTestId('motion-dot').first()
  // The position inside the track: the click scrolls the page, which moves the dot on screen without moving it.
  const box = () =>
    dot.evaluate((el) => {
      const { offsetLeft, offsetTop } = el as HTMLElement
      return JSON.stringify([offsetLeft, offsetTop, getComputedStyle(el).translate])
    })
  const start = await box()
  await expect(page.getByTestId('motion-note').first()).toHaveText('Reduced motion is on, so this demo does not move.')
  await page.getByTestId('motion-play').first().click()
  // Only the dot's own animations: the Play button may run a color transition of its own on press, which is not the demo moving.
  const running = await dot.evaluate((el) => el.getAnimations().filter((a) => a.playState === 'running').length)
  expect(running).toBe(0)
  await page.waitForTimeout(400)
  expect(await box()).toBe(start)
})

test('REQ-054 AC4: every preview of a tbd token shows the hatched band, the status badge, and its TBD ids', async ({
  page,
}) => {
  for (const route of ['typography', 'spacing', 'shape', 'effects', 'motion']) {
    await page.goto(`/foundations/${route}`)
    const cards = page.getByTestId('preview')
    const count = await cards.count()
    expect(count, route).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const item = cards.nth(i)
      const paths = await item.getByTestId('preview-path').allTextContents()
      const tokens = paths.map((path) => flat[path]!)
      const ids = [...new Set(tokens.flatMap((token) => token.tbd ?? []))].sort()
      if (tokens.some((token) => token.status === 'tbd')) {
        await expect(item.getByTestId('hatch'), paths.join()).toHaveCount(1)
        const hatch = await item.getByTestId('hatch').evaluate((el) => getComputedStyle(el).backgroundImage)
        expect(hatch).toContain('repeating-linear-gradient')
        await expect(item.getByTestId('status-badge'), paths.join()).toHaveText('tbd')
      }
      expect(await item.getByTestId('tbd-badge').allTextContents(), paths.join()).toEqual(ids)
    }
  }
})

test('the token previews are not on the color page, which has its own, or on a doc with no table block', async ({
  page,
}) => {
  await page.goto('/foundations/color')
  await expect(page.getByTestId('token-previews')).toHaveCount(0)
  await page.goto('/overview/brand-identity')
  await expect(page.getByTestId('token-previews')).toHaveCount(0)
})

// T13.1 (ADR-0046, ADR-0047): the specimens render in Titan One and Rubik, and every glyph of the es-MX sample comes from
// those files. Chromium reports the fonts it used for a node, so a fallback glyph would list a second family.
test('T13.1: the specimens render in Titan One and Rubik, with no fallback glyphs in es-MX', async ({ page }) => {
  await page.goto('/foundations/typography')
  await page.evaluate(() => document.fonts.ready)
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 })
  const expected = { H1: 'Titan One', H2: 'Titan One', H3: 'Titan One', body: 'Rubik', caption: 'Rubik' }
  for (const [label, family] of Object.entries(expected)) {
    const selector = `[data-testid="preview"][data-label="${label}"] [data-testid="specimen"]`
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    // Rubik is one variable file, and Chromium names its default instance "Rubik Light", so the name is matched by prefix.
    expect(fonts.length, `${label} uses one font`).toBe(1)
    expect(fonts[0]!.familyName.startsWith(family), `${label} uses ${family}, not ${fonts[0]!.familyName}`).toBe(true)
    expect(fonts[0]!.isCustomFont, label).toBe(true)
    // The sample holds the Spanish letters, so the glyph count covers them.
    expect(fonts[0]!.glyphCount, label).toBeGreaterThan(DIACRITICS.length)
  }
})

// T13.1 (ADR-0048): a long Spanish word in a heading does not scroll sideways at 360 px. Without hyphenation the same
// word overflows, so the test shows both the problem and the remedy.
test('T13.1: long words in es-MX headings hyphenate at 360 px instead of overflowing', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/foundations/typography')
  await page.evaluate(() => document.fonts.ready)
  const results = await page.evaluate(async () => {
    const box = document.createElement('div')
    box.style.cssText = 'width:328px;position:absolute;top:0;left:16px'
    box.lang = 'es-MX'
    document.body.append(box)
    const out: Record<string, { plain: boolean; hyphenated: boolean; lines: number }> = {}
    for (const word of ['Extraordinarios', 'Responsabilidades', 'Inscripciones']) {
      const h1 = document.createElement('h1')
      h1.textContent = word
      box.append(h1)
      h1.style.hyphens = 'manual'
      h1.style.overflowWrap = 'normal'
      const plain = h1.scrollWidth > h1.clientWidth
      h1.style.hyphens = ''
      h1.style.overflowWrap = ''
      await document.fonts.ready
      const lines = Math.round(h1.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(h1).lineHeight))
      out[word] = { plain, hyphenated: h1.scrollWidth <= h1.clientWidth, lines }
    }
    return out
  })
  // A word of 15 letters or more overflows without the rule, and wraps to two lines with it.
  expect(results['Extraordinarios']).toEqual({ plain: true, hyphenated: true, lines: 2 })
  expect(results['Responsabilidades']).toEqual({ plain: true, hyphenated: true, lines: 2 })
  // The 13-letter word fits on one line either way (ADR-0048).
  expect(results['Inscripciones']).toEqual({ plain: false, hyphenated: true, lines: 1 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
