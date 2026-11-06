---
title: Using the system
slug: using-the-system
layer: overview
status: stable
lang: en
brandRules: []
tbd: []
related: [principles, brand-identity, glossary, app, skip-link]
since: 0.1.0
updated: 2026-11-05
---

# Using the system

## Purpose

This doc explains how a project installs and consumes the three Cup Noobles packages, how to read these docs, and how to report a missing brand value (a TBD item). It applies to every project that uses the system, because the system is project-agnostic and reusable (ER-09).

## Usage rules

### Packages

All three packages share one version number and are released together (A-04). They stay on `0.x` until the 1.0 release gate passes (REQ-018).

| Package | What it holds | Who uses it |
|---|---|---|
| `@vinsmokemau/cup-noobles-tokens` | The design tokens, built into four framework-free outputs (REQ-013): `dist/css/tokens.css` (CSS custom properties), `dist/json/tokens.flat.json` (resolved values), `dist/ts/tokens.ts` (typed constants), and `dist/email/email-tokens.json` (email-safe values). It has no runtime dependencies. | Any project, on any stack |
| `@vinsmokemau/cup-noobles-nuxt` | A Nuxt layer: the Nuxt UI theme built from the tokens, the custom `Cn*` components, and forced dark mode (C-01, REQ-031). | Nuxt 4 apps, including apps rendered with SSR (ER-03) |
| `@vinsmokemau/cup-noobles-email` | Static HTML email components and a reference layout, compiled from MJML, with `{{ slot_name }}` placeholders (REQ-041). | Any backend that sends email (REQ-044) |

The components are Vue and Nuxt only. A project on another stack uses the tokens package and the email HTML, which are framework-free (R-07).

### Install from GitHub Packages

The packages are published privately on GitHub Packages under the `@vinsmokemau` scope (OD-03). Installing them takes a GitHub token.

1. Create a GitHub personal access token (classic) with the `read:packages` scope. GitHub Packages' npm registry accepts classic tokens only.
2. Keep the token out of the repository. Expose it to your shell, and to CI as a secret, in the environment variable `NODE_AUTH_TOKEN`.
3. Add an `.npmrc` file at the root of the consuming project. It points the scope at GitHub Packages, and it holds no token, so it is safe to commit:

   ```ini
   @vinsmokemau:registry=https://npm.pkg.github.com
   ```

4. Put the token line in your user-level `.npmrc` (`~/.npmrc`), not in the project file. It reads the token from the environment:

   ```ini
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

   In GitHub Actions, `actions/setup-node` with `registry-url: https://npm.pkg.github.com` and `scope: '@vinsmokemau'` writes this line for you. Pass the token as `NODE_AUTH_TOKEN` to the install step. A token line in the project `.npmrc` makes pnpm 12 fail on the package download with HTTP 401, even though it resolves the package first.
5. If the project uses pnpm, tell it not to run the install scripts of `esbuild` and `vue-demi`. Neither is needed, and without this setting `pnpm add` ends with `ERR_PNPM_IGNORED_BUILDS` and a non-zero exit code. In `pnpm-workspace.yaml`:

   ```yaml
   allowBuilds:
     esbuild: false
     vue-demi: false
   ```

6. Install the packages the project needs:

   ```sh
   pnpm add @vinsmokemau/cup-noobles-nuxt @vinsmokemau/cup-noobles-tokens
   ```

   Add `@vinsmokemau/cup-noobles-email` the same way when the project sends email.

These steps were run against the registry on 2026-10-18, with version `0.2.0` of the three packages, pnpm 12.6.0, and a clean store and cache. Every file this doc names was present in the installed packages.

### Consume the packages

- **Nuxt apps.** Extend the layer in `nuxt.config.ts` with `extends: ['@vinsmokemau/cup-noobles-nuxt']`. The layer brings Nuxt UI, its theme, and the `Cn*` components.
- **Keep visual styling in the layer.** A consuming app uses Tailwind for layout only, and adds no colors, borders, radii, glow, or other visual styling of its own (ER-02, C-03, OD-11).
- **Dark only.** The theme is dark-only. Do not add a color-mode toggle (A-02, REQ-031). The layer also tells the browser: it sets `color-scheme: dark` (a `<meta>` tag and a CSS rule, so scrollbars and form controls are dark), and a `theme-color` meta tag with the pure-black page base, read from the `color.bg.base` token (BR-03). Nuxt UI sets neither when its color mode is off. An app that needs another `theme-color` on a page can override it with `useHead`.
- **Render `CnApp` at the root.** Nuxt UI writes some text itself, such as the name of the close button of a modal, a slideover, a toast, and an alert, and it uses English unless the root sets a locale. The layer gives you `CnApp`, which is `UApp` with Spanish (the Nuxt UI `es` locale) as the default (ADR-0071, DSR-13). In `app.vue` and in `error.vue`, replace `<UApp>` with `<CnApp>`; the props and the slot are the same:

  ```vue
  <template>
    <CnApp>
      <NuxtPage />
    </CnApp>
  </template>
  ```

  An app that keeps `<UApp>` stays English and nothing reports it, so search the app for `<UApp` after upgrading. To use another language, pass a Nuxt UI locale: `import { en } from '#ui/locale'` and `<CnApp :locale="en">`. The `#ui` alias comes with the layer, so the app adds no `@nuxt/ui` dependency. See [App](../02-components/organisms/app.md).
- **Add a skip link and `CnMain` to every page.** A keyboard user must be able to jump past the header (WCAG 2.4.1). The layer gives you `CnSkipLink`, a link that stays hidden until it receives keyboard focus, and `CnMain`, the `<main>` it jumps to (ADR-0072, DSR-14). Put the link first in the layout, before the header, and use `CnMain` for the main region of every page. `CnMain` carries the `id` and the `tabindex="-1"` that move focus, so the app writes neither:

  ```vue
  <template>
    <CnSkipLink label="Saltar al contenido" />
    <SiteHeader />
    <CnMain>
      <slot />
    </CnMain>
  </template>
  ```

  The two agree on the id `main` with no props; to use another id, pass it to both (`target` on the link, `id` on `CnMain`). A plain `<main>` still scrolls, but focus stays in the header, and nothing reports it. The label is yours to write, in the page language. See [Skip link](../02-components/atoms/skip-link.md).
- **Text comes from the app.** Components contain no hardcoded copy. Pass every string through props or slots (A-11), and write customer-facing copy in Spanish (es-MX) (ER-04).
- **Minimum width.** Layouts must work at 360 px wide (ER-05).
- **Lint for raw values.** The layer ships the lint rule of REQ-016, so an app runs the same check as this repository (ADR-0067). The rule `cn/no-raw-values` fails on a hex, `rgb()`, or `hsl()` color, and on a `px`, `rem`, or `ms` number, in script, template, `<style>`, and CSS. `0` and `var(--cn-*)` pass. Add it to the app's `eslint.config.js` (ESLint 9 or later, with `vue-eslint-parser` for `.vue` files and `@eslint/css` for `.css` files):

  ```js
  import cn from '@vinsmokemau/cup-noobles-nuxt/eslint/index.js'

  export default [
    {
      files: ['**/*.{js,ts,vue,css}'],
      ignores: ['**/tests/**'],
      plugins: { cn },
      rules: { 'cn/no-raw-values': 'error' },
    },
  ]
  ```

  Run `eslint .` in the app's checks. A line such as `border-radius: 12px` fails with `Raw visual value "12px"`. Use a token variable instead.
- **Other stacks.** Use the CSS custom properties from `dist/css/tokens.css`. Each one is named `--cn-` followed by the token path with dashes, so the token `color.bg.base` is `--cn-color-bg-base` (REQ-017).
- **Email.** Copy the compiled HTML from the email package's `dist/` folder into your backend, and fill each `{{ slot_name }}` placeholder with your template engine. [Email components](../05-email/email-components.md) lists the slots of each component (REQ-041 AC4).

### Read the docs

- Start at [DESIGN.md](../../DESIGN.md). It links every doc, grouped by layer.
- The same `.md` files render in the showcase at `https://vinsmokemau.github.io/cup-noobles-desgins-system/` (OD-02), with live previews. The files are the source; the showcase adds no content of its own.
- Every doc's frontmatter has a `status`:

| Status | Meaning |
|---|---|
| `tbd` | Not written yet. |
| `draft` | Written, but it holds rules that the owner has not approved yet. They can still change (REQ-009). |
| `stable` | Approved. Its changelog references the ADR or owner approval, and it contains no draft or TBD callouts (REQ-009 AC2, REQ-037). |
| `deprecated` | Being removed. Do not start using it. |

- Docs mark their content with these callouts:

| Callout | Meaning |
|---|---|
| `> **BR-NN:** …` | A brand rule, quoted with its ID from SPEC.md §2.1 (REQ-006 AC2). It is binding. |
| `> **TBD (TBD-NN):** …` | A value that no source defines yet. Its ID is in SPEC.md §2.4 (REQ-005). |
| `> **TBD:** Content pending (Tn.n).` | A section that task `Tn.n` has not written yet. |
| `> **Draft:** …` | A proposed rule, awaiting the owner's approval (REQ-009 AC1). |

- Token tables sit between `cn:generated` marker comments. `pnpm sync:docs` writes them from the token files, so never edit them by hand (REQ-004).
- UI copy examples sit in code blocks tagged `copy es-MX` (a good example) or `copy-bad es-MX` (a bad one) (REQ-007).
- A token with status `tbd` holds a placeholder value, recorded in ADR-0006. A placeholder is not a brand value. Never copy one into another project as if it were (R-11).

### Report a TBD item

- `pnpm check:tbd` lists every open TBD item in `reports/tbd-report.json`, with the docs and tokens that use it. The showcase `/status` page shows the same list (REQ-057).
- Only the owner resolves a TBD item. Send the owner the TBD ID, the value you propose, and its source. The owner supplies or approves the value, an ADR records it, the tokens become `stable`, and the callouts are removed (SPEC.md §4.4).
- If you find a value that the system needs but no TBD item covers, report it to the owner the same way. It gets a new ID in SPEC.md §2.4.
- Never fill a TBD item with a value of your own, in this repository or in a consuming project.

### When to use

- Read this doc before adding any of the packages to a project.
- Use it to learn what the status badges and callouts in the other docs mean.

### When not to use

- Do not use this doc for a component's API. Each component doc has a "Code reference" section.
- Do not use it for release and versioning rules. See [Versioning and releases](../06-governance/versioning-and-releases.md).

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: packages, install from GitHub Packages, consumption rules, how to read the docs, and how to report a TBD item (T4.1) — awaiting owner approval
- 0.1.0 — Approved without changes; status `stable` — owner approval in chat, 2026-09-27
- 0.2.0 — Install steps verified against GitHub Packages: the token line moves to the user-level `.npmrc`, and the pnpm `allowBuilds` setting is added (T12.2) — ADR-0007
- 0.3.0 — The layer sets `color-scheme: dark` and a `theme-color` meta tag from `color.bg.base` (T15.5, DSR-06) — approved without changes; owner approval in chat, 2026-11-01
- 0.4.0 — The layer ships the raw-value lint rule, with its usage (T15.6, DSR-09) — approved without changes; owner approval in chat, 2026-11-01 (ADR-0067)
- 0.5.0 — The layer ships `CnApp`, `UApp` with Spanish as the default for Nuxt UI's built-in text, and the doc says how an app turns it on (T15.16, DSR-13) — approved without changes; owner choice in chat, 2026-11-04 (ADR-0071)
- 0.6.0 — The layer ships `CnSkipLink` and `CnMain`, and the doc says where they go in a layout (T15.18, DSR-14) — approved without changes; owner choice in chat, 2026-11-05 (ADR-0072)
