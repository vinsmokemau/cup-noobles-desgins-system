---
title: "ADR-0070: A 44 px tap target for radios and checkboxes"
slug: adr-0070-choice-controls-44px
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [radio-group, checkbox]
since: 1.7.0
updated: 2026-11-03
---

# ADR-0070: A 44 px tap target for radios and checkboxes

## Context

The storefront (DSR-12, its CR-36) needs every tap target to be at least 44 px, reached through a design system size prop and never by restyling. Measured on 1.6.0 at `size="xl"`, a `URadioGroup` or `UCheckboxGroup` row is 24 px tall. The 24 px promise of REQ-028 AC2 stays true, but a thumb misses a 24 px row.

## Decision

1. **A new size `2xl`** on `UCheckbox`, `UCheckboxGroup`, and `URadioGroup`. The sizes `xs` to `xl` do not change, so nothing changes for a consumer until it picks `2xl`.
2. At `2xl` every row is at least 44 px tall (`min-h-11`). The 44 px is the storefront's requirement, not a brand value, and no token is added.
3. The label fills the row, so tapping the text toggles the control.
4. The visible box, its 24 px minimum, the text size of `xl`, and the focus ring of ADR-0009 do not change.
5. The change is in `app.config.ts` of the layer. The storefront restyles nothing.

The owner chose option B in chat on 2026-11-03, after comparing it with making `xl` itself 44 px (A) and with an opt-in prop (C).

## Consequences

- A minor addition to the layer, released in the next lockstep version.
- A tap on the box works through the control itself, and a tap on the text works through the label.
- The `card` and `table` variants of Nuxt UI are not used by the layer and get no `2xl` rules.
