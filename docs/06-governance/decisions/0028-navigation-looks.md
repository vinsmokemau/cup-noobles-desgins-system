---
title: "ADR-0028: Tabs, breadcrumb, and pagination looks"
slug: adr-0028-navigation-looks
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-03, BR-13]
tbd: []
related: [adr-0009-focus-indicator, adr-0010-button-variants, adr-0011-link-and-badge-looks, adr-0018-card-look, tabs, breadcrumb, pagination]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0028: Tabs, breadcrumb, and pagination looks

## Context

The brand context names buttons and cards (BR-10, BR-12) but does not say how tabs, a breadcrumb, or a pagination control look. No ADR defines them either. T8.4 (Tabs, Breadcrumb, and Pagination) needed one look for each: what marks the selected tab, the current page in a breadcrumb, and the current page number.

The owner compared three complete sets on a visual comparison page, on the pure-black page (BR-03):

- A. The selected tab is pink and bold with a thick pink underline on a neutral rule. The breadcrumb links are pink and underlined, like every link, and the current page is plain bold text. The current page number is a pink chip with a black number. The selected state is shown by more than color, the links reuse ADR-0011, the chip matches the primary button fill (ADR-0010), and the yellow focus ring (ADR-0009) stays clearly different from every selected mark.
- B. Pink pill tabs, with the selected one filled pink, and a yellow current page in the breadcrumb and in the pagination. The yellow focus ring sits next to a pink outline (2.22:1), so it is harder to tell apart, and a yellow current page looks like the tag badge.
- C. Text only, where pink means current. The selected state is told by color alone, which fails WCAG 1.4.1, and the breadcrumb links would not match the pink underlined link.

The owner chose A in chat on 2026-10-10 (T8.4 session). No `frontend-design` audit was run: option A uses only stable brand tokens and the looks already decided in ADR-0010, ADR-0011, and ADR-0018.

## Decision

The three parts are drawn like this. The values come from the owner in chat, 2026-10-10.

| Part | Look |
|---|---|
| Tab list | A neutral rule under the tabs (`tabs.rule`) |
| Selected tab | Brand pink label, bold, with a thick brand pink underline (`tabs.active.fg`, `tabs.active.indicator`, BR-01) |
| Tab that is not selected | Neutral label (`tabs.fg`) |
| Breadcrumb link | Brand pink, always underlined (`breadcrumb.link.fg`, ADR-0011) |
| Breadcrumb current page | Plain bold text, not underlined, with `aria-current="page"` (`breadcrumb.current.fg`) |
| Breadcrumb separator | A caret from the icon set, neutral and hidden from assistive technology (`breadcrumb.separator.fg`) |
| Page number that is not current | A neutral outline, no fill, no glow (`pagination.item.*`) |
| Current page number | Brand pink chip with a black number, bold, with `aria-current="page"` (`pagination.current.*`) |
| Keyboard focus | The yellow focus ring from ADR-0009, an outline and not the glow |

1. The neutral grey, the body text color, the corner radius, and the stroke width are not part of this decision. They stay placeholders (TBD-04, TBD-05, TBD-10, TBD-11).
2. The hover and pressed looks are not part of this decision. They are the drafts in the three docs: the label of a tab that is not selected turns to the body text color, a breadcrumb link reads the derived-pending hover shade (TBD-08), and the outline of a page number turns pink.
3. The pagination draws no glow. The glow belongs to buttons (BR-10), and the chip is a marker of position, not an action.

## Consequences

- `tabs.json`, `breadcrumb.json`, and `pagination.json` hold the component tokens. The brand colors are `stable`, and the placeholders are `tbd`.
- The Nuxt layer makes `link` the default variant of `UTabs`. Nuxt UI's `pill` variant fills the selected tab and is not part of this look.
- The three docs stay `draft` while the placeholders and the hover looks are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
