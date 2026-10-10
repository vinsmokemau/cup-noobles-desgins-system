// T7.8 (REQ-029 AC2): with `prefers-reduced-motion: reduce` emulated, an animated sparkle does not fade. motion.reduced.ts
// already checks that no animation runs on any route; this names the component, and proves the reason: its animation is
// switched off in the rule, not just paused.
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

test('REQ-029 AC2: an animated sparkle does not animate under reduced motion', async ({ page }) => {
  await openDemo(page, 'sparkle', 'states')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  const sparkle = page.locator('[data-state="animated"] .cn-sparkle')
  await expect(sparkle).toHaveAttribute('data-animated', 'true')
  expect(await sparkle.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  expect(await sparkle.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  expect(
    await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length),
  ).toBe(0)
})
