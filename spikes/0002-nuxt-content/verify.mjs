// T0.2 evidence. Run from spikes/0002-nuxt-content/site with `pnpm verify`.
// 1. Builds twice against a temp docs dir holding an invalid doc: once without the frontmatter
//    guard (control: Content accepts it) and once with it (the build must fail on the schema).
// 2. Builds statically against ../docs and checks the output. This build runs last, so
//    .output/public is the valid site afterwards.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const spikeDir = fileURLToPath(new URL('.', import.meta.url))
const siteDir = join(spikeDir, 'site')
const docsDir = join(spikeDir, 'docs')
const publicDir = join(siteDir, '.output', 'public')

let failed = 0
const check = (label, ok, detail = '') => {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  [${detail}]` : ''}`)
}

const generate = env => spawnSync('pnpm exec nuxt generate', {
  cwd: siteDir, shell: true, encoding: 'utf8', env: { ...process.env, ...env }
})

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])

const hashTree = dir => Object.fromEntries(walk(dir).map(f =>
  [relative(dir, f), createHash('sha256').update(readFileSync(f)).digest('hex')]))

// --- 1. Schema enforcement --------------------------------------------------------------
const badDir = mkdtempSync(join(tmpdir(), 'cn-spike-0002-'))
cpSync(docsDir, badDir, { recursive: true })
writeFileSync(join(badDir, 'invalid.md'), [
  '---', 'title: Invalid', 'slug: invalid', 'layer: overview', 'status: finished', 'lang: es',
  'since: 0.1.0', 'updated: 2026-09-25', '---', '', '# Invalid', ''
].join('\n'))
// Control: without the guard, Content 3.16.1 accepts the invalid doc and renders its bad values.
const control = generate({ SPIKE_DOCS_DIR: badDir, SPIKE_NO_GUARD: '1' })
const controlPage = join(publicDir, 'docs', 'invalid', 'index.html')
check('Control: Content alone does not enforce the schema',
  control.status === 0 && existsSync(controlPage) && readFileSync(controlPage, 'utf8').includes('<p data-status>finished</p>'),
  `exit ${control.status}`)
// A BOM hides frontmatter from Content (the doc gets null fields). Added after the control run,
// whose index page would otherwise link to /docs/null.
writeFileSync(join(badDir, 'bom.md'), '﻿' + readFileSync(join(docsDir, '00-overview', 'sample-overview.md'), 'utf8'))
const bad = generate({ SPIKE_DOCS_DIR: badDir })
rmSync(badDir, { recursive: true, force: true })
const badLog = `${bad.stdout}\n${bad.stderr}`
check('Build fails on invalid frontmatter', bad.status !== 0, `exit ${bad.status}`)
// This run follows the control run, which left invalid.md in Content's parse cache. The guard
// reads files from disk, so a cache hit cannot skip it.
check('Failure names the file and exactly the bad fields',
  badLog.includes('[cn] Invalid frontmatter:') && /^invalid\.md: /m.test(badLog)
  && /status: Invalid enum value/.test(badLog) && /lang: Invalid literal value/.test(badLog)
  && !/slug: /.test(badLog))
check('Failure flags a BOM-prefixed doc', /bom\.md: starts with a UTF-8 BOM/.test(badLog))
check('Failure stops the build before prerendering', !badLog.includes('Prerendering'))

// --- 2. Static build from the parent directory -------------------------------------------
const before = hashTree(docsDir)
const good = generate({ SPIKE_DOCS_DIR: '' })
check('Static generate succeeds against ../docs', good.status === 0, `exit ${good.status}`)
check('Source docs unchanged by the build', JSON.stringify(hashTree(docsDir)) === JSON.stringify(before))

const siteMd = walk(siteDir)
  .filter(f => !/[\\/](node_modules|\.nuxt|\.output|\.data)[\\/]/.test(f))
  .filter(f => f.endsWith('.md'))
check('No .md file inside the app directory (REQ-051 AC1)', siteMd.length === 0, siteMd.join(', '))

const docFiles = walk(docsDir).filter(f => f.endsWith('.md'))
const docRoutes = existsSync(join(publicDir, 'docs'))
  ? readdirSync(join(publicDir, 'docs')).filter(d => existsSync(join(publicDir, 'docs', d, 'index.html')))
  : []
check('One static route per doc (REQ-051 AC2 shape)', docRoutes.length === docFiles.length,
  `${docRoutes.length} routes, ${docFiles.length} docs`)

const page = slug => readFileSync(join(publicDir, 'docs', slug, 'index.html'), 'utf8')
const overview = page('sample-overview')
const foundation = page('sample-foundation')
check('sample-overview rendered statically', /<h1 id="sample-overview">[\s\S]*?Sample overview/.test(overview))
check('sample-foundation rendered statically', /<h1 id="sample-foundation">[\s\S]*?Sample foundation/.test(foundation))
check('Frontmatter reaches the page (status)', foundation.includes('<p data-status>draft</p>'))

check('Generated block intercepted into CnGenerated',
  /<section data-cn-generated data-tokens="spike\.sample" data-format="table">/.test(foundation))
check('Original table kept as the fallback slot',
  /data-cn-generated[\s\S]*<table>[\s\S]*spike\.sample\.two[\s\S]*<\/table>[\s\S]*<\/section>/.test(foundation))
check('No raw cn:generated marker leaks into HTML', !foundation.includes('cn:generated'))
const rawFoundation = readFileSync(join(docsDir, '01-foundations', 'sample-foundation.md'), 'utf8')
check('Raw .md keeps the marker and has no MDC syntax (REQ-008 AC1)',
  rawFoundation.includes('<!-- cn:generated') && !/^::/m.test(rawFoundation) && !/:[\w-]+\{/.test(rawFoundation))

const sections = JSON.parse(readFileSync(join(publicDir, 'search-sections.json'), 'utf8'))
const ids = sections.map(s => s.id)
check('Search sections prerendered for both docs',
  ids.includes('/00-overview/sample-overview#purpose') && ids.includes('/01-foundations/sample-foundation#tokens-and-specs'),
  `${sections.length} sections`)
check('Search content includes generated table text',
  sections.some(s => s.content.includes('spike.sample.one')))

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
