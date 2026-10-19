// T10.4 checks: the reference email layout in packages/email/src/layouts/ (REQ-043) and the build helpers it needs
// (ADR-0042). The layout compiles with the real build, composes the six components in order, and gives the header its
// logo clear space from the tokens. docs/05-email/email-layouts.md lists the plain-text counterpart (REQ-043 AC2). The
// check that the compiled layout has no horizontal scroll at 320 and 600 px (REQ-043 AC1) needs a browser, so it is the
// Playwright spec apps/showcase/tests/e2e/email-layout.spec.ts, which `pnpm test:all` runs. Tokens come from a token
// build into a temporary directory, as in tests/email-components.test.ts, so `pnpm test` needs no earlier build.
import { afterAll, beforeAll, test } from 'vitest'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build as buildTokens } from '../packages/tokens/build'
import { build, expandIncludes, injectTokens, lintSources, type EmailTokens } from '../packages/email/build'
import { readFrontmatter } from '../scripts/check-docs'
import { flatTokens } from './lib/flat-tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const layouts = join(root, 'packages/email/src/layouts')
const components = join(root, 'packages/email/src/components')
const temp = mkdtempSync(join(tmpdir(), 'cn-email-layout-'))
const tokensFile = join(temp, 'tokens/email/email-tokens.json')
const dist = join(temp, 'dist')
let tokens: EmailTokens

const source = readFileSync(join(layouts, 'reference.mjml'), 'utf8')
const slotsOf = (text: string) => [...text.matchAll(/\{\{\s*([a-z_]+)\s*\}\}/g)].map((m) => m[1]!)
const unique = (list: string[]) => [...new Set(list)]
const html = () => readFileSync(join(dist, 'reference.html'), 'utf8')
// The six components of REQ-041 AC3, in the order of the layout.
const PARTS = ['header', 'content-section', 'card', 'button', 'divider', 'footer']

const doc = readFileSync(join(root, 'docs/05-email/email-layouts.md'), 'utf8')
const section = (heading: string, level = 2) =>
  doc
    .split(new RegExp(`^${'#'.repeat(level)} ${heading}\\s*$`, 'm'))[1]
    ?.split(new RegExp(`^#{1,${level}} `, 'm'))[0] ?? ''

beforeAll(async () => {
  await buildTokens(join(temp, 'tokens'))
  tokens = JSON.parse(readFileSync(tokensFile, 'utf8')) as EmailTokens
  await build({ src: layouts, out: dist, tokensFile })
}, 60_000)
afterAll(() => rmSync(temp, { recursive: true, force: true }))

// A source tree in the temporary directory, to test the include expansion on its own.
function tree(files: Record<string, string>) {
  const dir = mkdtempSync(join(temp, 'tree-'))
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true })
    writeFileSync(join(dir, name), text)
  }
  return dir
}
const frame = '<mj-head><mj-attributes><mj-all font-family="x" /></mj-attributes></mj-head>'
const mjml = (body: string, head = frame) => `<mjml lang="es-MX">${head}<mj-body width="600px">${body}</mj-body></mjml>`

test('REQ-041 AC3, REQ-043: the layout is one source that includes the six components in order, and compiles', () => {
  const includes = [...source.matchAll(/<mj-include\s+path="([^"]+)"/g)].map((m) => m[1])
  assert.deepEqual(
    includes,
    PARTS.map((name) => `../components/${name}.mjml`),
  )
  assert.match(source, /<mjml lang="es-MX">/)
  assert.match(source, /<mj-body width="\$cn\(layout\.email\.width\.max\)"/)
  assert.deepEqual(lintSources(), [], 'no hex literal in the layout source (REQ-042 AC2)')
  assert.match(html(), /<html[^>]*lang="es-MX"/)
  assert.doesNotMatch(html(), /mj-include|\$cn\(|var\(|<script\b|<link\b/)
  assert.match(html(), /max-width:600px/)
})

test('REQ-041 AC4: the layout has the slots of its components, each component once, and in the order of the parts', () => {
  const all = unique(slotsOf(html()))
  const expected = PARTS.flatMap((name) => unique(slotsOf(readFileSync(join(components, `${name}.mjml`), 'utf8'))))
  assert.equal(all.length, 13)
  assert.deepEqual(all, expected, 'slots appear in the order of the parts, and none repeats or is missing')
  assert.deepEqual(slotsOf(html()), all, 'no slot is used twice')
})

test('REQ-043, REQ-042 AC1: the layout reads the same tokens as its components', () => {
  const text = html().replace(/:\s+/g, ':')
  assert.ok(text.includes(`border-bottom:${tokens['border.width.siteHeader']} solid ${tokens['siteHeader.line']}`))
  assert.ok(text.includes(`border:${tokens['border.width.card']} solid ${tokens['card.highlight']}`))
  assert.ok(text.includes(`border:${tokens['border.width.button']} solid ${tokens['button.primary.border']}`))
  assert.ok(text.includes(`border-top:solid ${tokens['border.width.separator']} ${tokens['separator.color']}`))
  assert.ok(text.includes(`border-top:${tokens['border.width.siteFooter']} solid ${tokens['siteFooter.line']}`))
  assert.doesNotMatch(text, /box-shadow|text-shadow|filter\s*:/i)
})

test('ADR-0016, ADR-0042: the header pads the logo with 25% of its height, computed from the tokens', async () => {
  const height = Number.parseFloat(String(tokens['logo.rule.minHeight.horizontal']))
  const share = Number(tokens['logo.rule.clearSpace'])
  assert.equal(share, 0.25)
  assert.equal(height, 36)
  const clear = `${share * height}px`
  assert.equal(clear, '9px')
  const header = readFileSync(join(components, 'header.mjml'), 'utf8')
  assert.match(header, /padding="\$cn\(logo\.rule\.clearSpace\*logo\.rule\.minHeight\.horizontal\)"/)
  assert.ok(html().includes(`padding:${clear}`), 'the compiled layout has the clear space')
  const alone = await build({ src: components, out: join(temp, 'components'), tokensFile })
  assert.ok(alone.includes('header.html'))
  assert.ok(readFileSync(join(temp, 'components/header.html'), 'utf8').includes(`padding:${clear}`))
})

test('ADR-0042: $cn(a*b) multiplies a number by a dimension and writes px', () => {
  const t: EmailTokens = { ratio: 0.25, high: '36px', tall: '2rem', half: 0.5, wide: '10px' }
  assert.equal(injectTokens('$cn(ratio*high)', t), '9px')
  assert.equal(injectTokens('$cn(high*ratio)', t), '9px')
  assert.equal(injectTokens('$cn(ratio*tall)', t), '8px', 'rem converts as in ADR-0040')
  assert.equal(injectTokens('$cn(ratio*half)', t), '0.125')
  assert.equal(injectTokens('$cn(ratio*half*high)', t), '4.5px')
  assert.equal(injectTokens('{{ x }} $cn(ratio*high)', t), '{{ x }} 9px')
})

test('ADR-0042: a product with an unknown token, two dimensions, or a non-number fails, naming the line', () => {
  const t: EmailTokens = { ratio: 0.25, high: '36px', wide: '10px', name: 'solid' }
  assert.throws(
    () => injectTokens('a\n$cn(ratio*nope)', t, 'f.mjml'),
    /f\.mjml:2: unknown token in \$cn\(ratio\*nope\)/,
  )
  assert.throws(() => injectTokens('$cn(ratio*)', t), /unknown token/)
  assert.throws(() => injectTokens('$cn(high*wide)', t), /multiplies two dimensions/)
  assert.throws(() => injectTokens('$cn(ratio*name)', t), /multiplies name, which is not a number or a px dimension/)
})

test('ADR-0042: an include is replaced by the body of the included file, before tokens are injected', () => {
  const dir = tree({
    'parts/a.mjml': mjml('<mj-section>$cn(x)</mj-section>'),
    'layouts/l.mjml': mjml('<mj-include path="../parts/a.mjml" />'),
  })
  const layout = readFileSync(join(dir, 'layouts/l.mjml'), 'utf8')
  const expanded = expandIncludes(layout, join(dir, 'layouts'), 'l.mjml')
  assert.ok(expanded.includes('<mj-body width="600px"><mj-section>$cn(x)</mj-section></mj-body>'))
  assert.ok(!expanded.includes('mj-include'))
})

test('ADR-0042: an include of a missing file, a non-mjml file, or a file with another head fails, naming the line', () => {
  const dir = tree({
    'parts/ok.mjml': mjml('<mj-section />'),
    'parts/other-head.mjml': mjml('<mj-section />', '<mj-head><mj-attributes /></mj-head>'),
    'parts/nested.mjml': mjml('<mj-include path="ok.mjml" />'),
    'parts/no-body.mjml': '<mjml lang="es-MX"></mjml>',
    'parts/note.txt': 'x',
  })
  const expand = (path: string) =>
    expandIncludes(`\n${mjml(`<mj-include path="${path}" />`)}`, join(dir, 'layouts'), 'l.mjml')
  assert.throws(
    () => expand('../parts/missing.mjml'),
    /l\.mjml:2: mj-include "\.\.\/parts\/missing\.mjml" cannot be read/,
  )
  assert.throws(() => expand('../parts/note.txt'), /is not an \.mjml file/)
  assert.throws(() => expand('../parts/other-head.mjml'), /<mj-head> or <mj-body> tag that differs/)
  assert.throws(() => expand('../parts/nested.mjml'), /includes another file/)
  assert.throws(() => expand('../parts/no-body.mjml'), /has no <mj-body>/)
  assert.doesNotThrow(() => expand('../parts/ok.mjml'))
})

test('REQ-043 AC2: the plain-text counterpart lists every slot of the layout but the logo image, part by part', () => {
  const part = section('Plain-text counterpart', 3)
  assert.ok(part.trim().length > 0, 'the section exists')
  const table = part.split('\n').filter((line) => /^\| \d+ \|/.test(line))
  assert.equal(table.length, PARTS.length, 'one block per part')
  // The logo address is an image, which has no plain-text form. Every other slot of a part is in that part's block.
  PARTS.forEach((name, index) => {
    const expected = unique(slotsOf(readFileSync(join(components, `${name}.mjml`), 'utf8')))
      .filter((slot) => slot !== 'logo_url')
      .sort()
    assert.deepEqual(unique(slotsOf(table[index]!)).sort(), expected, `${name}: its block holds its slots`)
  })
  assert.doesNotMatch(table.join('\n'), /logo_url/)
  assert.match(part, /except `\{\{ logo_url \}\}`/)
  assert.match(table[4]!, /`---`/, 'the divider is a line of three hyphens')
  for (const rule of ['plain text', 'UTF-8', 'no markup', 'no images', 'full address', 'es-MX']) {
    assert.ok(part.toLowerCase().includes(rule.toLowerCase()), `the rules mention "${rule}"`)
  }
})

test('REQ-043 AC2, REQ-007: the plain-text example is a copy es-MX block, and holds the divider and a link per slot URL', () => {
  const block = /```copy es-MX\n([\s\S]*?)```/.exec(section('Plain-text counterpart', 3))?.[1] ?? ''
  assert.ok(block.length > 0, 'a copy es-MX block')
  assert.match(block, /^---$/m)
  assert.equal([...block.matchAll(/https:\/\/\S+/g)].length, 3, 'home, button, and footer link addresses')
  assert.doesNotMatch(block, /<[a-z]/i, 'no markup')
})

test('REQ-043: the doc names the widths, and the Playwright spec renders the layout at both', () => {
  assert.match(section('Widths', 3), /320 px/)
  assert.match(section('Widths', 3), /600 px/)
  const spec = readFileSync(join(root, 'apps/showcase/tests/e2e/email-layout.spec.ts'), 'utf8')
  assert.match(spec, /for \(const width of \[320, 600\]\)/)
  assert.match(spec, /dist\/reference\.html/)
  assert.match(spec, /scrollWidth/)
})

test('REQ-042, REQ-040 AC2: every token the doc names in a code span is in email-tokens.json', async () => {
  const flat = await flatTokens<unknown>()
  const prose = doc
    .replace(/<!-- cn:generated[\s\S]*?<!-- \/cn:generated -->/g, '')
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, '')
  const names = [...prose.matchAll(/`([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9-]+)+)`/g)].map((m) => m[1]!)
  const files = new Set(['email-tokens.json', 'build.ts', 'reference.html', 'reference.mjml', 'example.com'])
  const found = [...new Set(names)].filter((name) => !files.has(name) && !/\.(json|ts|md|html|mjml)$/.test(name))
  assert.ok(found.length >= 5, 'the doc names its tokens')
  for (const token of found) assert.ok(token in flat, `"${token}" is a token`)
})

test('REQ-009, REQ-037: the doc is a draft with a Draft callout and its TBD items, and holds no hex literal or typeface', () => {
  const data = readFrontmatter(doc).data as Record<string, unknown>
  assert.equal(data.status, 'draft')
  assert.equal(data.layer, 'email')
  // ADR-0042: the owner approved the layout, so no Draft callout remains; the open TBD items keep the doc a draft.
  assert.doesNotMatch(doc, /^> \*\*Draft:\*\*/m)
  assert.match(
    doc,
    /^- 0\.1\.0 — Part order, plain-text blocks, and logo clear space approved by the owner[^\n]* — ADR-0042$/m,
  )
  assert.doesNotMatch(doc, /Content pending/)
  for (const id of ['TBD-09', 'TBD-10']) {
    assert.ok((data.tbd as string[]).includes(id), `${id} is listed`)
    assert.match(section('Open items'), new RegExp(`\\*\\*TBD \\(${id}\\):\\*\\*`), `${id} has a callout`)
  }
  const prose = doc.replace(/<!-- cn:generated[\s\S]*?<!-- \/cn:generated -->/g, '')
  assert.doesNotMatch(prose, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(prose, /\b(?:Ubuntu|Helvetica|Arial|Roboto|Segoe)\b/)
  assert.match(doc, /^- 0\.1\.0 — First draft: .*\(T10\.4, REQ-043\)/m)
})

test('ADR-0042 is stable, links its context, and the decision log lists it', () => {
  const adr = readFileSync(
    join(root, 'docs/06-governance/decisions/0042-email-layout-includes-and-clear-space.md'),
    'utf8',
  )
  assert.equal((readFrontmatter(adr).data as Record<string, unknown>).status, 'stable')
  for (const heading of ['Context', 'Decision', 'Consequences']) assert.match(adr, new RegExp(`^## ${heading}$`, 'm'))
  assert.match(adr, /ADR-0041/)
  const log = readFileSync(join(root, 'docs/06-governance/decision-log.md'), 'utf8')
  assert.match(log, /decisions\/0042-email-layout-includes-and-clear-space\.md/)
})
