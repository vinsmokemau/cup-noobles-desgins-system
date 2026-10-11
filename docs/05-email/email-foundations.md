---
title: Email foundations
slug: email-foundations
layer: email
status: draft
lang: en
brandRules: [BR-01, BR-03, BR-06, BR-10, BR-13, BR-16]
tokens: [font.family, color.bg.base, color.brand.black, color.brand.primary, color.text, border.width.button, effect.glow.button, radius.button, radius.card, logo.rule]
tbd: [TBD-01, TBD-03, TBD-10, TBD-12]
related: [typography, color, shape, effects, brand-identity, logo, accessibility, email-components, email-layouts]
since: 0.1.0
updated: 2026-10-11
---

# Email foundations

## Purpose

This doc lists every limitation of email clients that changes how the Cup Noobles brand looks, and says what an email does about each one: the font fallback stack, the glow fallback, radius tolerance, dark-mode inversion, images-off behavior, and the maximum width (REQ-040). It keeps the email faithful to BR-01, BR-03, BR-06, BR-10, BR-13, and BR-16 where a client allows it, and degrades to a legible, on-brand result where it does not. Email values are the resolved literals in `email-tokens.json`, and every fallback below names the token that carries it (REQ-040 AC2). The components are in [Email components](email-components.md), and the layouts are in [Email layouts](email-layouts.md).

## Tokens and specs

The tokens the fallbacks use are generated below. The email build reads them from `dist/email/email-tokens.json` with `$cn(token.path)` (§4.9, REQ-042). Several of them are `tbd`, and their values are ADR-0006 placeholders, not brand values.

<!-- cn:generated tokens="font.family color.bg.base color.brand.black color.brand.primary color.text button.primary.border border.width.button border.width.card effect.glow.button radius.button radius.card logo.rule" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.button` | `--cn-border-width-button` | `3px` | stable |
| `border.width.card` | `--cn-border-width-card` | `3px` | stable |
| `button.primary.border` | `--cn-button-primary-border` | `#ef80ae` | stable |
| `color.bg.base` | `--cn-color-bg-base` | `#000000` | stable |
| `color.brand.black` | `--cn-color-brand-black` | `#000000` | stable |
| `color.brand.primary` | `--cn-color-brand-primary` | `#ef80ae` | stable |
| `color.text.default` | `--cn-color-text-default` | `#f5f5f5` | stable |
| `color.text.disabled` | `--cn-color-text-disabled` | `#5c5c5c` | stable |
| `color.text.inverted` | `--cn-color-text-inverted` | `#000000` | stable |
| `color.text.muted` | `--cn-color-text-muted` | `#bdbdbd` | stable |
| `effect.glow.button` | `--cn-effect-glow-button` | `none` | tbd (TBD-12) |
| `font.family.body` | `--cn-font-family-body` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-02) |
| `font.family.display` | `--cn-font-family-display` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-01) |
| `logo.rule.clearSpace` | `--cn-logo-rule-clear-space` | `0.25` | stable |
| `logo.rule.minHeight.horizontal` | `--cn-logo-rule-min-height-horizontal` | `36px` | stable |
| `logo.rule.minHeight.icon` | `--cn-logo-rule-min-height-icon` | `64px` | stable |
| `logo.rule.minHeight.vertical` | `--cn-logo-rule-min-height-vertical` | `80px` | stable |
| `radius.button` | `--cn-radius-button` | `0.375rem` | tbd (TBD-10) |
| `radius.card` | `--cn-radius-card` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

### Fallback map

Every fallback maps to a token that exists in `email-tokens.json` (REQ-040 AC2). A test checks each token name in the second column.

| Fallback | Token | What the email does |
|---|---|---|
| Font stack, headings | `font.family.display` | Sets the whole stack as the heading font. The client uses the first family it has installed. |
| Font stack, text | `font.family.body` | Sets the whole stack as the text font. |
| Glow replacement | `border.width.button` | Draws a solid border of this width in place of the glow. |
| Glow replacement color | `button.primary.border` | The color of that border on a primary button. |
| Glow off | `effect.glow.button` | Not used in email. The value is `none`, and a `box-shadow` is never emitted. |
| Radius | `radius.button`, `radius.card` | Applied as `border-radius`. A client that ignores it shows square corners. |
| Page background | `color.bg.base` | Set as both the `bgcolor` attribute and the inline `background`. |
| Brand pink | `color.brand.primary` | Fills, borders, and links. Never a text color on a pink fill. |
| Brand black | `color.brand.black` | The label color on pink and yellow fills. |
| Body text | `color.text.default` | Text on the page background. |
| Muted text | `color.text.muted` | Secondary text on the page background. |
| Logo text fallback color | `color.text.default` | The color of the alt text that stands in for the logo when images are off. |
| Logo minimum height | `logo.rule.minHeight.horizontal` | The horizontal wordmark is never rendered shorter than this. |
| Logo clear space | `logo.rule.clearSpace` | The clear space around the wordmark, as a share of its height. |

### Font fallback stack

Most email clients ignore web fonts (R-05), and the build compiles with `fonts: {}` so no web font is ever linked (ADR-0004). The email therefore renders in the first family of the stack that the reader's device has installed.

- Headings use `font.family.display`, and text uses `font.family.body`. The email build injects the whole stack as one value, so the fallback order is the order in the token.
- No MJML default font reaches a component. MJML fills an unset font with its own default, which is not a brand value (ADR-0004), so every component sets `font-family` from a token.
- The type sizes, line heights, and weights come from the `font.*` tokens, so the hierarchy of BR-08 holds in the fallback font too. Heading and text sizes do not change with the font that ends up rendering.
- When the display typeface is chosen, its ADR records the email fallback stack (typography selection criterion 4). That stack must end in the generic `sans-serif` keyword, so a client that has none of the named families still shows a sans-serif.

> **TBD (TBD-01):** The display typeface is not defined, so `font.family.display` holds the ADR-0006 placeholder stack, and the email fallback stack cannot be set to a final value. Owner input needed: a font name and its license (OD-06).
>
> **TBD (TBD-03):** The type scale is not defined, so the `font.*` sizes, line heights, and weights hold ADR-0006 placeholders. Owner input needed: values or approval of a proposal.

### Glow fallback

`box-shadow` is widely unsupported in email clients (R-05), so the neon glow of BR-10 cannot be relied on. The email replaces it with a solid, thick border.

- A button uses a solid border of `border.width.button` in the color `button.primary.border`, instead of a glow. The border is a real `border`, not a shadow, so it renders in every client that renders borders.
- The border takes the outline role of BR-13. The glow was only the accent on top of it, so the thick, high-contrast line work survives without the glow.
- Never emit a `box-shadow`, a `text-shadow`, or a `filter` in an email. `effect.glow.button` is not referenced from email sources.
- Cards and dividers use their component border tokens, for example `border.width.card`, in the same way.

> **TBD (TBD-12):** The glow parameters are not defined, so `effect.glow.button` holds the ADR-0006 placeholder `none`. In email the glow is not used even after TBD-12 is resolved, because the fallback is a solid border. Owner input needed: only if the owner wants a different email treatment.

### Radius tolerance

Outlook's support for `border-radius` is limited (R-05). A client that ignores the radius shows square corners, and the email must look correct either way.

- Apply `radius.button` and `radius.card` as `border-radius`, and let a client that ignores it show square corners. Do not build rounded corners from images or from nested tables.
- Never let a layout, a label, or a boundary depend on a corner being round. The solid border (BR-13) is the boundary in both cases.
- Keep enough padding that a label never touches a corner, round or square.
- Every radius in an email comes from a token. MJML fills an unset radius with its own default, which is not a brand value (ADR-0004).

> **TBD (TBD-10):** The corner radius is not defined, so the `radius.*` tokens hold ADR-0006 placeholders. Owner input needed: values.

### Dark-mode inversion

The system is dark-only (A-02), and its base is the pure black of BR-03, held by `color.bg.base` and `color.brand.black`. Some clients alter colors in dark mode (R-05), so `color.bg.base` (BR-03) and `color.brand.primary` (BR-01) may be shifted. The email never ships a second, light palette.

| Client behavior | What can happen to the brand | What the email does |
|---|---|---|
| The client leaves colors alone | Nothing. | The tokens render as defined. |
| The client lightens a dark background or darkens a light one (partial inversion) | `color.bg.base` can turn dark grey, and `color.brand.primary` can shift in lightness. | Every element sets its background and its text color explicitly and together, so a client that changes one changes the pair. |
| The client inverts every color (full inversion) | The black base can turn light, and the pink can turn dark. | The same pairing, plus the solid border, which keeps a button and a card readable as a shape. |

- Set the background twice: as the `bgcolor` attribute and as an inline `background`. Some clients read only one.
- Never set a text color without the background it sits on, and never rely on a background that an ancestor element sets.
- Never use `color.brand.primary` as text on a pink fill, or yellow on pink (SPEC.md §2.1). A client that shifts either color does not make a failing pair pass.
- Never convey meaning by color alone, so an inverted palette loses no information (see Accessibility).
- The contrast pairs of the primary button, the email's main color pairing, are generated below from the same tokens as the web. They describe the pairs as defined. An inverting client can change them, and the real result is checked in the client (see Open items).

<!-- cn:generated tokens="button.primary.fg button.primary.bg button.primary.border" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `button.primary.fg` (`#000000`) | `button.primary.bg` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.fg` (`#000000`) | `button.primary.bgHover` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.fg` (`#000000`) | `button.primary.bgActive` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Images-off behavior

Many clients block images until the reader allows them. The email must be complete and usable without any image.

- Every `img` has an `alt` attribute. An informative image has alt text that says what a reader needs, in es-MX (ER-04). A decorative image, such as a motif, has an empty `alt` and carries no content.
- The logo is an image (BR-16), so it has a text fallback: the alt text is the words "Cup Noobles", and the `img` sets the display font, the size, and the color from `font.family.display` and `color.text.default`. A client that blocks images shows that text in the logo's place.
- A button is text with a background, never an image, so it works with images off.
- Never put a headline, a date, a code, or a link label only inside an image.
- Set a background color on every cell that an image sits on, from `color.bg.base`, so the reader sees the brand base and not a client's white while images load.
- Never render the horizontal wordmark shorter than `logo.rule.minHeight.horizontal`, and keep `logo.rule.clearSpace` around it (ADR-0016).

### Maximum width

The email body is at most 600 px wide. This is assumption A-08, a widespread email convention, and not a brand rule.

- Set the body to 600 px at most, and let it shrink to the width of the client. The layouts are checked at 320 and 600 px (REQ-043).
- The web breakpoints and container width do not apply to email, and the 360 px minimum of ER-05 is a web rule. The email test widths are 320 and 600 px.
- Never set a fixed width wider than 600 px, and never let a block force horizontal scroll at 320 px.

> **Draft:** `email-tokens.json` has no token for the 600 px maximum width, so the width is written in the email sources as a number from A-08 and not as a `$cn()` reference. Adding a token for it is a token change that needs the owner's approval. This rule awaits owner approval.

## Usage rules

### When to use

- Use the tokens in the fallback map, injected with `$cn(token.path)`, for every color, size, border, and radius in an email (REQ-042).
- Use a solid `border.width.button` border in place of the glow on every button.
- Set a background and a text color together on every element that carries text.
- Give every image an `alt` attribute, and give the logo a text fallback.
- Keep the body at 600 px or less (A-08).
- Keep the copy of an email in es-MX, with every example in a `copy es-MX` block (ER-04, REQ-007).

### When not to use

- Never write a hex color, a font family, a size, or a radius in an MJML source. Reference a token (REQ-042 AC2).
- Never rely on `box-shadow`, a web font, a rounded corner, or an image for meaning.
- Never ship a light palette, a color-scheme toggle, or a second set of colors for dark mode (A-02).
- Never put white text on a pink fill, or yellow on pink (SPEC.md §2.1).
- Never use a backend template tag in an email source. Content slots are `{{ slot_name }}` (REQ-044).
- Never treat an ADR-0006 placeholder as a brand value.

## Accessibility

- The target is WCAG 2.2 level AA (A-10). The email uses the same contrast pairs as the web, from the same tokens. The label on a primary button is black on pink at 8.37:1, from the generated pairs above.
- Every `img` has an `alt` attribute. A decorative image has an empty `alt`.
- The email root sets `lang`, because MJML defaults it to `und` (ADR-0004). The language is es-MX for customer copy (ER-04).
- Never convey meaning by color alone. Pair color with text or an icon image that has alt text.
- Use real text for every link and every button. Link text says where the link goes.
- A text-only counterpart exists for every layout (REQ-043 AC2, see [Email layouts](email-layouts.md)).
- There is no keyboard focus styling to define: email clients do not expose it.

## Code reference

| Where | What |
|---|---|
| `packages/tokens`, `dist/email/email-tokens.json` | The flat map from token path to resolved literal. The only source of email values (REQ-013, §4.9). |
| `packages/email/src/` | The MJML sources, which reference tokens as `$cn(path)`. Built by T10.2. |
| `packages/email/build.ts` | Replaces `$cn(path)` with the literal, and throws on an unknown path (ADR-0004). Built by T10.2. |
| [Email components](email-components.md) | The six components and their `{{ slot_name }}` slots. |
| [Email layouts](email-layouts.md) | The reference layout and its plain-text counterpart. |

The smallest use of a token in an MJML source:

```xml
<mj-button background-color="$cn(button.primary.bg)" color="$cn(button.primary.fg)">
  {{ label }}
</mj-button>
```

## Open items

> **TBD (TBD-01):** The display typeface, and so the final email fallback stack, are not defined. Owner input needed: a font name and its license (OD-06).
>
> **TBD (TBD-03):** The type scale is not defined. Owner input needed: values or approval of a proposal.
>
> **TBD (TBD-10):** The corner radius is not defined. Owner input needed: values.
>
> **TBD (TBD-12):** The glow parameters are not defined. Email uses a solid border in place of the glow in any case. Owner input needed: values.
>
> **Draft:** The dark-mode, images-off, radius, and maximum-width rules above are not sourced from the brand context or an ADR. They rest on R-05 and A-08, and they await owner approval (REQ-037).

Real-client rendering is not verified here. R-05 puts it with the consuming project, and an optional rendering service is a future ADR. Until then, the generated contrast pairs describe the colors as defined, and not as an inverting client shows them.

## Changelog

- 0.1.0 — First draft: the font fallback stack, glow fallback, radius tolerance, dark-mode inversion, images-off behavior, and maximum width, with every fallback mapped to a token (T10.1, REQ-040) — awaiting owner approval
