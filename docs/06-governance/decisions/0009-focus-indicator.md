---
title: "ADR-0009: Focus indicator style"
slug: adr-0009-focus-indicator
layer: adr
status: stable
lang: en
brandRules: [BR-02, BR-03, BR-06, BR-10]
tbd: [TBD-16]
related: [adr-0006-placeholder-values, adr-0008-token-format-and-naming]
since: 0.1.0
updated: 2026-09-27
---

# ADR-0009: Focus indicator style

## Context

TBD-16 (SPEC.md §2.4) left the focus indicator style undefined: its color, width, offset, and line style. REQ-024 AC1 requires a focus-visible indicator that is not the glow alone, uses the `focus.*` tokens, and has at least 3:1 contrast against adjacent colors. Until now, `focus.ring.*` referenced the ADR-0006 placeholders: the neutral `#90a1b9`, `3px` wide, offset `0`, `solid`.

The placeholder ring failed against the brand fills: 1.05:1 on the pink fill and 2.32:1 on the yellow fill. A yellow ring with no gap would fail too, because yellow on pink is 2.22:1, a combination SPEC.md §2.1 forbids, and yellow on the yellow fill is 1:1.

During T4.4 the owner compared four options on a visual comparison page, on the three button styles over the pure-black page (BR-03):

- A. A yellow ring with a black gap. The ring only ever touches black, at 18.55:1 on every button.
- B. A yellow ring touching the button. It fails on the pink and yellow fills.
- C. A black inner ring with a yellow outer ring. It passes, but it looks heavier.
- D. A pink ring with a black gap. It passes, but it is easy to confuse with a pink glow (REQ-024).

The owner chose A. A second page then compared four sizes of A: 2 px ring and 2 px gap, 3 px and 3 px, 4 px and 4 px, and 4 px with a 6 px gap. The owner chose size 2 (3 px ring, 3 px gap). Both answers were given in chat on 2026-09-27 (T4.4 session) and confirmed for the record on 2026-09-27.

## Decision

The focus indicator is a solid yellow outline, separated from the component by a gap. The values come from the owner in chat, 2026-09-27.

| Token | Value | Source |
|---|---|---|
| `focus.ring.color` | `{color.brand.yellow}`, which is `#fff488` | BR-02; chosen by the owner (option A) |
| `focus.ring.width` | `3px`, from the primitive `focus.width.default` | The owner (size 2) |
| `focus.ring.offset` | `3px`, from the primitive `focus.offset.default` | The owner (size 2) |
| `focus.ring.style` | `solid`, from the primitive `focus.style.default` | The owner (option A, shown as a solid ring) |

1. The four semantic `focus.ring.*` tokens become `stable`. The new primitives in `tokens/primitive/focus.json` are `stable` and name this ADR as their source (ADR-0008 decision 4).
2. The ring is drawn with `outline` and `outline-offset`, so the gap shows whatever is behind the component. The ring's adjacent colors are therefore the background of the component's container, on both sides, never the component's own fill.
3. `tokens/contrast-pairs.json` drops the pair `focus.ring.color` on `color.brand.primary`, because the ring never touches the fill. That pair would be yellow on pink, which SPEC.md §2.1 forbids. It keeps `focus.ring.color` on `color.bg.base` (18.55:1) and adds `focus.ring.color` on `color.surface.card`, which stays `unverified` until TBD-06 is resolved.
4. ADR-0006 policy 5 applies: `placeholder.focus.width`, `placeholder.focus.offset`, and `placeholder.focus.style` are deleted, because no token references them any more. `placeholder.color.neutral` no longer stands in for TBD-16.
5. SPEC.md §2.4 marks TBD-16 `Resolved (ADR-0009)`.

## Consequences

- REQ-024 AC1 is met by the tokens on the pure-black page: the ring is yellow, the glow color is TBD-12, and a yellow ring on black is 18.55:1.
- The gap is only black where the container is black. A focusable component on a container whose background is pink or yellow would put yellow on pink or yellow on yellow. Such a container needs its own check, and the card pair above covers cards once TBD-06 is decided.
- A glow (TBD-12) spreads outside the component and can tint the 3 px gap, most visibly on the yellow fill. When TBD-12 is decided, check that the gap still reads as black next to the ring. If it does not, the ring size is revisited in a new ADR.
- If TBD-12 makes the glow yellow, the ring and the glow may look alike. REQ-024 then needs a new check, and possibly a new ADR.
- If TBD-11 sets a stroke width thicker than 3 px, revisit the ring width so the ring stays at least as thick as the component outline.
- The ring sits 6 px outside the component (3 px gap plus 3 px ring). Component tasks (T7.x) leave enough room around focusable elements, including inside scrolling containers at 360 px (ER-05).
- Changing any of these values takes a new ADR that supersedes this one.
