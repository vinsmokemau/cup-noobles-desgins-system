---
title: Using the system
slug: using-the-system
layer: overview
status: stable
lang: en
brandRules: []
tbd: []
related: [principles, brand-identity, glossary]
since: 0.1.0
updated: 2026-09-27
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
3. Add an `.npmrc` file at the root of the consuming project. It points the scope at GitHub Packages and reads the token from the environment:

   ```ini
   @vinsmokemau:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

4. Install the packages the project needs:

   ```sh
   pnpm add @vinsmokemau/cup-noobles-nuxt @vinsmokemau/cup-noobles-tokens
   ```

### Consume the packages

- **Nuxt apps.** Extend the layer in `nuxt.config.ts` with `extends: ['@vinsmokemau/cup-noobles-nuxt']`. The layer brings Nuxt UI, its theme, and the `Cn*` components.
- **Keep visual styling in the layer.** A consuming app uses Tailwind for layout only, and adds no colors, borders, radii, glow, or other visual styling of its own (ER-02, C-03, OD-11).
- **Dark only.** The theme is dark-only. Do not add a color-mode toggle (A-02, REQ-031).
- **Text comes from the app.** Components contain no hardcoded copy. Pass every string through props or slots (A-11), and write customer-facing copy in Spanish (es-MX) (ER-04).
- **Minimum width.** Layouts must work at 360 px wide (ER-05).
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

The install steps have not been verified against the registry yet, because no package is published until T12.1. T12.2 verifies them.

## Changelog

- 0.1.0 — First draft: packages, install from GitHub Packages, consumption rules, how to read the docs, and how to report a TBD item (T4.1) — awaiting owner approval
- 0.1.0 — Approved without changes; status `stable` — owner approval in chat, 2026-09-27
