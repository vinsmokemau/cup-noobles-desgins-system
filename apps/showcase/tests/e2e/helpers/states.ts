// T7.1 (REQ-026 AC2, AC3): the helper every component task uses to give a state matrix its visual baselines. A component's
// `states` demo marks each state with `data-state="<state>"`; this opens the isolated demo route, checks that the matrix
// shows exactly the states the doc lists, and asserts one baseline image per state (A-12: images are made and compared in
// the pinned Linux container only, see visual.ts).
import { expect, type Page } from '@playwright/test'
import { demoRoute, STATES_DEMO } from '../../../lib/demos'
import { waitForHydration } from './ready'
import { expectVisual } from './visual'

/** Opens the isolated page of a demo and waits for it to be ready. */
export async function openDemo(page: Page, slug: string, demo: string) {
  const response = await page.goto(demoRoute(slug, demo))
  expect(response?.status(), `${slug}/${demo} demo page`).toBe(200)
  await waitForHydration(page)
  await expect(page.getByTestId('demo-root')).toBeVisible()
}

/**
 * The states a component's matrix shows, in page order. A matrix cell is a plain element; Nuxt UI parts carry
 * `data-slot` and Reka UI parts use `data-state` for their own open/closed state (the select), so those are skipped.
 */
export async function matrixStates(page: Page): Promise<string[]> {
  return page
    .locator('[data-state]:not([data-slot])')
    .evaluateAll((cells) => cells.map((cell) => cell.getAttribute('data-state')!))
}

/**
 * Opens `slug`'s state matrix and checks it: it shows at least one state, shows none twice, and, when `states` is given
 * (the States table of the doc), shows exactly those (REQ-026 AC2). Returns the states in page order.
 */
export async function expectStateMatrix(page: Page, slug: string, states?: string[]): Promise<string[]> {
  await openDemo(page, slug, STATES_DEMO)
  const shown = await matrixStates(page)
  expect(shown.length, `${slug}: the state matrix shows no state`).toBeGreaterThan(0)
  expect(new Set(shown).size, `${slug}: a state is shown twice`).toBe(shown.length)
  if (states)
    expect([...shown].sort(), `${slug}: the matrix and the doc list different states`).toEqual([...states].sort())
  return shown
}

/**
 * Asserts the baseline image of every state in `slug`'s state matrix (REQ-026 AC3), after `expectStateMatrix`. Baselines
 * are named `<slug>-<state>`.
 */
export async function expectStateBaselines(page: Page, slug: string, states?: string[]) {
  for (const state of await expectStateMatrix(page, slug, states)) {
    // Reka UI parts carry `data-state` too (`checked`, `unchecked`), so a matrix cell is the one without `data-slot`.
    await expectVisual(page.locator(`[data-state="${state}"]:not([data-slot])`), `${slug}-${state}`)
  }
}
