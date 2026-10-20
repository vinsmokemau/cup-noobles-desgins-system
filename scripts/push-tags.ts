// T14.3 (REQ-070 AC1): pushes the git tags that `changeset publish` creates in the release runner.
// `changesets/action` pushes a tag only when `createGithubReleases` is true (it needs the tag for the release page), and
// this repository sets it to false. Changesets 3 also no longer prints the `New tag:` lines the action looks for, so
// the action cannot tell which packages were released. The 1.0.0 release therefore made its three tags in the runner
// and lost them. This runs after the action: it pushes each local tag `<name>@<version>` that matches a package's
// current version. A run that published nothing has no such local tag, so it pushes nothing.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export interface PackageVersion {
  name: string
  version: string
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function readPackages(root: string): PackageVersion[] {
  const dir = join(root, 'packages')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .map((name) => join(dir, name, 'package.json'))
    .filter((file) => existsSync(file))
    .map((file) => JSON.parse(readFileSync(file, 'utf8')) as PackageVersion & { private?: boolean })
    .filter((manifest) => !manifest.private)
    .map(({ name, version }) => ({ name, version }))
}

// The tags to push: those named exactly `<name>@<version>` for a package at its current version.
export function tagsToPush(localTags: string[], packages: PackageVersion[]): string[] {
  const wanted = new Set(packages.map(({ name, version }) => `${name}@${version}`))
  return localTags.filter((tag) => wanted.has(tag))
}

export type Git = (args: string[]) => string

export function pushTags(root: string, git: Git): string[] {
  const local = git(['tag', '--list']).split(/\r?\n/).filter(Boolean)
  const tags = tagsToPush(local, readPackages(root))
  for (const tag of tags) git(['push', 'origin', `refs/tags/${tag}`])
  return tags
}

const runGit =
  (cwd: string): Git =>
  (args) => {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8' })
    if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.error}`)
    return result.stdout
  }

// Usage: node scripts/push-tags.ts
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const tags = pushTags(repoRoot, runGit(repoRoot))
    console.log(tags.length ? `push-tags: pushed ${tags.join(', ')}` : 'push-tags: no release tags to push')
  } catch (error) {
    console.error(`push-tags: ${(error as Error).message}`)
    process.exitCode = 1
  }
}
