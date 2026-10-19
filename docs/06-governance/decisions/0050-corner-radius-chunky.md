---
title: "ADR-0050: The corner radius is Chunky"
slug: adr-0050-corner-radius-chunky
layer: adr
status: stable
lang: en
brandRules: [BR-05, BR-10, BR-13]
tbd: []
related: [shape, adr-0006-placeholder-values, adr-0032-text-neutral-feedback-stroke-motion-values, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0050: The corner radius is Chunky

## Context

TBD-10 left the corner radius values open. BR-10 asks for "rounded" corners, and BR-13 for thick, clean line work. The stroke width is 3 px (ADR-0032). The radius tokens hold ADR-0006 placeholders taken from Nuxt UI's defaults. The owner reviewed three options on a comparison page, each shown on buttons, badges, a field, a checkbox, a media card, and an alert, next to the logo: Soft, Chunky, and Pill. The page marked Chunky as the recommendation.

## Decision

The owner chose **Chunky** in chat on 2026-10-18 ("B"). A check at 2x zoom followed before this record.

| Token | Value |
|---|---|
| `radius.sm` | 0.5rem (8 px) |
| `radius.md` | 0.75rem (12 px) |
| `radius.lg` | 1.25rem (20 px) |
| `radius.button` | 0.75rem (12 px) |
| `radius.badge` | 0.5rem (8 px) |
| `radius.input` | 0.75rem (12 px) |
| `radius.choice` | 0.5rem (8 px) |
| `radius.card`, `radius.mediaCard` | 1.25rem (20 px) |
| `radius.alert` | 0.75rem (12 px) |

These values are the owner's choice for an open item. They are not brand values from the brand context. The mapping of each component to a step was the proposal on the comparison page. The remaining radius tokens (`radius.interactive`, `radius.overlay`, `radius.pagination`, `radius.skeleton`, `radius.toast`, `radius.tooltip`) are not decided here. The later task assigns each of them a step from `radius.sm`, `radius.md`, or `radius.lg`, and the owner is asked if a case is unclear.

The radius is the same at every viewport. There is no fully round ("full") step in this scale.

## Consequences

- TBD-10 is decided. The owner's choice is Chunky, with the values above.
- The SPEC.md §2.4 row for TBD-10, the TBD-10 callouts in `shape.md` and the component docs, and the tokens that name TBD-10 (`radius.*` and `placeholder.radius.*`) change in a later task, not in this ADR. Until then the placeholders stay, and `pnpm check:tbd` still counts TBD-10 as open.
- Outlook ignores corner radius in email, so email buttons show square corners (R-05). The email fallbacks stay as `email-foundations.md` defines them.
- Note from the audit for the component tasks, not decided here: a badge with an 8 px radius looks nearly round when it is short, so badges keep a minimum height.
- The glow (TBD-12) is a separate decision and will be reviewed with these corners.
