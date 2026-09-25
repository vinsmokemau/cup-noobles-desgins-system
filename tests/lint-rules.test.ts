// T1.3 checks: the custom lint rules fire on their fixture violations. Fixtures are linted through the
// repository's own eslint.config.js as if they lived at real paths, so a test passing here means the
// same code in that path makes `eslint .`, and therefore `pnpm test`, fail.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint, type Linter } from 'eslint'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const eslint = new ESLint({ cwd: root })

// Lints a fixture from tests/fixtures/lint/ as if it were the file at `path`.
const lint = async (fixture: string, path: string): Promise<Linter.LintMessage[]> => {
  const code = readFileSync(join(root, 'tests/fixtures/lint', fixture), 'utf8')
  const [result] = await eslint.lintText(code, { filePath: join(root, path) })
  const fatal = result!.messages.filter((message) => message.fatal)
  assert.deepEqual(fatal, [], `${fixture} did not parse as ${path}`)
  return result!.messages
}

// The quoted value in each message from `ruleId`, after asserting every one is an error (severity 2).
const flagged = (messages: Linter.LintMessage[], ruleId: string) => {
  const hits = messages.filter((message) => message.ruleId === ruleId)
  for (const hit of hits) assert.equal(hit.severity, 2, `${ruleId} must be an error so it fails pnpm test`)
  return hits.map((hit) => /"(.*)"/.exec(hit.message)?.[1])
}

test('the rule targets are linted, not ignored', async () => {
  for (const path of ['packages/nuxt/components/CnFixture.vue', 'apps/showcase/components/Fixture.vue']) {
    assert.equal(await eslint.isPathIgnored(join(root, path)), false, `${path} is ignored`)
  }
})

// REQ-016 AC1 and AC2
test('REQ-016: cn/no-raw-values flags raw values in Vue script, template, and style blocks', async () => {
  const expected = ['#123456', '12px', 'rgb(1, 2, 3)', '4px', 'hsl(1,2%,3%)', '10rem', '150ms', '6px', '-0.5rem']
  for (const path of ['packages/nuxt/components/CnFixture.vue', 'apps/showcase/components/Fixture.vue']) {
    assert.deepEqual(flagged(await lint('raw-values.vue', path), 'cn/no-raw-values'), expected, path)
  }
})

test('REQ-016: cn/no-raw-values flags raw values in the theme config', async () => {
  const messages = await lint('raw-values.ts', 'packages/nuxt/app.config.ts')
  assert.deepEqual(flagged(messages, 'cn/no-raw-values'), ['8px', '4px', '#abcdef', '0.25rem'])
})

test('REQ-016: cn/no-raw-values flags raw values in CSS declarations', async () => {
  const messages = await lint('raw-values.css', 'packages/nuxt/assets/css/main.css')
  assert.deepEqual(flagged(messages, 'cn/no-raw-values'), ['12px', 'rgb(1 2 3)', '150ms', '#123456', '4px'])
})

test('REQ-016: zero, var(--cn-*), selectors, media queries, and comments are allowed', async () => {
  const messages = await lint('raw-values-allowed.vue', 'packages/nuxt/components/CnFixture.vue')
  assert.deepEqual(flagged(messages, 'cn/no-raw-values'), [])
})

test('REQ-016: the rule is scoped to packages/nuxt and apps/showcase, minus tests', async () => {
  for (const path of ['packages/tokens/src/fixture.ts', 'apps/showcase/tests/e2e/fixture.spec.ts']) {
    assert.deepEqual(flagged(await lint('raw-values.ts', path), 'cn/no-raw-values'), [], path)
  }
})

// REQ-022 AC2
test('REQ-022 AC2: cn/no-hardcoded-text flags text nodes and static strings, except aria-hidden text', async () => {
  const messages = await lint('hardcoded-text.vue', 'packages/nuxt/components/CnFixture.vue')
  assert.deepEqual(flagged(messages, 'cn/no-hardcoded-text'), ['Enviar', "'Hola'", '`Adiós`', 'Visible'])
})

test('REQ-022 AC2: cn/no-hardcoded-text applies to component templates only', async () => {
  const messages = await lint('hardcoded-text.vue', 'apps/showcase/components/Fixture.vue')
  assert.deepEqual(flagged(messages, 'cn/no-hardcoded-text'), [])
})
