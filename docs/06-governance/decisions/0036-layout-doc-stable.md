---
title: "ADR-0036: Layout doc moves to stable"
slug: adr-0036-layout-doc-stable
layer: adr
status: stable
lang: en
brandRules: [BR-15]
tbd: []
related: [adr-0035-breakpoints-and-container, adr-0033-first-docs-stable, layout, responsive-behavior]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0036: Layout doc moves to stable

## Context

A doc moves from `draft` to `stable` only when an ADR or an owner approval is referenced in its changelog (REQ-009 AC2). ADR-0035 resolved TBD-13, the last open value in `layout.md`, so the doc had no TBD callout left. It kept only a `Draft` callout that said the owner had approved the values but not the rules of the doc as a whole.

## Decision

The owner approved `layout.md` in chat, 2026-10-11 ("approve layout"). The approval covers every rule the doc states: the 360 px minimum (ER-05), the reference viewports (A-09), the no-overflow and target-size rules (REQ-028), the reflow and reading-order rules, and the use of the breakpoint and container tokens (ADR-0035).

## Consequences

- `layout.md` is `stable`, drops its `Draft` callout, and cites this ADR in its changelog.
- A change to a stable doc follows the contribution flow, with a changeset (REQ-070), and a new ADR when a decision changes.
