// T10.5 checks: the pure logic of the email previews (REQ-058). The sandboxed frame, the width toggle, and "Copy HTML"
// run in a real browser: apps/showcase/tests/e2e/email-preview.spec.ts (`pnpm test:all`).
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  EMAIL_PREVIEWS,
  EMAIL_SANDBOX,
  EMAIL_TITLES,
  EMAIL_WIDTHS,
  emailPreviewsFor,
} from '../apps/showcase/lib/email-previews'
import { scanDocs } from '../apps/showcase/lib/doc-scan'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'packages/email/src')

test('REQ-058 AC1: the width toggle offers 320 and 600 px', () => {
  assert.deepEqual([...EMAIL_WIDTHS], [320, 600])
})

test('REQ-058 AC1: the frame sandbox lets no script run and no navigation happen', () => {
  const tokens = EMAIL_SANDBOX.split(/\s+/).filter(Boolean)
  for (const forbidden of ['allow-scripts', 'allow-forms', 'allow-popups', 'allow-top-navigation', 'allow-modals']) {
    assert.ok(!tokens.includes(forbidden), `the sandbox does not grant ${forbidden}`)
  }
})

test('REQ-058 AC1: every email doc names previews, and each one is the output of an MJML source', () => {
  const sources = new Set(
    ['components', 'layouts'].flatMap((folder) =>
      readdirSync(join(src, folder))
        .filter((file) => file.endsWith('.mjml'))
        .map((file) => file.replace(/\.mjml$/, '')),
    ),
  )
  const emailDocs = scanDocs(join(root, 'docs')).filter((doc) => doc.route.startsWith('/email/'))
  assert.equal(emailDocs.length, 3)
  for (const doc of emailDocs) {
    const slug = doc.route.split('/').at(-1)
    assert.ok(emailPreviewsFor(slug).length > 0, `${doc.route} has previews`)
  }
  for (const [slug, names] of Object.entries(EMAIL_PREVIEWS)) {
    assert.ok(existsSync(join(root, 'docs/05-email', `${slug}.md`)), `${slug} is an email doc`)
    for (const name of names) {
      assert.ok(sources.has(name), `${slug}: ${name} has an MJML source`)
      assert.ok(EMAIL_TITLES[name], `${name} has a title`)
    }
  }
})

test('the components doc previews all 6 components, and a doc outside the email layer has no preview', () => {
  assert.equal(EMAIL_PREVIEWS['email-components']!.length, 6)
  assert.deepEqual(emailPreviewsFor('button'), [])
  assert.deepEqual(emailPreviewsFor(undefined), [])
})
