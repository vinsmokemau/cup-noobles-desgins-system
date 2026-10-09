// T5.7: what a page needs before a check runs, in place of `networkidle` (which waits for 500 ms of silence on every page).
// The checks need the app hydrated (the skip link, the menu button, and the 404 page are drawn or wired by the client) and
// a first-level heading on screen.
import { expect, type Page } from '@playwright/test'

type NuxtWindow = Window & { useNuxtApp?: () => { isHydrating: boolean } }

/** Resolves once Nuxt has hydrated the page and its h1 is attached. */
export async function waitForPage(page: Page) {
  await page.waitForFunction(() => (window as NuxtWindow).useNuxtApp?.().isHydrating === false)
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeAttached()
}
