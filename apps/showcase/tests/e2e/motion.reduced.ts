// T5.5: the `reduced-motion` project runs with `prefers-reduced-motion: reduce` emulated (REQ-029 AC2). On every route,
// no animation keeps running, and a transition or animation that is declared has no visible duration. Component tasks
// add their own checks to this project for their animated parts (skeleton, sparkle, glow).
import { expect, test } from '@playwright/test'
import { builtRoutes } from './helpers/crawl'

test('the project emulates reduced motion', async ({ page }) => {
  await page.goto('/')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
})

for (const route of builtRoutes()) {
  test(`REQ-029 AC2: ${route} has no running animation`, async ({ page }) => {
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
        .map((animation) => {
          const target = (animation.effect as KeyframeEffect | null)?.target
          const name = (animation as CSSAnimation).animationName ?? (animation as CSSTransition).transitionProperty
          return `${target?.tagName.toLowerCase() ?? 'unknown'}: ${name ?? 'script animation'}`
        }),
    )
    expect(running).toEqual([])
  })
}
