---
title: Component inventory
slug: inventory
layer: overview
status: draft
lang: en
brandRules: []
tbd: []
related: [button, logo, media-card, modal, site-header]
since: 0.1.0
updated: 2026-10-10
---

# Component inventory

## Purpose

The inventory lists every component in the system, with its level, its source, its implementation, and its status (REQ-020, §4.10). A component is either a themed Nuxt UI component (`source: nuxt-ui`) or a custom `Cn*` component built only where Nuxt UI has no equivalent (`source: custom`). Its single source is the frontmatter of the component docs, so the table below is generated and never edited by hand (SPEC.md §4.5).

### Components

<!-- cn:generated format="inventory" -->

| Component | Level | Source | Implementation | Status | Open TBD items |
|---|---|---|---|---|---|
| [Badge](atoms/badge.md) | atom | nuxt-ui | `UBadge` | draft | TBD-10, TBD-11 |
| [Button](atoms/button.md) | atom | nuxt-ui | `UButton` | draft | TBD-08, TBD-10, TBD-11, TBD-12 |
| [Checkbox](atoms/checkbox.md) | atom | nuxt-ui | `UCheckbox` | draft | TBD-05, TBD-10, TBD-11 |
| [Icon](atoms/icon.md) | atom | nuxt-ui | `UIcon` | draft | — |
| [Input](atoms/input.md) | atom | nuxt-ui | `UInput` | draft | TBD-04, TBD-05, TBD-07, TBD-10, TBD-11 |
| [Link](atoms/link.md) | atom | nuxt-ui | `ULink` | draft | TBD-08 |
| [Logo](atoms/logo.md) | atom | custom | `CnLogo` | stable | — |
| [Progress](atoms/progress.md) | atom | nuxt-ui | `UProgress` | draft | TBD-05, TBD-11 |
| [Radio group](atoms/radio-group.md) | atom | nuxt-ui | `URadioGroup` | draft | TBD-05, TBD-10, TBD-11 |
| [Select](atoms/select.md) | atom | nuxt-ui | `USelect` | draft | TBD-04, TBD-05, TBD-06, TBD-07, TBD-10, TBD-11 |
| [Separator](atoms/separator.md) | atom | nuxt-ui | `USeparator` | draft | TBD-05, TBD-11 |
| [Skeleton](atoms/skeleton.md) | atom | nuxt-ui | `USkeleton` | draft | TBD-05, TBD-10, TBD-11, TBD-14 |
| [Sparkle](atoms/sparkle.md) | atom | custom | `CnSparkle` | draft | TBD-14 |
| [Sticker frame](atoms/sticker-frame.md) | atom | custom | `CnStickerFrame` | stable | — |
| [Switch](atoms/switch.md) | atom | nuxt-ui | `USwitch` | draft | TBD-05, TBD-10, TBD-11 |
| [Textarea](atoms/textarea.md) | atom | nuxt-ui | `UTextarea` | draft | TBD-04, TBD-05, TBD-07, TBD-10, TBD-11 |
| [Alert](molecules/alert.md) | molecule | nuxt-ui | `UAlert` | draft | TBD-04, TBD-05, TBD-07, TBD-10, TBD-11 |
| [Breadcrumb](molecules/breadcrumb.md) | molecule | nuxt-ui | `UBreadcrumb` | draft | TBD-04, TBD-05, TBD-08 |
| [Card](molecules/card.md) | molecule | nuxt-ui | `UCard` | draft | TBD-04, TBD-05, TBD-06, TBD-10, TBD-11 |
| [Form field](molecules/form-field.md) | molecule | nuxt-ui | `UFormField` | draft | TBD-04, TBD-05, TBD-07 |
| [Media card](molecules/media-card.md) | molecule | custom | `CnMediaCard` | draft | TBD-04, TBD-06, TBD-10, TBD-11, TBD-20 |
| [Pagination](molecules/pagination.md) | molecule | nuxt-ui | `UPagination` | draft | TBD-04, TBD-05, TBD-10, TBD-11 |
| [Tabs](molecules/tabs.md) | molecule | nuxt-ui | `UTabs` | draft | TBD-04, TBD-05, TBD-11 |
| [Toast](molecules/toast.md) | molecule | nuxt-ui | `UToast` | draft | TBD-04, TBD-05, TBD-07, TBD-10, TBD-11, TBD-14, TBD-15 |
| [Tooltip](molecules/tooltip.md) | molecule | nuxt-ui | `UTooltip` | draft | TBD-04, TBD-10, TBD-11, TBD-14 |
| [Modal](organisms/modal.md) | organism | nuxt-ui | `UModal` | draft | TBD-04, TBD-05, TBD-10, TBD-11, TBD-15 |
| [Site footer](organisms/site-footer.md) | organism | nuxt-ui | `UFooter` | draft | TBD-04, TBD-11 |
| [Site header](organisms/site-header.md) | organism | nuxt-ui | `UHeader` | draft | TBD-04, TBD-11 |
| [Slideover](organisms/slideover.md) | organism | nuxt-ui | `USlideover` | draft | TBD-04, TBD-05, TBD-10, TBD-11, TBD-15 |

<!-- /cn:generated -->

## Usage rules

### When to use

- Use the inventory to find out which component exists before you build or request a new one.
- Use the `Source` column to tell a themed Nuxt UI component from a custom `Cn*` component. Both are documented the same way.
- Use the `Status` column to see how far a component's doc has progressed: `tbd`, `draft`, `stable`, or `deprecated`.

### When not to use

- Do not edit the table. Change the frontmatter of the component's doc, then run `pnpm sync:docs`.
- Do not use the inventory to look up a component's rules. Open the component's doc.
- Do not expect commerce components here. The system is project-agnostic, and a storefront builds its own from these parts (C-02).

## Open items

The `Open TBD items` column lists the TBD items each component still depends on. The full register is in SPEC.md §2.4, and `/status` in the showcase lists the open ones.

## Changelog

- 0.1.0 — First version: the generated table of every component doc, in the `inventory` format of `sync:docs` (T8.7) — awaiting owner approval
