// T14.3 checks (REQ-070 AC1): the release workflow pushes the tags `changeset publish` creates in the runner.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { pushTags, tagsToPush } from '../scripts/push-tags'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const PACKAGES = ['tokens', 'nuxt', 'email'].map((dir) => ({
  name: `@vinsmokemau/cup-noobles-${dir}`,
  version: '1.0.0',
}))

test('REQ-070 AC1: only tags named <package>@<current version> are pushed', () => {
  const local = [
    ...PACKAGES.map((p) => `${p.name}@${p.version}`),
    'v1.0.0',
    '@vinsmokemau/cup-noobles-nuxt@0.2.0',
    'other@1.0.0',
  ]
  assert.deepEqual(
    tagsToPush(local, PACKAGES),
    PACKAGES.map((p) => `${p.name}@${p.version}`),
  )
  assert.deepEqual(tagsToPush([], PACKAGES), [], 'a run that published nothing has no tags to push')
})

test('REQ-070 AC1: pushTags pushes each matching tag to origin and nothing else', () => {
  const dir = mkdtempSync(join(tmpdir(), 'push-tags-'))
  try {
    for (const p of PACKAGES) {
      const pkg = join(dir, 'packages', p.name.split('-').pop()!)
      mkdirSync(pkg, { recursive: true })
      writeFileSync(join(pkg, 'package.json'), JSON.stringify(p))
    }
    const calls: string[][] = []
    const tags = PACKAGES.map((p) => `${p.name}@${p.version}`)
    const pushed = pushTags(dir, (args) => {
      calls.push(args)
      return args[0] === 'tag' ? [...tags, 'stray-tag'].join('\n') + '\n' : ''
    })
    assert.deepEqual(pushed, tags)
    assert.deepEqual(
      calls.filter((args) => args[0] === 'push'),
      tags.map((tag) => ['push', 'origin', `refs/tags/${tag}`]),
    )
    assert.deepEqual(
      pushTags(dir, () => ''),
      [],
      'no local tags, no push',
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('REQ-070 AC1: the release workflow runs the tag push after changesets/action', () => {
  const workflow = parse(readFileSync(join(root, '.github/workflows/release.yml'), 'utf8')) as {
    permissions: Record<string, string>
    jobs: Record<string, { steps: { uses?: string; run?: string }[] }>
  }
  assert.equal(workflow.permissions.contents, 'write', 'pushing a tag needs contents: write')
  const steps = Object.values(workflow.jobs).flatMap((job) => job.steps)
  const action = steps.findIndex((step) => step.uses?.startsWith('changesets/action@'))
  const push = steps.findIndex((step) => step.run === 'node scripts/push-tags.ts')
  assert.ok(action >= 0 && push > action, 'scripts/push-tags.ts runs after the action')
})
