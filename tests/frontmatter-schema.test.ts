// T2.1 checks: docs/_schema/frontmatter.schema.json implements SPEC.md §4.3 (REQ-002 AC1–AC3).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ajv2020 } from 'ajv/dist/2020.js'
import { parse } from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const schema = JSON.parse(read('docs/_schema/frontmatter.schema.json'))
const validate = new Ajv2020({ allErrors: true, allowUnionTypes: true }).compile(schema)
const isValid = (data: unknown) => validate(data) === true

// The §4.3 example, read from SPEC.md itself so the schema is tested against the contract, not a copy of it.
const specExample = (): Record<string, unknown> => {
  const section = read('SPEC.md').split('### 4.3 Frontmatter schema')[1]!
  const block = section.match(/```yaml\r?\n([\s\S]*?)```/)
  assert.ok(block, 'SPEC.md §4.3 has no yaml example')
  return parse(block[1]!)
}

const frontmatter = (path: string): unknown => {
  const match = read(path).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  assert.ok(match, `${path} has no frontmatter`)
  return parse(match[1]!)
}

const omit = (data: Record<string, unknown>, ...fields: string[]) =>
  Object.fromEntries(Object.entries(data).filter(([field]) => !fields.includes(field)))

const component = specExample()
const governance = {
  ...omit(component, 'level', 'source', 'nuxtUi', 'component', 'demos'),
  title: 'Ownership',
  slug: 'ownership',
  layer: 'governance',
  tokens: [],
}

test('the schema is a valid draft 2020-12 schema', () => {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema')
})

test('Done when: the schema accepts the §4.3 example', () => {
  assert.ok(isValid(component), JSON.stringify(validate.errors))
})

test('Done when: the schema rejects a component doc that has no `level`', () => {
  assert.equal(isValid(omit(component, 'level')), false)
  assert.ok(validate.errors?.some((e) => e.keyword === 'required' && e.params.missingProperty === 'level'))
})

test('REQ-002 AC3: a component doc needs `source`, and a valid `level` and `source`', () => {
  assert.equal(isValid(omit(component, 'source')), false)
  assert.equal(isValid({ ...component, level: 'template' }), false)
  assert.equal(isValid({ ...component, source: 'vendor' }), false)
  for (const level of ['atom', 'molecule', 'organism']) assert.ok(isValid({ ...component, level }), level)
})

test('§4.3: source nuxt-ui requires `nuxtUi`, and source custom requires `component`', () => {
  assert.equal(isValid(omit(component, 'nuxtUi')), false)
  assert.equal(isValid({ ...component, nuxtUi: null }), false)

  const custom = { ...component, source: 'custom', nuxtUi: null, component: 'CnMediaCard' }
  assert.ok(isValid(custom), JSON.stringify(validate.errors))
  assert.equal(isValid({ ...custom, component: null }), false)
  assert.equal(isValid({ ...custom, component: 'MediaCard' }), false, 'custom components are named Cn* (REQ-021)')
})

test('§4.3: component-only fields are rejected on other layers, and `demos` on non-component, non-pattern layers', () => {
  assert.ok(isValid(governance), JSON.stringify(validate.errors))
  for (const field of ['level', 'source', 'nuxtUi', 'component'] as const) {
    assert.equal(isValid({ ...governance, [field]: component[field] }), false, field)
  }
  assert.equal(isValid({ ...governance, demos: ['states'] }), false)
  assert.ok(isValid({ ...governance, layer: 'pattern', demos: ['states'] }), JSON.stringify(validate.errors))
})

test('REQ-002 AC2: `status` is exactly one of tbd, draft, stable, deprecated', () => {
  for (const status of ['tbd', 'draft', 'stable', 'deprecated']) assert.ok(isValid({ ...component, status }), status)
  for (const status of ['Draft', 'final', '', null]) assert.equal(isValid({ ...component, status }), false, `${status}`)
})

test('§4.3: every required field is required, and each field is type-checked', () => {
  for (const field of ['title', 'slug', 'layer', 'status', 'lang', 'since', 'updated']) {
    assert.equal(isValid(omit(component, field)), false, `missing ${field}`)
  }
  const invalid: Record<string, unknown> = {
    title: '',
    slug: 'Button_Primary',
    layer: 'atom',
    lang: 'es-MX', // REQ-007 AC1
    brandRules: ['BR-1'],
    tbd: ['TBD-XX'],
    related: ['Form Field'],
    since: 'v0.1',
    updated: '23/09/2026',
    tokens: 'component.button',
    unknownField: true,
  }
  for (const [field, value] of Object.entries(invalid)) {
    assert.equal(isValid({ ...component, [field]: value }), false, `${field}: ${JSON.stringify(value)}`)
  }
})

test('the existing ADRs validate against the schema', () => {
  const dir = 'docs/06-governance/decisions'
  // The ADR template is not exempt under REQ-002 AC4, so it validates too.
  const adrs = readdirSync(join(root, dir)).filter((name) => /^\d{4}-.+\.md$/.test(name))
  assert.ok(adrs.length > 0)
  for (const name of adrs) {
    assert.ok(isValid(frontmatter(`${dir}/${name}`)), `${name}: ${JSON.stringify(validate.errors)}`)
  }
})

test('the template frontmatter lists every schema field', () => {
  const fields = Object.keys(frontmatter('docs/_template.md') as object)
  assert.deepEqual(fields, Object.keys(schema.properties))
})
