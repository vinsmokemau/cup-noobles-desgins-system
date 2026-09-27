// T1.5 check: the owner-supplied brand source stays byte-identical to the committed SHA-256 (REQ-006 AC1).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'docs/00-overview/brand-context-source.md')
const hashFile = `${source}.sha256`

const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')

// The `.sha256` file uses the `sha256sum` format: `<64 hex digits>  <file name>`.
function expectedHash(path: string) {
  const match = readFileSync(path, 'utf8').match(/^([0-9a-f]{64}) [ *](.+?)\r?\n?$/)
  assert.ok(match, `${basename(path)} is not in sha256sum format`)
  assert.equal(match[2], 'brand-context-source.md', `${basename(path)} names the wrong file`)
  return match[1]!
}

function checkBrandSource(file: string, hash: string) {
  return { actual: sha256(readFileSync(file)), expected: expectedHash(hash) }
}

test('REQ-006 AC1: brand-context-source.md matches its committed SHA-256', () => {
  const { actual, expected } = checkBrandSource(source, hashFile)
  assert.equal(actual, expected, 'brand-context-source.md changed; it is hash-locked (REQ-006 AC3 requires an ADR)')
})

test('REQ-006 AC1: the check fails when one byte of the file changes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cn-brand-source-'))
  try {
    const copy = join(dir, 'brand-context-source.md')
    const copyHash = `${copy}.sha256`
    copyFileSync(source, copy)
    copyFileSync(hashFile, copyHash)
    assert.equal(checkBrandSource(copy, copyHash).actual, checkBrandSource(copy, copyHash).expected)

    const bytes = readFileSync(copy)
    bytes[Math.floor(bytes.length / 2)]! ^= 0x01
    writeFileSync(copy, bytes)
    const { actual, expected } = checkBrandSource(copy, copyHash)
    assert.notEqual(actual, expected, 'a one-byte change went undetected')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('REQ-006 AC1: a one-byte change at any position is detected', () => {
  const original = readFileSync(source)
  const expected = expectedHash(hashFile)
  for (let i = 0; i < original.length; i++) {
    const bytes = Buffer.from(original)
    bytes[i]! ^= 0x01
    assert.notEqual(sha256(bytes), expected, `a change to byte ${i} went undetected`)
  }
})
