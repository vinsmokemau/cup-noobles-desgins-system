// T12.1 checks (REQ-070, OD-03): the three packages can be published privately to GitHub Packages, and what a
// tarball holds is what a consumer needs and nothing else.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

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

test('REQ-071 AC2: the fixture installs the layer from the registry at an exact published version, not from the workspace', () => {
  const fixture = JSON.parse(read('apps/consumer-fixture/package.json')) as { dependencies: Record<string, string> }
  const wanted = fixture.dependencies['@vinsmokemau/cup-noobles-nuxt']!
  assert.match(wanted, /^\d+\.\d+\.\d+$/, 'an exact version, so the install cannot fall back to the workspace')
  assert.notEqual(wanted, '0.1.0', '0.1.0 was never published')
  const current = PACKAGES[0]!.manifest.version
  const [a, b] = [wanted, current].map((v) => v.split('.').map(Number) as [number, number, number])
  assert.ok(
    a![0] < b![0] || (a![0] === b![0] && (a![1] < b![1] || (a![1] === b![1] && a![2] <= b![2]))),
    'newer than the workspace',
  )
})

test('REQ-071 AC2: the scope points at GitHub Packages, no token is committed, and every CI install carries one', () => {
  const npmrc = read('.npmrc')
  assert.match(npmrc, /^@vinsmokemau:registry=https:\/\/npm\.pkg\.github\.com$/m)
  assert.doesNotMatch(npmrc, /^[^#\n]*_authToken/m, 'a token must never be committed')
  // Every job of every workflow that installs the workspace: the fixture's dependency is on the private registry, so
  // each such job needs the packages permission, the scope's token from setup-node, and the token on the install.
  interface Step {
    uses?: string
    run?: string
    with?: Record<string, string>
    env?: Record<string, string>
  }
  interface Workflow {
    permissions?: Record<string, string>
    jobs: Record<string, { permissions?: Record<string, string>; steps?: Step[] }>
  }
  let installs = 0
  for (const file of readdirSync(join(root, '.github/workflows')).filter((name) => name.endsWith('.yml'))) {
    const workflow = parse(read(`.github/workflows/${file}`)) as Workflow
    for (const [name, job] of Object.entries(workflow.jobs)) {
      const where = `${file} > ${name}`
      for (const step of (job.steps ?? []).filter((s) => /^pnpm install\b/m.test(s.run ?? ''))) {
        installs++
        const permissions = job.permissions ?? workflow.permissions ?? {}
        assert.match(permissions.packages ?? '', /^(read|write)$/, `${where}: needs the packages permission`)
        const setup = (job.steps ?? []).find((s) => s.uses?.startsWith('actions/setup-node@'))
        assert.equal(setup?.with?.['registry-url'], 'https://npm.pkg.github.com', `${where}: setup-node registry`)
        assert.equal(setup?.with?.scope, '@vinsmokemau', `${where}: setup-node scope`)
        assert.equal(step.env?.NODE_AUTH_TOKEN, '${{ secrets.GITHUB_TOKEN }}', `${where}: the install has the token`)
      }
    }
  }
  assert.ok(installs >= 4, `found ${installs} install steps; expected ci, deploy build, deploy verify, and release`)
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
