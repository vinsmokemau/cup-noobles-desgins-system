// T5.1 checks: the @vinsmokemau/cup-noobles-nuxt layer. It extends Nuxt UI at the ADR-0001 pin, forces dark mode
// (REQ-031 AC1), and themes Nuxt UI only through --cn-* variables (REQ-016, C-03), with the C-06 shade scales.
// The build itself runs in `pnpm test:all` (build:nuxt); these tests read the sources and the package metadata.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { checkTokens, cssVariable } from '../scripts/check-tokens'
import nuxtConfig from '../packages/nuxt/nuxt.config'
import appConfig from '../packages/nuxt/app.config'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const layer = join(root, 'packages/nuxt')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const json = (path: string) => JSON.parse(read(path))
const mainCss = read('packages/nuxt/assets/css/main.css')
const { tokens } = checkTokens(root)
const tokenVars = new Set(tokens.map((t) => cssVariable(t.path)))

// ADR-0001 §2 and §3: the aliases Nuxt UI themes, and the 11 shades each one reads.
const ALIASES = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

// `--name: value;` declarations inside the first block that follows `opener` in main.css.
function declarations(opener: RegExp): Map<string, string> {
  const start = mainCss.search(opener)
  assert.ok(start >= 0, `main.css has ${opener}`)
  const body = mainCss.slice(mainCss.indexOf('{', start) + 1, mainCss.indexOf('}', start))
  return new Map([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]))
}
const theme = declarations(/@theme static\s*\{/)
const roles = declarations(/@layer theme\s*\{/)

test('ADR-0001 §1: the layer pins @nuxt/ui 4.11.2 and Tailwind CSS 4.3.3, and installs exactly those', () => {
  const pkg = json('packages/nuxt/package.json')
  assert.equal(pkg.name, '@vinsmokemau/cup-noobles-nuxt')
  assert.equal(pkg.dependencies['@nuxt/ui'], '4.11.2')
  assert.equal(pkg.dependencies.tailwindcss, '4.3.3')
  assert.equal(pkg.devDependencies.nuxt, '4.5.2')
  assert.equal(pkg.scripts.build, 'nuxt build', 'the package builds with `nuxt build`')
  // @nuxt/ui does not export ./package.json, so its manifest is read from the layer's node_modules.
  const installed = JSON.parse(readFileSync(join(layer, 'node_modules/@nuxt/ui/package.json'), 'utf8'))
  assert.equal(installed.version, '4.11.2')
  assert.equal(installed.license, 'MIT')
})

test('the layer registers Nuxt UI and loads main.css; its sources sit at the §4.1 paths', () => {
  assert.deepEqual(nuxtConfig.modules, ['@nuxt/ui'])
  assert.deepEqual(nuxtConfig.css, [join(layer, 'assets/css/main.css')])
  assert.equal(nuxtConfig.srcDir, '.', 'app.config.ts, assets/, and components/ live at the package root')
})

test('REQ-031 AC1: the layer forces dark mode and installs no color-mode module or toggle', () => {
  assert.equal(nuxtConfig.ui?.colorMode, false, 'ADR-0001 §4: no @nuxtjs/color-mode, so no toggle components')
  assert.equal(nuxtConfig.app?.head?.htmlAttrs?.class, 'dark', 'the server renders <html class="dark">')
  assert.equal(nuxtConfig.ui?.fonts, false, 'no default typeface is fetched while TBD-01 and TBD-02 are open')
})

test('main.css imports Tailwind, Nuxt UI, and the built token CSS through the tokens package', () => {
  const imports = [...mainCss.matchAll(/^@import '([^']+)';$/gm)].map((m) => m[1])
  assert.deepEqual(imports, ['tailwindcss', '@nuxt/ui', '@vinsmokemau/cup-noobles-tokens/tokens.css'])
  const pkg = json('packages/nuxt/package.json')
  assert.equal(pkg.dependencies['@vinsmokemau/cup-noobles-tokens'], 'workspace:*')
  const tokensPkg = json('packages/tokens/package.json')
  assert.equal(tokensPkg.exports['./tokens.css'], './dist/css/tokens.css', 'the REQ-013 CSS output')
})

test('app.config.ts points every Nuxt UI color alias at a cn-* scale', () => {
  const colors = (appConfig as { ui: { colors: Record<string, string> } }).ui.colors
  assert.deepEqual(Object.keys(colors).sort(), [...ALIASES].sort())
  for (const alias of ALIASES) assert.equal(colors[alias], `cn-${alias}`, alias)
})

test('C-03 and REQ-016: every scale step is one var() of an existing --cn-* token, 11 shades per alias', () => {
  assert.equal(theme.size, ALIASES.length * SHADES.length, 'main.css declares nothing else in @theme')
  for (const alias of ALIASES)
    for (const shade of SHADES) {
      const value = theme.get(`--color-cn-${alias}-${shade}`)
      const ref = value?.match(/^var\((--cn-[a-z0-9-]+)\)$/)?.[1]
      assert.ok(ref, `--color-cn-${alias}-${shade} is var(--cn-*), not ${value}`)
      assert.ok(tokenVars.has(ref), `${ref} is a token`)
    }
})

test('C-06: primary and secondary read the derived-pending shade tokens of the single brand pink and yellow', () => {
  for (const [alias, color] of [
    ['primary', 'pink'],
    ['secondary', 'yellow'],
  ] as const)
    for (const shade of SHADES) {
      const path = `color.brand.${color}-${shade}`
      assert.equal(theme.get(`--color-cn-${alias}-${shade}`), `var(${cssVariable(path)})`, path)
      const token = tokens.find((t) => t.path === path)
      assert.ok(token, `${path} exists`)
      assert.equal(token.tier, 'primitive', path)
      assert.equal(token.value, `{color.brand.${color}}`, `${path} repeats the brand value; no tint is generated`)
      assert.equal(token.cn?.status, 'derived-pending', path)
      assert.deepEqual(token.cn?.tbd, ['TBD-08'], path)
    }
})

test('C-06 and §4.4: the other aliases repeat their TBD tokens; none reads a stable token or a brand shade', () => {
  const expected: Record<string, string> = {
    success: 'color.feedback.success',
    info: 'color.feedback.info',
    warning: 'color.feedback.warning',
    error: 'color.feedback.error',
    neutral: 'placeholder.color.neutral', // TBD-05: no color.neutral.* token exists yet (ADR-0006)
  }
  for (const [alias, path] of Object.entries(expected)) {
    assert.equal(tokens.find((t) => t.path === path)?.cn?.status, 'tbd', path)
    for (const shade of SHADES) assert.equal(theme.get(`--color-cn-${alias}-${shade}`), `var(${cssVariable(path)})`)
  }
})

test('REQ-012 and §2.1: Nuxt UI roles read the page background and the black label color from tokens', () => {
  assert.equal(roles.get('--ui-bg'), 'var(--cn-color-bg-base)')
  assert.equal(roles.get('--ui-text-inverted'), 'var(--cn-color-text-inverted)')
  assert.match(mainCss, /@layer theme\s*\{\s*:root,\s*\.dark\s*\{/, 'the roles also override Nuxt UI’s .dark rules')
  for (const [name, value] of roles) {
    const ref = value.match(/^var\((--cn-[a-z0-9-]+)\)$/)?.[1]
    assert.ok(name.startsWith('--ui-') && ref && tokenVars.has(ref), `${name}: ${value}`)
  }
  assert.match(mainCss, /body\s*\{\s*background-color: var\(--ui-bg\);\s*color: var\(--ui-text\);\s*\}/)
})

test('REQ-016 AC1: the layer sources pass cn/no-raw-values', async () => {
  const eslint = new ESLint({ cwd: root })
  const files = ['nuxt.config.ts', 'app.config.ts', 'assets/css/main.css'].map((f) => join(layer, f))
  for (const result of await eslint.lintFiles(files)) {
    assert.deepEqual(
      result.messages.map((m) => `${m.ruleId}: ${m.message}`),
      [],
      result.filePath,
    )
  }
})

test('Done when: `pnpm test:all` builds the tokens, then the layer', () => {
  const scripts = json('package.json').scripts as Record<string, string>
  assert.equal(scripts['build:nuxt'], 'pnpm --filter @vinsmokemau/cup-noobles-nuxt build')
  assert.match(scripts['test:all']!, /^pnpm test && pnpm build:tokens && pnpm build:nuxt(?: &&|$)/)
})
