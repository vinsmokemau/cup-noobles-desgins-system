---
title: Versioning and releases
slug: versioning-and-releases
layer: governance
status: draft
lang: en
tbd: []
related: [ownership, contribution, deprecation, decision-log]
since: 0.1.0
updated: 2026-10-11
---

# Versioning and releases

## Purpose

This doc says how the three packages are numbered and how a release reaches people. Every package moves together, so a consumer never has to match versions by hand (A-04, REQ-070).

## Policy and process

### Packages and numbering

| Package | What it ships |
|---|---|
| `@vinsmokemau/cup-noobles-tokens` | Framework-free tokens: CSS, JSON, and TypeScript |
| `@vinsmokemau/cup-noobles-nuxt` | The Nuxt layer: the themed Nuxt UI components and the custom `Cn*` components |
| `@vinsmokemau/cup-noobles-email` | The email components and the reference layout, as static HTML |

- The three packages are released **in lockstep**: one version number for all of them, with semantic versioning (REQ-070 AC1).
- Versions start at `0.1.0` and stay `0.x` until the 1.0 gate passes (A-04, REQ-018).
- While the version is `0.x`, a minor release may contain breaking changes. Each one is still listed under **Breaking** in `CHANGELOG.md`, with a migration note (REQ-072 AC2).
- From `1.0.0`: a major release for a breaking change, a minor release for an addition, and a patch release for a fix.

### The 1.0 gate

`pnpm release:check` decides whether `1.0.0` is allowed (REQ-018):

- It fails if any component whose doc is `stable` reaches, directly or through a chain, a token whose status is `tbd` or `derived-pending`.
- For a `1.0.0` version, it fails if any doc under `01-foundations/` has status `tbd`.

Passing the gate is necessary, not sufficient. The owner decides in writing, in an ADR, whether to release `1.0.0` (T12.3).

### Release flow

1. Each change that affects a package includes a changeset, created with `pnpm changeset` (SPEC.md §4.8).
2. When changes reach `main`, the release workflow runs Changesets and opens a "Version packages" pull request.
3. Merging that pull request bumps all three packages in lockstep, updates `CHANGELOG.md`, and tags the release.
4. A tagged release publishes the packages privately to GitHub Packages (OD-03) and deploys the showcase to GitHub Pages (OD-02).

### The changelog

- Every release updates `CHANGELOG.md`, with entries grouped as **Breaking**, **Added**, **Changed**, **Deprecated**, and **Fixed** (REQ-070 AC2).
- Every breaking change has a migration note (REQ-072 AC2).
- The showcase shows the same file at `/changelog` (REQ-062).

### What needs a changeset

A changeset is required when the public API, the tokens, or the docs change (SPEC.md §0.2). A change to the tooling or tests only does not need one.

## Open items

> **Draft:** The release flow above is the target flow from SPEC.md §4.8. The Changesets configuration, the release workflow, and `CHANGELOG.md` arrive with T11.3, and `pnpm release:check` arrives with T11.4. Until then, changeset files are written by hand in `.changeset/`, and the steps after "Version packages" are not automated.

## Changelog

- 0.1.0 — First draft: lockstep versioning, the 1.0 gate, the release flow, and the changelog format (T11.2, REQ-070) — awaiting owner approval
