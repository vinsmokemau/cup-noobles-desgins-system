---
title: "ADR-0033: First docs move to stable"
slug: adr-0033-first-docs-stable
layer: adr
status: stable
lang: en
brandRules: [BR-06, BR-13]
tbd: []
related: [adr-0031-forms-feedback-loading-patterns, adr-0032-text-neutral-feedback-stroke-motion-values, motion, iconography, icon, progress, separator, sparkle, form-field, tabs, site-header, site-footer, forms, feedback, loading]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0033: First docs move to stable

## Context

A doc moves from `draft` to `stable` only when an ADR or an owner approval is referenced in its changelog (REQ-009 AC2), and a stable doc holds no `TBD` or `Draft` callout (REQ-037 AC1). ADR-0032 resolved the last open values that thirteen docs were waiting for. After it, those docs had no TBD callout and no open value, and each kept only a `Draft` callout that said it waited for the owner's approval. The report that listed them asked the owner to approve them.

## Decision

The owner approved moving them to `stable` in chat, 2026-10-11 ("Move to stable").

| Layer | Docs |
|---|---|
| Foundations | `motion.md`, `iconography.md` |
| Atoms | `icon.md`, `progress.md`, `separator.md`, `sparkle.md` |
| Molecules | `form-field.md`, `tabs.md` |
| Organisms | `site-header.md`, `site-footer.md` |
| Patterns | `forms.md`, `feedback.md`, `loading.md` |

1. **What the approval covers.** The approval covers every rule each doc states, including the three items that its `Draft` callout had still called out: the hover look of an unselected tab (`tabs.md`), the example icon sizes (`icon.md`), and the safety and motion rules of `motion.md`.
2. **Callouts.** Each doc drops its `Draft` callout. Its Open items section reads `Not applicable.`
3. **Not included.** Every other draft doc still has an open item (TBD-01, 02, 03, 06, 08, 09, 10, 12, 13, 15, or 20), so it stays a draft.

## Consequences

- The thirteen docs are `stable`, and their changelog cites this ADR.
- A change to a stable doc follows the contribution flow, with a changeset (REQ-070), and a new ADR when a decision changes.
- When a value they use changes, such as TBD-10 for a doc that reads the radius, the doc goes back to `draft` until the owner approves again.
