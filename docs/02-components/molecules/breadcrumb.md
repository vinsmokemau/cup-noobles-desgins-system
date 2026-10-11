---
title: Breadcrumb
slug: breadcrumb
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UBreadcrumb
status: draft
lang: en
brandRules: [BR-01, BR-06]
tokens: [breadcrumb]
demos: [states, playground]
tbd: [TBD-04, TBD-05, TBD-08]
related: [tabs, pagination, link, navigation, accessibility]
since: 0.1.0
updated: 2026-10-10
---

# Breadcrumb

## Purpose

The breadcrumb shows where the current page sits in a hierarchy and lets a person go back up it. It is a themed Nuxt UI `UBreadcrumb`, styled only through tokens (C-03). The links are brand pink and underlined, like every link (BR-01, ADR-0011), and the current page is plain bold text, so the trail is readable on the pure-black page (BR-06, ADR-0028).

## Anatomy

1. **list**: the ordered list of items, inside a `nav` landmark labelled "breadcrumb".
2. **link**: an ancestor page, pink and underlined.
3. **separator**: the caret between two items. It is decorative and hidden from assistive technology.
4. **current page**: the last item, plain bold text. It is not a link and carries `aria-current="page"`.

## Tokens and specs

<!-- cn:generated tokens="breadcrumb" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `breadcrumb.current.fg` | `--cn-breadcrumb-current-fg` | `#90a1b9` | tbd (TBD-04) |
| `breadcrumb.focus.color` | `--cn-breadcrumb-focus-color` | `#fff488` | stable |
| `breadcrumb.focus.offset` | `--cn-breadcrumb-focus-offset` | `3px` | stable |
| `breadcrumb.focus.style` | `--cn-breadcrumb-focus-style` | `solid` | stable |
| `breadcrumb.focus.width` | `--cn-breadcrumb-focus-width` | `3px` | stable |
| `breadcrumb.link.fg` | `--cn-breadcrumb-link-fg` | `#ef80ae` | stable |
| `breadcrumb.link.fgHover` | `--cn-breadcrumb-link-fg-hover` | `#ef80ae` | derived-pending (TBD-08) |
| `breadcrumb.separator.fg` | `--cn-breadcrumb-separator-fg` | `#90a1b9` | tbd (TBD-05) |

<!-- /cn:generated -->

The breadcrumb tokens reference semantic tokens only (REQ-010 AC2). The link color and the focus ring are `stable`: brand pink and brand yellow (BR-01, BR-02). The current page text and the separator follow placeholders (TBD-04, TBD-05), and the link hover color is `derived-pending` because no pink shade is defined (TBD-08).

Contrast pairs declared for the breadcrumb (REQ-015):

<!-- cn:generated tokens="breadcrumb" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `breadcrumb.link.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `breadcrumb.link.fgHover` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `breadcrumb.current.fg` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `breadcrumb.current.fg`, `color.text.default`, `placeholder.color.neutral`) |
| `breadcrumb.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.

The separator is decorative, so it is not held to a contrast pair. Pink on black is 8.37:1 (SPEC.md §2.1).

## Variants

The breadcrumb has one brand look. Nuxt UI's `color` prop is not used: the theme sets the look through the `.cn-breadcrumb__*` hook classes, so there is nothing to map.

| Brand look | Nuxt UI props | Links | Current page |
|---|---|---|---|
| default | none | Pink, underlined | Plain bold text |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Pink underlined links, neutral carets, and the current page in bold. | `breadcrumb.link.fg`, `breadcrumb.current.fg`, `breadcrumb.separator.fg` |
| `hover` | The link turns to the hover color. The underline stays. | `breadcrumb.link.fgHover` |
| `focus-visible` | A yellow ring outside the focused link. | `breadcrumb.focus.color`, `breadcrumb.focus.width`, `breadcrumb.focus.offset`, `breadcrumb.focus.style` |

The current page is the last item and is not a control, so it has no hover, focus-visible, or disabled state. It is shown in every row above. A link has no `active` (pressed) state of its own. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a breadcrumb on a page that is two or more levels deep, so a person can go back up.
- Put it above the page title, and list every ancestor in order, from the top to the current page.
- Make the last item the current page. Give it a label, no link, and `active: true`, so Nuxt UI sets `aria-current="page"` on it.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use a breadcrumb for a page at the top level. There is nothing to go back to.
- Never use it as the main navigation, or in place of [Tabs](tabs.md) or [Pagination](pagination.md).
- Never make the current page a link, or remove its `aria-current`.
- Never remove the underline from a link. A link must not be told apart by color alone (WCAG 1.4.1).
- Never write a color literally in a breadcrumb. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Use the same label as the page title: "Dados". | Rename the page in the trail. |
| Keep each label short, one or two words. | Write a full sentence as an item. |
| Truncate a long current page with an ellipsis. | Let a long label wrap the trail onto several lines. |
| Use the caret from the icon set as the separator. | Draw a slash or an arrow by hand. |

## Accessibility

- The breadcrumb is a `nav` landmark with `aria-label="breadcrumb"` and an ordered list inside it, so a screen reader announces the trail and the number of items.
- The current page is the last item. It has `aria-current="page"` and is not a link, so a screen reader reads where the person is.
- Links are pink and underlined, so they are not told apart by color alone (WCAG 1.4.1). A link is 8.37:1 against the page, and the current page is 7.98:1 with the example grey (REQ-015).
- The separators are `role="presentation"` and `aria-hidden="true"`, so they are not read.
- The focus ring shows on `:focus-visible`. The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1, AC2).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the next link. The current page is not a link and is skipped. |
| Shift + Tab | Moves focus to the previous link. |
| Enter | Follows the focused link. |

ARIA: `aria-label="breadcrumb"` on the `nav`, `aria-current="page"` on the current page, and `aria-hidden="true"` on each separator, set by Nuxt UI.

## Content

- Write each item as the page's name, in sentence case, in one or two words: "Juegos".
- Make the current page's label the same as the page title.
- Use a link text that names the page. Never write "Aquí".

```copy es-MX
Inicio
Juegos
Dados
```

```copy-bad es-MX
Haz clic aquí para volver al inicio
>>>
```

## Responsive behavior

The trail fills the width of its container at 360, 768, and 1280 px (A-09). Each label truncates with an ellipsis when the trail is wider than the container, so it never causes horizontal overflow (REQ-028 AC1). Every link is at least 24 px tall, or sits inline in a row, which WCAG 2.5.8 allows (REQ-028 AC2).

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UBreadcrumb` |
| Props used | `items` (each with `label` and, except the last, `to`; the last has `active: true`) |
| Slots used | none |
| Theme | `ui.breadcrumb` in `packages/nuxt/app.config.ts` and the `.cn-breadcrumb__*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `breadcrumb.*` |
| Demos | `apps/showcase/demos/breadcrumb/` |

```vue
<UBreadcrumb :items="[{ label: 'Inicio', to: '/' }, { label: 'Juegos', to: '/juegos' }, { label: 'Dados', active: true }]" />
```

## Open items

> **TBD (TBD-04):** The body text color is not decided. The current page reads a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-05):** The neutral scale is not defined. The separator reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-08):** Tints and shades of pink are not defined (C-06, OD-04). The link hover color repeats the brand pink. Owner input needed: decision OD-04.
>
> **Draft:** The look (pink underlined links and a plain bold current page) is approved (ADR-0028). The hover look of a link is a draft. The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UBreadcrumb` themed with the pink link look, the component tokens, and the demos (T8.4) — ADR-0028
