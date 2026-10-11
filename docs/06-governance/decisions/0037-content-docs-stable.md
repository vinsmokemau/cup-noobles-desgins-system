---
title: "ADR-0037: Content docs move to stable"
slug: adr-0037-content-docs-stable
layer: adr
status: stable
lang: en
brandRules: [BR-05, BR-17]
tbd: []
related: [adr-0033-first-docs-stable, voice-and-tone, microcopy, formatting]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0037: Content docs move to stable

## Context

T9.3 wrote `voice-and-tone.md`, `microcopy.md`, and `formatting.md` as drafts. The voice "this, not that" attribute pairs were a proposal that no source defined (TBD-21), so they stayed a draft until the owner approved them. A doc moves from `draft` to `stable` only when an ADR or an owner approval is referenced in its changelog (REQ-009 AC2).

## Decision

The owner approved the three content docs in chat, 2026-10-11 ("Move to stable"), in answer to the open question that asked whether to approve the voice pairs and the three drafts. The approval covers every rule in the three docs, including the five "this, not that" pairs: premium not stiff, fun not childish, energetic not loud, geek-fluent not insider-only, and hype with substance not hollow. The es-MX examples are samples of how each pair reads, not final copy.

## Consequences

- `voice-and-tone.md`, `microcopy.md`, and `formatting.md` are `stable`, hold no `Draft` or `TBD` callout, and cite this ADR in their changelogs.
- The TBD-21 row of the register is marked `Resolved (ADR-0037)`.
- A change to a stable doc follows the contribution flow, with a changeset (REQ-070), and a new ADR when a decision changes.
