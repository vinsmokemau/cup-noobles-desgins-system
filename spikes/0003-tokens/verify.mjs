// Runs two independent token builds and checks the ADR-0003 claims. Run after `pnpm install`.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import StyleDictionary from 'style-dictionary'

const OUTPUTS = ['css/tokens.css', 'json/tokens.flat.json', 'ts/tokens.ts', 'email/email-tokens.json']
const PINK = '#ef80ae' // BR-01

const results = []
const check = (name, ok, detail) => results.push({ name, ok, detail })
const read = (dir, f) => readFileSync(`${dir}/${f}`)
const sha = buf => createHash('sha256').update(buf).digest('hex')

rmSync('.verify', { recursive: true, force: true })

// Two builds, each in its own Node process, into separate directories. A third build reverses the source order.
for (const [dir, ...flags] of [['.verify/a'], ['.verify/b'], ['.verify/r', '--reverse-sources']]) {
  const r = spawnSync(process.execPath, ['build.mjs', dir, ...flags], { encoding: 'utf8' })
  check(`Build into ${dir} exits 0${flags.length ? ` (${flags.join(' ')})` : ''}`, r.status === 0, r.status === 0 ? '' : r.stderr)
}

for (const f of OUTPUTS) check(`Output exists: ${f}`, ['a', 'b', 'r'].every(d => existsSync(`.verify/${d}/${f}`)))

const hashes = OUTPUTS.map(f => [f, sha(read('.verify/a', f)), sha(read('.verify/b', f)), sha(read('.verify/r', f))])
for (const [f, a, b] of hashes) check(`Byte-identical across builds: ${f}`, a === b, a.slice(0, 12))
for (const [f, a, , r] of hashes) check(`Independent of source order: ${f}`, a === r)

const A = '.verify/a'
const css = read(A, OUTPUTS[0]).toString()
const flat = JSON.parse(read(A, OUTPUTS[1]))
const ts = read(A, OUTPUTS[2]).toString()
const email = read(A, OUTPUTS[3]).toString()
const all = OUTPUTS.map(f => read(A, f).toString())

check('CSS: --cn-color-brand-primary resolves to BR-01 pink', css.includes(`--cn-color-brand-primary: ${PINK};`))
check('CSS: all three tiers present as --cn-* vars', ['color-brand-pink', 'color-brand-primary', 'button-primary-bg'].every(n => css.includes(`--cn-${n}: ${PINK};`)))
check('CSS: no var() references (resolved values)', !css.includes('var('))
check('Flat JSON: 3 tokens keyed by DTCG path', Object.keys(flat).join() === 'button.primary.bg,color.brand.pink,color.brand.primary', Object.keys(flat).join())
check('Flat JSON: carries value, cssVar, status', flat['color.brand.primary'].value === PINK && flat['color.brand.primary'].cssVar === '--cn-color-brand-primary' && flat['color.brand.primary'].status === 'stable')
const mod = await import(pathToFileURL(`${A}/ts/tokens.ts`).href) // Node 24 strips types natively
check('TS: loads and exports resolved constants', mod.tokens['button.primary.bg'] === PINK)
check('TS: typed with `as const` and a TokenPath type', ts.includes('} as const') && ts.includes('export type TokenPath'))
check('Email JSON: no references and no var()', !email.includes('{color') && !email.includes('{button') && !email.includes('var('))
check('Email JSON: path -> literal value', JSON.parse(email)['color.brand.primary'] === PINK)
check('No output imports anything (zero runtime deps)', all.every(s => !/\bimport\b|\brequire\(/.test(s)))
check('No CR line endings in any output', all.every(s => !s.includes('\r')))
check('No timestamp in any output', all.every(s => !/Generated on|\d{4}-\d{2}-\d{2}T/.test(s)))

// Controls: what Style Dictionary does NOT enforce on its own.
const memoryBuild = async tokens => {
  const sd = new StyleDictionary({
    tokens,
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'error' },
    platforms: { css: { transformGroup: 'css', prefix: 'cn', files: [{ destination: 'x.css', format: 'css/variables' }] } }
  })
  const [out] = await sd.formatPlatform('css')
  return out.output
}
const base = { color: { brand: { pink: { $type: 'color', $value: PINK } } } }

let brokenErr = null
try { await memoryBuild({ ...base, button: { bg: { $type: 'color', $value: '{color.brand.missing}' } } }) } catch (e) { brokenErr = e }
check('Control: a broken reference fails the build', brokenErr !== null, brokenErr?.message.split('\n')[0])

let tierOut = null
try {
  tierOut = await memoryBuild({
    color: { brand: { pink: { $type: 'color', $value: PINK }, primary: { $type: 'color', $value: '{button.bg}' } } },
    button: { bg: { $type: 'color', $value: '{color.brand.pink}' } }
  })
} catch {}
check('Control: tier rules are NOT enforced (semantic -> component ref builds)', tierOut !== null)

let badOut = null
try { badOut = await memoryBuild({ ...base, bogus: { $type: 'color', $value: 'banana' } }) } catch {}
check('Control: invalid DTCG color value is NOT rejected', badOut !== null && badOut.includes('--cn-bogus: banana;'))

const camelOut = await memoryBuild({ color: { brandAlias: { x: { $type: 'color', $value: '{color.brand.pink}' } }, brand: base.color.brand } })
const camelName = camelOut.match(/--cn-color-[\w-]+-x/)?.[0]
check('Observed: camelCase segment naming under name/kebab', camelName === '--cn-color-brand-alias-x', camelName)

let collisionErr = null
try {
  await memoryBuild({ color: { brandAlias: { x: { $type: 'color', $value: PINK } }, 'brand-alias': { x: { $type: 'color', $value: PINK } } } })
} catch (e) { collisionErr = e }
check('Control: a CSS-name collision fails the build (warnings: error)', /collision/i.test(collisionErr?.message ?? ''))

let failed = 0
for (const r of results) {
  if (!r.ok) failed++
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  [${r.detail}]` : ''}`)
}
console.log('\nSHA-256 (build a = build b = reversed-source build):')
for (const [f, a] of hashes) console.log(`  ${a}  ${f}`)
process.exit(failed ? 1 : 0)
