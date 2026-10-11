---
title: "ADR-0035: Breakpoints and container width"
slug: adr-0035-breakpoints-and-container
layer: adr
status: stable
lang: en
brandRules: [BR-15]
tbd: []
related: [adr-0006-placeholder-values, adr-0034-navigation-empty-error-responsive-patterns, layout, responsive-behavior, navigation]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0035: Breakpoints and container width

## Context

The brand context asks that the system works on mobile and on web and dashboard layouts (BR-15), and gives no width for either. The breakpoints and the container width (TBD-13) were placeholders from ADR-0006, copied from Tailwind and Nuxt UI. The owner is not a designer, so three options were shown on a visual page with a live width slider and measured checks: A keeps the current values, B adds a 480 px step and a 1152 px container, and C keeps the steps and widens the container to 1536 px. The recommendation was A.

## Decision

The owner chose A in chat, 2026-10-11 ("A"). The values are the owner's choice for an open item. None of them is a brand value from the brand context.

| Token | Value | Pixels |
|---|---|---|
| `breakpoint.sm` | `40rem` | 640 |
| `breakpoint.md` | `48rem` | 768 |
| `breakpoint.lg` | `64rem` | 1024 |
| `breakpoint.xl` | `80rem` | 1280 |
| `breakpoint.xxl` | `96rem` | 1536 |
| `container.max`, `layout.container.max` | `80rem` | 1280 |

1. **Why these.** 768 and 1280 px, two of the three reference viewports (A-09), sit exactly on `breakpoint.md` and `breakpoint.xl`, so each test width gets its own layout: one, two, and three card columns at 360, 768, and 1280 px. They match what Nuxt UI is built for, so no component needs a recheck.
2. **What changes at each step.** The site header shows its links in the bar from `breakpoint.lg`, and below it the links are in the slideover. A card grid goes to two columns at `breakpoint.md` and to three at `breakpoint.lg`.
3. **Fixed widths stay.** The 360 px minimum (ER-05) and the reference viewports (A-09) do not depend on this decision.
4. **Not decided here.** The surface colors (TBD-06), the shade scales (TBD-08), the radius (TBD-10), the glow (TBD-12), and the elevation and z-index (TBD-15) stay placeholders.

## Consequences

- The primitive tokens `breakpoint.*` and `container.max`, and the semantic token `layout.container.max`, become `stable` and name this ADR as their source. The `placeholder.breakpoint.*` and `placeholder.container.max` tokens are removed.
- The TBD-13 row of the register is marked `Resolved (ADR-0035)`, and the TBD callouts that cited it are removed.
- `responsive-behavior.md` moves to `stable`, as ADR-0034 said it would. `layout.md` has no open item left, but it stays a draft until the owner approves its rules as a whole (REQ-009 AC2).
- Changing a value takes a new ADR that supersedes this one.
