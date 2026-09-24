// Starts the built SSR server and checks the ADR-0001 claims. Run after `pnpm build`.
import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'

const PORT = 3917
const URL = `http://localhost:${PORT}/`
const EXPECTED = 'rgb(239, 128, 174)' // #ef80ae (BR-01)

const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: String(PORT), NITRO_PORT: String(PORT) },
  stdio: 'inherit'
})

const results = []
const check = (name, ok, detail) => results.push({ name, ok, detail })

try {
  let html
  for (let i = 0; i < 50 && !html; i++) {
    try { html = await (await fetch(URL)).text() } catch { await new Promise(r => setTimeout(r, 200)) }
  }
  if (!html) throw new Error('server did not start')

  check('SSR html has class="dark"', /<html[^>]*class="[^"]*\bdark\b/.test(html))
  check('SSR html contains the layer-themed button', html.includes('data-testid="spike-button"'))
  check('SSR html maps primary alias to cn-pink scale', html.includes('--ui-color-primary-400: var(--color-cn-pink-400'))
  check('No color-mode component rendered', !/color-mode|ColorMode/i.test(html))

  const browser = await chromium.launch({ channel: 'msedge' })
  for (const js of [false, true]) {
    const page = await (await browser.newContext({ javaScriptEnabled: js })).newPage()
    await page.goto(URL, { waitUntil: 'networkidle' })
    const bg = await page.locator('[data-testid="spike-button"]').evaluate(el => getComputedStyle(el).backgroundColor)
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    check(`button background = BR-01 pink (JS ${js ? 'on, hydrated' : 'off, SSR only'})`, bg === EXPECTED, bg)
    check(`<html> is dark (JS ${js ? 'on' : 'off'})`, dark)
  }
  await browser.close()
} finally {
  server.kill()
}

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  [${r.detail}]` : ''}`)
process.exit(results.every(r => r.ok) ? 0 : 1)
