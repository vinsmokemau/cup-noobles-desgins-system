// T1.2 checks: the lint, format, typecheck, and test runners are wired into the §0.3 commands.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const scripts: Record<string, string> = JSON.parse(read('package.json')).scripts

// Expands `pnpm <script>` references so a check sees every command a script ends up running.
const expand = (name: string): string =>
  (scripts[name] ?? '').replace(/\bpnpm (?:run )?([\w:]+)/g, (call, ref: string) =>
    ref in scripts ? `(${expand(ref)})` : call,
  )

test('the runner configs exist', () => {
  for (const file of [
    'eslint.config.js',
    '.prettierrc.json',
    '.prettierignore',
    '.markdownlint-cli2.jsonc',
    'tsconfig.json',
    'vitest.config.ts',
  ]) {
    assert.ok(existsSync(join(root, file)), `${file} is missing`)
  }
  assert.equal(JSON.parse(read('tsconfig.json')).extends, './tsconfig.base.json')
})

test('pnpm test runs lint (ESLint, Prettier, markdownlint), then typecheck, then Vitest', () => {
  const test = expand('test')
  const steps = ['eslint', 'prettier --check', 'markdownlint-cli2', 'vue-tsc --noEmit', 'vitest run']
  const positions = steps.map((step) => test.indexOf(step))
  steps.forEach((step, i) => assert.ok(positions[i]! >= 0, `pnpm test does not run \`${step}\``))
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b),
    'steps run out of order',
  )
  assert.doesNotMatch(test, /\|\||;/, 'every step must be able to fail the run')
})

// REQ-074 AC1 (partial): `pnpm test:all` exists and starts with `pnpm test`; T1.4 runs it in CI.
test('REQ-074 AC1: pnpm test:all runs pnpm test first', () => {
  assert.match(scripts['test:all'] ?? '', /^pnpm test(?:$| &&)/)
})

test('the hash-locked brand source is never reformatted (REQ-006)', () => {
  assert.match(read('.prettierignore'), /^\*\.md$/m)
  assert.ok(read('.markdownlint-cli2.jsonc').includes('"docs/00-overview/brand-context-source.md"'))
})
