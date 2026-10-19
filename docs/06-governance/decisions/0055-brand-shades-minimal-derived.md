---
title: "ADR-0055: Brand shades are minimal derived"
slug: adr-0055-brand-shades-minimal-derived
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-10]
tbd: []
related: [color, adr-0001-nuxt-ui-spike, adr-0006-placeholder-values, adr-0051-neon-glow-neon-tube, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0055: Brand shades are minimal derived

## Context

TBD-08 left the tints and shades of pink and yellow open (C-06, OD-04). Nuxt UI reads all 11 steps (50 to 950) of each colour alias, and uses step 400 as `--ui-primary` in dark mode (ADR-0001). Until now every step held the single brand hex and was marked `derived-pending`, and the hover and pressed colours of the buttons, links, and breadcrumbs were the same brand hex. The owner reviewed three options on a comparison page, each showing both scales and the same button states: one colour, a full derived scale, and a minimal derived scale. Label contrast was computed for every state. The page marked the minimal derived scale as the recommendation.

## Decision

The owner chose **Minimal derived** in chat on 2026-10-18 ("C"). This is OD-04 option (b), in its reduced form.

For each brand colour, two extra tones are derived and nothing else. They keep the brand's hue and change only lightness in the OKLCH colour space. The 11 steps fill as follows:

| Steps | Pink | Yellow |
|---|---|---|
| 50, 100, 200, 300 (lighter tone, used for hover) | `#fea0c5` | `#fff7a3` |
| 400 (the brand colour, `color.brand.pink`, `color.brand.yellow`) | `#ef80ae` | `#fff488` |
| 500, 600, 700, 800, 900, 950 (darker tone, used for pressed) | `#d06c96` | `#dacf6d` |

States:

- Primary and secondary fills: rest uses the brand colour, hover the lighter tone, pressed the darker tone.
- The ghost button hovers with the glow only, on a black background.
- Labels on every fill are black (SPEC.md §2.1).

Computed contrast: a black label on the pink fill is 8.37:1 at rest, 11.05:1 on hover, and 6.27:1 pressed. On the yellow fill it is 18.55:1 at rest, 19.09:1 on hover, and 13.13:1 pressed. The pressed pink against the black page is 6.27:1 (3:1 needed).

The four derived hex values are the owner's approved output of the lightness method, not values from the brand context. They are the only colours added by this decision. Nothing else is derived from a brand colour, and the forbidden pairs (white on pink, yellow on pink, white on yellow) stay forbidden at every step.

## Consequences

- TBD-08 and OD-04 are decided. C-06 is resolved by this reduced derivation.
- The SPEC.md §2.4 row for TBD-08, the OD-04 and C-06 rows, the TBD-08 callouts in `color.md` and the component docs, and the tokens that name TBD-08 (the `color.brand.pink-*` and `color.brand.yellow-*` steps, the primary and secondary hover and active tokens, and the button, link, and breadcrumb hover and active tokens) change in a later task, not in this ADR. Until then the placeholders stay, and `pnpm check:tbd` still counts TBD-08 as open.
- The later task sets each step as the primary tokens above, marks them `stable` with this ADR as the source, and adds the new contrast pairs to `tokens/contrast-pairs.json`.
- Nuxt UI's default classes that use partial opacity (for example `hover:bg-primary/75`) produce translucent brand colours. This ADR does not approve them. The later task removes them from the theme layer or brings the owner the specific cases (C-06).
- Note from the audit for the button task, not decided here: the yellow hover tone is very close to the rest yellow, so the glow must carry the hover state (ADR-0051).
- Steps 50 to 300 are identical, and so are steps 500 to 950. That is acceptable in a dark-only system (A-02) that uses only a few steps.
