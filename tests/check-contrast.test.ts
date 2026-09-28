// T3.5 checks: scripts/check-contrast.ts enforces REQ-015 on the declared contrast pairs: the WCAG 2.x ratio from the
// resolved values and the per-usage minimums (AC2), the forbidden combinations (AC3), and "unverified" for pairs with
// tbd tokens (AC4). Fixture roots live in tests/fixtures/check-contrast/{pass,fail}/.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast, contrastRatio, MINIMUMS, round } from '../scripts/check-contrast'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = join(root, 'tests/fixtures/check-contrast')
const script = join(root, 'scripts/check-contrast.ts')
const run = (dir: string) => spawnSync(process.execPath, [script, dir], { encoding: 'utf8' })

test('WCAG 2.x: the ratio formula gives the known extremes, is symmetric, and blends a translucent foreground', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21)
  assert.equal(contrastRatio('#ffffff', '#000000'), 21)
  assert.equal(contrastRatio('#ef80ae', '#ef80ae'), 1)
  assert.equal(contrastRatio('#EF80AE', '#000000'), contrastRatio('#ef80ae', '#000000'))
  assert.equal(contrastRatio('#ffffff00', '#000000'), 1, 'a fully transparent foreground shows the background')
  assert.equal(contrastRatio('#ffffffff', '#000000'), 21)
  assert.throws(() => contrastRatio('#000000', '#ffffff80'), /translucent/)
})

test('REQ-015 AC2: the minimums are 4.5 for text, 3 for large text, and 3 for UI', () => {
  assert.deepEqual(MINIMUMS, { text: 4.5, 'large-text': 3, ui: 3 })
})

test('SPEC.md §2.1: every derived contrast figure is reproduced to 2 decimals', () => {
  const figures: [string, string, number][] = [
    ['#ef80ae', '#000000', 8.37], // pink on black
    ['#fff488', '#000000', 18.55], // yellow on black
    ['#000000', '#ef80ae', 8.37], // black text on a pink fill
    ['#000000', '#fff488', 18.55], // black text on a yellow fill
    ['#ffffff', '#ef80ae', 2.51], // white text on a pink fill
    ['#fff488', '#ef80ae', 2.22], // yellow on pink
    ['#ef80ae', '#fff488', 2.22], // pink on yellow
    ['#ffffff', '#fff488', 1.13], // white on yellow
  ]
  for (const [fg, bg, ratio] of figures) assert.equal(round(contrastRatio(fg, bg)), ratio, `${fg} on ${bg}`)
})

test('the passing fixture passes: pairs pass at their usage minimum, and a tbd pair is unverified', () => {
  const report = checkContrast(join(fixtures, 'pass'))
  assert.deepEqual(report.problems, [])
  assert.deepEqual(
    report.pairs.map((p) => `${p.foreground} on ${p.background} (${p.usage}) ${p.ratio} ${p.result}`),
    [
      'color.brand.primary on color.bg.base (text) 8.37 pass',
      'color.brand.primary on color.bg.base (ui) 8.37 pass',
      'color.brand.secondary on color.bg.base (large-text) 18.55 pass',
      'color.text.inverted on color.brand.primary (text) 8.37 pass',
      'color.text.default on color.bg.base (text) 7.98 unverified',
    ],
  )
  const tbd = report.pairs.find((p) => p.result === 'unverified')!
  assert.deepEqual(tbd.tbd, ['color.text.default', 'placeholder.color.neutral'])
  assert.equal(run(join(fixtures, 'pass')).status, 0)
})

test('the failing fixture fails, once per violation, exactly where expected', () => {
  const report = checkContrast(join(fixtures, 'fail'))
  const problems = report.problems.map((p) => `${p.file} #${p.index} ${p.message}`)
  const expected: [string, RegExp][] = [
    ['tokens/contrast-forbidden.json #2', /\{color\.brand\.missing\} is not a token/],
    ['tokens/contrast-forbidden.json #3', /gives its `reason`/],
    // AC2 and AC3: a component token pair, white label on the pink fill, is below 4.5:1 and forbidden.
    ['tokens/contrast-pairs.json #0', /2\.51:1 is below the text minimum of 4\.5:1/],
    ['tokens/contrast-pairs.json #0', /combines #ffffff on color\.brand\.pink, which is forbidden/],
    // AC3 and AC4: a tbd pair is never failed on its ratio, but a forbidden combination still fails.
    ['tokens/contrast-pairs.json #1', /combines #ffffff on color\.brand\.pink, which is forbidden/],
    // AC2: pink on white is not forbidden, but 2.51:1 is below the UI minimum.
    ['tokens/contrast-pairs.json #2', /2\.51:1 is below the ui minimum of 3:1/],
    ['tokens/contrast-pairs.json #3', /\{color\.nothing\} is not a token/],
    ['tokens/contrast-pairs.json #4', /usage must be one of text, large-text, ui/],
    ['tokens/contrast-pairs.json #5', /\{color\.fixture\.size\} resolves to "1rem", not a #rrggbb/],
    ['tokens/contrast-pairs.json #6', /has a string `foreground`, `background`, and `usage`/],
  ]
  assert.equal(problems.length, expected.length, problems.join('\n'))
  expected.forEach(([where, message], i) => {
    assert.ok(problems[i]!.startsWith(`${where} `), `${problems[i]} is at ${where}`)
    assert.match(problems[i]!, message)
  })
  assert.deepEqual(
    report.pairs.map((p) => `${p.foreground} ${p.result}`),
    ['button.primary.label fail', 'color.text.pending unverified', 'color.brand.primary fail'],
  )
  const result = run(join(fixtures, 'fail'))
  assert.equal(result.status, 1)
  assert.match(result.stderr, /check-contrast: 10 problem\(s\)/)
})

test('REQ-015: the repository pairs pass or are unverified, and every tbd pair is unverified', () => {
  const report = checkContrast(root)
  assert.deepEqual(report.problems, [])
  assert.ok(report.pairs.length)
  for (const pair of report.pairs) {
    assert.notEqual(pair.result, 'fail', `${pair.foreground} on ${pair.background}`)
    assert.equal(pair.result === 'unverified', pair.tbd.length > 0, `${pair.foreground} on ${pair.background}`)
  }
  for (const path of ['color.text.default', 'color.surface.card'])
    assert.ok(
      report.pairs
        .filter((p) => p.foreground === path || p.background === path)
        .every((p) => p.result === 'unverified'),
      `${path} pairs are unverified`,
    )
})

test('REQ-015 AC2: the ratios come from the same resolved values the token build writes', () => {
  const out = mkdtempSync(join(tmpdir(), 'cn-contrast-'))
  try {
    execFileSync(process.execPath, [join(root, 'packages/tokens/build.ts'), out], { cwd: root })
    const flat = JSON.parse(readFileSync(join(out, 'json/tokens.flat.json'), 'utf8')) as Record<
      string,
      { value: unknown }
    >
    for (const pair of checkContrast(root).pairs) {
      assert.equal(pair.foregroundValue, String(flat[pair.foreground]?.value).toLowerCase(), pair.foreground)
      assert.equal(pair.backgroundValue, String(flat[pair.background]?.value).toLowerCase(), pair.background)
    }
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}, 60_000)

test('§0.3: `pnpm check:tokens` runs check-contrast after check-tokens', () => {
  const { scripts } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  assert.equal(scripts['check:tokens'], 'node scripts/check-tokens.ts && node scripts/check-contrast.ts')
})

// Done when: the three pairs from §2.1 are reported with the exact ratios 8.37, 18.55, and 2.51 (rounded to 2
// decimals), and a fixture using white on pink fails (the failing fixture above).
test('Done when: the repository report shows pink on black 8.37, yellow on black 18.55, and white on pink 2.51', () => {
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /^color\.brand\.primary on color\.bg\.base \(text\) {2}8\.37:1 {2}pass/m)
  assert.match(result.stdout, /^color\.brand\.secondary on color\.bg\.base \(text\) {2}18\.55:1 {2}pass/m)
  assert.match(result.stdout, /^forbidden: #ffffff on color\.brand\.pink {2}2\.51:1$/m)
})
