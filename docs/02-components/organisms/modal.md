---
title: Modal
slug: modal
layer: component
level: organism
source: nuxt-ui
nuxtUi: UModal
status: stable
lang: en
brandRules: [BR-03, BR-12, BR-13]
tokens: [overlay, radius.overlay, border.width.overlay, effect.scrim]
demos: [states, playground]
tbd: []
related: [slideover, card, button, effects, accessibility]
since: 0.1.0
updated: 2026-10-19
---

# Modal

## Purpose

The modal is a dialog that opens on top of the page and asks for one decision or one short task before the person goes on. It is a themed Nuxt UI `UModal`, styled only through tokens (C-03). While it is open, the page behind is dimmed, switched off, and hidden from assistive technology. The panel looks like a card: the pure-black page color with a thick brand-pink outline (BR-03, BR-12, BR-13, ADR-0029). For a panel that holds navigation or a longer form, use [Slideover](slideover.md).

## Anatomy

1. **backdrop**: the dimmed layer over the page. It is pure black at 85% (ADR-0054).
2. **panel**: the framed dialog. It has the page's black fill, the pink outline, and the rounded corners.
3. **header**: the title and the description, with the close button at the end.
4. **body**: the main content, passed to the `body` slot.
5. **footer**: the optional actions, passed to the `footer` slot.
6. **dividers**: the pink lines between header, body, and footer. They are drawn only between parts that exist.

## Tokens and specs

<!-- cn:generated tokens="overlay radius.overlay border.width.overlay effect.scrim" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.overlay` | `--cn-border-width-overlay` | `3px` | stable |
| `effect.scrim.opacity` | `--cn-effect-scrim-opacity` | `0.85` | stable |
| `overlay.bg` | `--cn-overlay-bg` | `#000000` | stable |
| `overlay.divider` | `--cn-overlay-divider` | `#ef80ae` | stable |
| `overlay.fg` | `--cn-overlay-fg` | `#f5f5f5` | stable |
| `overlay.fgMuted` | `--cn-overlay-fg-muted` | `#bdbdbd` | stable |
| `overlay.highlight` | `--cn-overlay-highlight` | `#ef80ae` | stable |
| `overlay.scrim` | `--cn-overlay-scrim` | `#000000` | stable |
| `overlay.scrimOpacity` | `--cn-overlay-scrim-opacity` | `0.85` | stable |
| `overlay.shadow` | `--cn-overlay-shadow` | `none` | stable |
| `overlay.z` | `--cn-overlay-z` | `50` | stable |
| `radius.overlay` | `--cn-radius-overlay` | `1.25rem` | stable |

<!-- /cn:generated -->

The overlay tokens reference semantic tokens only (REQ-010 AC2). The fill, the outline, the dividers, and the backdrop color are `stable`: black and brand pink (BR-01, BR-03). The backdrop amount (0.85), the shadow (none), and the stacking order (50) are `stable` (ADR-0054). The corner radius is `stable`: the panel uses the large radius step, the same as the card (ADR-0050; the step is assigned by T13.3). The fill is `color.surface.elevated`, the pure-black page (ADR-0053). The text colors and the stroke width are `stable` (ADR-0032). The slideover reads the same tokens.

Contrast pairs declared for the modal and the slideover (REQ-015):

<!-- cn:generated tokens="overlay" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `overlay.fg` (`#f5f5f5`) | `overlay.bg` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `overlay.fgMuted` (`#bdbdbd`) | `overlay.bg` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `overlay.highlight` (`#ef80ae`) | `overlay.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `overlay.divider` (`#ef80ae`) | `overlay.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-12:** Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge).
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The brand context does not describe a dialog. The panel takes the card's look so the system reads as one thing (ADR-0029): a pink outline and pink dividers on the black page, with no glow and no shadow. The outline and the backdrop lift the panel off the page (ADR-0054). Pink on black is 8.37:1 (SPEC.md §2.1). The page behind is pure black (BR-03), so the backdrop only dims the colored content on it.

## Variants

The modal has one brand look. The Nuxt UI props below change its layout, not its color.

| Brand look | Nuxt UI props | Result |
|---|---|---|
| default | none | A centered panel, at most 32 rem wide |
| fullscreen | `fullscreen` | The panel fills the viewport |
| scrollable | `scrollable` | The backdrop scrolls when the content is taller than the screen |

The close button is a themed `UButton`. Pass `:close="{ color: 'primary', variant: 'ghost' }"` so it takes the brand ghost look (BR-11). Never use the `solid` neutral look, which would paint a light fill and break BR-03.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Open and at rest: the dimmed backdrop, and the black panel with the pink outline and pink dividers. | `overlay.bg`, `overlay.highlight`, `overlay.divider`, `overlay.scrim`, `overlay.scrimOpacity`, `radius.overlay`, `border.width.overlay` |

Closed, the modal renders nothing. It is not a control, so it has no hover, focus-visible, active, or disabled state of its own. The buttons inside it show their own states, and the opening button is a [Button](../atoms/button.md). The matrix shows the real dialog, open and drawn inside its cell, so the baseline keeps it in frame. The close button shows the yellow focus ring in the baseline, because focus moves into the panel when it opens (ADR-0009).

## Usage rules

### When to use

- Use a modal to confirm an action, or to ask for one short thing that must be answered before going on.
- Always give it a `title`, and a `description` when the title alone is not enough.
- Put the main action first in the footer, and the cancel action after it.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never open a modal from another modal.
- Never use a modal for content people may want to keep reading beside the page. Use [Slideover](slideover.md).
- Never use it for a message that needs no answer. Use a toast or an inline alert.
- Never write a color, radius, width, or z-index literally on a modal. Read the tokens (REQ-016).
- Never add a glow to the panel. The glow belongs to buttons (BR-10).
- Never rebuild a dialog by hand. Nuxt UI provides it (ER-01, REQ-020 AC3).
- Never open a [Toast](../molecules/toast.md) while a modal is open. The toast sits above the modal in the bottom-right corner and can cover its actions (ADR-0054, ADR-0060).
- Never rely on the page behind the modal for context. At 85% it is nearly invisible, which is the owner's choice (ADR-0054, ADR-0060).

## Do and don't

| Do | Don't |
|---|---|
| Name the action in the title: "Confirmar lugar". | Title it "Aviso" or leave it empty. |
| Keep the body to one or two sentences and one control. | Put a long form in it. |
| Let Escape and the close button always work, unless losing the content would hurt. | Block closing with no way out. |
| Return focus to the button that opened it. Nuxt UI does this. | Move focus to the top of the page on close. |

## Accessibility

- The panel has `role="dialog"`. Its accessible name is the title (`aria-labelledby`), and its description is linked with `aria-describedby`. Without a title, Nuxt UI adds an empty hidden one, which assistive technology reads as an unnamed dialog, so always pass `title`.
- Focus moves into the panel when it opens, and is trapped there: Tab and Shift+Tab cycle through the panel only.
- Escape closes the panel and returns focus to the control that opened it.
- The page behind is switched off while the panel is open. It is hidden from assistive technology (`aria-hidden="true"`), its controls cannot be reached by Tab, and clicks on it hit the backdrop. This is what "inert" means here: Reka UI does it with `aria-hidden` and a focus trap, not with the HTML `inert` attribute.
- Text is 4.5:1 or more against the fill, and the pink outline is 8.37:1, so the boundary is perceivable (REQ-015, WCAG 1.4.11).
- The opening fade and scale stop under `prefers-reduced-motion: reduce`.

Keyboard map:

| Key | Action |
|---|---|
| `Tab` | Moves focus to the next control in the panel, and from the last one to the first |
| `Shift+Tab` | Moves focus to the previous control in the panel, and from the first one to the last |
| `Escape` | Closes the panel and returns focus to the opening control. It does nothing when `dismissible` is false |
| `Enter` or `Space` | Activates the focused button, including the close button |

ARIA: `role="dialog"`, `aria-labelledby` (the title), `aria-describedby` (the description). While it is open, the page behind has `aria-hidden="true"`.

## Content

- Write the title as a verb phrase or a noun phrase of two to five words.
- Write the description as one short sentence, in sentence case.
- Write footer actions as verbs: "Confirmar", "Cancelar".

```copy es-MX
Confirmar lugar
Te guardamos una mesa para cuatro personas.
Confirmar
Cancelar
```

```copy-bad es-MX
AVISO!!!
¿Está seguro de que desea continuar con la operación solicitada?
Aceptar
```

## Responsive behavior

The panel is the viewport width minus one rem of margin on each side, up to a maximum width, and it is centered at 360, 768, and 1280 px (A-09). A tall body scrolls inside the panel, and the page behind never scrolls. Nothing causes horizontal overflow (REQ-028 AC1).

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UModal` |
| Props used | `title`, `description`, `dismissible`, `close`, `fullscreen`, `scrollable` |
| Slots used | default (the trigger), `body`, `footer` |
| Theme | `ui.modal.slots` in `packages/nuxt/app.config.ts` and the `.cn-overlay-*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `overlay.*`, `radius.overlay`, `border.width.overlay`, `effect.scrim.opacity` |
| Demos | `apps/showcase/demos/modal/` |

```vue
<UModal title="Confirmar lugar" description="Te guardamos una mesa para cuatro personas." :close="{ color: 'primary', variant: 'ghost' }">
  <UButton label="Apartar lugar" />
  <template #body>Trae tus dados y tu mazo favorito.</template>
  <template #footer="{ close }">
    <UButton label="Confirmar" @click="close" />
  </template>
</UModal>
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: `UModal` themed with the pink outline look, the component tokens, and the demos (T8.5) — ADR-0029
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Approved as stable by the owner, with every point of the draft callouts decided. No value or rule changes — ADR-0060
