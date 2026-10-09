// T5.4 end-to-end checks on the static build: the route crawl and the route count (REQ-051 AC2, REQ-052 AC1), the status
// banner (REQ-057 AC1), the on-page table of contents, the verbatim brand source, the 404 page, and the fixture-doc
// edit (REQ-051 AC3). The pages are fetched as HTML where the check is about content, and opened in the browser where
// it is about behavior.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { siteBase } from '../../lib/site'
import { crawl, routeOf, type Crawl } from './helpers/crawl'
import { expect, test } from './helpers/test'

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url))
const appDir = fileURLToPath(new URL('../../', import.meta.url))
const docsDir = join(repoRoot, 'docs')

function* markdown(dir: string, prefix = ''): Generator<string> {
  for (const entry of readdirSync(join(dir, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) yield* markdown(dir, relative)
    else if (entry.name.endsWith('.md') && entry.name !== '_template.md') yield relative
  }
}

const docFiles = [...markdown(docsDir)]
const frontmatter = (file: string) =>
  parseYaml(/^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(join(docsDir, file), 'utf8'))?.[1] ?? '') as {
    title?: string
    status?: string
  }

// SPEC.md Â§4.6, one example route per row, plus the routes that have no doc behind them.
const sitemap = [
  '/',
  '/overview/glossary',
  '/overview/brand-context-source',
  '/foundations',
  '/foundations/color',
  '/tokens',
  '/components',
  '/components/button',
  '/components/modal',
  '/patterns',
  '/patterns/forms',
  '/content',
  '/content/microcopy',
  '/email',
  '/email/email-foundations',
  '/governance',
  '/governance/ownership',
  '/governance/decisions',
  '/governance/decisions/adr-0009-focus-indicator',
  '/changelog',
  '/status',
]

let crawled: Crawl
test.beforeAll(async ({ playwright, baseURL }) => {
  const request = await playwright.request.newContext({ baseURL })
  crawled = await crawl(request)
  await request.dispose()
})

test('REQ-052 AC1: the route crawl finds no 404', () => {
  expect(crawled.broken).toEqual([])
  expect(crawled.pages.size).toBeGreaterThan(docFiles.length)
})

test('REQ-052 AC1: every route in SPEC.md Â§4.6 returns a rendered page', async ({ page }) => {
  for (const route of sitemap) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBe(200)
    await expect(page.getByRole('main'), route).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 }).first(), route).toBeVisible()
  }
})

test('REQ-051 AC2: the number of doc routes equals the number of docs', () => {
  const sources = [...crawled.pages.values()].flatMap(({ html }) =>
    [...html.matchAll(/data-doc-source="([^"]+)"/g)].map((m) => m[1]!),
  )
  expect(sources.length, 'no doc is rendered on two routes').toBe(new Set(sources).size)
  expect(sources.length).toBe(docFiles.length)
  expect([...sources].sort()).toEqual(docFiles.map((file) => `docs/${file}`).sort())
})

test('every doc route shows its doc: the heading is the doc title (the brand source has a fixed title)', () => {
  for (const file of docFiles) {
    if (file === '00-overview/brand-context-source.md') continue
    const html = [...crawled.pages.values()].find((p) => p.html.includes(`data-doc-source="docs/${file}"`))?.html
    expect(html, file).toBeDefined()
    const title = frontmatter(file).title!
    const h1 = /<h1\b[^>]*>(?:<!--\[-->)?(.*?)(?:<!--\]-->)?<\/h1>/s.exec(html!)?.[1]
    expect(
      h1
        ?.replaceAll(/<[^>]+>/g, '')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"'),
      file,
    ).toBe(title)
  }
})

test('REQ-057 AC1: a status banner shows on exactly the docs whose status is draft, tbd, or deprecated', () => {
  let withBanner = 0
  let withoutBanner = 0
  for (const file of docFiles) {
    if (file === '00-overview/brand-context-source.md') continue
    const html = [...crawled.pages.values()].find((p) => p.html.includes(`data-doc-source="docs/${file}"`))!.html
    const banner = html.includes('data-testid="status-banner"')
    const status = frontmatter(file).status
    expect(banner, `${file} (${status})`).toBe(status !== 'stable')
    if (banner) withBanner++
    else withoutBanner++
  }
  expect(withBanner, 'some docs are drafts').toBeGreaterThan(0)
  expect(withoutBanner, 'some docs are stable').toBeGreaterThan(0)
})

test('REQ-057 AC1: the banner names the status, and a stable doc has none', async ({ page }) => {
  await page.goto('/foundations/color')
  await expect(page.getByTestId('status-banner')).toContainText('Status: draft')
  await page.goto('/components')
  await expect(page.getByTestId('status-banner')).toContainText('Status: tbd')
  await page.goto('/governance/decisions/adr-0009-focus-indicator')
  await expect(page.getByTestId('status-banner')).toHaveCount(0)
  await page.goto('/overview/brand-context-source')
  await expect(page.getByTestId('status-banner')).toHaveCount(0)
})

test('the on-page table of contents lists the headings of the doc and jumps to them', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/foundations/color')
  const toc = page.getByRole('complementary', { name: 'On this page' })
  await expect(toc).toBeVisible()
  const h2s = await page.locator('article h2').allInnerTexts()
  expect(h2s.length).toBeGreaterThan(2)
  const links = await toc.getByRole('link').allInnerTexts()
  for (const heading of h2s) expect(links, heading).toContain(heading)
  await toc.getByRole('link', { name: 'Purpose' }).click()
  await expect(page).toHaveURL(/#purpose$/)
})

test('doc links go to routes, not to .md files, and every anchor exists on its page', () => {
  const problems: string[] = []
  for (const [path, { html }] of crawled.pages) {
    const article = /<article\b[\s\S]*?<\/article>/.exec(html)?.[0] ?? ''
    for (const match of article.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
      const href = match[1]!
      if (/\.md(#|$)/.test(href)) problems.push(`${path}: ${href} still points at a file`)
      if (!href.startsWith('/') || href.startsWith('//')) continue
      const [target, hash] = href.split('#')
      const destination = crawled.pages.get(routeOf(target!) ?? target!)
      if (!destination) problems.push(`${path}: ${href} was not crawled`)
      else if (hash && !destination.html.includes(`id="${hash}"`)) problems.push(`${path}: ${href} has no anchor`)
    }
  }
  expect(problems).toEqual([])
})

test('the brand source page renders the source verbatim under a fixed title', async ({ page }) => {
  const source = readFileSync(join(docsDir, '00-overview/brand-context-source.md'), 'utf8')
  await page.goto('/overview/brand-context-source')
  await expect(page).toHaveTitle(/Brand context source/)
  const article = page.locator('article')
  const headings = [...source.matchAll(/^(#{1,6}) (.+)$/gm)].map((m) => ({ level: m[1]!.length, text: m[2]!.trim() }))
  const rendered = await article
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((els) =>
      els.map((el) => ({ level: Number(el.tagName.slice(1)), text: (el.textContent ?? '').trim() })),
    )
  expect(rendered).toEqual(headings)
  for (const hex of ['#ef80ae', '#fff488', '#000000']) await expect(article).toContainText(hex)
  const bulletCount = [...source.matchAll(/^- /gm)].length
  expect(await article.locator('li').count()).toBeGreaterThanOrEqual(bulletCount)
})

test('the section indexes show a card per doc with its status', async ({ page }) => {
  await page.goto('/foundations')
  const foundations = readdirSync(join(docsDir, '01-foundations')).length
  await expect(page.locator(`main a[href^="${siteBase}foundations/"]`)).toHaveCount(foundations)
  await expect(page.getByTestId('status-badge').first()).toBeVisible()
  await page.goto('/components')
  await expect(page.getByRole('heading', { name: 'Atoms' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Molecules' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Organisms' })).toBeVisible()
})

test('the pending pages say which task writes them', async ({ page }) => {
  for (const [route, task] of [
    ['/changelog', 'T11.3'],
    ['/email/email-components', 'T10.5'],
  ] as const) {
    await page.goto(route)
    await expect(page.getByTestId('pending-notice'), route).toContainText(task)
  }
})

test('a path with no page shows the 404 page, built from the design system', async ({ page }) => {
  for (const path of ['/no-such-page', '/foundations/no-such-doc', '/a/b/c']) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(404)
    await expect(page.getByRole('heading', { name: 'Page not found' }), path).toBeVisible()
    await expect(page.getByRole('button', { name: 'Back to home' }), path).toBeVisible()
    await expect(page.getByRole('main'), path).toHaveCount(1)
  }
})

test('REQ-051 AC3: editing a doc changes the rendered page after regeneration', async () => {
  test.setTimeout(480_000)
  const root = mkdtempSync(join(tmpdir(), 'cn-fixture-docs-'))
  const out = join(root, 'out')
  const doc = join(root, 'docs/01-foundations/sample.md')
  const write = (sentence: string) =>
    writeFileSync(
      doc,
      [
        '---',
        'title: Sample',
        'slug: sample',
        'layer: foundation',
        'status: draft',
        'lang: en',
        'since: 0.1.0',
        'updated: 2026-10-08',
        '---',
        '',
        '# Sample',
        '',
        '## Purpose',
        '',
        sentence,
        '',
      ].join('\n'),
    )
  const generate = () => {
    const nuxt = join(appDir, 'node_modules/nuxt/bin/nuxt.mjs')
    const result = spawnSync(process.execPath, [nuxt, 'generate'], {
      cwd: appDir,
      env: { ...process.env, CN_DOCS_ROOT: root, CN_OUT_DIR: out },
      encoding: 'utf8',
    })
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0)
    const html = join(out, 'public/foundations/sample/index.html')
    expect(existsSync(html), 'the fixture doc has a route').toBe(true)
    return readFileSync(html, 'utf8')
  }
  try {
    mkdirSync(join(root, 'docs/01-foundations'), { recursive: true })
    writeFileSync(
      join(root, 'DESIGN.md'),
      '# Fixture\n\n## Foundations\n\n- [Sample](docs/01-foundations/sample.md): a fixture doc.\n',
    )
    write('The first sentence of the fixture doc.')
    const before = generate()
    expect(before).toContain('The first sentence of the fixture doc.')

    write('The second sentence, after the edit.')
    const after = generate()
    expect(after).toContain('The second sentence, after the edit.')
    expect(after).not.toContain('The first sentence of the fixture doc.')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
