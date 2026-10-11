---
title: "ADR-0032: Text, neutral, feedback, stroke, and motion values"
slug: adr-0032-text-neutral-feedback-stroke-motion-values
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-05, BR-06, BR-13, BR-17]
tbd: []
related: [adr-0006-placeholder-values, adr-0009-focus-indicator, adr-0027-feedback-look, adr-0031-forms-feedback-loading-patterns, color, motion, shape]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0032: Text, neutral, feedback, stroke, and motion values

## Context

Five items of the TBD register (SPEC.md §2.4) were still placeholders from ADR-0006: the body text color (TBD-04), the neutral scale (TBD-05), the feedback colors (TBD-07), the stroke widths (TBD-11), and the motion durations and easing (TBD-14). The brand context gives no value for any of them. The owner is not a designer, so the options were shown on a visual comparison page, on the pure-black page with the contrast measured, with a recommendation for each. The owner answered "1B 2A 3B 4B 5B" in chat on 2026-10-11, which is the recommended option in every case.

## Decision

The values come from the owner in chat, 2026-10-11. None of them is a brand value from the brand context; they are the owner's choices for open items.

| Item | Choice | Value |
|---|---|---|
| TBD-04 body text | B, soft white | `#f5f5f5` (19.26:1 on black) |
| TBD-05 neutrals | A, plain grey | text `#bdbdbd` (11.18:1), border `#8c8c8c` (6.25:1), disabled `#5c5c5c` (3.14:1, exempt), divider `#3a3a3a` (1.85:1, decorative) |
| TBD-07 feedback | B, set apart from the brand | success `#34d399` (10.92:1), warning `#ff9f43` (10.29:1), error `#ff5c5c` (6.94:1), info `#5cc8ff` (11.16:1) |
| TBD-11 stroke | B | 3 px, the same as the focus ring width (ADR-0009) |
| TBD-14 motion | B, snappy | fast 100 ms, default 180 ms, slow 300 ms, shimmer cycle 1500 ms, easing `cubic-bezier(0.2, 0, 0, 1)` |

1. **Why these.** Soft white keeps pink and yellow the brightest things on the page. Plain grey adds no third hue. The feedback colors keep clear of the brand yellow, which is also the focus ring. A 3 px stroke is thick on a phone and matches the ring. The snappy durations fit the energetic feel of BR-05 and BR-17.
2. **Feedback is never color alone.** Each type keeps its icon and title (WCAG 1.4.1, ADR-0027). The error red and the brand pink have similar brightness, so the icon and the title stay essential.
3. **Reduced motion.** Every animation still stops under `prefers-reduced-motion: reduce` (REQ-029 AC2).
4. **Not decided here.** The surface colors (TBD-06), the shade scales (TBD-08), the radius (TBD-10), the glow (TBD-12), and the elevation and z-index (TBD-15) stay placeholders.

## Consequences

- The primitive tokens `color.neutral.*`, `color.signal.*`, `border.width.default`, and `motion.*` become `stable` and name this ADR as their source. The semantic and component tokens that follow them become `stable` too, unless another open item still applies to them.
- The five rows of the TBD register are marked `Resolved (ADR-0032)`, and the callouts that cited them are removed from the docs.
- The visual baselines change, because every outline is now 3 px and the text and feedback colors are new. They are regenerated in the pinned container.
- Changing a value takes a new ADR that supersedes this one.
