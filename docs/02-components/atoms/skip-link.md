---
title: Skip link
slug: skip-link
layer: component
level: atom
source: custom
component: CnSkipLink
status: stable
lang: en
brandRules: [BR-01, BR-10, BR-13]
tokens: [skipLink]
demos: [states, playground]
tbd: []
related: [link, button, site-header, using-the-system, accessibility]
since: 1.9.0
updated: 2026-11-05
---

# Skip link

## Purpose

`CnSkipLink` is the link that lets a keyboard or screen-reader user jump past the site header to the main content of the page (WCAG 2.4.1, bypass blocks; DSR-14). Without it, a person who tabs through a page goes through the logo, the navigation, and the cart on every page before reaching the content. It is the first focusable element of the page, it stays hidden until it receives keyboard focus, and then it appears above the header. Its companion `CnMain` is the `<main>` it jumps to.

**Why custom:** Nuxt UI has no skip link. The nearest component, `ULink`, is a plain link with no hidden state, no reveal on focus, and no target to move focus to, and the reveal is styling that only the design system supplies (CR-27, ADR-0072). `CnSkipLink` is a real `<a href="#id">` with the look of the system. `CnMain` is custom for one reason: a plain `<main>` takes no keyboard focus, so a skip link that points at it scrolls the page and leaves focus in the header. `CnMain` adds the `id` and the `tabindex="-1"` that make the jump work, and nothing else.

## Anatomy

1. **link**: an `<a>` with `href="#target"`. It is hidden above the top edge of the page until `:focus-visible`. It stays in the tab order and a screen reader still reads it.
2. **label**: the text of the link. It is a prop, so the app writes it in its own language.
3. **focus ring**: the yellow ring of ADR-0009, with a gap that shows the black header behind it.
4. **main (`CnMain`)**: the `<main>` element with an `id` and `tabindex="-1"`. It has no fill, no outline, and no ring.

## Tokens and specs

| Token | What it styles |
|---|---|
| `skipLink.bg`, `skipLink.fg` | The fill and the text of the shown link: pink with black text, 8.37:1 (the fill of a primary button). |
| `skipLink.border.color`, `skipLink.border.width` | The thick outline (BR-10, BR-13). |
| `skipLink.radius` | The chunky corner of an interactive element (ADR-0050). |
| `skipLink.z` | The stacking level of the shown link: the highest level, above the sticky header and above an open overlay. |
| `skipLink.focus.*` | The focus ring of ADR-0009. |

The shown link is at least 44 px tall, set by the `min-h-11` utility in the layer's CSS. The 44 px is the storefront's requirement (its CR-36), not a brand value, so no token holds it (ADR-0070 does the same). The text is the body size in the display typeface, as on a button. The link has no glow.

## Variants

None. There is one link, and the text and the target come from props.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The link is hidden: it sits above the top edge of the page, out of sight, and stays in the tab order. | None |
| `focus-visible` | The link slides into view at the top left, above the header, with the yellow ring. | `skipLink.bg`, `skipLink.fg`, `skipLink.focus.*` |

A mouse click or a tap on the link, or the link losing focus, hides it again. A mouse click on the page does not show it, because the reveal is `:focus-visible`, not `:focus`. The link has no hover, active, disabled, loading, or error state: it is shown only to a person who is already using the keyboard, and it is always available. The state matrix on the component page forces the shown state with `data-cn-state="focus-visible"`, because a page cannot hold keyboard focus for a screenshot.

## Usage rules

### When to use

- Use one `CnSkipLink` on every page, as the first element inside the root of the app, before the header. In a Nuxt app that is the layout, or `app.vue` when there is no layout.
- Use `CnMain` for the `<main>` of every page, and pass both the same id, or none. This is the exact markup an app needs:

  ```vue
  <template>
    <CnSkipLink label="Saltar al contenido" />
    <SiteHeader />
    <CnMain>
      <slot />
    </CnMain>
  </template>
  ```

  `CnSkipLink` points at `#main`, and `CnMain` is `<main id="main" tabindex="-1">`, so the two agree with no props. To use another id, pass it to both: `<CnSkipLink target="contenido" />` and `<CnMain id="contenido">`.
- The component, not the app, gives `<main>` its `tabindex="-1"`. That is the decision of ADR-0072: an app that writes its own `<main>` has to remember an attribute that nothing checks.
- Write the label in the language of the page (es-MX in the storefront), such as "Saltar al contenido".

### When not to use

- Never write a plain `<main id="main">` in place of `CnMain`. The link still scrolls to it, but focus stays in the header and the next Tab walks back through it, and nothing reports it. If an app must write its own `<main>`, it must add `tabindex="-1"` itself.
- Never let the `target` and the `id` differ. A link whose target does not exist does nothing, and the browser reports no error. Use the defaults on both, or set both.
- Never put the link after the header. It must be the first Tab stop.
- Never use more than one `CnMain` on a page: a page has one main landmark.
- Never restyle the link in the app's CSS to show it. Visual styling lives in the layer (C-03).

## Do and don't

| Do | Don't |
|---|---|
| Put `CnSkipLink` first in the layout and `CnMain` around the page. | Put the link after the header, or skip `CnMain`. |
| Pass the label in the page language. | Leave English text on an es-MX page. |
| Keep the default id on both, or set both. | Change only one of the two ids. |

## Accessibility

- The link is a real `<a href>`, so it works with a screen reader, with server-side rendering, and with JavaScript turned off. The reveal is CSS only.
- It is the first focusable element of the page. Pressing Tab once focuses it and shows it; pressing Enter follows it and moves focus to the `<main>`; pressing Tab again goes to the first control in the content, not back into the header.
- The shown link is at least 44 px tall (the storefront's CR-36), above the 24 px minimum of WCAG 2.2 (REQ-028 AC2). Its text is black on pink, 8.37:1, and its fill and outline are pink on the black page, 8.37:1 (REQ-015). The ring is yellow on black, 18.55:1.
- The `:focus-visible` rule shows the link only to keyboard users. A screen-reader user reaches it by its name in the list of links.
- `CnMain` is the `main` landmark. A page has one. It takes programmatic focus only (`tabindex="-1"`), so it is not a Tab stop, and it shows no ring.
- Keyboard map: **Tab** focuses and shows the link; **Enter** follows it and moves focus to the main region; **Shift+Tab** from the first control returns to the link.
- Verified in a browser on the showcase and on the consumer fixture, at 360, 768, and 1280 px with axe.

## Content

- `CnSkipLink` has no copy: the `label` prop is the text. Write a short phrase that names the destination, such as "Saltar al contenido" (es-MX). The English "Skip to content" is used by the showcase.
- Follow [Voice and tone](../../04-content/voice-and-tone.md) and [Microcopy](../../04-content/microcopy.md).

## Responsive behavior

The link is fixed at the top left with a small margin, and its width follows its text, up to the width of the screen minus the margin, so a long label wraps rather than overflows at 360 px. It is 44 px tall at every width. `CnMain` has no layout of its own.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnSkipLink` (`packages/nuxt/components/CnSkipLink.vue`) and `CnMain` (`packages/nuxt/components/CnMain.vue`) |
| Theme | None. The look is `.cn-skip-link` in `packages/nuxt/assets/css/main.css` |
| Tokens | `skipLink` (`tokens/component/skip-link.json`) |
| Demos | `apps/showcase/demos/skip-link/` |

| `CnSkipLink` prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required. The text of the link, in the language of the page. |
| `target` | `string` | Optional. The id of the main region, with no `#`. `"main"` when it is not set. |

| `CnMain` prop | Type | Notes |
|---|---|---|
| `id` | `string` | Optional. The id of the region, with no `#`. `"main"` when it is not set. |

| `CnMain` slot | Notes |
|---|---|
| `default` | The page content. |

Every other attribute, such as `class`, falls through to the element.

## Open items

Not applicable.

## Changelog

- 1.9.0 — First version: `CnSkipLink`, a link hidden until keyboard focus with the ADR-0009 ring and a 44 px target, and its companion `CnMain` — DSR-14, T15.18, ADR-0072
