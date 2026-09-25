// T1.4 checks: CI runs the full suite in a pinned container, and the PR template carries the docs-sync checklist.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

interface Step {
  uses?: string
  run?: string
}
interface Job {
  name?: string
  container?: string | { image?: string }
  steps?: Step[]
}
const workflow: { on: Record<string, unknown>; jobs: Record<string, Job> } = parse(read('.github/workflows/ci.yml'))
const jobs = Object.values(workflow.jobs)
const imageOf = (job: Job) => (typeof job.container === 'string' ? job.container : job.container?.image)
const suiteJobs = jobs.filter((job) => job.steps?.some((step) => /^pnpm test:all$/m.test(step.run ?? '')))

test('REQ-074 AC1: CI triggers on every push and every pull request, with no branch or path filters', () => {
  for (const event of ['push', 'pull_request']) {
    assert.ok(event in workflow.on, `ci.yml does not trigger on ${event}`)
    const filters = workflow.on[event]
    assert.ok(filters == null || Object.keys(filters).length === 0, `${event} is filtered: ${JSON.stringify(filters)}`)
  }
})

test('REQ-074 AC1: CI runs `pnpm test:all` after a frozen-lockfile install', () => {
  assert.equal(suiteJobs.length, 1, 'exactly one job runs pnpm test:all')
  const runs = suiteJobs[0]!.steps!.map((step) => step.run ?? '')
  const install = runs.findIndex((run) => /^pnpm install --frozen-lockfile$/m.test(run))
  const suite = runs.findIndex((run) => /^pnpm test:all$/m.test(run))
  assert.ok(install >= 0 && install < suite, 'pnpm install --frozen-lockfile must run before pnpm test:all')
})

test('A-12: every CI job runs in one container image pinned by tag and digest', () => {
  const images = new Set(jobs.map(imageOf))
  assert.equal(images.size, 1, `jobs use different images: ${[...images].join(', ')}`)
  const [image] = images
  assert.match(image ?? '', /^[\w./-]+:v?\d+\.\d+\.\d+[\w.-]*@sha256:[0-9a-f]{64}$/, `image is not pinned: ${image}`)
  assert.doesNotMatch(image ?? '', /:latest\b/)
})

test('third-party actions are pinned to a full commit SHA', () => {
  for (const step of jobs.flatMap((job) => job.steps ?? [])) {
    if (step.uses) assert.match(step.uses, /@[0-9a-f]{40}$/, `${step.uses} is not pinned to a commit`)
  }
})

test('the suite job is named `test:all`, the check that branch protection requires (README.md)', () => {
  assert.equal(suiteJobs[0]?.name, 'test:all')
  assert.ok(read('README.md').includes('`test:all`'), 'README.md does not name the required check')
})

test('REQ-075 AC1: the PR template includes a docs-sync checklist', () => {
  const template = read('.github/pull_request_template.md')
  const section = template.split(/^## /m).find((part) => part.startsWith('Docs sync checklist'))
  assert.ok(section, 'the PR template has no "Docs sync checklist" section')
  const items = section.match(/^- \[ \] .+$/gm) ?? []
  for (const topic of ['docs/', 'pnpm sync:docs --check', 'status', 'TBD', 'changeset']) {
    assert.ok(
      items.some((item) => item.includes(topic)),
      `no checklist item covers ${topic}`,
    )
  }
})
