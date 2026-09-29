---
title: Motion
slug: motion
layer: foundation
status: draft
lang: en
brandRules: [BR-14, BR-17]
tokens: [motion]
tbd: [TBD-14]
related: [effects, accessibility, imagery-and-motifs, sparkle]
since: 0.1.0
updated: 2026-09-28
---

# Motion

## Purpose

This doc defines how Cup Noobles UI moves: the durations and easing curves of transitions, and the safety rules every animation follows. Motion can support the feel described in BR-17, and the decorative motifs of BR-14 may animate, but motion is never required to understand the UI. This doc states the documentation part of REQ-029: animations respect reduced motion and never flash more than 3 times per second. The durations and easing curves are not defined yet (TBD-14), so the motion tokens hold ADR-0006 placeholders that are not brand values.

## Tokens and specs

<!-- cn:generated tokens="motion" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `motion.duration.default` | `--cn-motion-duration-default` | `150ms` | tbd (TBD-14) |
| `motion.easing.default` | `--cn-motion-easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | tbd (TBD-14) |

<!-- /cn:generated -->

Every row above is `tbd`. They hold the ADR-0006 placeholders taken from Tailwind's default transition duration and timing function, which Nuxt UI uses for its color transitions. **None of them is a brand value.** They exist only so the tokens build and the showcase renders.

The component tokens that apply motion to a component are added by that component's task.

### Brand rules

> **BR-17:** The overall feel conveys anticipation, hype, energy, gamer/geek identity, visual professionalism, and memorable branding.
>
> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.

The brand context defines no motion values. Whether and how motion expresses BR-17 is part of TBD-14. The motifs are covered in [Imagery and motifs](imagery-and-motifs.md).

### Durations and easing

| Token group | Source | Role |
|---|---|---|
| `motion.duration.default` | Value TBD-14 | How long a transition takes, such as a color change on hover. |
| `motion.easing.default` | Value TBD-14 | The acceleration curve of a transition. |

How many durations and curves the system needs, and which interactions use each, is part of TBD-14.

### Safety rules

These rules come from REQ-029 and apply to every animation, whatever TBD-14 defines.

1. **Reduced motion.** Any animation stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce` (REQ-029 AC2). A state change still happens; only the movement goes.
2. **Flash limit.** Nothing flashes more than 3 times per second (REQ-029 AC3, WCAG SC 2.3.1).
3. **Decorative motifs carry no meaning.** Animated or not, `CnSparkle`, `CnStickerFrame`, and every motif SVG render with `aria-hidden="true"` and contain no focusable element (REQ-029 AC1).

## Usage rules

### When to use

- Use `motion.*` tokens for every transition duration and easing curve.
- Reference motion only through `--cn-motion-*` variables or token imports. Never write a duration or an easing curve literally in a component, the showcase, or an app (REQ-016).
- Wrap every animation in a `prefers-reduced-motion` check, so it stops or becomes static under `reduce` (REQ-029 AC2).
- Keep content usable while an animation runs and after it ends.

### When not to use

- Never let anything flash more than 3 times per second (REQ-029 AC3).
- Never make an animation the only way to show a state or a message.
- Never give a decorative motif meaning, a focusable element, or an accessible name (REQ-029 AC1).
- Never make up a duration or an easing curve. They are TBD-14, and only the owner can supply them.
- Never treat the ADR-0006 placeholders as brand values, and never copy them into another project.

## Do and don't

| Do | Don't |
|---|---|
| Set a hover transition with `motion.duration.*` and `motion.easing.*`. | Type a duration or an easing curve into the component. |
| Show a sparkle as a still image under reduced motion. | Keep a sparkle twinkling when the user asked for reduced motion. |
| Mark an animated sparkle `aria-hidden="true"`. | Give an animated sparkle an accessible name or make it focusable. |
| Keep a pulsing effect well under 3 flashes per second. | Strobe a glow or a motif to build hype. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10).
- **Reduced motion.** Under `prefers-reduced-motion: reduce`, every animation stops or reduces to a non-moving state (REQ-029 AC2). Playwright checks each animated component with reduced motion emulated.
- **Flash limit.** Nothing flashes more than 3 times per second (REQ-029 AC3, WCAG SC 2.3.1). This is a manual check, because flash frequency needs visual review; it is done once per animated component.
- **Decorative motifs.** Motifs render with `aria-hidden="true"` and no focusable element (REQ-029 AC1), so screen readers and keyboard users never meet them.
- An animated glow follows the same rules; the glow itself is covered in [Effects](effects.md).
- Motion never moves focus or content away from where the user is working.

## Responsive behavior

Motion does not change between viewports. The same tokens and safety rules apply at 360, 768, and 1280 px (A-09), and at every breakpoint once TBD-13 is resolved.

## Email notes

Email templates do not animate. Motion tokens are not used in email, and a motif in an email is a static image. The email foundations are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/motion.json` | The duration and easing, both `tbd` (TBD-14). |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-motion-duration-default` (REQ-017). |

```css
.example {
  transition-duration: var(--cn-motion-duration-default);
  transition-timing-function: var(--cn-motion-easing-default);
}

@media (prefers-reduced-motion: reduce) {
  .example {
    transition: none;
    animation: none;
  }
}
```

## Open items

> **TBD (TBD-14):** Motion durations and easing curves are not defined. `motion.duration.default` and `motion.easing.default` hold ADR-0006 placeholders. Owner input needed: values, and whether motion is used to express BR-17.

## Changelog

- 0.1.0 — First draft: BR-14 and BR-17, the duration and easing groups, the REQ-029 reduced-motion, flash-limit, and decorative-motif rules, and TBD-14 (T4.5) — awaiting owner approval
