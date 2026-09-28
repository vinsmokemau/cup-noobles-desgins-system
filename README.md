# Cup Noobles Design System

The design system for Cup Noobles: design tokens, a Nuxt UI theme layer with a few custom components, email components compiled to static HTML, and a showcase site.

- **`DESIGN.md`** is the entry point to the documentation (created in Phase 2).
- **[`SPEC.md`](SPEC.md)** is the contract this repository is built from, using Spec-Driven Development.
- **[`CLAUDE.md`](CLAUDE.md)** holds the standing instructions for Claude Code. Work is done one SPEC.md §6 task at a time, with `/task <id>`.

## Status

Phase 3 (token pipeline). The pnpm workspace, the directory tree from SPEC.md §4.1, and the doc stubs exist, and the primitive and semantic token sources build into the `tokens` package; the other packages and the apps are still empty. `pnpm test`, `pnpm test:all`, `pnpm check:docs`, `pnpm check:tbd`, `pnpm check:tokens`, and `pnpm build:tokens` exist; the other commands in SPEC.md §0.3 arrive with their tasks.

## Layout

The full tree is in SPEC.md §4.1. Empty directories hold a `.gitkeep` until their files arrive.

| Path | Contents |
|---|---|
| `docs/00-overview/brand-context-source.md` | The owner-supplied brand context, verbatim and hash-locked (`.sha256` next to it). Never edit it. |
| `docs/06-governance/decisions/` | Architecture decision records (ADRs), starting from `0000-adr-template.md` |
| `tokens/` | DTCG token sources |
| `packages/` | `tokens`, `nuxt`, and `email`, published as `@vinsmokemau/cup-noobles-*` |
| `apps/` | `showcase` and `consumer-fixture` |
| `reports/` | Generated reports (git-ignored) |

## Setup

Requirements: Node.js 24.19.0 (see `.nvmrc`) and pnpm 12.6.0 (see `packageManager` in `package.json`).

```sh
pnpm install
pnpm test
```

| Command | Runs |
|---|---|
| `pnpm test` | `pnpm lint`, then `pnpm typecheck`, then `pnpm test:unit`, then `pnpm check:docs`, then `pnpm check:tokens`, then `pnpm check:tbd` |
| `pnpm check:tokens` | `scripts/check-tokens.ts`: DTCG structure, types, values, and references; tier rules; `$description`, `$extensions.cn` status, source, and TBD IDs; placeholders; and path naming, across `tokens/` |
| `pnpm check:docs` | `scripts/check-docs.ts`: frontmatter, template headings, hex literals, MDC syntax, `copy` locales, and callouts in `stable` docs, across `docs/` and `DESIGN.md` |
| `pnpm lint` | ESLint (`eslint.config.js`), `prettier --check`, and markdownlint (`.markdownlint-cli2.jsonc`) |
| `pnpm typecheck` | `vue-tsc --noEmit` over `tsconfig.json` |
| `pnpm test:unit` | The Vitest workspace in `vitest.config.ts` |
| `pnpm build:tokens` | `packages/tokens/build.ts` (Style Dictionary): writes `dist/css/tokens.css`, `dist/json/tokens.flat.json`, `dist/ts/tokens.ts`, and `dist/email/email-tokens.json` in `packages/tokens` |
| `pnpm test:all` | `pnpm test`, then `pnpm build:tokens`. The email, static generation, and end-to-end stages are added by later tasks (SPEC.md §0.3). |
| `pnpm format` | Rewrites code with Prettier and fixes what markdownlint can fix |

## CI and branch protection

`.github/workflows/ci.yml` runs `pnpm test:all` on every push and every pull request (SPEC.md REQ-074). The job runs inside one container image, pinned by tag and digest (SPEC.md A-12). Its check is named `test:all`. Pull requests use `.github/pull_request_template.md`, which carries the docs-sync checklist (REQ-075).

The default branch is `main`. Branch protection is a repository setting, so the owner applies it once by hand (REQ-074 AC2). In **Settings → Branches → Add branch protection rule** (or an equivalent ruleset), for the branch name pattern `main`:

- Turn on **Require a pull request before merging**.
- Turn on **Require status checks to pass before merging**, then **Require branches to be up to date before merging**, and add the status check `test:all`.
- Leave **Allow force pushes** and **Allow deletions** off.

With these settings, changes reach `main` through pull requests, and a red `test:all` check blocks the merge.

Prettier formats code only; Markdown is checked by markdownlint. `SPEC.md`, `CLAUDE.md`, `AGENTS.md`, the skills, and the hash-locked brand source are not linted, because tasks may not reformat them.
