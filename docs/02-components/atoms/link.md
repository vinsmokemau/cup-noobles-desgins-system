---
title: Link
slug: link
layer: component
level: atom
source: nuxt-ui
nuxtUi: ULink
status: draft
lang: en
brandRules: [BR-01, BR-06, BR-13]
tokens: [link]
demos: [states, playground]
tbd: [TBD-08]
related: [button, icon, badge, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Link

## Purpose

The link takes a person to another page, another part of the page, or another site. It is brand pink on the pure-black page (BR-01), which keeps it legible (BR-06), and it is always underlined, so it is never told apart from the text around it by color alone. It is a themed Nuxt UI `ULink`, styled only through tokens (C-03). The brand context does not describe a link, so the look in this doc is a proposal that awaits the owner (REQ-009).

## Anatomy

1. **text**: the words that name the destination. They arrive through the default slot (A-11).
2. **underline**: the line under the text. It stays on in every state.
3. **icon**: an optional [icon](icon.md) before or after the text. An icon-only link has an icon and no text.
4. **focus ring**: the yellow outline drawn outside the link on keyboard focus (REQ-024, ADR-0009).

## Tokens and specs

<!-- cn:generated tokens="link" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `link.fg` | `--cn-link-fg` | `#ef80ae` | stable |
| `link.fgActive` | `--cn-link-fg-active` | `#ef80ae` | derived-pending (TBD-08) |
| `link.fgHover` | `--cn-link-fg-hover` | `#ef80ae` | derived-pending (TBD-08) |
| `link.focus.color` | `--cn-link-focus-color` | `#fff488` | stable |
| `link.focus.offset` | `--cn-link-focus-offset` | `3px` | stable |
| `link.focus.style` | `--cn-link-focus-style` | `solid` | stable |
| `link.focus.width` | `--cn-link-focus-width` | `3px` | stable |

<!-- /cn:generated -->

The component tokens only reference semantic tokens (REQ-010 AC2). The hover and pressed colors are `derived-pending`: each reads a shade token that repeats the single brand pink, so a hovered or pressed link does not change color yet (C-06, TBD-08). The text color and the focus tokens are `stable`.

Contrast pairs declared for the link (REQ-015):

<!-- cn:generated tokens="link" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `link.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `link.fgHover` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `link.fgActive` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `link.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.

The pink is the primary brand color of BR-01, which is the protagonist color of the identity. Pink on black is 8.37:1 (SPEC.md §2.1). Yellow on pink and white on pink fail, so a link never sits on a pink fill with a pink or white text color.

## Variants

The link has one brand look. Nuxt UI's `ULink` has no `color` or `variant` prop, so there is nothing to map.

| Brand look | Nuxt UI props | Text | Underline |
|---|---|---|---|
| default | none; `to` or `href` sets the destination | Brand pink (BR-01) | Always on |

An icon-only link is a link whose slot holds only an icon. It has no other look, and it must carry an accessible name (see Accessibility). Whether a link is the current page is shown by [Tabs](../molecules/tabs.md) and [Navigation](../../03-patterns/navigation.md), not by the link itself.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Pink text with an underline. | `link.fg` |
| `hover` | The text color. | `link.fgHover` |
| `focus-visible` | A yellow ring outside the link. | `link.focus.color`, `link.focus.width`, `link.focus.offset`, `link.focus.style` |
| `active` | The text color while pressed. | `link.fgActive` |
| `disabled` | The link has no `href`, is marked `aria-disabled`, and is skipped by Tab. Nuxt UI dims it. | none |

The state matrix on the component page shows every row for a text link, a link with an icon, and an icon-only link, and each state has a visual baseline.

## Usage rules

### When to use

- Use a link to move to another page, a section of the page, or another site.
- Name the destination in the link text, so it makes sense read on its own.
- Give an icon-only link an accessible name through `aria-label` (REQ-027).
- Make an icon-only link at least 24 × 24 CSS px (REQ-028 AC2). A link inside a sentence is exempt.
- Pass the text through the slot. The component never holds copy (A-11).

### When not to use

- Never use a link to run an action on the page. Use [Button](button.md).
- Never use a vague text such as "aquí" or "haz clic aquí".
- Never remove the underline, and never rely on color alone to show a link.
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a link. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Name the destination: "las reglas del torneo" (`descriptive.example.vue`). | Use a vague text: "aquí" (`vague.example.vue`). |
| Give an icon-only link an `aria-label`. | Leave an icon-only link without a name. |
| Use a link to navigate and a button to act. | Style a link as a button to run an action. |
| Leave the underline on. | Remove the underline because it "looks cleaner". |

## Accessibility

- The link is a native `<a>` when it has a destination. It is named by its text, or by `aria-label` when it holds only an icon.
- An icon inside a link is hidden from assistive technology (`UIcon` sets `aria-hidden="true"`), so it adds nothing to the link's name.
- **An icon-only link requires an accessible name.** Without one, a screen reader announces only "link", and axe reports `link-name`. A test proves both cases (REQ-027 AC1).
- A disabled link has no `href`, carries `aria-disabled="true"` and `role="link"`, and has `tabindex="-1"`, so it is announced as unavailable and skipped by Tab.
- Focus is shown on `:focus-visible` only, never on a mouse click alone (REQ-024 AC2). The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1).
- The underline is always on, so the link is not told apart by color alone (WCAG 1.4.1).
- A link that opens in a new tab says so in its text or label.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the link and shows the focus ring. A disabled link is skipped. |
| Enter | Follows the link. |

Space does not follow a link; this is native behavior for `<a>`. ARIA: no `role` is added to a link that has a destination. A disabled link gets `aria-disabled="true"` and `role="link"` from Nuxt UI.

## Content

- Name the destination or the result in two to six words: "Ver las reglas del torneo".
- Start with a verb when the link leads to an action-like page: "Ver", "Leer", "Ir a".
- Do not end with a period, and do not write the address.
- For an icon-only link, the `aria-label` names the destination: "Buscar en el catálogo".

```copy es-MX
Ver las reglas del torneo
Ir al catálogo
Buscar en el catálogo
```

```copy-bad es-MX
Haz clic aquí
Link
https://ejemplo.mx/reglas
```

## Responsive behavior

The link is the same at 360, 768, and 1280 px (A-09). Long link text wraps like the text around it. An icon-only link keeps its 32 px square in the demos, so it stays above the 24 px minimum at every width (REQ-028 AC2). The focus ring reaches 6 px outside the link, so leave room around links inside scrolling containers.

## Email notes

The email link is plain `<a>` markup inside the MJML components, described in [Email components](../../05-email/email-components.md). It uses a solid underline and the brand pink, with no focus ring.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `ULink` |
| Props used | `to`, `href`, `disabled`, `target` |
| Theme | `ui.link.base` in `packages/nuxt/app.config.ts` and the `.cn-link` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `link.*` |
| Demos | `apps/showcase/demos/link/` |

```vue
<ULink to="/reglas">Ver las reglas del torneo</ULink>
```

## Open items

> **TBD (TBD-08):** Tints and shades of pink and yellow are not defined. The hover and pressed colors read shade tokens that repeat the brand pink, so they look the same as the default color. Owner input needed: decision OD-04.
>
> **Draft:** The brand context does not describe a link. The pink text, the always-on underline, and the unchanged hover color are a proposal, and the dimming of a disabled link is Nuxt UI's default. This awaits owner approval.

## Changelog

- 0.1.0 — First draft: `ULink` themed with a pink, underlined look, the five states, the component tokens, and the demos (T7.3) — awaiting owner approval
