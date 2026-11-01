---
title: Key-value list
slug: key-value-list
layer: component
level: molecule
source: custom
component: CnKeyValueList
status: stable
lang: en
brandRules: [BR-03, BR-13]
tokens: [keyValueList]
demos: [states, playground]
tbd: []
related: [separator, card, media-card, form-field, spacing, layout, accessibility]
since: 1.2.0
updated: 2026-11-01
---

# Key-value list

## Purpose

`CnKeyValueList` shows a list of attributes, each a label and a value, such as a table of details about one item: a size, a material, a number of players. It is a description list. Assistive technology announces each label together with its value, and the list needs no column headers. Use it for facts that belong to one subject, read from top to bottom.

**Why custom:** Nuxt UI has no equivalent. The nearest component, `UTable`, is a data grid for rows and columns with sorting and selection, and it expects column headers that a list of attributes does not have. No Nuxt UI component renders a description list (ADR-0065).

## Anatomy

1. **list**: the `<dl>` element. It sits on the black page and has no fill, no outline, and no glow.
2. **row**: one label and its value, in a `<div>` inside the list. A grey line below the row separates it from the next. The last row has no line.
3. **label**: the `<dt>`. It is the name of the attribute, in the muted text color.
4. **value**: the `<dd>`. It is the attribute itself, in the default text color, so it is the stronger of the two.

The list renders nothing when it has no rows.

## Tokens and specs

<!-- cn:generated tokens="keyValueList" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `keyValueList.bg` | `--cn-key-value-list-bg` | `#000000` | stable |
| `keyValueList.divider.color` | `--cn-key-value-list-divider-color` | `#8c8c8c` | stable |
| `keyValueList.divider.width` | `--cn-key-value-list-divider-width` | `3px` | stable |
| `keyValueList.label` | `--cn-key-value-list-label` | `#bdbdbd` | stable |
| `keyValueList.value` | `--cn-key-value-list-value` | `#f5f5f5` | stable |

<!-- /cn:generated -->

The key-value list tokens reference semantic tokens only (REQ-010 AC2), and all of them are `stable`. The label is the muted text color, the value is the default text color, and the line between rows has the color and the stroke of the separator. The list has no fill of its own: it sits on the pure-black page (BR-03).

The space inside a row uses existing steps of the spacing scale (ADR-0049): `space.md` above and below a row, and `space.sm` between a label and its value when they stack. From the `md` breakpoint the gap between the two columns is `space.md`.

Contrast pairs declared for the key-value list (REQ-015):

<!-- cn:generated tokens="keyValueList" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `keyValueList.label` (`#bdbdbd`) | `keyValueList.bg` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `keyValueList.value` (`#f5f5f5`) | `keyValueList.bg` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `keyValueList.divider.color` (`#8c8c8c`) | `keyValueList.bg` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The line between rows is thick and clean (BR-13), with the stroke of the separator. The list stays on the pure-black page (BR-03), with no fill of its own.

## Variants

The key-value list has one look and one structure. It changes layout with the width of the screen, not with a prop (see [Responsive behavior](#responsive-behavior)).

| Variant | Props | What changes |
|---|---|---|
| Text values | `items` | Each value is the text in `items`. |
| Custom values | `items` and the `value` slot | The slot draws each value, for example as a badge. The label stays the text in `items`. |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Muted labels, default-colored values, and a grey line between rows. | `keyValueList.label`, `keyValueList.value`, `keyValueList.divider.color`, `keyValueList.divider.width` |
| `empty` | A list with no `items` renders nothing: no element, no space. | None |

A key-value list is not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. It has no loading or error state: the page that fetches the details decides what to show meanwhile (see [Loading](../../03-patterns/loading.md)). The state matrix on the component page shows a list of text values, a list with a badge in the `value` slot, and the empty list, and each state has a visual baseline.

## Usage rules

### When to use

- Use a key-value list for the attributes of one subject, where each attribute has a name and one value.
- Keep each label to one to three words, and each value short enough to read at a glance.
- Keep the rows in the order people need them. The list does not sort.
- Draw a value your own way through the `value` slot only for non-interactive content such as text or a [badge](../atoms/badge.md).
- Pass every word through `items` or the slot. The component never holds copy (A-11).
- Name the list for what it is, not for the project it comes from (REQ-022).

### When not to use

- Never use a key-value list to compare several subjects across the same columns. Use a table.
- Never put a link, a button, or a field inside a value. The list is not interactive, and a control would be an unexplained tab stop.
- Never use the list for layout of unrelated content. A description list means each value describes its label.
- Never write a color, width, or space literally on the list. Read the tokens (REQ-016).
- Never leave a label empty. A value without a label is announced without a name.

## Do and don't

| Do | Don't |
|---|---|
| Write the label as a noun: "Jugadores". | Write the label as a sentence or a question. |
| Let a long value wrap onto more lines. | Truncate a value that people need to read. |
| Give a missing value its own words, such as "No indicado". | Leave a value empty and show a label alone. |
| Use the `value` slot for a badge. | Put a link or a button in the slot. |

## Accessibility

- The list is a native description list: `<dl>` with `<dt>` and `<dd>`. Each row is wrapped in a `<div>`, which HTML allows inside a `<dl>` and which adds no role. Screen readers announce the list and read each label with its value.
- The list is not focusable and takes no keyboard interaction. A Playwright test checks that Tab skips it.
- The label is the muted text color and the value is the default text color, both on the black page. The contrast table above lists both pairs against the 4.5:1 minimum for text (REQ-015, WCAG 1.4.3).
- The line between rows is the separator's grey, which passes the 3:1 minimum for a UI element, and no meaning depends on it (WCAG 1.4.11).
- A badge in the `value` slot keeps its text, and a status must not rely on color alone (WCAG 1.4.1).
- No target size applies: the list has no interactive target (REQ-028 AC2).

Keyboard map: not applicable, because the key-value list is not interactive.

ARIA: no `role` or `aria-*` attribute is added. The roles are native: the description list, its terms, and its definitions.

## Content

- Write labels as short nouns in sentence case, without a colon. The layout separates the label from its value, so the colon is not needed.
- Write values the way the person would say them, with units next to the number.
- Write numbers and units in the formats of [Formatting](../../04-content/formatting.md).

```copy es-MX
Jugadores
2 a 4
Duración
30 minutos
Edad recomendada
8 años en adelante
```

```copy-bad es-MX
JUGADORES:
2-4 jug.
```

## Responsive behavior

At 360 px each row stacks: the label sits over its value, and both use the full width of the list. From the `md` breakpoint (`breakpoint.md`, 768 px, ADR-0035) the row has two columns, the label in one third and the value in two thirds. At 768 and 1280 px the columns keep these proportions, so labels line up down the list. A long word breaks inside its column, and the list never causes horizontal overflow at 360, 768, and 1280 px (REQ-028 AC1, ER-05, A-09).

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnKeyValueList` (`packages/nuxt/components/CnKeyValueList.vue`) |
| Theme | The `.cn-key-value-list*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `keyValueList.*` |
| Demos | `apps/showcase/demos/key-value-list/` |

| Prop | Type | Notes |
|---|---|---|
| `items` | `{ label: string; value: string }[]` | Required. The rows, in order. An empty array renders nothing. |

| Slot | Notes |
|---|---|
| `value` | Draws the value of one row in place of its text. It receives `item` and `index`. Keep it non-interactive. |

```vue
<CnKeyValueList
  :items="[
    { label: 'Jugadores', value: '2 a 4' },
    { label: 'Duración', value: '30 minutos' },
    { label: 'Edad recomendada', value: '8 años en adelante' },
  ]"
/>
```

With a badge as a value:

```vue
<CnKeyValueList :items="[{ label: 'Idioma', value: 'Español' }]">
  <template #value="{ item }">
    <UBadge :label="item.value" color="primary" variant="outline" />
  </template>
</CnKeyValueList>
```

## Open items

Not applicable.

## Changelog

- 1.2.0 — First version: `CnKeyValueList`, a description list of labels and values that stacks at 360 px, with the `keyValueList` tokens and the demos — DSR-02, T15.2, ADR-0065
