---
title: "ADR-0065: The key-value list is a custom component"
slug: adr-0065-key-value-list-custom
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-13]
tbd: []
related: [adr-0001-nuxt-ui-spike, key-value-list, separator]
since: 0.1.0
updated: 2026-11-01
---

# ADR-0065: The key-value list is a custom component

## Context

The e-commerce repository asked for a list of attributes, each a label and a value, for the attribute table on its product page (DSR-02). C-01 and ER-01 say a themed Nuxt UI component comes first, and a custom `Cn*` component exists only where Nuxt UI has no equivalent. T15.2 asked for this to be checked first and the choice recorded.

The check read the component folder of the pinned `@nuxt/ui` 4.11.2 (ADR-0001). None of its components is a list of labels and values:

- `UTable` is a data grid with rows, columns, sorting, and selection. It renders `<table>` markup that expects column headers, which a two-column list of attributes does not have, and it brings behavior the list does not need.
- `UPageList`, `UPageFeature`, and `UPageCard` lay out marketing content: icons, titles, descriptions, and links.
- `UUser` shows a person, `UTimeline` and `UStepper` show steps, and `UAccordion` and `UCollapsible` hide and show content.

No component renders a description list (`<dl>`, `<dt>`, `<dd>`).

## Decision

1. **`CnKeyValueList` is a custom component.** Nuxt UI has no equivalent (C-01, REQ-020 AC2).
2. **It renders a description list.** The markup is `<dl>`, with one `<dt>` for each label and one `<dd>` for each value, grouped in a `<div>` per row. This is semantic, and assistive technology announces each label with its value.
3. **It holds no copy.** Labels and values arrive through the `items` prop, and the `value` slot replaces how a value is drawn (A-11).
4. **It implements no primitive.** It has no interaction, no role of its own, and no focusable element, so ER-01 and REQ-020 AC3 do not apply.
5. **It adds no brand value.** Every color and the line width are component tokens that reference existing semantic tokens (REQ-010 AC2). Spacing uses `space.sm` and `space.md` (ADR-0049). The columns change at the Tailwind `md` breakpoint, which is `breakpoint.md` (ADR-0035).

## Consequences

- A new doc, `docs/02-components/molecules/key-value-list.md`, with `source: custom` and a "Why custom" paragraph.
- New component tokens `keyValueList.*`, all `stable`, all referencing semantic tokens. No TBD item is opened.
- If a later Nuxt UI release adds a description list, this component is reviewed for replacement (C-01).
- The storefront builds its attribute table from this component and adds no styling of its own (DSR-02).
