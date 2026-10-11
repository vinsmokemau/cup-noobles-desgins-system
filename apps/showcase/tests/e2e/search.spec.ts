// T11.1 (REQ-056): the global search. Every query and every expected target is read from the repository (the docs and
// tokens.flat.json), so a doc or a token that is added shows up here without an edit. The shortcut is Ctrl+K, or Cmd+K when
// the browser says it is macOS (Nuxt UI reads the user agent), so both are run. Keyboard and axe (REQ-060 AC1) are checked
// with the palette open.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Locator, Page } from '@playwright/test'
import { scanDocs } from '../../lib/doc-scan'
import { expectNoA11yViolations, expectNoHorizontalOverflow, expectTargetSize } from './helpers/a11y'
import { waitForPage } from './helpers/ready'
import { expect, test, withBase } from './helpers/test'

const repo = fileURLToPath(new URL('../../../../', import.meta.url))
const docsDir = join(repo, 'docs')
const docs = scanDocs(docsDir)
const flat = JSON.parse(readFileSync(join(repo, 'packages/tokens/dist/json/tokens.flat.json'), 'utf8')) as Record<
  string,
  unknown
>

const MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

const read = (file: string) => readFileSync(join(docsDir, file), 'utf8')
const frontmatter = (file: string, key: string) =>
  new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(read(file).split(/\r?\n---/)[0]!)?.[1]
const titleOf = (file: string) => frontmatter(file, 'title')!.replace(/^["']|["']$/g, '')

/** Every `##` and `###` heading of every doc, with the doc it is in. A heading in a code fence is not one. */
function headings() {
  const found: { text: string; file: string }[] = []
  const walk = (dir: string, prefix = '') => {
    for (const entry of readdirSync(join(docsDir, dir), { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) walk(relative.replaceAll('\\', '/'), relative)
      else if (entry.name.endsWith('.md') && entry.name !== '_template.md') {
        let fenced = false
        for (const line of read(relative).split(/\r?\n/)) {
          if (line.startsWith('```')) fenced = !fenced
          const match = !fenced && /^#{2,3} (.+?)\s*$/.exec(line)
          if (match) found.push({ text: match[1]!, file: relative })
        }
      }
    }
  }
  walk('')
  return found
}

const dialog = (page: Page) => page.getByRole('dialog', { name: 'Search' })
const input = (page: Page) => dialog(page).getByRole('textbox')
const results = (page: Page) => dialog(page).getByRole('option')
const triggerButton = (page: Page) => page.getByRole('banner').getByRole('button', { name: 'Search' })

async function openWithShortcut(page: Page, key = 'Control+K') {
  await page.goto('/')
  await waitForPage(page)
  await page.keyboard.press(key)
  await expect(dialog(page)).toBeVisible()
  await expect(input(page)).toBeFocused()
}

async function search(page: Page, query: string) {
  await input(page).fill(query)
}

/** The result row that links to `route` (the link of a row is the row itself). */
const resultTo = (page: Page, route: string): Locator => results(page).and(page.locator(`a[href="${withBase(route)}"]`))

test.describe('shortcut', () => {
  test('REQ-056 AC1: Ctrl+K opens the search, and Escape closes it', async ({ page }) => {
    await openWithShortcut(page, 'Control+K')
    await expect(dialog(page)).toHaveAccessibleDescription(/page title, heading, token path, or component name/)
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toHaveCount(0)
  })

  test('REQ-056 AC1: the shortcut opens the search from any doc page, not only the home page', async ({ page }) => {
    await page.goto('/components/button')
    await waitForPage(page)
    await page.keyboard.press('Control+K')
    await expect(dialog(page)).toBeVisible()
  })

  test('REQ-056 AC1: the same shortcut closes the open search', async ({ page }) => {
    await openWithShortcut(page)
    await page.keyboard.press('Control+K')
    await expect(dialog(page)).toHaveCount(0)
  })

  test('REQ-056 AC1: the header button opens it too, and it is named and announces the shortcut', async ({ page }) => {
    await page.goto('/')
    await waitForPage(page)
    await expect(triggerButton(page)).toHaveAttribute('aria-keyshortcuts', 'Control+K Meta+K')
    await triggerButton(page).click()
    await expect(dialog(page)).toBeVisible()
    await expect(input(page)).toBeFocused()
  })

  test.describe('on macOS', () => {
    test.use({ userAgent: MAC })

    test('REQ-056 AC1: Cmd+K opens the search', async ({ page }) => {
      await openWithShortcut(page, 'Meta+K')
      await page.keyboard.press('Escape')
      await expect(dialog(page)).toHaveCount(0)
    })
  })
})

test.describe('results', () => {
  test('with nothing typed, the list is the doc titles, and no color mode command is offered (REQ-031)', async ({
    page,
  }) => {
    await openWithShortcut(page)
    await expect(dialog(page).getByText('Pages', { exact: true })).toBeVisible()
    await expect(dialog(page).getByText('Sections', { exact: true })).toHaveCount(0)
    await expect(dialog(page).getByText('Tokens', { exact: true })).toHaveCount(0)
    for (const mode of ['Light', 'Dark', 'System']) {
      await expect(dialog(page).getByText(mode, { exact: true }), `${mode} is not offered`).toHaveCount(0)
    }
    await expect(results(page).first()).toBeVisible()
  })

  test('REQ-056 AC1, AC2: a doc title finds its page, and choosing it opens the page', async ({ page }) => {
    const doc = docs.find((entry) => entry.route === '/foundations/typography')!
    const title = titleOf(doc.file)
    await openWithShortcut(page)
    await search(page, title)
    await expect(results(page).first()).toContainText(title)
    await expect(resultTo(page, doc.route)).toBeVisible()
    await resultTo(page, doc.route).click()
    await expect(page).toHaveURL(new RegExp(`${doc.route}$`))
    await expect(dialog(page)).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
  })

  test('REQ-056 AC1, AC2: a heading finds its page and its anchor, and the page scrolls to it', async ({ page }) => {
    const all = headings()
    // A heading that only one doc has, so the right result is unambiguous. It must be below the title and have an id.
    const unique = all.filter((heading) => all.filter((other) => other.text === heading.text).length === 1)
    const pick = unique.find((heading) => heading.file === '01-foundations/color.md')!
    expect(pick, 'color.md has a heading no other doc has').toBeTruthy()
    const doc = docs.find((entry) => entry.file === pick.file)!

    await openWithShortcut(page)
    await search(page, pick.text)
    const row = results(page).filter({ hasText: pick.text }).first()
    await expect(row).toBeVisible()
    const href = (await row.getAttribute('href'))!
    expect(href.startsWith(withBase(`${doc.route}#`)), `${href} is on ${doc.route}`).toBe(true)
    await row.click()
    await expect(page).toHaveURL(new RegExp(`${doc.route}#.+`))
    const anchor = decodeURIComponent(new URL(page.url()).hash.slice(1))
    const heading = page.locator(`[id="${anchor}"]`)
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(pick.text.replace(/`/g, ''))
    await expect(heading).toBeInViewport()
  })

  test('REQ-056 AC1, AC2: a token path finds its row on /tokens, and the row is in view', async ({ page }) => {
    const path = 'color.brand.primary'
    expect(flat, 'the token exists').toHaveProperty([path])
    await openWithShortcut(page)
    await search(page, path)
    const row = resultTo(page, `/tokens#token-${path}`)
    await expect(row).toBeVisible()
    await expect(results(page).first()).toContainText(path)
    await row.click()
    await expect(page).toHaveURL(new RegExp(`/tokens#token-${path.replaceAll('.', '\\.')}$`))
    const tokenRow = page.locator(`[data-testid="token-row"][data-path="${path}"]`)
    await expect(tokenRow).toBeVisible()
    await expect(tokenRow).toBeInViewport()
  })

  test('REQ-056 AC1, AC2: a component name finds the page of the component, Nuxt UI or custom', async ({ page }) => {
    for (const [name, route] of [
      ['UButton', '/components/button'],
      ['CnMediaCard', '/components/media-card'],
    ] as const) {
      const doc = docs.find((entry) => entry.route === route)!
      expect(read(doc.file), `${doc.file} names ${name}`).toContain(name)
      await openWithShortcut(page)
      await search(page, name)
      await expect(resultTo(page, route), name).toBeVisible()
      await expect(results(page).first(), name).toContainText(name)
      await resultTo(page, route).click()
      await expect(page).toHaveURL(new RegExp(`${route}$`))
    }
  })

  test('a query that matches nothing says so, and the search stays usable', async ({ page }) => {
    await openWithShortcut(page)
    await search(page, 'zzqx-no-such-thing')
    await expect(dialog(page)).toContainText('No result for "zzqx-no-such-thing"')
    await search(page, 'Color')
    await expect(results(page).first()).toBeVisible()
  })

  test('the search data is a file the build wrote, with a page for every doc', async ({ request }) => {
    const response = await request.get(withBase('/search-sections.json'))
    expect(response.status()).toBe(200)
    const data = (await response.json()) as { pages: { path: string }[]; sections: { id: string }[] }
    expect(data.pages.length).toBe(docs.length)
    expect(data.sections.length).toBeGreaterThan(docs.length)
    for (const doc of docs)
      expect(
        data.pages.map((p) => p.path),
        doc.file,
      ).toContain(doc.path)
  })
})

test.describe('keyboard', () => {
  test('REQ-056, REQ-060 AC2: arrows move through the results, Enter opens one, and Tab stays inside', async ({
    page,
  }) => {
    await openWithShortcut(page)
    await search(page, 'Color')
    await expect(results(page).first()).toBeVisible()
    expect(await results(page).count()).toBeGreaterThan(1)
    const highlighted = () => dialog(page).locator('[data-highlighted]')
    await expect(highlighted()).toHaveCount(1)
    const first = (await highlighted().textContent())!
    await page.keyboard.press('ArrowDown')
    await expect.poll(async () => (await highlighted().textContent())!).not.toBe(first)
    await page.keyboard.press('ArrowUp')
    await expect.poll(async () => (await highlighted().textContent())!).toBe(first)

    // The active result shows the focus ring, not a fill that reads black on the black page (REQ-024).
    const outline = await highlighted().evaluate((el) => {
      const style = getComputedStyle(el)
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
    })
    expect(outline.style).toBe('solid')
    expect(outline.width).toBeGreaterThan(0)

    const inside = () =>
      page.evaluate(() => {
        const open = document.querySelector('[role="dialog"]')
        return !!open && open.contains(document.activeElement)
      })
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      expect(await inside(), `Tab ${i + 1} stays in the search`).toBe(true)
    }

    await input(page).focus()
    const target = await highlighted().getAttribute('href')
    await page.keyboard.press('Enter')
    await expect(dialog(page)).toHaveCount(0)
    await expect(page).toHaveURL(new RegExp(`${target!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`))
  })

  test('a long list scrolls, and the arrow keys keep the active result in view', async ({ page }) => {
    await openWithShortcut(page)
    const listbox = dialog(page).getByRole('listbox', { name: 'Search results' })
    await expect(results(page).first()).toBeVisible()
    const overflows = await listbox.evaluate((el) => el.scrollHeight > el.clientHeight)
    expect(overflows, 'the empty list is longer than the panel').toBe(true)
    await input(page).focus()
    for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowDown')
    const active = dialog(page).locator('[data-highlighted]')
    await expect(active).toBeInViewport()
    const inside = await active.evaluate((el) => {
      const list = el.closest('[role="listbox"]')!.getBoundingClientRect()
      const row = el.getBoundingClientRect()
      return row.top >= list.top - 1 && row.bottom <= list.bottom + 1
    })
    expect(inside, 'the active result is inside the list').toBe(true)
    expect(await listbox.evaluate((el) => el.scrollTop), 'the list scrolled').toBeGreaterThan(0)
  })

  test('REQ-060 AC2: the whole flow works with the keyboard alone, from the header button', async ({ page }) => {
    await page.goto('/')
    await waitForPage(page)
    await triggerButton(page).focus()
    await page.keyboard.press('Enter')
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.type('Typography')
    await expect(results(page).first()).toContainText('Typography')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/foundations\/typography$/)
    await expect(dialog(page)).toHaveCount(0)
  })

  test('Escape closes the search and focus goes back to the button that opened it', async ({ page }) => {
    await page.goto('/')
    await waitForPage(page)
    await triggerButton(page).focus()
    await page.keyboard.press('Enter')
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toHaveCount(0)
    await expect(triggerButton(page)).toBeFocused()
  })
})

test.describe('accessibility', () => {
  for (const width of [360, 1280]) {
    test(`REQ-060 AC1: axe reports no violation with the search open, empty and with results, at ${width} px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 })
      await openWithShortcut(page)
      await expect(results(page).first()).toBeVisible()
      await expectNoA11yViolations(page, { label: `the empty search at ${width} px` })
      await search(page, 'color')
      await expect(dialog(page).getByText('Tokens', { exact: true })).toBeVisible()
      await expectNoA11yViolations(page, { label: `the search with results at ${width} px` })
      await expectNoHorizontalOverflow(page, `the search at ${width} px`)
      await expectTargetSize(page, `the search at ${width} px`)
    })
  }

  test('REQ-056: the header button fits the header at 360 px and is at least 24 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/')
    await waitForPage(page)
    await expectNoHorizontalOverflow(page, 'the home page at 360 px')
    const box = (await triggerButton(page).boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(24)
    expect(box.height).toBeGreaterThanOrEqual(24)
  })

  test('the palette keeps the overlay look of the modal: a black panel with a pink outline (ADR-0029)', async ({
    page,
  }) => {
    await openWithShortcut(page)
    const style = await dialog(page).evaluate((el) => {
      const s = getComputedStyle(el)
      return { background: s.backgroundColor, border: s.borderTopColor }
    })
    expect(style.background).toBe('rgb(0, 0, 0)')
    expect(style.border).toBe('rgb(239, 128, 174)')
  })
})
