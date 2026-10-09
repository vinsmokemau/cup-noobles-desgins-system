---
title: "ADR-0010: Button variants"
slug: adr-0010-button-variants
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-10, BR-11]
tbd: []
related: [adr-0009-focus-indicator, button]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0010: Button variants

## Context

BR-11 names the button variants primary, secondary, and ghost, plus a disabled state, but the brand context does not say how each one looks. T7.2 (Button) built a proposal and marked it `> **Draft:**` in `button.md` (REQ-009 AC1).

The owner compared three complete sets on a visual comparison page, on the pure-black page (BR-03). The primary button was the same in all three, a pink fill with a black label:

- A. Secondary is a solid yellow fill, and ghost is a transparent button with a pink label and outline that fills pink on hover. It uses yellow as a bright accent (BR-02). Primary and secondary are both filled, so they differ by color and wording.
- B. Secondary is a pink outline, and ghost is plain pink text until hover. The three are easiest to tell apart, but yellow is not used on buttons, and ghost has no outline until hover.
- C. Secondary is a yellow outline, and ghost is a pink outline. Secondary and ghost differ only by color.

Every label and outline pair in all three sets passes contrast on the black page. The owner chose A in chat on 2026-10-09 (T7.2 session).

## Decision

The three brand variants look like this. The values come from the owner in chat, 2026-10-09.

| Variant | Nuxt UI props | Fill | Label | Outline |
|---|---|---|---|---|
| `primary` | `color="primary" variant="solid"` | Brand pink (BR-01) | Black | Pink |
| `secondary` | `color="secondary" variant="solid"` | Brand yellow (BR-02) | Black | Yellow |
| `ghost` | `color="primary" variant="ghost"` | None | Pink | Pink |

1. On hover and press, a ghost button fills pink and its label turns black. Black on pink is 8.37:1.
2. Labels on pink and yellow fills stay black (SPEC.md §2.1).
3. Hover and pressed behavior of the solid variants, and the dimming of a disabled or loading button, are not part of this decision. They stay `> **Draft:**` in `button.md`.

## Consequences

- The `.cn-button*` rules and the button tokens already match this decision, so no code changes.
- The radius, stroke width, and glow stay placeholders (TBD-10, TBD-11, TBD-12). The hover and pressed fills stay `derived-pending` (TBD-08).
- Changing the look of a variant takes a new ADR that supersedes this one, and new visual baselines.
