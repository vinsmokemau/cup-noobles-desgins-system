---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add tabs, breadcrumb, and pagination (T8.4, REQ-020, REQ-026, REQ-027, REQ-028). The tokens package gains the component tokens `tabs.*`, `breadcrumb.*`, and `pagination.*`, plus `border.width.tabs`, `border.width.pagination`, and `radius.pagination`. The Nuxt layer themes `UTabs`, `UBreadcrumb`, and `UPagination` with one look chosen by the owner (ADR-0028): the selected tab is pink and bold with a thick pink underline on a neutral rule, breadcrumb links are pink and underlined with the current page as plain bold text, and the current page number is a pink chip with a black number and no glow. `UTabs` defaults to its `link` variant. The label colors, the neutral outline, the radius, and the stroke width still follow ADR-0006 placeholders (TBD-04, TBD-05, TBD-10, TBD-11).
