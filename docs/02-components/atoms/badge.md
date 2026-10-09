---
title: Badge
slug: badge
layer: component
level: atom
source: nuxt-ui
nuxtUi: UBadge
status: draft
lang: en
brandRules: [BR-01, BR-02, BR-12, BR-13]
tokens: [badge, radius.badge, border.width.badge]
demos: [states, playground]
tbd: [TBD-10, TBD-11]
related: [button, link, icon, media-card, shape]
since: 0.1.0
updated: 2026-10-09
---

# Badge

## Purpose

The badge is a small label that names a category, a status, or a count. It includes the **tag badge** that sits on the featured media card (BR-12), which is the variant the media card uses. It is a themed Nuxt UI `UBadge`, styled only through tokens (C-03). The corner radius (TBD-10) and the stroke width (TBD-11) are not defined yet, so those tokens hold ADR-0006 placeholders that are not brand values. The brand context does not say how a badge looks, so the three variants in this doc are a proposal that awaits the owner (REQ-009).

## Anatomy

1. **container**: the filled or transparent shape, with rounded corners.
2. **outline**: the stroke around the container (BR-13).
3. **label**: the short text. It arrives through the `label` prop or the default slot (A-11).
4. **leading icon**: an optional [icon](icon.md) before the label.
5. **trailing icon**: an optional icon after the label.

## Tokens and specs

<!-- cn:generated tokens="badge radius.badge border.width.badge" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `badge.outline.border` | `--cn-badge-outline-border` | `#ef80ae` | stable |
| `badge.outline.fg` | `--cn-badge-outline-fg` | `#ef80ae` | stable |
| `badge.primary.bg` | `--cn-badge-primary-bg` | `#ef80ae` | stable |
| `badge.primary.border` | `--cn-badge-primary-border` | `#ef80ae` | stable |
| `badge.primary.fg` | `--cn-badge-primary-fg` | `#000000` | stable |
| `badge.tag.bg` | `--cn-badge-tag-bg` | `#fff488` | stable |
| `badge.tag.border` | `--cn-badge-tag-border` | `#fff488` | stable |
| `badge.tag.fg` | `--cn-badge-tag-fg` | `#000000` | stable |
| `border.width.badge` | `--cn-border-width-badge` | `1px` | tbd (TBD-11) |
| `radius.badge` | `--cn-radius-badge` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The component tokens only reference semantic tokens (REQ-010 AC2). The shape tokens are `tbd`: they follow the ADR-0006 placeholders (Nuxt UI's default radius and outline width), and **none of them is a brand value**. The fill, label, and outline tokens are `stable`. A badge has no glow and no focus ring, because it is not interactive.

Contrast pairs declared for the badge (REQ-015):

<!-- cn:generated tokens="badge" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `badge.primary.fg` (`#000000`) | `badge.primary.bg` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `badge.primary.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `badge.outline.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `badge.outline.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `badge.tag.fg` (`#000000`) | `badge.tag.bg` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `badge.tag.border` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-12:** Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge).

The labels on pink and yellow fills are black, because white on pink is 2.51:1, yellow on pink is 2.22:1, and white on yellow is 1.13:1 (SPEC.md §2.1).

## Variants

The badge exposes three brand variants. Each maps to Nuxt UI props like this:

| Brand variant | Nuxt UI props | Fill | Label | Outline |
|---|---|---|---|---|
| `primary` | `color="primary" variant="solid"` | Brand pink (BR-01) | Black | Pink |
| `outline` | `color="primary" variant="outline"` | None; the page shows through | Pink | Pink |
| `tag` | `color="secondary" variant="solid"` | Brand yellow (BR-02) | Black | Yellow |

The `tag` variant is the tag badge of the featured media card (BR-12). Any other Nuxt UI `color` or `variant` falls back to Nuxt UI's defaults and is not part of the system. Sizes `xs`, `sm`, `md` (default), `lg`, and `xl` are Nuxt UI's.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The variant's fill, label, and outline. | `badge.<variant>.bg`, `badge.<variant>.fg`, `badge.<variant>.border`, `radius.badge`, `border.width.badge` |

A badge shows information. It is not a control, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. To make something clickable, use [Button](button.md) or [Link](link.md).

## Usage rules

### When to use

- Use `tag` for the category label on a featured media card (BR-12).
- Use `primary` for a status that should stand out, such as "Nuevo".
- Use `outline` for a quieter status next to a `primary` one.
- Keep the text short, one to three words.
- Pass the text through the `label` prop or the slot. The component never holds copy (A-11).

### When not to use

- Never use a badge as a button or a link. It cannot be focused.
- Never put a badge text on a fill that the table above does not pair it with: no white or yellow text on pink, and no white text on yellow (SPEC.md §2.1).
- Never use a badge for a sentence or a message. Use an alert.
- Never rely on the badge color alone to tell a status apart. Write the status in the text.
- Never write a radius, width, or color literally in a badge. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write the category: "Juegos de mesa". | Write a sentence: "Este juego llega pronto a la tienda". |
| Use one `tag` badge per category on a media card. | Use a badge as a clickable filter. |
| Keep the label in sentence case. | Write the label in capitals to make it stand out. |

## Accessibility

- The badge is a `<span>`. It is read as text, in order, so its text must make sense on its own.
- It has no role and takes no focus, so it has no keyboard interaction.
- The colors never carry the meaning alone: the text names the status.
- A decorative icon inside a badge is hidden from assistive technology.
- Every label and outline pair is at or above the WCAG 2.2 AA minimums (REQ-015). The state matrix passes axe.

Keyboard map: the badge has no keyboard interaction.

## Content

- Name the category or status in one to three words, in sentence case.
- Do not end with a period.
- Do not put a number alone; say what it counts: "3 nuevos".

```copy es-MX
Nuevo
Preventa
Juegos de mesa
```

```copy-bad es-MX
NUEVO!!!
Este juego llega pronto
```

## Responsive behavior

The badge is the same at 360, 768, and 1280 px (A-09). Its label stays on one line. A row of badges wraps to the next line instead of overflowing (ER-05).

## Email notes

The email equivalent is a small inline label inside the MJML components, described in [Email components](../../05-email/email-components.md). It uses a solid border and no glow.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UBadge` |
| Props used | `color`, `variant`, `size`, `label`, `leading-icon`, `trailing-icon` |
| Theme | `ui.badge` in `packages/nuxt/app.config.ts` (hook classes) and the `.cn-badge*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `badge.*`, `radius.badge`, `border.width.badge` |
| Demos | `apps/showcase/demos/badge/` |

```vue
<UBadge label="Juegos de mesa" color="secondary" variant="solid" />
```

## Open items

> **TBD (TBD-10):** The corner radius is not defined ("rounded" in BR-10). `radius.badge` follows an ADR-0006 placeholder. Owner input needed.
>
> **TBD (TBD-11):** The stroke width is not defined ("thick" in BR-13). `border.width.badge` follows an ADR-0006 placeholder. Owner input needed.
>
> **Draft:** The brand context names the tag badge (BR-12) but not how it looks. The three variants, and the choice of a yellow fill for `tag`, are a proposal. This awaits owner approval.

## Changelog

- 0.1.0 — First draft: `UBadge` themed with the `primary`, `outline`, and `tag` variants, the component tokens, and the demos (T7.3) — awaiting owner approval
