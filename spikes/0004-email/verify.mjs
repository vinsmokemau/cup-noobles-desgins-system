// Builds the spike and checks the ADR-0004 claims. Run after `pnpm install`.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, rmSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { compile, MJML_OPTIONS } from './build.mjs'

const tokens = JSON.parse(readFileSync('email-tokens.json', 'utf8'))
const source = readFileSync('src/button.mjml', 'utf8')
const PINK = '#ef80ae' // BR-01
const BLACK = '#000000' // BR-03; black label on pink fill (§2.1 derived facts)

const results = []
const check = (name, ok, detail) => results.push({ name, ok, detail })
const sha = s => createHash('sha256').update(s).digest('hex')

rmSync('.verify', { recursive: true, force: true })
for (const dir of ['.verify/a', '.verify/b']) {
  const r = spawnSync(process.execPath, ['build.mjs', dir], { encoding: 'utf8' })
  check(`Build into ${dir} exits 0`, r.status === 0, r.status === 0 ? '' : r.stderr)
}
const html = readFileSync('.verify/a/button.html', 'utf8')
check('Byte-identical across two builds', sha(html) === sha(readFileSync('.verify/b/button.html', 'utf8')), sha(html).slice(0, 12))

// Done-when and REQ-041 AC2 / REQ-044 AC1.
check('Injected hex present: button.primary.bg', html.includes(`background:${PINK}`) && html.includes(`bgcolor="${PINK}"`))
check('Injected hex present: button.primary.label', html.includes(`color:${BLACK}`))
check('No $cn( left in output', !html.includes('$cn('))
check('{{ label }} intact (text slot)', html.includes('{{ label }}'))
check('{{ url }} intact (attribute slot)', html.includes('href="{{ url }}"'))
check('No var(', !html.includes('var('))
check('No <link> (no external stylesheet)', !/<link\b/i.test(html))
check('No <script>', !/<script\b/i.test(html))
check('No @import or url( (no external CSS)', !/@import|url\(/i.test(html))
check('No backend template tags ({%, <%, @{)', !/\{%|<%|@\{/.test(html))
const hexes = [...new Set(html.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) ?? [])]
check('Every hex in output is in email-tokens.json', hexes.every(h => Object.values(tokens).includes(h.toLowerCase())), hexes.join(','))
check('No CR line endings', !html.includes('\r'))

// Inlining behavior.
const styleBlocks = html.match(/<style\b/g)?.length ?? 0
check('Observed: component attributes render as inline style=""', /<a\b[^>]*style="[^"]*color:#000000/.test(html))
check('Observed: MJML keeps its reset and media queries in <head> <style> blocks', styleBlocks > 0, `${styleBlocks} blocks`)
check('Observed: <noscript> inside the Outlook conditional (not a <script>)', html.includes('<noscript>'))
const defaults = ['font-family:Ubuntu, Helvetica, Arial, sans-serif', 'font-size:13px', 'border-radius:3px', 'padding:10px 25px']
check('Observed: MJML defaults fill unset attributes (not brand values)', defaults.every(d => html.includes(d)), defaults.join(' | '))
check('Observed: <html lang> defaults to "und"', html.includes('<html lang="und"'))

const inlineSrc = source.replace('<mj-body>', '<mj-head><mj-style inline="inline">.cta { letter-spacing: 0; }</mj-style></mj-head>\n  <mj-body>').replace('<mj-button ', '<mj-button css-class="cta" ')
const inlined = await compile(inlineSrc, tokens)
check('Control: mj-style inline="inline" is inlined by juice', /class="cta"[^>]*style="[^"]*letter-spacing:\s*0/.test(inlined))
check('Control: {{ label }} and {{ url }} survive juice inlining', inlined.includes('{{ label }}') && inlined.includes('href="{{ url }}"'))

// Controls.
const withDefaultFonts = await compile(source, tokens, { validationLevel: 'strict' })
const fontLink = withDefaultFonts.match(/<link href="([^"]+)"/)?.[1]
check('Control: without fonts: {}, MJML adds a Google Fonts <link> and @import', Boolean(fontLink) && withDefaultFonts.includes('@import url('), fontLink)

let unknownErr = null
try { await compile(source.replace('button.primary.bg', 'button.primary.missing'), tokens) } catch (e) { unknownErr = e }
check('Control: an unknown $cn() path fails the build', unknownErr !== null, unknownErr?.message)

let strictErr = null
try { await compile(source.replace('<mj-button ', '<mj-button bogus="x" '), tokens) } catch (e) { strictErr = e }
check('Control: validationLevel strict rejects an invalid attribute', strictErr !== null, strictErr?.errors?.[0]?.formattedMessage ?? strictErr?.message)

const minified = await compile(source, tokens, { ...MJML_OPTIONS, minify: true })
check('Control: minify keeps {{ label }} and {{ url }}', minified.includes('{{ label }}') && minified.includes('{{ url }}'))

let failed = 0
for (const r of results) {
  if (!r.ok) failed++
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  [${r.detail}]` : ''}`)
}
const size = s => `${Buffer.byteLength(s)} B (gzip ${gzipSync(s).length} B)`
console.log('\nOutput size of button.html:')
console.log(`  default:    ${size(html)}`)
console.log(`  minify:true ${size(minified)}`)
console.log(`\nSHA-256 button.html: ${sha(html)}`)
process.exit(failed ? 1 : 0)
