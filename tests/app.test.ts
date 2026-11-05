// T15.16 checks: CnApp, its doc, the ADR, the fixture, and the Spanish locale (DSR-13, REQ-020, REQ-021, REQ-022, REQ-027,
// REQ-071, ADR-0071). What needs a browser, such as the close buttons announced in Spanish and the English override, is in
// apps/consumer-fixture/tests/e2e/app-locale.spec.ts.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { assertControls } from '../apps/showcase/lib/demos'
import { readFrontmatter } from '../scripts/check-docs'
import { findDomainTerms, findForbiddenPrimitives, findMisnamedComponents, listFiles } from './lib/architecture'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const component = read('packages/nuxt/components/CnApp.vue')
const template = component.slice(component.indexOf('<template>'))
const doc = read('docs/02-components/organisms/app.md')
const data = readFrontmatter(doc).data as Record<string, unknown>

// The folder of the pinned Nuxt UI, where the locales are.
const store = join(root, 'node_modules/.pnpm')
const uiFolder = join(
  store,
  readdirSync(store).find((name) => name.startsWith('@nuxt+ui@'))!,
  'node_modules/@nuxt/ui/dist/runtime',
)
type Messages = Record<string, unknown>
const flat = (messages: Messages, prefix = ''): [string, string][] =>
  Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' ? flat(value as Messages, `${prefix}${key}.`) : [[`${prefix}${key}`, String(value)]],
  )
async function locale(code: string) {
  return (await import(pathToFileURL(join(uiFolder, `locale/${code}.js`)).href)).default as { messages: Messages }
}

test('REQ-021 AC1, REQ-020 AC3, REQ-022 AC1: CnApp is named Cn*, hand-rolls no primitive, and uses no domain term', () => {
  assert.ok(listFiles(root, 'packages/nuxt/components', /\.vue$/).includes('packages/nuxt/components/CnApp.vue'))
  assert.deepEqual(findMisnamedComponents(root), [])
  assert.deepEqual(findForbiddenPrimitives(root), [])
  assert.deepEqual(findDomainTerms(root), [])
})

test('REQ-020 AC1, AC2: the doc is a stable custom organism that says why it is custom', () => {
  assert.equal(data.layer, 'component')
  assert.equal(data.level, 'organism')
  assert.equal(data.source, 'custom')
  assert.equal(data.component, 'CnApp')
  assert.equal(data.status, 'stable')
  assert.deepEqual(data.demos, ['states', 'playground'])
  assert.deepEqual(data.tbd, [])
  assert.deepEqual(data.tokens, [])
  assert.match(doc, /\*\*Why custom:\*\* the component starts from Nuxt UI's `UApp`/)
  assert.match(doc, /ADR-0071/)
})

test('ADR-0071: the choice is recorded with the owner option, and it is in the decision log', () => {
  const adr = read('docs/06-governance/decisions/0071-cn-app-spanish-default.md')
  assert.match(adr, /# ADR-0071: CnApp gives the built-in text of Nuxt UI a Spanish default/)
  assert.match(adr, /option A, the owner's choice/)
  assert.match(adr, /\*\*B\.\*\*/)
  assert.match(adr, /\*\*C\.\*\*/)
  assert.match(read('docs/06-governance/decision-log.md'), /\(decisions\/0071-cn-app-spanish-default\.md\)/)
})

test('A-11, DSR-13: CnApp wraps UApp, defaults to the Nuxt UI es locale, lets a locale override it, and holds no text', () => {
  assert.match(component, /import \{ es \} from '@nuxt\/ui\/locale'/)
  assert.match(component, /locale\?: AppProps\['locale'\]/)
  assert.match(component, /\{ locale: \(\) => es \}/)
  // One <UApp> with the locale and the slot, and nothing else: no element, no class, no text node.
  assert.match(template, /<UApp :locale="locale">\s*<slot \/>\s*<\/UApp>/)
  assert.doesNotMatch(template, /<(?!\/?(?:template|UApp|slot)\b)[a-zA-Z]/)
  assert.doesNotMatch(template, />\s*[^<\s][^<]*</, 'a text node')
  assert.doesNotMatch(component, /\b(?:class|style)=/)
})

test('DSR-13: the pinned Nuxt UI keeps English as the fallback, and its es locale translates every message', async () => {
  // ADR-0071 rests on this. If a release adds an app-level default, or leaves a message in English, this test fails.
  const app = readFileSync(join(uiFolder, 'components/App.vue'), 'utf8')
  assert.match(app, /provide\(localeContextInjectionKey, locale\)/)
  assert.match(
    readFileSync(join(uiFolder, 'composables/useLocale.js'), 'utf8'),
    /inject\(localeContextInjectionKey, en\)/,
  )
  const en = Object.fromEntries(flat((await locale('en')).messages))
  const es = Object.fromEntries(flat((await locale('es')).messages))
  assert.deepEqual(Object.keys(es).sort(), Object.keys(en).sort(), 'es and en have the same messages')
  assert.equal(Object.keys(es).length, 74, 'the doc says 74 built-in messages')
  assert.deepEqual(
    Object.keys(en).filter((key) => en[key] === es[key]),
    [],
    'a message stays English in es',
  )
})

test('the doc names the built-in text the system uses, with the Nuxt UI wording', async () => {
  const en = Object.fromEntries(flat((await locale('en')).messages))
  const es = Object.fromEntries(flat((await locale('es')).messages))
  for (const key of ['alert.close', 'modal.close', 'slideover.close', 'toast.close', 'drawer.close']) {
    assert.equal(en[key], 'Close', key)
    assert.equal(es[key], 'Cerrar', key)
  }
  assert.equal(es['header.open'], 'Abrir menú')
  assert.equal(es['header.close'], 'Cerrar menú')
  assert.equal(es['carousel.prev'], 'Anterior')
  assert.equal(es['carousel.next'], 'Siguiente')
  assert.equal(es['error.clear'], 'Volver al inicio')
  assert.match(doc, /translates all 74 built-in messages/)
  assert.match(doc, /Cerrar menú/)
})

test('REQ-071, DSR-13: the fixture and the showcase render CnApp, and the fixture page sets no close label', () => {
  assert.doesNotMatch(read('apps/consumer-fixture/app.vue'), /<UApp/)
  for (const file of ['apps/showcase/app.vue', 'apps/showcase/error.vue']) {
    const text = read(file)
    assert.match(text, /<CnApp :locale="en"/, file)
    assert.doesNotMatch(text, /<UApp/, file)
  }
  const page = read('apps/consumer-fixture/pages/components/app.vue')
  assert.doesNotMatch(page, /aria-label(?!ledby)/)
  assert.doesNotMatch(page, /<CnApp/)
  assert.match(read('apps/consumer-fixture/app.vue'), /<CnApp :locale="locale">/)
  assert.match(read('apps/consumer-fixture/app.vue'), /route\.query\.locale === 'en'/)
  assert.match(read('apps/consumer-fixture/tests/e2e/app-locale.spec.ts'), /another locale can still be set/)
})

test('DSR-13: using-the-system.md says how an app turns CnApp on, and a minor changeset exists', () => {
  const guide = read('docs/00-overview/using-the-system.md')
  assert.match(guide, /Render `CnApp` at the root/)
  assert.match(guide, /replace `<UApp>` with `<CnApp>`/)
  assert.match(guide, /#ui\/locale/)
  // Once the "Version packages" pull request has consumed the changeset, its text lives in the changelog.
  if (!existsSync(join(root, '.changeset/cn-app.md'))) {
    assert.match(read('CHANGELOG.md'), /CnApp/)
    return
  }
  const changeset = read('.changeset/cn-app.md')
  for (const name of ['tokens', 'nuxt', 'email']) assert.match(changeset, new RegExp(`cup-noobles-${name}': minor`))
  assert.match(changeset, /CnApp/)
})

test('REQ-055: the demos exist, and the playground has a locale control', async () => {
  for (const file of ['states.vue', 'playground.vue', 'controls.ts']) {
    assert.ok(existsSync(join(root, 'apps/showcase/demos/app', file)), file)
  }
  const controls = assertControls((await import('../apps/showcase/demos/app/controls')).default, 'app')
  assert.deepEqual(
    controls.map((control) => control.name),
    ['locale'],
  )
  assert.match(read('apps/showcase/demos/app/playground.vue'), /locale\?: 'es' \| 'en'/)
})
