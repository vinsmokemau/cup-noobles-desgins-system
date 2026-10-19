---
title: "ADR-0029: Modal and slideover look"
slug: adr-0029-overlay-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-03, BR-12, BR-13]
tbd: [TBD-15]
related: [adr-0018-card-look, adr-0006-placeholder-values, adr-0009-focus-indicator, modal, slideover, effects]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0029: Modal and slideover look

## Context

The brand context says nothing about a dialog that opens on top of the page. It says cards have "a dark surface with neon highlights" (BR-12) and that line work is thick and high-contrast (BR-13). T8.5 (Modal and Slideover) needed one look for both overlays. No overlay value exists in SPEC.md §2.1 or in an earlier ADR.

The owner compared the options on a visual comparison page, on the pure-black page (BR-03), as a modal and as a slideover.

For the edge of the panel:

- A. A thick brand-pink outline, the same as the card (ADR-0018). Pink on black is 8.37:1, and it uses only brand colors.
- B. A pink outline with a glow. It depends on the glow values (TBD-12) and competes with the button glow.
- C. A thick yellow outline. Yellow on black is 18.55:1, but yellow beside a pink button is 2.22:1, so it can never be the only line between two regions.

For the page behind the panel:

- A. Dimmed and still visible. People keep their place in the page.
- B. Fully black. The page disappears.
- C. Not dimmed. Nothing shows that the page behind is switched off, so it was marked as failing.

The owner chose A for both questions in chat on 2026-10-10 (T8.5 session). The page showed 70% as an example amount. No `frontend-design` audit was run: option A uses only stable brand tokens, the same look the owner approved in ADR-0018.

## Decision

The values come from the owner in chat, 2026-10-10.

| Part | Look |
|---|---|
| Panel fill | The black page (`overlay.bg`, `color.bg.base`) |
| Panel outline | Brand pink, thick (`overlay.highlight`, BR-01) |
| Lines between header, body, and footer | Brand pink (`overlay.divider`) |
| Glow | None. The panel has an elevation shadow token only (`overlay.shadow`, TBD-15) |
| Backdrop color | Pure black (`overlay.scrim`, `color.bg.base`) |
| Backdrop amount | A placeholder, 0.75 (`overlay.scrimOpacity`, TBD-15) |

1. **The backdrop amount is a placeholder, not a decision.** The owner picked "dimmed and still visible", not an amount. The page showed 70% as an example. The amount is the Nuxt UI default for `UModal` and `USlideover` (`bg-elevated/75`), recorded as the placeholder `placeholder.effect.scrimOpacity` = `0.75` with status `tbd`, under the same rule as every ADR-0006 placeholder (ADR-0006, policy 1 to 5). It is added to the ADR-0006 table in the same commit. It is filed under TBD-15 (the elevation scale) because no TBD item names the dimming amount. Owner input needed: an amount, or approval of 0.75.
2. **Both overlays share the look.** The modal and the slideover read the same `overlay.*` tokens. A slideover that touches the screen edge rounds only the corners that do not touch the edge.
3. **The behavior is Nuxt UI's.** `UModal` and `USlideover` come from Reka UI's dialog: focus is trapped and restored, Escape closes, and the page behind is hidden from assistive technology and cannot be clicked or tabbed to. Nothing is re-implemented (ER-01, REQ-020 AC3).
4. **Opening movement.** Nuxt UI's fade and slide stay. They are switched off under `prefers-reduced-motion: reduce`. The durations are Nuxt UI's own (TBD-14).
5. **Not decided here.** The text colors, the corner radius, the stroke width, the stacking order, and the elevation shadow stay placeholders (TBD-04, TBD-05, TBD-10, TBD-11, TBD-15).

## Consequences

- `overlay.json` holds `overlay.bg`, `overlay.highlight`, `overlay.divider`, and `overlay.scrim` as `stable` tokens that reference semantic tokens, and holds the placeholders as `tbd`.
- The semantic token `effect.scrim.opacity` and the primitive `effect.opacity.scrim` are new. Both were `tbd` (TBD-15); ADR-0054 set them to 0.85, the overlay shadow to none, and the stacking order to 50, and T13.2 applied it.
- `modal.md` and `slideover.md` stay `draft` while the placeholders are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
