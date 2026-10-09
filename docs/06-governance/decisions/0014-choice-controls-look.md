---
title: "ADR-0014: Choice controls look"
slug: adr-0014-choice-controls-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-06, BR-13]
tbd: []
related: [adr-0009-focus-indicator, adr-0013-text-field-look, checkbox, radio-group, switch]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0014: Choice controls look

## Context

The brand context describes buttons and cards but not the controls a person ticks or flips. T7.5 (Checkbox, RadioGroup, and Switch) built one shared look from existing tokens and marked it `> **Draft:**` in `checkbox.md`, `radio-group.md`, and `switch.md` (REQ-009).

The owner compared three looks on a visual comparison page, on the pure-black page (BR-03):

- A. A neutral outline that turns pink on hover. Checked controls fill pink with a black mark. The outline is 7.98:1 against the page with the example grey, black on pink is 8.37:1, the yellow focus ring is 18.55:1 and clearly different from the outline, and resting, hovered, and checked all look different.
- B. A pink outline at all times. Mouse-over shows no change, and the yellow focus ring sits next to a pink outline (2.22:1 between the two), so it is harder to tell apart.
- C. A neutral outline that turns pink on hover, and checked controls keep a black inside with a pink outline and a pink mark. A hovered empty box and a checked box both have a pink outline, so they differ only by the small mark.

The owner chose A in chat on 2026-10-09 (T7.5 session). No `frontend-design` audit was run: option A is the look already built, it matches the text fields (ADR-0013), and its baselines and tests were reviewed in the T7.5 session.

## Decision

The checkbox, the radio group, and the switch share one look. The values come from the owner in chat, 2026-10-09.

| Part | Look |
|---|---|
| Unchecked at rest | Black fill, neutral outline on the black page (`choice.border`) |
| Unchecked on hover | Brand pink outline (`choice.borderHover`, BR-01) |
| Checked or indeterminate | Brand pink fill and outline, with a black mark: check, minus, dot, or thumb (`choice.checked.*`) |
| Keyboard focus | The yellow focus ring from ADR-0009, an outline and not the glow |
| Disabled | Natively disabled, dimmed, no hover |

1. The grey, the corner radius, and the stroke width are not part of this decision. They stay placeholders (TBD-05, TBD-10, TBD-11).

## Consequences

- The `.cn-choice` rules and the `choice.*` tokens already match this decision, so no code changes.
- The three docs stay `draft` while those placeholders are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
