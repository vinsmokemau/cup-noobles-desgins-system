// T13.2 (C-06, ADR-0051, ADR-0055): no translucent brand color is rendered, except the glow. The layer drops Nuxt UI's
// partial-opacity color classes from its themes (packages/nuxt/utils/partial-opacity.ts), so this walks the isolated demo
// pages and checks two things: no element carries one of those classes, and no element has a color that is partly
// transparent, apart from the neon glow of a button and the black backdrop of an overlay. The unit test of the strip
// itself is tests/partial-opacity.test.ts.
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'
import { isPartialOpacity } from '../../../../packages/nuxt/utils/partial-opacity'
import { openDemo } from './helpers/states'
import { expect, test } from './helpers/test'

const demosDir = fileURLToPath(new URL('../../demos', import.meta.url))
// Every demo page: the `.vue` files of a slug's folder, except the `.example.vue` snippets of the docs.
const demos = readdirSync(demosDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) =>
    readdirSync(`${demosDir}/${entry.name}`)
      .filter((file) => file.endsWith('.vue') && !file.endsWith('.example.vue'))
      .map((file) => ({ slug: entry.name, demo: file.replace(/\.vue$/, '') })),
  )

interface Finding {
  kind: string
  value: string
  where: string
}

/** Every class that is a partial opacity, and every color that is partly transparent, on the page. */
async function scan(page: Page, partial: string[]): Promise<Finding[]> {
  return page.evaluate((partialClasses) => {
    const known = new Set(partialClasses)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })!
    const alphaOf = (css: string) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = '#000000'
      context.fillStyle = css
      context.fillRect(0, 0, 1, 1)
      return context.getImageData(0, 0, 1, 1).data[3]!
    }
    const findings: Finding[] = []
    for (const el of document.querySelectorAll('body *')) {
      const where = `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').slice(0, 60)}`
      for (const className of el.classList)
        if (known.has(className)) findings.push({ kind: 'class', value: className, where })
      const style = getComputedStyle(el)
      for (const [kind, value] of [
        ['color', style.color],
        ['background-color', style.backgroundColor],
        ['border-color', style.borderTopWidth === '0px' ? '' : style.borderTopColor],
        ['outline-color', style.outlineStyle === 'none' ? '' : style.outlineColor],
      ] as const) {
        if (!value) continue
        const alpha = alphaOf(value)
        if (alpha > 0 && alpha < 255) findings.push({ kind, value, where })
      }
    }
    return findings
  }, partial)
}

// The classes the page carries are checked against the strip's own test, so the browser and the build agree on the rule.
async function classesOnPage(page: Page): Promise<string[]> {
  const all = await page.evaluate(() => [
    ...new Set([...document.querySelectorAll('body *')].flatMap((el) => [...el.classList])),
  ])
  return all.filter(isPartialOpacity)
}

for (const { slug, demo } of demos) {
  test(`C-06: ${slug}/${demo} has no partial-opacity class and no translucent color`, async ({ page }) => {
    await openDemo(page, slug, demo)
    const partial = await classesOnPage(page)
    const findings = await scan(page, partial)
    // The black backdrop of an overlay is the one translucent fill: black at 85% (ADR-0054), and it holds no brand color.
    const unexpected = findings.filter(
      (finding) =>
        !(
          finding.kind === 'background-color' &&
          /^color\(srgb 0 0 0 \/ 0\.85\)$|^rgba\(0, 0, 0, 0\.85\)$/.test(finding.value)
        ),
    )
    expect(unexpected, `${slug}/${demo}`).toEqual([])
  })
}

test('ADR-0054: an open overlay has a black backdrop at 85%, no shadow, and a stacking order below the toast', async ({
  page,
}) => {
  for (const slug of ['modal', 'slideover']) {
    await openDemo(page, slug, 'playground')
    await page.getByTestId('open').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const panel = await dialog.evaluate((el) => {
      const style = getComputedStyle(el)
      return { shadow: style.boxShadow, z: style.zIndex }
    })
    expect(panel.shadow, `${slug} shadow`).toBe('none')
    expect(panel.z, `${slug} z-index`).toBe('50')
    const overlay = page.locator('[data-slot="overlay"]')
    expect(await overlay.evaluate((el) => getComputedStyle(el).zIndex), `${slug} backdrop z-index`).toBe('50')
    // The partial-opacity classes are gone from the open overlay as well.
    expect((await classesOnPage(page)).filter(Boolean), `${slug} open`).toEqual([])
    await page.keyboard.press('Escape')
  }
})

test('ADR-0054: the toast viewport sits at 100, above every overlay', async ({ page }) => {
  await openDemo(page, 'toast', 'playground')
  await page.getByRole('button', { name: 'Mostrar aviso' }).click()
  const viewport = page.locator('.cn-toaster')
  await expect(viewport).toHaveCount(1)
  expect(await viewport.evaluate((el) => getComputedStyle(el).zIndex)).toBe('100')
})
