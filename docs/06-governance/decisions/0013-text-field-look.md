---
title: "ADR-0013: Text field look"
slug: adr-0013-text-field-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-10, BR-13]
tbd: []
related: [adr-0009-focus-indicator, adr-0011-link-and-badge-looks, input, textarea, select]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0013: Text field look

## Context

The brand context describes buttons and cards but not a field where a person types. T7.4 (Input, Textarea, and Select) built one shared look from existing tokens and marked it `> **Draft:**` in `input.md`, `textarea.md`, and `select.md` (REQ-009).

The owner compared three looks on a visual comparison page, on the pure-black page (BR-03):

- A. A boxed field with a neutral outline that turns pink on hover. The outline is 7.98:1 against the page with the example grey, the yellow focus ring is clearly different from the outline, and the box shows where to click.
- B. A boxed field with a pink outline at all times. Mouse-over shows no change, and the yellow focus ring sits next to a pink outline (2.22:1 between the two), so it is harder to tell apart.
- C. An underline only, grey at rest and pink on hover. It has no boxed click target and only part of the thick-outline rule (BR-13).

The owner chose A in chat on 2026-10-09 (T7.4 session). No `frontend-design` audit was run: option A is the look already built, and its baselines and tests were reviewed in the T7.4 session.

## Decision

The input, the textarea, and the select trigger share one look. The values come from the owner in chat, 2026-10-09.

| Part | Look |
|---|---|
| Outline at rest | Neutral outline on the black page (`input.border`) |
| Outline on hover | Brand pink (`input.borderHover`, BR-01) |
| Keyboard focus | The yellow focus ring from ADR-0009, an outline and not the glow |
| Error | The error outline (`input.error.border`), `aria-invalid="true"`, and a message with an icon linked by `aria-describedby` |
| Disabled | Natively disabled, dimmed, no hover |

1. The grey, the error color, the corner radius, and the stroke width are not part of this decision. They stay placeholders (TBD-05, TBD-07, TBD-10, TBD-11), and the error color stays equal to the neutral until TBD-07 is decided.

## Consequences

- The `.cn-field` rules and the `input.*` tokens already match this decision, so no code changes.
- The three docs stay `draft` while those placeholders are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
