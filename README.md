# Cup Noobles Design System

The design system for Cup Noobles: design tokens, a Nuxt UI theme layer with a few custom components, email components compiled to static HTML, and a showcase site.

- **`DESIGN.md`** is the entry point to the documentation (created in Phase 2).
- **[`SPEC.md`](SPEC.md)** is the contract this repository is built from, using Spec-Driven Development.
- **[`CLAUDE.md`](CLAUDE.md)** holds the standing instructions for Claude Code. Work is done one SPEC.md §6 task at a time, with `/task <id>`.

## Status

Phase 0 (bootstrap and spikes). The workspace, packages, and commands described in SPEC.md §0.3 arrive in Phase 1.

## Layout so far

| Path | Contents |
|---|---|
| `docs/00-overview/brand-context-source.md` | The owner-supplied brand context, verbatim and hash-locked (`.sha256` next to it). Never edit it. |
| `docs/06-governance/decisions/` | Architecture decision records (ADRs), starting from `0000-adr-template.md` |
| `spikes/` | Throwaway technical spikes from Phase 0, removed in T1.1 |

## Setup

Requirements: Node.js LTS (24.x) and pnpm.

To run the Nuxt UI spike:

```sh
cd spikes/0001-nuxt-ui
pnpm install
pnpm build
pnpm verify
```

`pnpm verify` uses the locally installed Microsoft Edge.
