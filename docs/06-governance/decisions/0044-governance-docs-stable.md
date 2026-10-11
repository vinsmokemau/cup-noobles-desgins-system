---
title: "ADR-0044: Governance docs move to stable"
slug: adr-0044-governance-docs-stable
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [adr-0033-first-docs-stable, adr-0037-content-docs-stable, ownership, versioning-and-releases, contribution, deprecation, decision-log]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0044: Governance docs move to stable

## Context

T11.2 wrote `ownership.md`, `versioning-and-releases.md`, `contribution.md`, `deprecation.md`, and `decision-log.md` as drafts. They state process rules that come from the spec (A-01, SPEC.md §4.8, REQ-070, REQ-072, REQ-073) and from the owner's standing instructions, not from the brand context. A doc moves from `draft` to `stable` only when an ADR or an owner approval is referenced in its changelog (REQ-009 AC2).

## Decision

The owner approved the five governance docs in chat, 2026-10-11 ("move governance docs to stable"). The approval covers every rule in them: the owner table and the list of decisions that need the owner, the lockstep versioning and release flow, the spec-first contribution flow, and the deprecation policy.

## Consequences

- The five docs are `stable`, hold no `Draft` or `TBD` callout, and cite this ADR in their changelogs.
- The release flow, the changelog, and the deprecation helper they describe are built by T11.3 and T11.4. Until then, the docs state the policy and the tooling follows it.
- A change to a stable doc follows the contribution flow, with a changeset (REQ-070), and a new ADR when a decision changes.
