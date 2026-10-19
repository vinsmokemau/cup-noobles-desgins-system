// T13.5 checks: the layer's spacing sits on the Rhythm of 8 (REQ-005, REQ-016, ADR-0049).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(root, 'packages/nuxt/assets/css/main.css'), 'utf8')

test('REQ-016: no spacing in the layer is a multiple of the base unit', () => {
  assert.doesNotMatch(css, /calc\([^)]*--cn-space-base/)
  assert.doesNotMatch(css, /--cn-space-base\)\s*\*/)
})

test('ADR-0049: the media card uses the md step for its padding and the gap to its tags, and sm between tags', () => {
  const rule = (selector: string) => css.slice(css.indexOf(`${selector} {`)).split('}')[0] ?? ''
  assert.match(rule('.cn-media-card__body'), /gap: var\(--cn-space-md\)/)
  assert.match(rule('.cn-media-card__body'), /padding: var\(--cn-space-md\)/)
  assert.match(rule('.cn-media-card__tags'), /gap: var\(--cn-space-sm\)/)
})
