// ESLint flat config (T1.2, custom rules T1.3). Formatting is Prettier's job, so eslint-config-prettier goes last.
import css from '@eslint/css'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import cn from './scripts/eslint-plugin-cn/index.js'

const code = ['**/*.{js,mjs,cjs,ts,mts,cts,vue}']

// defineConfig intersects each extended config's own `files` with the outer `files` (tseslint.config replaces them).
export default defineConfig(
  {
    // tests/fixtures/ holds deliberate rule violations; tests/lint-rules.test.ts lints them on purpose.
    ignores: ['**/node_modules/', '**/dist/', '**/.nuxt/', '**/.output/', '**/.data/', 'reports/', 'tests/fixtures/'],
  },
  {
    files: code,
    extends: [js.configs.recommended, ...tseslint.configs.recommended, ...vue.configs['flat/recommended']],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    files: code,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  {
    // Nuxt names pages, layouts, and the error page by file (`index.vue`, `default.vue`, `error.vue`), so they can't be
    // multi-word (T5.3, T5.4).
    files: ['**/pages/**/*.vue', '**/layouts/**/*.vue', 'apps/showcase/error.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    // Nuxt auto-imports Nuxt Content's `queryCollection` (T5.4); apps/showcase/shims.d.ts declares it for the typecheck.
    files: ['apps/showcase/**/*.{ts,vue}'],
    // T7.1: `definePageMeta` is a Nuxt compiler macro, and the demo frame talks to its iframe through the browser's window.
    languageOptions: { globals: { ...globals.browser, queryCollection: 'readonly', definePageMeta: 'readonly' } },
  },
  {
    // SPEC.md §4.1 names the showcase component `Playground`.
    files: ['apps/showcase/components/Playground.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    // A component's demos are named for what they show, `states.vue` and `playground.vue` (T7.1).
    files: ['apps/showcase/demos/**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    // CSS is parsed so cn/no-raw-values can read it. Tailwind at-rules are tolerated, not validated.
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    languageOptions: { tolerant: true },
  },
  {
    // REQ-016: no raw visual values in the Nuxt layer or the showcase. Tests assert computed values, so they are exempt.
    files: ['packages/nuxt/**/*.{js,mjs,ts,vue,css}', 'apps/showcase/**/*.{js,mjs,ts,vue,css}'],
    ignores: ['**/tests/**', '**/*.{test,spec}.ts'],
    plugins: { cn },
    rules: { 'cn/no-raw-values': 'error' },
  },
  {
    // REQ-022 AC2: component templates render no hardcoded text.
    files: ['packages/nuxt/components/**/*.vue'],
    plugins: { cn },
    rules: { 'cn/no-hardcoded-text': 'error' },
  },
  prettier,
)
