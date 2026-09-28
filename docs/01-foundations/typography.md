---
title: Typography
slug: typography
layer: foundation
status: draft
lang: en
brandRules: [BR-07, BR-08, BR-09]
tokens: [font]
tbd: [TBD-01, TBD-02, TBD-03]
related: [color, accessibility, brand-identity, email-foundations]
since: 0.1.0
updated: 2026-09-27
---

# Typography

## Purpose

This doc defines how Cup Noobles sets type: the brand's typographic character, the five-level hierarchy, and the criteria a typeface must meet before the owner adopts it. It implements BR-07, BR-08, and BR-09. The typefaces and the type scale are not defined yet (TBD-01, TBD-02, and TBD-03), so every font token holds an ADR-0006 placeholder that is not a brand value.

## Tokens and specs

<!-- cn:generated tokens="font" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `font.body.family` | `--cn-font-body-family` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-02) |
| `font.body.letterSpacing` | `--cn-font-body-letter-spacing` | `0em` | tbd (TBD-03) |
| `font.body.lineHeight` | `--cn-font-body-line-height` | `1.75rem` | tbd (TBD-03) |
| `font.body.size` | `--cn-font-body-size` | `1rem` | tbd (TBD-03) |
| `font.body.weight` | `--cn-font-body-weight` | `400` | tbd (TBD-03) |
| `font.caption.family` | `--cn-font-caption-family` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-02) |
| `font.caption.letterSpacing` | `--cn-font-caption-letter-spacing` | `0em` | tbd (TBD-03) |
| `font.caption.lineHeight` | `--cn-font-caption-line-height` | `1.25rem` | tbd (TBD-03) |
| `font.caption.size` | `--cn-font-caption-size` | `0.875rem` | tbd (TBD-03) |
| `font.caption.weight` | `--cn-font-caption-weight` | `400` | tbd (TBD-03) |
| `font.family.body` | `--cn-font-family-body` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-02) |
| `font.family.display` | `--cn-font-family-display` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-01) |
| `font.h1.family` | `--cn-font-h1-family` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-01) |
| `font.h1.letterSpacing` | `--cn-font-h1-letter-spacing` | `0em` | tbd (TBD-03) |
| `font.h1.lineHeight` | `--cn-font-h1-line-height` | `2.5rem` | tbd (TBD-03) |
| `font.h1.size` | `--cn-font-h1-size` | `2.25rem` | tbd (TBD-03) |
| `font.h1.weight` | `--cn-font-h1-weight` | `700` | tbd (TBD-03) |
| `font.h2.family` | `--cn-font-h2-family` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-01) |
| `font.h2.letterSpacing` | `--cn-font-h2-letter-spacing` | `0em` | tbd (TBD-03) |
| `font.h2.lineHeight` | `--cn-font-h2-line-height` | `2rem` | tbd (TBD-03) |
| `font.h2.size` | `--cn-font-h2-size` | `1.5rem` | tbd (TBD-03) |
| `font.h2.weight` | `--cn-font-h2-weight` | `700` | tbd (TBD-03) |
| `font.h3.family` | `--cn-font-h3-family` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | tbd (TBD-01) |
| `font.h3.letterSpacing` | `--cn-font-h3-letter-spacing` | `0em` | tbd (TBD-03) |
| `font.h3.lineHeight` | `--cn-font-h3-line-height` | `1.75rem` | tbd (TBD-03) |
| `font.h3.size` | `--cn-font-h3-size` | `1.25rem` | tbd (TBD-03) |
| `font.h3.weight` | `--cn-font-h3-weight` | `700` | tbd (TBD-03) |
| `font.letterSpacing.body` | `--cn-font-letter-spacing-body` | `0em` | tbd (TBD-03) |
| `font.letterSpacing.caption` | `--cn-font-letter-spacing-caption` | `0em` | tbd (TBD-03) |
| `font.letterSpacing.h1` | `--cn-font-letter-spacing-h1` | `0em` | tbd (TBD-03) |
| `font.letterSpacing.h2` | `--cn-font-letter-spacing-h2` | `0em` | tbd (TBD-03) |
| `font.letterSpacing.h3` | `--cn-font-letter-spacing-h3` | `0em` | tbd (TBD-03) |
| `font.lineHeight.body` | `--cn-font-line-height-body` | `1.75rem` | tbd (TBD-03) |
| `font.lineHeight.caption` | `--cn-font-line-height-caption` | `1.25rem` | tbd (TBD-03) |
| `font.lineHeight.h1` | `--cn-font-line-height-h1` | `2.5rem` | tbd (TBD-03) |
| `font.lineHeight.h2` | `--cn-font-line-height-h2` | `2rem` | tbd (TBD-03) |
| `font.lineHeight.h3` | `--cn-font-line-height-h3` | `1.75rem` | tbd (TBD-03) |
| `font.size.body` | `--cn-font-size-body` | `1rem` | tbd (TBD-03) |
| `font.size.caption` | `--cn-font-size-caption` | `0.875rem` | tbd (TBD-03) |
| `font.size.h1` | `--cn-font-size-h1` | `2.25rem` | tbd (TBD-03) |
| `font.size.h2` | `--cn-font-size-h2` | `1.5rem` | tbd (TBD-03) |
| `font.size.h3` | `--cn-font-size-h3` | `1.25rem` | tbd (TBD-03) |
| `font.weight.body` | `--cn-font-weight-body` | `400` | tbd (TBD-03) |
| `font.weight.caption` | `--cn-font-weight-caption` | `400` | tbd (TBD-03) |
| `font.weight.h1` | `--cn-font-weight-h1` | `700` | tbd (TBD-03) |
| `font.weight.h2` | `--cn-font-weight-h2` | `700` | tbd (TBD-03) |
| `font.weight.h3` | `--cn-font-weight-h3` | `700` | tbd (TBD-03) |

<!-- /cn:generated -->

Every row above is `tbd`. The family rows hold the ADR-0006 placeholder stack, and the size, line-height, weight, and letter-spacing rows hold ADR-0006 placeholders taken from Nuxt UI and Tailwind defaults. **None of them is a brand value**, and none may be copied into another project. They exist only so the tokens build and the showcase renders.

The primitive tokens (`font.family.*`, `font.size.*`, `font.lineHeight.*`, `font.weight.*`, and `font.letterSpacing.*`) hold the raw values. The semantic tokens (`font.h1.*`, `font.h2.*`, `font.h3.*`, `font.body.*`, and `font.caption.*`) give each hierarchy level its family, size, line height, weight, and letter spacing. Components and apps use the semantic tokens only.

### Brand rules

> **BR-07:** Typography is a bold, retro display sans-serif, similar in feel to the logo. The specific typeface is TBD-01.
>
> **BR-08:** Type hierarchy is H1 → H2/H3 → body → caption.
>
> **BR-09:** Type feels bold, geek, and premium, with strong presence and easy legibility.

### Hierarchy

BR-08 sets five levels. H2 and H3 share a rank in the brand source; they are separate tokens so each can be sized on its own once TBD-03 is resolved.

| Level | Semantic tokens | Family | Role |
|---|---|---|---|
| H1 | `font.h1.*` | Display (`font.family.display`) | The single top heading of a page or view. |
| H2 | `font.h2.*` | Display (`font.family.display`) | Section headings. |
| H3 | `font.h3.*` | Display (`font.family.display`) | Subsection headings. |
| Body | `font.body.*` | Body (`font.family.body`) | Running text, labels, and form input. |
| Caption | `font.caption.*` | Body (`font.family.body`) | Secondary text: helper text, metadata, and fine print. |

The headings use the display family because BR-07 calls for a bold, retro display sans-serif. Whether body and caption use a separate family, or the display family covers them too, is TBD-02.

### Selection criteria

The owner chooses the typefaces (OD-06). A candidate for the display typeface, and for the body typeface if one is needed, must meet every criterion below. The ADR that resolves TBD-01 or TBD-02 records how the chosen typeface meets each one, including its license terms (R-12).

| # | Criterion | How to check it |
|---|---|---|
| 1 | **A bold, retro display sans-serif** that feels similar to the logo (BR-07) and reads as bold, geek, and premium, with strong presence (BR-09). It must never read as childish or generic (BR-05). | Set the H1 to H3 specimens next to the logo assets (TBD-17) and review them with the owner. |
| 2 | **Spanish diacritics.** The family covers every character es-MX copy uses (ER-04), at least `áéíóú ÁÉÍÓÚ ñ Ñ ü Ü ¿ ¡`, in every weight the scale uses, with no fallback glyphs. | Render the showcase specimens, which include `áéíóú ñ ¿¡` (REQ-054 AC2), in every weight. |
| 3 | **A license that covers web embedding**: self-hosting or serving the font files to every consuming app, and the static showcase on GitHub Pages (OD-02). | Read the license text and record it in the ADR. |
| 4 | **Defined email fallback behavior.** Most email clients ignore web fonts (R-05), so the family needs a fallback stack that keeps the hierarchy and legibility when the font does not load, and a license that allows email use if the font is referenced from email. | Record the fallback stack in the ADR and in [Email foundations](../05-email/email-foundations.md) (REQ-040 AC1). |
| 5 | **Legible at body and caption sizes** if it is also the body family (TBD-02), because BR-09 requires easy legibility. | Review the body and caption specimens at 360 px (ER-05). |

## Usage rules

### When to use

- Use the semantic tokens `font.h1.*` through `font.caption.*` for every piece of text. Pick the level by its place in the hierarchy (BR-08), never by the size you want.
- Use the display family for H1, H2, and H3 only (BR-07).
- Use one H1 per page or view, and do not skip heading levels.
- Reference type only through `--cn-font-*` variables or token imports. Never write a font family, size, line height, weight, or letter spacing literally in a component, the showcase, or an app (REQ-016).
- Leave a missing typeface or type-scale value as a `tbd` token with its placeholder until the owner supplies it.

### When not to use

- Never name, load, or suggest a specific typeface. The typefaces are TBD-01 and TBD-02, and only the owner can supply them.
- Never make up a size, line height, weight, or letter spacing. The type scale is TBD-03.
- Never treat the ADR-0006 placeholders as brand values, and never copy them into another project.
- Never set body text or captions in the display family unless TBD-02 confirms that one family covers both.

## Do and don't

| Do | Don't |
|---|---|
| Style a section title with `font.h2.*`. | Style body text with a heading size to make it stand out. |
| Use the display family for headings only. | Set a paragraph in the display family before TBD-02 allows it. |
| Leave the family as a `tbd` token until the owner picks one. | Load a "close enough" retro font from a font service. |
| Check every weight with `áéíóú ñ ¿¡` before a typeface is adopted. | Adopt a typeface that falls back to another font for `ñ`, `¿`, or `¡`. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10). Text contrast follows [Color](color.md): 4.5:1 for text and 3:1 for large text (REQ-015 AC2).
- Headings are real `h1` to `h3` elements in order, so assistive technology can navigate by heading. The visual level and the element level match.
- Sizes are set in `rem`, so text scales with the user's browser setting. Text resized to 200% must not lose content or function (WCAG 1.4.4).
- Layouts must not break when a user overrides line height, paragraph spacing, letter spacing, or word spacing (WCAG 1.4.12). The TBD-03 values are defaults, not limits.
- es-MX pages declare `lang="es-MX"`, so screen readers pronounce the copy correctly (ER-04).

## Responsive behavior

The hierarchy is the same at every viewport. The sizes do not change between viewports until the type scale (TBD-03) and the breakpoints (TBD-13) are defined. Every level must fit and stay legible at 360 px (ER-05), and the reference viewports are 360, 768, and 1280 px (A-09). Long headings wrap; they are never truncated or scaled down to fit.

## Email notes

Email clients do not support `var()`, so email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time with `$cn(font.h1.size)` (REQ-013, §4.9). Web fonts are widely unsupported in email (R-05), so email relies on the fallback stack from selection criterion 4. The stack, and the rule that no MJML default font reaches a component (ADR-0004), are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040 AC1).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/font.json` | The families, sizes, line heights, weights, and letter spacing, all `tbd`. |
| `tokens/semantic/font.json` | The five hierarchy levels: `font.h1` to `font.h3`, `font.body`, and `font.caption`. |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-font-h1-size` (REQ-017). |
| `packages/nuxt/nuxt.config.ts` | Sets `ui.fonts: false`, so Nuxt UI loads no default typeface until TBD-01 is resolved (ADR-0001). |

```css
.example {
  font-family: var(--cn-font-h2-family);
  font-size: var(--cn-font-h2-size);
  line-height: var(--cn-font-h2-line-height);
  font-weight: var(--cn-font-h2-weight);
  letter-spacing: var(--cn-font-h2-letter-spacing);
}
```

## Open items

> **TBD (TBD-01):** The display typeface is not defined: its family, license, and web and email availability. It must match BR-07 and meet the selection criteria above. `font.family.display` holds the ADR-0006 placeholder stack. Owner input needed: a font name and its license (OD-06).
>
> **TBD (TBD-02):** The body typeface is not defined, or the owner confirms that the display family covers body and caption too. `font.family.body` holds the ADR-0006 placeholder stack. Owner input needed: a font name (OD-06).
>
> **TBD (TBD-03):** The type scale is not defined: sizes, line heights, weights, and letter spacing for H1, H2, H3, body, and caption. `font.size.*`, `font.lineHeight.*`, `font.weight.*`, and `font.letterSpacing.*` hold ADR-0006 placeholders. Owner input needed: values, or approval of a proposal.

## Changelog

- 0.1.0 — First draft: BR-07 to BR-09, the hierarchy from BR-08, the typeface selection criteria, and TBD-01 to TBD-03 (T4.3) — awaiting owner approval
