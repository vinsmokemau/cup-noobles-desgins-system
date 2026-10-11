---
title: "ADR-0034: Navigation, empty-states, error-pages, and responsive-behavior patterns"
slug: adr-0034-navigation-empty-error-responsive-patterns
layer: adr
status: stable
lang: en
brandRules: [BR-05, BR-06, BR-13, BR-15]
tbd: []
related: [navigation, empty-states, error-pages, responsive-behavior, adr-0031-forms-feedback-loading-patterns, adr-0033-first-docs-stable]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0034: Navigation, empty-states, error-pages, and responsive-behavior patterns

## Context

The brand context says nothing about how navigation, empty states, error pages, or responsive layouts behave. It asks for a premium, never childish brand (BR-05), a legible and high-contrast UI (BR-06), thick clean line work (BR-13), and a system that works on mobile and on web layouts (BR-15). T9.2 wrote four pattern docs by composing the component docs and WCAG 2.2, and marked each one as a draft because no source approved its rules (REQ-009 AC1). The owner reviewed the four rule sets on a visual page.

## Decision

The owner approved all four rule sets in chat, 2026-10-11 ("A. Approve all four rule sets.").

1. **Navigation.** The site header holds the main sections, a breadcrumb shows the path, tabs switch views of one page, and pagination moves through a long list. The same links appear, in the same order, in the bar and in the mobile menu. The current page is marked with `aria-current="page"` and a visible style.
2. **Empty states.** An empty state says why there is nothing and offers one primary action at most. The kinds are first use, no results, cleared, and not available. It sits where the content would be, inside the same card.
3. **Error pages.** An error page has four parts in order: the status code, a title in the page's `h1`, one sentence that says what to do, and one primary action. It shows no technical detail and never blames the person. The showcase 404 is built from it.
4. **Responsive behavior.** Layouts are designed at 360 px first, and described and tested at 360, 768, and 1280 px. Nothing scrolls sideways. A card grid goes from one column to two to three. A wide table scrolls inside its own focusable region.
5. **Not decided here.** The breakpoint and container widths stay placeholders (TBD-13).

## Consequences

- `navigation.md`, `empty-states.md`, and `error-pages.md` move to `stable`, drop their `Draft` callout, and cite this ADR in their changelog.
- `responsive-behavior.md` drops its `Draft` callout and cites this ADR, but stays `draft` because its TBD-13 callout is open (REQ-037 AC1). It moves to `stable` when the owner resolves TBD-13.
- Changing a rule takes a new ADR that supersedes this one.
