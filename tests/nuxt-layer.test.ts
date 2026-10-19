// T5.1 checks: the @vinsmokemau/cup-noobles-nuxt layer. It extends Nuxt UI at the ADR-0001 pin, forces dark mode
// (REQ-031 AC1), and themes Nuxt UI only through --cn-* variables (REQ-016, C-03), with the C-06 shade scales.
// The build itself runs in `pnpm test:all` (build:nuxt); these tests read the sources and the package metadata.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
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
  // Beside the scales, @theme carries the two Tailwind transition defaults, which read the motion tokens (ADR-0032), and
  // the two font defaults, which read the body family (ADR-0047).
  assert.equal(theme.size, ALIASES.length * SHADES.length + 4, 'main.css declares nothing else in @theme')
  assert.equal(theme.get('--font-sans'), 'var(--cn-font-body-family)')
  assert.equal(theme.get('--default-font-family'), 'var(--cn-font-body-family)')
  assert.equal(theme.get('--default-transition-duration'), 'var(--cn-motion-duration-default)')
  assert.equal(theme.get('--default-transition-timing-function'), 'var(--cn-motion-easing-default)')
  for (const alias of ALIASES)
    for (const shade of SHADES) {
      const value = theme.get(`--color-cn-${alias}-${shade}`)
      const ref = value?.match(/^var\((--cn-[a-z0-9-]+)\)$/)?.[1]
      assert.ok(ref, `--color-cn-${alias}-${shade} is var(--cn-*), not ${value}`)
      assert.ok(tokenVars.has(ref), `${ref} is a token`)
    }
})

test('C-06, ADR-0055: primary and secondary read the shade tokens: two derived tones around the brand color', () => {
  for (const [alias, color, light, dark] of [
    ['primary', 'pink', '#fea0c5', '#d06c96'],
    ['secondary', 'yellow', '#fff7a3', '#dacf6d'],
  ] as const)
    for (const shade of SHADES) {
      const path = `color.brand.${color}-${shade}`
      assert.equal(theme.get(`--color-cn-${alias}-${shade}`), `var(${cssVariable(path)})`, path)
      const token = tokens.find((t) => t.path === path)
      assert.ok(token, `${path} exists`)
      assert.equal(token.tier, 'primitive', path)
      // Shade 400 is the brand color itself; the lighter tone sits below it and the darker tone above it.
      const expected = Number(shade) < 400 ? light : Number(shade) > 400 ? dark : `{color.brand.${color}}`
      assert.equal(token.value, expected, path)
      assert.equal(token.cn?.status, 'stable', path)
      assert.equal(token.cn?.tbd, undefined, path)
      if (Number(shade) !== 400) assert.equal(token.cn?.source, 'ADR-0055', path)
    }
})

test('ADR-0032: the feedback aliases repeat their stable feedback token, and neutral reads the neutral roles', () => {
  const expected: Record<string, string> = {
    success: 'color.feedback.success',
    info: 'color.feedback.info',
    warning: 'color.feedback.warning',
    error: 'color.feedback.error',
  }
  for (const [alias, path] of Object.entries(expected)) {
    assert.equal(tokens.find((t) => t.path === path)?.cn?.status, 'stable', path)
    for (const shade of SHADES) assert.equal(theme.get(`--color-cn-${alias}-${shade}`), `var(${cssVariable(path)})`)
  }
  // The neutral shades group by role: text, secondary text, border, disabled, divider, and the page.
  const roles: Record<number, string> = {
    50: 'color.text.default',
    100: 'color.text.default',
    200: 'color.text.default',
    300: 'color.text.muted',
    400: 'color.text.muted',
    500: 'color.border.default',
    600: 'color.border.default',
    700: 'color.text.disabled',
    800: 'color.border.divider',
    900: 'color.border.divider',
    950: 'color.bg.base',
  }
  for (const shade of SHADES) {
    const path = roles[shade]!
    assert.equal(tokens.find((t) => t.path === path)?.cn?.status, 'stable', path)
    assert.equal(theme.get(`--color-cn-neutral-${shade}`), `var(${cssVariable(path)})`, `neutral-${shade}`)
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
  assert.match(mainCss, /body\s*\{\s*background-color: var\(--ui-bg\);\s*color: var\(--ui-text\);/)
})

test('T13.1: the layer self-hosts Titan One and Rubik, with the OFL text of each, and sets headings and labels from the tokens', () => {
  const fonts = join(layer, 'assets/fonts')
  for (const file of [
    'titan-one-latin.woff2',
    'titan-one-latin-ext.woff2',
    'rubik-latin.woff2',
    'rubik-latin-ext.woff2',
    'OFL-TitanOne.txt',
    'OFL-Rubik.txt',
  ])
    assert.ok(existsSync(join(fonts, file)), file)
  assert.match(
    readFileSync(join(fonts, 'OFL-TitanOne.txt'), 'utf8'),
    /Rodrigo Fuenzalida[\s\S]*SIL Open Font License, Version 1\.1/,
  )
  assert.match(
    readFileSync(join(fonts, 'OFL-Rubik.txt'), 'utf8'),
    /The Rubik Project Authors[\s\S]*SIL Open Font License, Version 1\.1/,
  )
  const faces = [...mainCss.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]!)
  assert.equal(faces.length, 4)
  for (const face of faces) {
    const file = face.match(/url\('\.\.\/fonts\/([\w-]+\.woff2)'\)/)?.[1]
    assert.ok(file && existsSync(join(fonts, file)), 'every @font-face points at a shipped file')
    assert.match(face, /font-display: swap/)
  }
  assert.equal(faces.filter((f) => f.includes("font-family: 'Titan One'")).length, 2)
  assert.equal(faces.filter((f) => /font-family: 'Rubik'[\s\S]*font-weight: 400 700/.test(f)).length, 2)
  // Headings and labels read the display tokens, with one weight; the page reads the body tokens (ADR-0046, ADR-0047).
  for (const level of ['h1', 'h2', 'h3'])
    assert.match(
      mainCss,
      new RegExp(
        `^${level} \\{[^}]*font-family: var\\(--cn-font-${level}-family\\);[^}]*font-weight: var\\(--cn-font-${level}-weight\\);`,
        'm',
      ),
      level,
    )
  assert.match(mainCss, /\.cn-button,\s*\.cn-badge \{[^}]*font-family: var\(--cn-font-family-display\);/)
  assert.match(mainCss, /h1,\s*h2,\s*h3 \{\s*hyphens: auto;\s*overflow-wrap: break-word;/)
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
  assert.match(
    scripts['test:all']!,
    /^pnpm test && pnpm build:tokens && (?:pnpm build:email && )?pnpm build:nuxt(?: &&|$)/,
  )
})
