// T12.1 checks (REQ-070, OD-03): the three packages can be published privately to GitHub Packages, and what a
// tarball holds is what a consumer needs and nothing else.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

interface Manifest {
  name: string
  version: string
  private?: boolean
  repository?: { url?: string; directory?: string }
  publishConfig?: { registry?: string; access?: string }
  files?: string[]
}

const PACKAGES = ['tokens', 'nuxt', 'email'].map((dir) => ({
  dir,
  manifest: JSON.parse(read(`packages/${dir}/package.json`)) as Manifest,
}))

test('OD-03: each package is scoped and published privately to GitHub Packages', () => {
  for (const { dir, manifest } of PACKAGES) {
    assert.equal(manifest.name, `@vinsmokemau/cup-noobles-${dir}`)
    assert.notEqual(manifest.private, true, `${manifest.name} is marked private, so it cannot be published`)
    assert.equal(manifest.publishConfig?.registry, 'https://npm.pkg.github.com', `${manifest.name}: registry`)
    assert.equal(manifest.publishConfig?.access, 'restricted', `${manifest.name}: access`)
  }
})

test('OD-03: each package links to the repository, which GitHub Packages needs to accept the workflow token', () => {
  for (const { dir, manifest } of PACKAGES) {
    assert.equal(
      manifest.repository?.url,
      'git+https://github.com/vinsmokemau/cup-noobles-desgins-system.git',
      `${manifest.name}: repository`,
    )
    assert.equal(manifest.repository?.directory, `packages/${dir}`, `${manifest.name}: directory`)
  }
})

test('REQ-070 AC1: the three packages share one version', () => {
  assert.equal(new Set(PACKAGES.map(({ manifest }) => manifest.version)).size, 1)
})

test('T12.1: a tarball holds built output or layer sources, never build caches or dependencies', () => {
  const files = Object.fromEntries(PACKAGES.map(({ dir, manifest }) => [dir, manifest.files ?? []]))
  assert.deepEqual(files.tokens, ['dist'])
  assert.deepEqual(files.email, ['dist'])
  assert.deepEqual(files.nuxt, ['nuxt.config.ts', 'app.config.ts', 'assets', 'components', 'utils'])
  for (const list of Object.values(files)) {
    for (const entry of list) assert.doesNotMatch(entry, /node_modules|\.nuxt|\.output/)
  }
})

test('T12.1: each package directory has a CHANGELOG.md, which the Changesets action reads to build the version PR', () => {
  for (const { dir } of PACKAGES) {
    assert.ok(existsSync(join(root, `packages/${dir}/CHANGELOG.md`)), `packages/${dir}/CHANGELOG.md is missing`)
  }
})

test('T12.1: the publish command builds the tokens and the email files before it publishes', () => {
  const scripts = (JSON.parse(read('package.json')) as { scripts: Record<string, string> }).scripts
  const command = scripts['release:publish']!
  assert.ok(
    command.indexOf('build:tokens') >= 0 && command.indexOf('build:tokens') < command.indexOf('changeset publish'),
  )
  assert.ok(
    command.indexOf('build:email') >= 0 && command.indexOf('build:email') < command.indexOf('changeset publish'),
  )
})
