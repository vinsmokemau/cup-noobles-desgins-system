# Cup Noobles Design System

The design system for Cup Noobles: design tokens, a Nuxt UI theme layer with a few custom components, email components compiled to static HTML, and a showcase site.

- **`DESIGN.md`** is the entry point to the documentation (created in Phase 2).
- **[`SPEC.md`](SPEC.md)** is the contract this repository is built from, using Spec-Driven Development.
- **[`CLAUDE.md`](CLAUDE.md)** holds the standing instructions for Claude Code. Work is done one SPEC.md §6 task at a time, with `/task <id>`.

## Status

Phase 1 (repository and tooling). The pnpm workspace and the directory tree from SPEC.md §4.1 exist, but the packages and apps are still empty. The commands in SPEC.md §0.3 arrive from T1.2 onward.

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
pnpm test:scaffold
```
