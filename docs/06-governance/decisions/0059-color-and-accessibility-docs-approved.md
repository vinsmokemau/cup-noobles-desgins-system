---
title: "ADR-0059: The color and accessibility docs are approved"
slug: adr-0059-color-and-accessibility-docs-approved
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-06]
tbd: []
related: [color, accessibility, adr-0009-focus-indicator, adr-0032-text-neutral-feedback-stroke-motion-values, adr-0035-breakpoints-and-container, adr-0053-card-surface-pure-black, adr-0055-brand-shades-minimal-derived, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-19
---

# ADR-0059: The color and accessibility docs are approved

## Context

`color.md` and `accessibility.md` were the last two foundation docs still marked `draft`, each waiting for the owner's approval since its first draft (T4.2, T4.6). Every TBD item they depended on is now decided (ADR-0009, ADR-0032, ADR-0053, ADR-0055). The owner reviewed both on a comparison page that showed the brand colors on real samples, the contrast ratios calculated from the hex values, and the points to know before approving. The page offered three options for each doc: A, approve as written; B, approve and fix the stale wording; C, hold. The page marked B as the recommendation.

## Decision

The owner chose **B for color and B for accessibility** in chat on 2026-10-19. Both docs move from `draft` to `stable`. The stale wording is fixed first:

- Both docs said that behavior applies "once TBD-13 is resolved". TBD-13 is resolved (ADR-0035), so the sentence now names the breakpoint tokens.
- Both docs described `unverified` contrast pairs and the ADR-0006 placeholder. No declared pair uses a TBD token, so those passages now say that no unverified pair exists.

No color, token, contrast pair, or rule changes. The owner saw and accepted these points on the comparison page: the yellow hover tone (`#fff7a3`) is very close to the resting yellow, and the glow carries the hover state (ADR-0051); shade steps 50 to 300 share one value and so do 500 to 950; disabled text is 3.14:1 and is checked as a UI part, not as text; and the flashing review is manual.

## Consequences

- No foundation doc is `draft`. All ten are `stable`.
- Each changelog gets a line that records this approval.
- This ADR is added to the decision log.
