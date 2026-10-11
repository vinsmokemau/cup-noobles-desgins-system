---
title: Tabs
slug: tabs
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UTabs
status: draft
lang: en
brandRules: [BR-01, BR-06, BR-13]
tokens: [tabs, border.width.tabs]
demos: [states, playground]
tbd: []
related: [breadcrumb, pagination, badge, navigation, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Tabs

## Purpose

Tabs switch between views of related content in the same place, one view at a time. They are a themed Nuxt UI `UTabs`, styled only through tokens (C-03). The selected tab is pink and carries a thick pink underline on a neutral rule, so it stands out on the pure-black page without relying on color alone (BR-01, BR-06, BR-13, ADR-0028).

## Anatomy

1. **list**: the row (or column) that holds the tabs, with a neutral rule along one edge.
2. **tab**: one button in the list. It has a label and, optionally, a leading icon or a trailing badge.
3. **indicator**: the thick pink underline under the selected tab. It slides from one tab to the next.
4. **panel**: the content of the selected tab, shown under the list.

## Tokens and specs

<!-- cn:generated tokens="tabs border.width.tabs" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.tabs` | `--cn-border-width-tabs` | `3px` | stable |
| `tabs.active.fg` | `--cn-tabs-active-fg` | `#ef80ae` | stable |
| `tabs.active.indicator` | `--cn-tabs-active-indicator` | `#ef80ae` | stable |
| `tabs.fg` | `--cn-tabs-fg` | `#bdbdbd` | stable |
| `tabs.fgHover` | `--cn-tabs-fg-hover` | `#f5f5f5` | stable |
| `tabs.focus.color` | `--cn-tabs-focus-color` | `#fff488` | stable |
| `tabs.focus.offset` | `--cn-tabs-focus-offset` | `3px` | stable |
| `tabs.focus.style` | `--cn-tabs-focus-style` | `solid` | stable |
| `tabs.focus.width` | `--cn-tabs-focus-width` | `3px` | stable |
| `tabs.rule` | `--cn-tabs-rule` | `#8c8c8c` | stable |

<!-- /cn:generated -->

The tab tokens reference semantic tokens only (REQ-010 AC2). The selected label and the underline are `stable`: brand pink (BR-01). The label of a tab that is not selected, its hover color, the rule, and the stroke width are `stable` (ADR-0032).

Contrast pairs declared for the tabs (REQ-015):

<!-- cn:generated tokens="tabs" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `tabs.fg` (`#bdbdbd`) | `color.bg.base` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `tabs.fgHover` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `tabs.active.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `tabs.active.indicator` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `tabs.rule` (`#8c8c8c`) | `color.bg.base` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `tabs.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

Pink on black is 8.37:1 (SPEC.md §2.1). The underline is the line work of BR-13: it is as thick as the stroke width token says.

## Variants

The tabs have one brand look, the `link` variant of Nuxt UI. The theme makes it the default, so nothing needs to be passed. Never use `variant="pill"`: it fills the selected tab and is not the look chosen in ADR-0028.

| Brand look | Nuxt UI props | Selected tab |
|---|---|---|
| default | none (`variant="link"`, `color="primary"`) | Pink label, bold, with a thick pink underline |

The `orientation` prop lays the tabs out in a row (`horizontal`, the default) or in a column (`vertical`). In a column the underline is a bar on the inline-start edge.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A tab that is not selected: a neutral label on the black page. | `tabs.fg`, `tabs.rule` |
| `hover` | The label of a tab that is not selected turns to the body text color. | `tabs.fgHover` |
| `focus-visible` | A yellow ring outside the focused tab. | `tabs.focus.color`, `tabs.focus.width`, `tabs.focus.offset`, `tabs.focus.style` |
| `selected` | A pink bold label with the thick pink underline. | `tabs.active.fg`, `tabs.active.indicator`, `border.width.tabs` |
| `disabled` | The tab is natively disabled, cannot be focused, and Nuxt UI dims it. It ignores hover. | none |

A tab has no `active` (pressed) state of its own: pressing a tab selects it, and `selected` covers that. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use tabs to split one page into two to four views of the same subject, where a person looks at one view at a time.
- Keep each label to one or two words, so the list fits at 360 px.
- Give every tab a unique `value`, and put each tab's content in its panel.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use tabs to move between pages. Use links, a [Breadcrumb](breadcrumb.md), or [Pagination](pagination.md).
- Never use more than four tabs, or long labels, at 360 px. Use a [Select](../atoms/select.md) instead.
- Never nest tabs inside a tab panel.
- Never use `variant="pill"`, and never fill the selected tab.
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally on a tab. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Name each tab with a short noun: "Reglas". | Write a sentence in a tab label. |
| Keep the order of the tabs the same on every visit. | Reorder the tabs by use. |
| Show the selected tab with the underline and the bold label. | Tell the selected tab apart by color alone. |
| Disable a tab that is not available yet. | Hide a tab that exists in other states. |

## Accessibility

- The list is `role="tablist"`, each tab is `role="tab"`, and each panel is `role="tabpanel"`. Reka UI sets `aria-selected`, `aria-controls`, and `aria-labelledby`, so a screen reader reads the tab's name with the panel.
- The tab list is one tab stop: Tab moves focus to the selected tab, and arrow keys move inside the list. The panel is focusable, so a keyboard user reaches its content.
- The selected tab is shown by the underline and the bold label as well as by color, so it is not told by color alone (WCAG 1.4.1). Its label is 8.37:1 against the page (REQ-015).
- The focus ring shows on `:focus-visible`. The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1, AC2).
- The underline moves between tabs. Under `prefers-reduced-motion: reduce` it jumps without moving (REQ-029 AC2).
- A disabled tab is natively disabled: it is announced as unavailable and skipped by Tab and by the arrow keys.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus into the list, to the selected tab. The next Tab moves focus into the panel. |
| Shift + Tab | Moves focus out of the panel, then out of the list. |
| Arrow right (horizontal list), arrow down (vertical list) | Moves focus to the next tab and selects it. It wraps from the last tab to the first. |
| Arrow left (horizontal list), arrow up (vertical list) | Moves focus to the previous tab and selects it. It wraps from the first tab to the last. |
| Home | Moves focus to the first tab and selects it. |
| End | Moves focus to the last tab and selects it. |

A disabled tab is skipped by the arrow keys, Home, and End.

ARIA: `role="tablist"` (with `aria-orientation="vertical"` for a column), `role="tab"` with `aria-selected` and `aria-controls`, and `role="tabpanel"` with `aria-labelledby`, set by Reka UI.

## Content

- Write each label as one or two words in sentence case: "Reglas".
- Keep labels the same part of speech: all nouns.
- Write the panel as the content of that view, with no repeat of the label as a heading.

```copy es-MX
Reglas
Mesas
Torneos
```

```copy-bad es-MX
HAZ CLIC AQUÍ PARA VER LAS REGLAS DEL JUEGO
Más
```

## Responsive behavior

The tab list fills the width of its container at 360, 768, and 1280 px (A-09). Labels truncate with an ellipsis and never cause horizontal overflow (REQ-028 AC1). Every tab is at least 24 × 24 px (REQ-028 AC2). At 360 px, keep to four short labels. A vertical list suits a side column at 768 px and above.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UTabs` |
| Props used | `items`, `default-value` or `v-model`, `orientation` (optional) |
| Slots used | default and `content` for each panel, `leading` and `trailing` (optional) |
| Theme | `ui.tabs` in `packages/nuxt/app.config.ts` and the `.cn-tabs__*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `tabs.*`, `border.width.tabs` |
| Demos | `apps/showcase/demos/tabs/` |

```vue
<UTabs
  :items="[
    { label: 'Reglas', value: 'reglas', content: 'Cada jugador empieza con cinco cartas.' },
    { label: 'Mesas', value: 'mesas', content: 'Hay seis mesas para cuatro personas.' },
  ]"
/>
```

## Open items

> **Draft:** The look (a pink bold label with a thick pink underline on a neutral rule) is approved (ADR-0028). The hover look of a tab that is not selected is a draft. No value in it is open any more, so the doc stays a draft only until the owner approves it as stable.

## Changelog

- 0.1.0 — First draft: `UTabs` themed with the underline look, the component tokens, and the demos (T8.4) — ADR-0028
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
