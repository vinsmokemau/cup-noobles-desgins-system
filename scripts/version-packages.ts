// T11.3 (REQ-070, SPEC.md §4.8): `pnpm version-packages` is the command the release workflow runs to open the
// "Version packages" pull request. It does two things in order:
//   1. It reads every pending changeset and groups its text under Breaking, Added, Changed, Deprecated, or Fixed.
//      Changesets itself can only write "Major/Minor/Patch Changes" into per-package files, so the root CHANGELOG.md
//      is written here (REQ-070 AC2). `.changeset/config.json` sets `changelog: false` for that reason.
//   2. It runs `changeset version`, which bumps the three packages in lockstep (the `fixed` group) and consumes the files.
//      It then puts back every `apps/*/package.json` that `changeset version` rewrote. An app installs the published
//      packages, and the new version is not on the registry yet, so pointing it there would make `pnpm install
//      --frozen-lockfile` fail in the pull request and in the publish run (T14.2). A later commit moves the app on.
// `--dry-run` does the same in a throwaway copy and prints the result, so nothing in the repository changes.
//
// A changeset picks its group with a prefix: `Breaking:`, `Added:`, `Changed:`, `Deprecated:`, or `Fixed:`. Without
// a prefix the bump decides: major is Breaking, minor is Added, patch is Fixed.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parse } from 'yaml'

export const CATEGORIES = ['Breaking', 'Added', 'Changed', 'Deprecated', 'Fixed'] as const
export type Category = (typeof CATEGORIES)[number]
export type Bump = 'major' | 'minor' | 'patch'

export interface Entry {
  file: string
  bump: Bump
  category: Category
  text: string
}

export const NO_RELEASES = 'No version has been released yet. Releases will be listed below, newest first.'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const RANK: Record<Bump, number> = { patch: 0, minor: 1, major: 2 }
const DEFAULT_CATEGORY: Record<Bump, Category> = { major: 'Breaking', minor: 'Added', patch: 'Fixed' }
const PREFIX = new RegExp(`^(${CATEGORIES.join('|')}):[ \\t]*`)

// A changeset is frontmatter (package: bump) and a summary. An empty frontmatter is an empty changeset: no entry.
export function parseChangeset(file: string, source: string): Entry | undefined {
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n?---[ \t]*(?:\r?\n([\s\S]*))?$/.exec(source.replace(/^\u{FEFF}/u, ''))
  if (!match) throw new Error(`${file}: a changeset starts with a frontmatter block`)
  const packages = (parse(match[1]!) ?? {}) as Record<string, unknown>
  const bumps = Object.entries(packages).map(([name, bump]) => {
    if (bump !== 'major' && bump !== 'minor' && bump !== 'patch')
      throw new Error(`${file}: ${name} has bump ${JSON.stringify(bump)}, which is not major, minor, or patch`)
    return bump
  })
  if (bumps.length === 0) return undefined
  const bump = bumps.reduce((a, b) => (RANK[b] > RANK[a] ? b : a))
  let text = (match[2] ?? '').trim()
  if (!text) throw new Error(`${file}: the changeset has no summary`)
  const prefix = PREFIX.exec(text)
  if (prefix) text = text.slice(prefix[0].length).trim()
  if (!text) throw new Error(`${file}: the changeset has a prefix and no summary`)
  return { file, bump, category: (prefix?.[1] as Category | undefined) ?? DEFAULT_CATEGORY[bump], text }
}

// One list item. Later lines are indented to stay inside it, and blank lines carry no trailing spaces.
const listItem = (text: string) =>
  `- ${text
    .split(/\r?\n/)
    .map((line, i) => (i === 0 || !line.trim() ? line.trimEnd() : `  ${line.trimEnd()}`))
    .join('\n')}`

export function renderRelease(version: string, date: string, entries: Entry[]): string {
  const parts = [`## ${version} (${date})`]
  for (const category of CATEGORIES) {
    const items = entries
      .filter((entry) => entry.category === category)
      .sort((a, b) => a.file.localeCompare(b.file))
      .map((entry) => listItem(entry.text))
    if (items.length) parts.push(`### ${category}\n\n${items.join('\n')}`)
  }
  return `${parts.join('\n\n')}\n`
}

// Newest first: the new release goes above the previous one, and the "no release yet" line goes away.
export function insertRelease(changelog: string, release: string): string {
  const text = changelog.replace(NO_RELEASES, '').replace(/\n{3,}/g, '\n\n')
  const first = /^## /m.exec(text)
  if (!first) return `${text.trimEnd()}\n\n${release}`
  return `${text.slice(0, first.index)}${release}\n${text.slice(first.index)}`
}

export function pendingEntries(root: string): Entry[] {
  const dir = join(root, '.changeset')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') && name.toLowerCase() !== 'readme.md')
    .sort()
    .flatMap((name) => parseChangeset(name, readFileSync(join(dir, name), 'utf8')) ?? [])
}

export interface Release {
  version: string
  packages: Record<string, string>
  entries: Entry[]
  changelog: string
}

const LOCKSTEP = ['tokens', 'nuxt', 'email'].map((name) => `@vinsmokemau/cup-noobles-${name}`)

function readVersions(root: string): Record<string, string> {
  const versions: Record<string, string> = {}
  for (const name of readdirSync(join(root, 'packages'))) {
    const file = join(root, 'packages', name, 'package.json')
    if (!existsSync(file)) continue
    const pkg = JSON.parse(readFileSync(file, 'utf8')) as { name: string; version: string }
    if (LOCKSTEP.includes(pkg.name)) versions[pkg.name] = pkg.version
  }
  return versions
}

// Reads the pending changesets, runs `changeset version`, and writes CHANGELOG.md, all under `root`.
export function versionPackages(root: string, date: string = new Date().toISOString().slice(0, 10)): Release {
  const entries = pendingEntries(root)
  if (entries.length === 0) throw new Error('There is no changeset to version. Run `pnpm changeset` first.')
  const apps = join(root, 'apps')
  const appFiles = (existsSync(apps) ? readdirSync(apps, { withFileTypes: true }) : []).flatMap((entry) => {
    const file = join(apps, entry.name, 'package.json')
    return entry.isDirectory() && existsSync(file) ? [[file, readFileSync(file, 'utf8')] as const] : []
  })
  const bin = join(repoRoot, 'node_modules/@changesets/cli/bin.js')
  const run = spawnSync(process.execPath, [bin, 'version'], { cwd: root, encoding: 'utf8' })
  if (run.status !== 0) throw new Error(`changeset version failed:\n${run.stdout}${run.stderr}`)

  for (const [file, text] of appFiles) writeFileSync(file, text)

  const packages = readVersions(root)
  const versions = new Set(Object.values(packages))
  if (Object.keys(packages).length !== LOCKSTEP.length || versions.size !== 1)
    throw new Error(`The packages are not in lockstep: ${JSON.stringify(packages)}`)
  const [version] = versions as unknown as [string]

  const file = join(root, 'CHANGELOG.md')
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '# Changelog\n'
  const changelog = insertRelease(current, renderRelease(version, date, entries))
  writeFileSync(file, changelog)
  return { version, packages, entries, changelog }
}

// The files `changeset version` and this script read or write. Nothing else is copied, so the dry run is fast.
export function dryRun(root: string = repoRoot, date?: string): Release {
  const copy = mkdtempSync(join(tmpdir(), 'cn-version-'))
  try {
    for (const path of ['package.json', 'pnpm-workspace.yaml', 'CHANGELOG.md', '.changeset']) {
      if (existsSync(join(root, path))) cpSync(join(root, path), join(copy, path), { recursive: true })
    }
    for (const group of ['packages', 'apps']) {
      if (!existsSync(join(root, group))) continue
      for (const name of readdirSync(join(root, group))) {
        const file = join(root, group, name, 'package.json')
        if (!existsSync(file)) continue
        mkdirSync(join(copy, group, name), { recursive: true })
        cpSync(file, join(copy, group, name, 'package.json'))
      }
    }
    return versionPackages(copy, date)
  } finally {
    rmSync(copy, { recursive: true, force: true })
  }
}

// Usage: node scripts/version-packages.ts [--dry-run]
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const dry = process.argv.includes('--dry-run')
  try {
    const release = dry ? dryRun() : versionPackages(repoRoot)
    const names = Object.entries(release.packages).map(([name, version]) => `  ${name} ${version}`)
    console.log(`${dry ? 'version-packages (dry run, nothing changed)' : 'version-packages'}: ${release.version}`)
    console.log(names.join('\n'))
    console.log(`${release.entries.length} changeset(s) are in CHANGELOG.md`)
  } catch (error) {
    console.error(`version-packages: ${(error as Error).message}`)
    process.exitCode = 1
  }
}
