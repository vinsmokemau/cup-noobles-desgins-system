// T14.7 checks (REQ-041 AC4, REQ-040 AC1, REQ-022 AC2, DSR-05): the raster logo of the email header is the horizontal
// wordmark converted from its SVG, it ships in the package, and the header doc names it.
import { expect, test } from 'vitest'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_PNG, DEFAULT_SVG, DISPLAY_HEIGHT, PIXEL_RATIO, svgSize } from '../packages/email/logo'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const png = readFileSync(DEFAULT_PNG)
const svg = readFileSync(DEFAULT_SVG, 'utf8')
const size = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }

test('REQ-041 AC4: the PNG is a PNG on a transparent background (RGBA, 8 bits)', () => {
  assert.equal(png.subarray(1, 4).toString('latin1'), 'PNG')
  assert.equal(png[24], 8, 'bit depth')
  assert.equal(png[25], 6, 'color type 6 is RGBA, which has an alpha channel')
})

test('REQ-041 AC4: the PNG height is twice the 36 px display height, and its width follows the SVG aspect ratio', () => {
  assert.equal(DISPLAY_HEIGHT, 36)
  assert.equal(size.height, DISPLAY_HEIGHT * PIXEL_RATIO)
  const { width, height } = svgSize(svg)
  assert.ok(Math.abs(size.width / size.height - width / height) < 1 / size.height, 'aspect ratio')
})

test('REQ-040 AC1: the source is the horizontal wordmark, and the header shows it at the minimum height token', () => {
  assert.ok(DEFAULT_SVG.endsWith('LogoHorizontal-CN.svg'))
  const header = readFileSync(join(root, 'packages/email/src/components/header.mjml'), 'utf8')
  assert.match(header, /height: \$cn\(logo\.rule\.minHeight\.horizontal\)/)
  const tokens = readFileSync(join(root, 'tokens/primitive/logo.json'), 'utf8')
  assert.ok(tokens.includes(`${DISPLAY_HEIGHT}px`), 'logo.rule.minHeight.horizontal is 36px')
})

test('REQ-041 AC4: the PNG is listed in the files of the packed email package', () => {
  const pack = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const out = execFileSync(pack, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: join(root, 'packages/email'),
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })
  const files = ((JSON.parse(out) as { files: { path: string }[] }[])[0]?.files ?? []).map((file) => file.path)
  expect(files).toContain('assets/logo-horizontal.png')
}, 60_000)

test('REQ-041 AC4: the header doc names the PNG, its size, the size shown, and who hosts it', () => {
  const doc = readFileSync(join(root, 'docs/05-email/email-components.md'), 'utf8')
  const row = doc.split('\n').find((line) => line.startsWith('| `{{ logo_url }}`'))
  assert.ok(row, 'the logo_url row')
  for (const part of ['logo-horizontal.png', `${size.width} x ${size.height} px`, '116 x 36 px', 'public HTTPS']) {
    assert.ok(row.includes(part), `the row names "${part}"`)
  }
})

test('REQ-022 AC2: the header source holds no text of its own besides the slots', () => {
  const header = readFileSync(join(root, 'packages/email/src/components/header.mjml'), 'utf8')
  assert.match(header, /src="\{\{ logo_url \}\}"/)
  assert.match(header, /alt="\{\{ logo_alt \}\}"/)
})
