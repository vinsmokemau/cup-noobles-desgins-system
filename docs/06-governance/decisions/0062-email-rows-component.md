---
title: "ADR-0062: The email rows component sits inside the card"
slug: adr-0062-email-rows-component
layer: adr
status: stable
lang: en
brandRules: [BR-12, BR-13]
tbd: []
related: [adr-0041-email-components-approved, adr-0042-email-layout-includes-and-clear-space, email-components, email-layouts, email-foundations]
since: 0.1.0
updated: 2026-10-28
---

# ADR-0062: The email rows component sits inside the card

## Context

The e-commerce repository asked for a way to show lines of items and totals in the email card (DSR-04). Its templates cannot mark slot HTML as safe by hand, so it cannot pass a table of rows through the `{{ card_body }}` slot. The card needs rows of its own, with slots for text only.

REQ-041 AC3 names six components. The rows are a seventh, so the count in SPEC.md, `email-components.md`, `email-layouts.md`, and `email-foundations.md` has to change. The rows also have to sit inside the card in `dist/reference.html`, and the build of ADR-0042 can include a component but cannot place one inside another.

## Decision

The owner approved, in chat on 2026-10-28, the wording "seven components" in SPEC.md (REQ-041 AC3, P10), in the three email docs, and as an amendment in SPEC.md §8. The seven are the button, the header with the logo, the content section, the card, the rows, the divider, and the footer.

1. **`rows.mjml` is a new component** that compiles to `dist/rows.html`. It has one item row with the slots `{{ item_name }}`, `{{ item_quantity }}`, and `{{ item_amount }}`, and one total row with `{{ total_label }}` and `{{ total_amount }}`. The words avoid every term in `scripts/domain-terms.txt` (REQ-022 AC1). The sending project repeats each row with its own template language, because a slot holds text and the design system adds no loop tag (REQ-044).
2. **It adds no brand value and no token.** It reads the card tokens (`card.bg`, `card.fg`, `card.fgMuted`, `card.highlight`, `card.divider`, `border.width.card`, `radius.card`), the body type tokens, the display face of `font.h3` for the totals, and the spacing steps `space.sm`, `space.md`, and `space.lg`.
3. **The build gets an `insert` option for `<mj-include>`.** `<mj-include path="card.mjml" insert="rows.mjml" />` replaces the one `<!-- cn:insert -->` comment in the included file with the content of the first `<mj-column>` of the inserted file. The inserted file follows the rules of an included file (ADR-0042): the same `<mj-head>` and `<mj-body>` tag, and no include of its own. The marker is a comment, so the card compiles to the same HTML alone.

## Consequences

- `reference.mjml` includes the card with the rows inserted, so the rows sit between the card body and the card footer. The layout has 18 slots.
- The plain-text counterpart splits the card into three blocks around the rows, with a blank line between blocks.
- Real-client rendering of the rows is not verified here (R-05).
