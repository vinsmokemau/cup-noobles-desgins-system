---
title: "ADR-0052: Glow goes on component edges only, never on text"
slug: adr-0052-glow-on-edges-only
layer: adr
status: stable
lang: en
brandRules: [BR-06, BR-10]
tbd: []
related: [effects, adr-0051-neon-glow-neon-tube, adr-0009-focus-indicator]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0052: Glow goes on component edges only, never on text

## Context

`effects.md` holds a draft rule, awaiting owner approval: glow applies to component edges only, such as the outline of a button or a card, and is never applied to body text or captions, as a text shadow or otherwise. A neon glow on a pure-black base causes halation that hurts text legibility, which would conflict with BR-06 (R-04). The comparison page for TBD-12 showed the same sentence with and without a text glow, and the glow blurred the letters. ADR-0051 recorded the glow values and left this rule open because the owner had not answered it.

## Decision

The owner approved the rule in chat on 2026-10-18 ("Yes to the rule"). The glow goes on component edges only, and never on body text, captions, or any text, whether as a text shadow or otherwise.

## Consequences

- The draft callout in `effects.md` and the matching lines in its do and don't table and accessibility section become a stable rule in a later task, citing this ADR. Until then the doc stays a draft, and `pnpm check:draft` style counts still list it.
- The rule applies to the glow values in ADR-0051, which were measured for edges only.
- A change to this rule needs a new ADR.
