---
title: "ADR-0049: The spacing scale is the rhythm of 8"
slug: adr-0049-spacing-scale-rhythm-of-8
layer: adr
status: stable
lang: en
brandRules: [BR-06, BR-15]
tbd: []
related: [spacing, adr-0006-placeholder-values, adr-0048-type-scale-balanced, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0049: The spacing scale is the rhythm of 8

## Context

TBD-09 left the spacing base unit and scale open. `space.base` holds an ADR-0006 placeholder of 0.25rem, taken from Tailwind's `--spacing`, which is the base unit of every Nuxt UI padding and gap class. The owner reviewed three scales on a comparison page at 360, 768, and 1280 px: Fine, Rhythm of 8, and Roomy. All three kept a 4 px base, because a larger base such as 8 px would double every stock Nuxt UI padding in the theme. The page marked Rhythm of 8 as the recommendation.

## Decision

The owner chose **Rhythm of 8** in chat on 2026-10-18 ("B"). A check at 1280 px followed before this record.

- Base unit: 0.25rem (4 px), kept from the placeholder.
- Steps, each a multiple of the base:

| Step | Value |
|---|---|
| xs | 0.25rem (4 px) |
| sm | 0.5rem (8 px) |
| md | 1rem (16 px) |
| lg | 1.5rem (24 px) |
| xl | 2rem (32 px) |
| 2xl | 3rem (48 px) |
| 3xl | 4rem (64 px) |
| 4xl | 6rem (96 px) |

These values are the owner's choice for an open item. They are not brand values from the brand context. The step names are the proposal on the comparison page. The roles shown there (icon to text, between buttons, card padding, between cards, and so on) were examples. Each component task decides which step it uses, and may not add a step outside this scale.

The scale is the same at every viewport. Sizes are in rem.

## Consequences

- TBD-09 is decided. The owner's choice is Rhythm of 8, with the values above.
- The SPEC.md §2.4 row for TBD-09, the TBD-09 callouts in `spacing.md`, `email-components.md`, and `email-layouts.md`, and the tokens that name TBD-09 (`space.base` and `placeholder.space.base`) change in a later task, not in this ADR. Until then the placeholder stays, and `pnpm check:tbd` still counts TBD-09 as open.
- The later task adds the seven steps above the base as tokens. The email build injects a token only as it is, so the email components and layout can use the steps after that task.
- Notes from the audit for the component tasks, not decided here: card footers in side-by-side cards should be pinned to the bottom, and the gap between a heading and its content may use `md` and not the gap between cards.
