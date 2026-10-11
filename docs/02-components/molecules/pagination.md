---
title: Pagination
slug: pagination
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UPagination
status: draft
lang: en
brandRules: [BR-01, BR-10, BR-13]
tokens: [pagination, radius.pagination, border.width.pagination]
demos: [states, playground]
tbd: [TBD-10]
related: [tabs, breadcrumb, button, navigation, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Pagination

## Purpose

Pagination moves between pages of results and shows which page the person is on. It is a themed Nuxt UI `UPagination`, built from buttons, and styled only through tokens (C-03). A page that is not current is a neutral outline, and the current page is a pink chip with a black number, like the primary button (BR-01, BR-10, ADR-0010, ADR-0028). It draws no glow: the glow belongs to actions.

## Anatomy

1. **previous**: the control that goes to the page before the current one.
2. **page number**: one button for a page. The current one is the chip.
3. **ellipsis**: the gap where pages are left out. It is not a control.
4. **next**: the control that goes to the page after the current one.

## Tokens and specs

<!-- cn:generated tokens="pagination radius.pagination border.width.pagination" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.pagination` | `--cn-border-width-pagination` | `3px` | stable |
| `pagination.current.bg` | `--cn-pagination-current-bg` | `#ef80ae` | stable |
| `pagination.current.border` | `--cn-pagination-current-border` | `#ef80ae` | stable |
| `pagination.current.fg` | `--cn-pagination-current-fg` | `#000000` | stable |
| `pagination.focus.color` | `--cn-pagination-focus-color` | `#fff488` | stable |
| `pagination.focus.offset` | `--cn-pagination-focus-offset` | `3px` | stable |
| `pagination.focus.style` | `--cn-pagination-focus-style` | `solid` | stable |
| `pagination.focus.width` | `--cn-pagination-focus-width` | `3px` | stable |
| `pagination.item.border` | `--cn-pagination-item-border` | `#8c8c8c` | stable |
| `pagination.item.borderHover` | `--cn-pagination-item-border-hover` | `#ef80ae` | stable |
| `pagination.item.fg` | `--cn-pagination-item-fg` | `#f5f5f5` | stable |
| `radius.pagination` | `--cn-radius-pagination` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The pagination tokens reference semantic tokens only (REQ-010 AC2). The current page chip and the focus ring are `stable`: brand pink, black, and brand yellow (BR-01, BR-03, BR-02). The corner radius follows a placeholder (TBD-10), so it is `tbd` until the owner supplies it. The text color, the outline color, and the stroke width are `stable` (ADR-0032).

Contrast pairs declared for the pagination (REQ-015):

<!-- cn:generated tokens="pagination" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `pagination.item.fg` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `pagination.item.border` (`#8c8c8c`) | `color.bg.base` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `pagination.item.borderHover` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `pagination.current.fg` (`#000000`) | `pagination.current.bg` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `pagination.current.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `pagination.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The page controls take the rounded corners and the thick outline of BR-10 and BR-13. They carry no glow, because they mark a position rather than start an action (ADR-0028). Black on pink is 8.37:1 (SPEC.md §2.1).

## Variants

The pagination has one brand look. Nuxt UI's `color`, `variant`, `activeColor`, and `activeVariant` props are not used: the theme sets the look through the `.cn-pagination` hook, so there is nothing to map. Never set `activeVariant` to anything but `solid`.

| Brand look | Nuxt UI props | Other pages | Current page |
|---|---|---|---|
| default | none | Neutral outline | Pink chip, black number |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Neutral outlined pages and the pink chip on the current page. | `pagination.item.fg`, `pagination.item.border`, `pagination.current.*` |
| `hover` | The outline of a page that is not current turns pink. | `pagination.item.borderHover` |
| `focus-visible` | A yellow ring outside the focused control. | `pagination.focus.color`, `pagination.focus.width`, `pagination.focus.offset`, `pagination.focus.style` |
| `selected` | The current page is a pink chip with a bold black number. | `pagination.current.bg`, `pagination.current.fg`, `pagination.current.border` |
| `disabled` | Every control is natively disabled, cannot be focused, and Nuxt UI dims it. They ignore hover. | none |

The current page is part of every row above. A page has no `active` (pressed) state of its own: pressing it makes it the current page, and `selected` covers that. The previous control is disabled on the first page and the next control on the last page, as Reka UI does it. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use pagination when a list is split into pages, and the person needs to know the page and move between them.
- Pass `total` and `items-per-page`, and bind the current page with `v-model:page`.
- Keep the number of items small with `sibling-count`, and show the first and last page with `show-edges`.
- Set an accessible name on every control and page number in the language of the page (see Content).
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use pagination for steps of a process. Use a progress indicator.
- Never use it for a few views of the same subject. Use [Tabs](tabs.md).
- Never use it for the path through a hierarchy. Use a [Breadcrumb](breadcrumb.md).
- Never add a glow to a page control. The glow belongs to buttons (BR-10).
- Never tell the current page apart by color alone, or remove its `aria-current`.
- Never write a color literally in a pagination. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Show the current page as the pink chip. | Show it only with a different text color. |
| Show the first and last page with `show-edges`. | Show every page number of a long list. |
| Give the controls es-MX accessible names. | Leave Nuxt UI's English names on a Spanish page. |
| Let the list wrap on a narrow screen. | Force it onto one line wider than the screen. |

## Accessibility

- Each page is a real `<button>` with an accessible name. The current page has `aria-current="page"`, so a screen reader announces it as the current page.
- The previous and next controls are icon-only, so each needs an accessible name. Nuxt UI's defaults are English ("Previous Page", "Page 2"). Pass es-MX names through the `prev`, `next`, and `item` slots, as the demos do.
- The current page is shown by the chip and the bold number as well as by color, so it is not told by color alone (WCAG 1.4.1). The black number on the pink chip is 8.37:1 (REQ-015).
- The focus ring shows on `:focus-visible`. The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1, AC2).
- A page number and a control are at least 24 × 24 px (REQ-028 AC2).
- The previous control on the first page and the next control on the last page are disabled, so they are announced as unavailable and skipped by Tab.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the next enabled control: previous, a page number, or next. |
| Shift + Tab | Moves focus to the previous enabled control. |
| Enter | Goes to the focused page, or to the previous or next page. |
| Space | Goes to the focused page, or to the previous or next page. |

A disabled control is skipped by Tab.

ARIA: `aria-current="page"` on the current page and `aria-label` on each control, set by Reka UI and overridden with es-MX names through the slots.

## Content

- Name the controls with the action: "Página anterior", "Página siguiente".
- Name each page number with the word and the number: "Página 3".
- Do not repeat the total in the control. Say it nearby in the page, for example "Página 3 de 9".

```copy es-MX
Página anterior
Página 3
Página siguiente
```

```copy-bad es-MX
Previous Page
Siguiente >>
```

## Responsive behavior

The control fills the width of its container at 360, 768, and 1280 px (A-09). The list wraps onto a second line when it is wider than the container, so it never causes horizontal overflow (REQ-028 AC1). Use `sibling-count` of 1 on a narrow screen to keep it short.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UPagination` |
| Props used | `total`, `items-per-page`, `v-model:page`, `sibling-count`, `show-edges`, `show-controls` (false when using the slots) |
| Slots used | `prev`, `item`, `next` |
| Theme | `ui.pagination` in `packages/nuxt/app.config.ts` and the `.cn-pagination*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `pagination.*`, `radius.pagination`, `border.width.pagination` |
| Demos | `apps/showcase/demos/pagination/` |

```vue
<UPagination v-model:page="page" :total="90" :items-per-page="10" :sibling-count="1" show-edges />
```

## Open items

> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The look (a neutral outline and a pink chip with a black number on the current page, with no glow) is approved (ADR-0028). The hover look is a draft. The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UPagination` themed with the pink chip look, the component tokens, and the demos (T8.4) — ADR-0028
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
