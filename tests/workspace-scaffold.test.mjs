// T1.1 workspace scaffold checks. Uses node:test until the Vitest workspace arrives in T1.2.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'))

// Every directory in the SPEC.md §4.1 repository tree. Build outputs (dist/) are excluded,
// and so are per-component subdirectories such as demos/<slug>/, which later tasks add.
const specDirectories = [
  '.changeset',
  '.claude/skills/task',
  '.github',
  '.github/workflows',
  'docs',
  'docs/_schema',
  'docs/00-overview',
  'docs/01-foundations',
  'docs/02-components',
  'docs/02-components/atoms',
  'docs/02-components/molecules',
  'docs/02-components/organisms',
  'docs/03-patterns',
  'docs/04-content',
  'docs/05-email',
  'docs/06-governance',
  'docs/06-governance/decisions',
  'tokens',
  'tokens/primitive',
  'tokens/semantic',
  'tokens/component',
  'packages',
  'packages/tokens',
  'packages/nuxt',
  'packages/nuxt/assets',
  'packages/nuxt/assets/css',
  'packages/nuxt/assets/brand',
  'packages/nuxt/components',
  'packages/email',
  'packages/email/src',
  'packages/email/src/components',
  'packages/email/src/layouts',
  'apps',
  'apps/showcase',
  'apps/showcase/pages',
  'apps/showcase/components',
  'apps/showcase/demos',
  'apps/showcase/tests',
  'apps/showcase/tests/e2e',
  'apps/consumer-fixture',
  'scripts',
  'tests',
  'reports',
]

test('every directory in the §4.1 tree exists', () => {
  const missing = specDirectories.filter((dir) => !existsSync(join(root, dir)) || !statSync(join(root, dir)).isDirectory())
  assert.deepEqual(missing, [])
})

test('root workspace files exist', () => {
  for (const file of ['package.json', 'pnpm-workspace.yaml', '.nvmrc', 'tsconfig.base.json']) {
    assert.ok(existsSync(join(root, file)), `${file} is missing`)
  }
  assert.equal(readJson('tsconfig.base.json').compilerOptions.strict, true, 'A-03: TypeScript strict mode')
})

test('the 3 packages and 2 apps are workspace packages with the §4.1 names', () => {
  assert.equal(readJson('packages/tokens/package.json').name, '@vinsmokemau/cup-noobles-tokens')
  assert.equal(readJson('packages/nuxt/package.json').name, '@vinsmokemau/cup-noobles-nuxt')
  assert.equal(readJson('packages/email/package.json').name, '@vinsmokemau/cup-noobles-email')
  assert.equal(readJson('apps/showcase/package.json').name, 'showcase')
  assert.equal(readJson('apps/consumer-fixture/package.json').name, 'consumer-fixture')
})

test('spikes/ is gone', () => {
  assert.equal(existsSync(join(root, 'spikes')), false)
})

test('reports/ and dist/ are git-ignored, but reports/ itself is kept', () => {
  const ignored = (path) => {
    try {
      execFileSync('git', ['check-ignore', '-q', '--no-index', path], { cwd: root })
      return true
    } catch {
      return false
    }
  }
  assert.ok(ignored('reports/tbd-report.json'))
  assert.ok(ignored('packages/tokens/dist/css/tokens.css'))
  assert.ok(ignored('packages/email/dist/button.html'))
  assert.equal(ignored('reports/.gitkeep'), false)
})

// REQ-013 AC3: the tokens package has zero runtime dependencies.
test('REQ-013 AC3: packages/tokens has zero runtime dependencies', () => {
  const pkg = readJson('packages/tokens/package.json')
  for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies', 'bundleDependencies', 'bundledDependencies']) {
    const value = pkg[field] ?? {}
    assert.equal(Object.keys(value).length, 0, `${field} must be empty`)
  }
})

// REQ-050 AC2: the showcase has no dependency on, and no import from, the e-commerce repository
// (ER-07). Anything outside this repository is reachable only through a local path, a git URL,
// or a relative import that escapes the repository root, so all three are rejected.
test('REQ-050 AC2: apps/showcase depends on nothing outside this repository', () => {
  const pkg = readJson('apps/showcase/package.json')
  const external = /^(file:|link:|portal:|git\+|git:|github:|https?:|\.{1,2}\/|\/)/
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    for (const [name, spec] of Object.entries(pkg[field] ?? {})) {
      assert.doesNotMatch(String(spec), external, `${field}.${name} = ${spec} points outside the registry and workspace`)
    }
  }
})

test('REQ-050 AC2: no apps/showcase source imports a path outside this repository', () => {
  const showcase = join(root, 'apps/showcase')
  const skip = new Set(['node_modules', '.nuxt', '.output', '.data', 'dist'])
  const sourceFile = /\.(m?[jt]s|vue|json)$/
  const importSpec = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*|\bextends\s*:\s*\[?\s*)['"]([^'"]+)['"]/g
  const escapes = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (sourceFile.test(entry.name)) {
        for (const [, spec] of readFileSync(full, 'utf8').matchAll(importSpec)) {
          if (!spec.startsWith('.') && !spec.startsWith('/')) continue
          const target = relative(root, resolve(dirname(full), spec))
          if (target.startsWith('..' + sep) || target === '..') escapes.push(`${relative(root, full)} → ${spec}`)
        }
      }
    }
  }
  walk(showcase)
  assert.deepEqual(escapes, [])
})
