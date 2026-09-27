# Cup Noobles Design System

This is the entry point to the Cup Noobles Design System (REQ-001). Every doc is linked below, grouped by layer. Every future Cup Noobles project follows these docs. [SPEC.md](SPEC.md) is the contract the system is built from.

Each doc's frontmatter `status` says how far along it is: `tbd`, `draft`, `stable`, or `deprecated`.

## Overview

- [Principles](docs/00-overview/principles.md): the principles that guide every design decision.
- [Brand identity](docs/00-overview/brand-identity.md): logos, lockups, clear space, and an overview of the motifs.
- [Using the system](docs/00-overview/using-the-system.md): how to install and consume the packages, and how to read these docs.
- [Glossary](docs/00-overview/glossary.md): the terms used across the system.
- [Brand context source](docs/00-overview/brand-context-source.md): the owner's brand context document, verbatim and hash-locked.

## Foundations

- [Color](docs/01-foundations/color.md): the brand colors, their roles, and the contrast rules.
- [Typography](docs/01-foundations/typography.md): typefaces and the type hierarchy.
- [Spacing](docs/01-foundations/spacing.md): the spacing scale.
- [Shape](docs/01-foundations/shape.md): corner radius and line work.
- [Effects](docs/01-foundations/effects.md): glow, elevation, z-index, and focus.
- [Motion](docs/01-foundations/motion.md): durations, easing, and reduced motion.
- [Layout](docs/01-foundations/layout.md): breakpoints and containers.
- [Iconography](docs/01-foundations/iconography.md): the icon set and how to use it.
- [Imagery and motifs](docs/01-foundations/imagery-and-motifs.md): decorative motifs, photography, and thumbnails.
- [Accessibility](docs/01-foundations/accessibility.md): the accessibility target and how the system meets it.

## Components

- [Component inventory](docs/02-components/inventory.md): a generated table of every component.

### Atoms

- [Button](docs/02-components/atoms/button.md): triggers an action.
- [Link](docs/02-components/atoms/link.md): navigates to another page or location.
- [Icon](docs/02-components/atoms/icon.md): shows a symbol from the icon set.
- [Badge](docs/02-components/atoms/badge.md): a short label, including the tag badge on media cards.
- [Input](docs/02-components/atoms/input.md): single-line text entry.
- [Textarea](docs/02-components/atoms/textarea.md): multi-line text entry.
- [Select](docs/02-components/atoms/select.md): picks one option from a list.
- [Checkbox](docs/02-components/atoms/checkbox.md): turns one option on or off.
- [Radio group](docs/02-components/atoms/radio-group.md): picks exactly one option from a set.
- [Switch](docs/02-components/atoms/switch.md): turns a setting on or off.
- [Progress](docs/02-components/atoms/progress.md): shows how far a task has progressed.
- [Skeleton](docs/02-components/atoms/skeleton.md): a placeholder shown while content loads.
- [Separator](docs/02-components/atoms/separator.md): divides content into groups.
- [Logo](docs/02-components/atoms/logo.md): the brand icon, lockup, and wordmark (custom).
- [Sparkle](docs/02-components/atoms/sparkle.md): the decorative sparkle and star motif (custom).
- [Sticker frame](docs/02-components/atoms/sticker-frame.md): a sticker-style border that wraps content (custom).

### Molecules

- [Form field](docs/02-components/molecules/form-field.md): a form control with its label, help text, and error message.
- [Card](docs/02-components/molecules/card.md): the standard content card.
- [Media card](docs/02-components/molecules/media-card.md): the featured media card with a thumbnail, title, and tag badges (custom).
- [Alert](docs/02-components/molecules/alert.md): an inline feedback message.
- [Toast](docs/02-components/molecules/toast.md): a brief feedback message that appears and goes away.
- [Tooltip](docs/02-components/molecules/tooltip.md): a short hint shown on hover or focus.
- [Tabs](docs/02-components/molecules/tabs.md): switches between views of related content.
- [Breadcrumb](docs/02-components/molecules/breadcrumb.md): shows where the current page sits in a hierarchy.
- [Pagination](docs/02-components/molecules/pagination.md): moves between pages of results.

### Organisms

- [Modal](docs/02-components/organisms/modal.md): a dialog over the page.
- [Slideover](docs/02-components/organisms/slideover.md): a panel that slides in from the edge of the screen.
- [Site header](docs/02-components/organisms/site-header.md): the page header, with logo, navigation, and action slots.
- [Site footer](docs/02-components/organisms/site-footer.md): the page footer.

## Patterns

- [Forms](docs/03-patterns/forms.md): how forms are laid out, validated, and submitted.
- [Feedback](docs/03-patterns/feedback.md): how the system reports success, warnings, errors, and information.
- [Loading](docs/03-patterns/loading.md): what people see while content loads.
- [Navigation](docs/03-patterns/navigation.md): how people move between pages and sections.
- [Empty states](docs/03-patterns/empty-states.md): what to show when there is no content yet.
- [Error pages](docs/03-patterns/error-pages.md): the 404 page and other error pages.
- [Responsive behavior](docs/03-patterns/responsive-behavior.md): how layouts adapt from 360 px wide upward.

## Content

- [Voice and tone](docs/04-content/voice-and-tone.md): how the brand sounds.
- [Microcopy](docs/04-content/microcopy.md): labels, buttons, messages, and other short UI text.
- [Formatting](docs/04-content/formatting.md): numbers, currency, and dates in es-MX.

## Email

- [Email foundations](docs/05-email/email-foundations.md): email-safe foundations and their fallbacks.
- [Email components](docs/05-email/email-components.md): the MJML components and their slots.
- [Email layouts](docs/05-email/email-layouts.md): the reference email layout.

## Governance

- [Ownership](docs/06-governance/ownership.md): who owns the system and makes decisions.
- [Versioning and releases](docs/06-governance/versioning-and-releases.md): how versions are numbered and released.
- [Contribution](docs/06-governance/contribution.md): how changes are proposed and made, spec first.
- [Deprecation](docs/06-governance/deprecation.md): how parts of the system are deprecated and removed.
- [Decision log](docs/06-governance/decision-log.md): the index of every architecture decision record (ADR).
