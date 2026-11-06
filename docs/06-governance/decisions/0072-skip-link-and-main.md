---
title: "ADR-0072: A skip link, CnSkipLink, with a companion CnMain"
slug: adr-0072-skip-link-and-main
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-10, BR-13]
tbd: []
related: [skip-link, link, site-header, using-the-system, accessibility]
since: 1.9.0
updated: 2026-11-05
---

# ADR-0072: A skip link, CnSkipLink, with a companion CnMain

## Context

The storefront (DSR-14, found in its T13.5 by `/ui-review`) has a site header before the `<main>` of every page and no skip link, so keyboard and screen-reader users tab through the header on every page (WCAG 2.4.1). The storefront cannot fix it: the link must be hidden until it receives keyboard focus and then shown with visible focus styling, and that styling only the design system supplies (CR-27, ADR-0009). The showcase had its own skip link, written with raw utility classes in its layout, with no tap-target size and with `:focus` instead of `:focus-visible`. It was not reusable.

The owner chose the shape on 2026-11-05, after the storefront's proposal and three options in chat:

- **A.** `CnSkipLink` only, with a required `label` and a `target` (default `"main"`). The app writes `<main id="main" tabindex="-1">` itself.
- **B.** `CnSkipLink` plus a companion `CnMain`, which renders the `<main>` with the matching `id` and `tabindex`.
- **C.** A page wrapper that owns the header slot, the link, and `<main>`.

The owner chose **B**. The owner also settled, in chat, that the system is dark-only for this task (REQ-031): SPEC.md 1.64 removed "light and dark" from T15.18.

## Decision

1. **`CnSkipLink` is a custom component.** It renders `<a class="cn-skip-link" href="#target">{{ label }}</a>`. `label` is required, and there is no hardcoded copy (A-11). `target` is the id of the main region, without `#`, and defaults to `"main"`.
2. **`CnMain` is a custom companion.** It renders `<main id="main" tabindex="-1">` around its slot, with an `id` prop that defaults to `"main"`. The component gives `<main>` its `tabindex="-1"`, not the consumer, because a plain `<main>` takes no programmatic focus: activating the link scrolls the page but leaves focus in the header, so the next Tab goes back through it, and nothing reports that. With `CnMain`, the two defaults agree and an app writes no attribute.
3. **The look is the look of a primary button.** The link is a pink fill with black text (8.37:1), the thick outline and the chunky radius, and the yellow focus ring of ADR-0009 with its gap showing the black header (18.55:1). It has no glow. It is fixed at the top left above the header, at the highest stacking level (`z.toast`), and is at least 44 px tall when shown (`min-h-11`, the storefront's CR-36, which is not a brand value, so no token holds it, as in ADR-0070).
4. **It is hidden off the top edge, not removed.** Until `:focus-visible` the link is translated above the page. It stays in the tab order and a screen reader still reads it. The reveal is CSS only, so it works with server-side rendering and with no JavaScript. A mouse click does not reveal it.
5. **New tokens are existing ones.** The `skipLink` component tokens (`tokens/component/skip-link.json`) reference `color.brand.primary`, `color.text.inverted`, `border.width.interactive`, `radius.interactive`, `z.toast`, and `focus.ring.*`. No brand value is introduced and no TBD item is opened. Three contrast pairs are added to `tokens/contrast-pairs.json`.
6. **One doc covers both components.** `docs/02-components/atoms/skip-link.md` documents `CnSkipLink`, and its Usage and Code reference sections document `CnMain`. SPEC.md 1.65 lists it, with the owner's approval in chat.
7. **The showcase uses the components** in place of its own skip link, with the label "Skip to content" and the id `main-content`, so its skip-link tests keep passing.

## Consequences

- A minor addition to the layer, released in the next lockstep version (1.9.0).
- The storefront adds `<CnSkipLink label="Saltar al contenido" />` first in its layout and replaces its `<main>` with `<CnMain>`. It adds no styling.
- An app that keeps a plain `<main>` still gets a working link, but focus stays in the header. The docs say so.
- If the link's target id does not exist, the link does nothing and the browser reports no error. The docs say to keep the defaults on both components or to set both.
- Changing any of these values takes a new ADR that supersedes this one.
