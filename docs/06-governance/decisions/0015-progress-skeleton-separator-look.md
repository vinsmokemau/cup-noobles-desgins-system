---
title: "ADR-0015: Progress, skeleton, and separator look"
slug: adr-0015-progress-skeleton-separator-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-03, BR-06, BR-13]
tbd: []
related: [adr-0013-text-field-look, adr-0014-choice-controls-look, progress, skeleton, separator]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0015: Progress, skeleton, and separator look

## Context

The brand context describes buttons and cards but not a progress bar, a loading placeholder, or a divider line. T7.6 (Progress, Skeleton, and Separator) needed a look for each. The owner compared three looks per component on a visual comparison page, on the pure-black page (BR-03):

- Progress: A, a neutral outline with a pink fill; B, a pink outline with a pink fill, where the filled and empty parts read as one shape; C, a neutral outline with a yellow fill, which shares its color with the focus ring (ADR-0009).
- Skeleton: A, outlined shapes that fade slowly, with no fill because the system has no surface color (C-05); B, a soft grey fill, which invents a tone; C, a sweeping shimmer, which invents greys and has the most motion.
- Separator: A, a neutral line; B, a pink line, which looks like an action because pink also means "clickable"; C, a thick neutral line, which is heavy when repeated.

The owner chose A for all three in chat on 2026-10-09 (T7.6 session), the recommended option in each case. No `frontend-design` audit was run: option A reuses the neutral-outline-plus-pink look already approved for the text fields and the choice controls (ADR-0013, ADR-0014), and adds no color.

## Decision

The three components share the look of the other form controls. The values come from the owner in chat, 2026-10-09.

| Component | Look |
|---|---|
| Progress | A pill-shaped track with a black fill and a neutral outline (`progress.border`). The filled part is brand pink (`progress.fill`, BR-01). |
| Skeleton | Outlined shapes with a neutral outline (`skeleton.border`) and no fill. They fade between full and half opacity, and stop fading under reduced motion (REQ-029). |
| Separator | A neutral line (`separator.color`). |

1. The grey, the stroke widths, the corner radii, and the motion duration are not part of this decision. They stay placeholders (TBD-05, TBD-10, TBD-11, TBD-14).
2. The fade depth of the skeleton (half opacity) is Nuxt UI's own default for the component, not a brand value.

## Consequences

- The `.cn-progress`, `.cn-skeleton`, and `.cn-separator` rules read only the `progress.*`, `skeleton.*`, and `separator.*` tokens.
- The three docs stay `draft` while those placeholders are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
