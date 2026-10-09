// T5.2 checks: the consumer fixture adds at most 10 lines of config to the layer (REQ-071 AC1).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

test('REQ-071 AC1: apps/consumer-fixture/nuxt.config.ts is 10 lines or fewer and extends the layer', () => {
  const config = read('apps/consumer-fixture/nuxt.config.ts')
  const lines = config.replace(/\n$/, '').split('\n').length
  assert.ok(lines <= 10, `nuxt.config.ts has ${lines} lines`)
  assert.match(config, /extends:\s*\['@vinsmokemau\/cup-noobles-nuxt'\]/)
})
