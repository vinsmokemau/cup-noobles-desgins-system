// T11.3 checks: Changesets in lockstep (REQ-070), the changelog grouping and page (REQ-070 AC2, REQ-062 AC2), and the
// development-only deprecation helper (REQ-072 AC1). The rendered /changelog page needs a browser, so that check is in
// apps/showcase/tests/e2e/docs.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import {
  CATEGORIES,
  dryRun,
  insertRelease,
  NO_RELEASES,
  parseChangeset,
  pendingEntries,
  renderRelease,
  versionPackages,
} from '../scripts/version-packages'
import { deprecationMessage, warnDeprecated } from '../packages/nuxt/utils/deprecation'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const PACKAGES = ['tokens', 'nuxt', 'email'].map((name) => `@vinsmokemau/cup-noobles-${name}`)
const changeset = (bump: string, text: string, names: string[] = PACKAGES) =>
  `---\n${names.map((name) => `'${name}': ${bump}`).join('\n')}\n---\n\n${text}\n`

// A throwaway repository holding only what `changeset version` reads: three packages at 0.1.0 and the config.
function fixture(changesets: Record<string, string>, changelog?: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'cn-release-test-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'fixture', private: true }))
  writeFileSync(join(dir, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n')
  for (const name of PACKAGES) {
    const folder = join(dir, 'packages', name.split('cup-noobles-')[1]!)
    mkdirSync(folder, { recursive: true })
    writeFileSync(join(folder, 'package.json'), JSON.stringify({ name, version: '0.1.0' }))
  }
  mkdirSync(join(dir, '.changeset'))
  writeFileSync(join(dir, '.changeset/config.json'), read('.changeset/config.json'))
  for (const [file, text] of Object.entries(changesets)) writeFileSync(join(dir, '.changeset', file), text)
  if (changelog !== undefined) writeFileSync(join(dir, 'CHANGELOG.md'), changelog)
  return dir
}
const versionOf = (dir: string, name: string) =>
  (JSON.parse(readFileSync(join(dir, 'packages', name, 'package.json'), 'utf8')) as { version: string }).version

test('REQ-070 AC1: Changesets is configured with the three packages in one fixed group, and the apps are ignored', () => {
  const config = JSON.parse(read('.changeset/config.json')) as {
    fixed: string[][]
    ignore: string[]
    changelog: unknown
  }
  assert.deepEqual(config.fixed, [PACKAGES])
  assert.deepEqual([...config.ignore].sort(), ['consumer-fixture', 'showcase'])
  // The root CHANGELOG.md is written by scripts/version-packages.ts, so Changesets writes no per-package file.
  assert.equal(config.changelog, false)
  const scripts = (JSON.parse(read('package.json')) as { scripts: Record<string, string> }).scripts
  assert.equal(scripts.changeset, 'changeset')
  assert.equal(scripts['version-packages'], 'node scripts/version-packages.ts')
})

test('REQ-070 AC1: a test changeset that names one package bumps all three together in a dry run', () => {
  const dir = fixture({ 'only-tokens.md': changeset('minor', 'Add a token.', [PACKAGES[0]!]) })
  try {
    const release = versionPackages(dir, '2026-10-12')
    assert.equal(release.version, '0.2.0')
    assert.deepEqual(release.packages, Object.fromEntries(PACKAGES.map((name) => [name, '0.2.0'])))
    for (const name of ['tokens', 'nuxt', 'email']) assert.equal(versionOf(dir, name), '0.2.0', name)
    assert.deepEqual(
      readdirSync(join(dir, '.changeset')).filter((name) => name.endsWith('.md')),
      [],
      'the changeset is consumed',
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('REQ-070 AC1: the dry run of the real repository versions in lockstep and changes no file', () => {
  const before = readdirSync(join(root, '.changeset')).sort()
  const changelogBefore = read('CHANGELOG.md')
  const versionBefore = read('packages/nuxt/package.json')
  const release = dryRun(root, '2026-10-12')
  assert.equal(new Set(Object.values(release.packages)).size, 1)
  assert.equal(Object.keys(release.packages).length, 3)
  assert.equal(release.entries.length, pendingEntries(root).length)
  assert.ok(release.entries.length > 0, 'the repository has pending changesets')
  assert.deepEqual(readdirSync(join(root, '.changeset')).sort(), before)
  assert.equal(read('CHANGELOG.md'), changelogBefore)
  assert.equal(read('packages/nuxt/package.json'), versionBefore)
  assert.match(release.changelog, /^## \d+\.\d+\.\d+ \(2026-10-12\)$/m)
}, 60_000)

test('REQ-070 AC2: entries are grouped as Breaking, Added, Changed, Deprecated, and Fixed, in that order', () => {
  const entries = [
    parseChangeset('a.md', changeset('patch', 'Fix the glow.'))!,
    parseChangeset('b.md', changeset('minor', 'Add the card.'))!,
    parseChangeset('c.md', changeset('minor', 'Deprecated: `CnOld` moves to `CnNew`.'))!,
    parseChangeset('d.md', changeset('minor', 'Changed: the radius is wider.'))!,
    parseChangeset('e.md', changeset('major', 'Remove `CnOld`.\n\nMigration: use `CnNew`.'))!,
  ]
  const release = renderRelease('1.0.0', '2026-10-12', entries)
  const headings = [...release.matchAll(/^### (.+)$/gm)].map((m) => m[1])
  assert.deepEqual(headings, ['Breaking', 'Added', 'Changed', 'Deprecated', 'Fixed'])
  assert.deepEqual(headings, [...CATEGORIES])
  assert.match(release, /### Breaking\n\n- Remove `CnOld`\.\n\n {2}Migration: use `CnNew`\.\n/)
  assert.match(release, /### Deprecated\n\n- `CnOld` moves to `CnNew`\.\n/)
  assert.doesNotMatch(release, /[ \t]+$/m, 'no trailing spaces')
})

test('REQ-070 AC2: a prefix picks the group, and the bump is the default', () => {
  const group = (bump: string, text: string) => parseChangeset('x.md', changeset(bump, text))
  assert.equal(group('major', 'Drop it.')?.category, 'Breaking')
  assert.equal(group('minor', 'Add it.')?.category, 'Added')
  assert.equal(group('patch', 'Mend it.')?.category, 'Fixed')
  assert.equal(group('patch', 'Changed: the order.')?.category, 'Changed')
  assert.equal(group('minor', 'Changed: the order.')?.text, 'the order.')
  // The highest bump across the packages decides the default.
  const mixed = `---\n'${PACKAGES[0]}': patch\n'${PACKAGES[1]}': major\n---\n\nRework it.\n`
  assert.equal(parseChangeset('m.md', mixed)?.category, 'Breaking')
})

test('a changeset with no packages is empty, and a broken one is reported by file name', () => {
  assert.equal(parseChangeset('empty.md', '---\n---\n'), undefined)
  assert.throws(() => parseChangeset('nosummary.md', changeset('minor', '')), /nosummary\.md: .*no summary/)
  assert.throws(() => parseChangeset('bad.md', changeset('huge', 'x')), /bad\.md: .*not major, minor, or patch/)
  assert.throws(() => parseChangeset('plain.md', 'just text'), /plain\.md: .*frontmatter/)
})

test('REQ-062 AC2: the new release goes above the older ones, and the "no release yet" line goes away', () => {
  const changelog = read('CHANGELOG.md')
  assert.ok(changelog.includes(NO_RELEASES), 'the file starts with the empty state')
  const first = insertRelease(
    changelog,
    renderRelease('0.2.0', '2026-10-12', [parseChangeset('a.md', changeset('minor', 'Add a.'))!]),
  )
  assert.ok(!first.includes(NO_RELEASES))
  assert.match(first, /^# Changelog\n/)
  const second = insertRelease(
    first,
    renderRelease('0.3.0', '2026-10-13', [parseChangeset('b.md', changeset('minor', 'Add b.'))!]),
  )
  assert.ok(second.indexOf('## 0.3.0') < second.indexOf('## 0.2.0'), 'newest first')
  assert.equal(second.match(/^# /gm)?.length, 1)
  assert.doesNotMatch(second, /\n{3,}/)
})

test('REQ-062 AC2: CHANGELOG.md is the file the showcase renders at /changelog', () => {
  assert.match(read('CHANGELOG.md'), /^# Changelog\n/)
  const config = read('apps/showcase/content.config.ts')
  assert.match(config, /changelog: defineCollection/)
  assert.match(config, /include: 'CHANGELOG\.md'/)
  const page = read('apps/showcase/pages/changelog.vue')
  assert.match(page, /queryCollection\('changelog'\)/)
  assert.doesNotMatch(page, /Pending/, 'the page is no longer a placeholder')
  assert.doesNotMatch(page, /data-doc-source/, 'a changelog is not one of the docs (REQ-051 AC2)')
})

test('REQ-070: the release workflow opens the version pull request with `pnpm version-packages`, then publishes', () => {
  const workflow = parse(read('.github/workflows/release.yml')) as {
    on: { push: { branches: string[] } }
    permissions: Record<string, string>
    jobs: Record<string, { steps: { uses?: string; run?: string; with?: Record<string, string> }[] }>
  }
  assert.deepEqual(workflow.on.push.branches, ['main'])
  assert.equal(workflow.permissions['pull-requests'], 'write')
  assert.equal(workflow.permissions.packages, 'write', 'publishing to GitHub Packages needs packages: write')
  const steps = Object.values(workflow.jobs).flatMap((job) => job.steps)
  for (const step of steps) if (step.uses) assert.match(step.uses, /@[0-9a-f]{40}$/, `${step.uses} is pinned`)
  const action = steps.find((step) => step.uses?.startsWith('changesets/action@'))
  assert.ok(action, 'the workflow runs changesets/action')
  assert.equal(action.with?.version, 'pnpm version-packages')
  assert.equal(
    action.with?.publish,
    'pnpm release:publish',
    'T12.1: the action publishes after the version pull request',
  )
  const setup = steps.find((step) => step.uses?.startsWith('actions/setup-node@'))
  assert.equal(setup?.with?.['registry-url'], 'https://npm.pkg.github.com')
  assert.equal(setup?.with?.scope, '@vinsmokemau')
  assert.ok(steps.some((step) => step.run === 'pnpm install --frozen-lockfile'))
})

test('REQ-072 AC1: the deprecation helper warns in development, once, and names the item, the replacement, and the version', () => {
  const calls: string[] = []
  const deprecation = { name: '`CnOldCard`', replacement: '`CnMediaCard`', removedIn: '1.0.0' }
  assert.equal(warnDeprecated(deprecation, { dev: true, warn: (m) => calls.push(m) }), true)
  assert.equal(calls.length, 1)
  assert.equal(calls[0], deprecationMessage(deprecation))
  for (const part of ['`CnOldCard`', '`CnMediaCard`', '1.0.0']) assert.ok(calls[0]!.includes(part), part)
  assert.equal(warnDeprecated(deprecation, { dev: true, warn: (m) => calls.push(m) }), false, 'once per message')
  assert.equal(calls.length, 1)
})

test('REQ-072 AC1: the deprecation helper stays silent in production and outside Nuxt', () => {
  const calls: string[] = []
  const warn = (message: string) => calls.push(message)
  const deprecation = { name: '`CnOldTag`', replacement: '`UBadge`', removedIn: '2.0.0' }
  assert.equal(warnDeprecated(deprecation, { dev: false, warn }), false)
  // No `dev` option, as in a unit test or a build that does not define `import.meta.dev`: silent.
  assert.equal(warnDeprecated(deprecation, { warn }), false)
  assert.deepEqual(calls, [])
  // The silent calls did not use up the warning: a development call still warns.
  assert.equal(warnDeprecated(deprecation, { dev: true, warn }), true)
  assert.equal(calls.length, 1)
})
