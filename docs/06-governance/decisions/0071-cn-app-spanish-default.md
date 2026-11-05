---
title: "ADR-0071: CnApp gives the built-in text of Nuxt UI a Spanish default"
slug: adr-0071-cn-app-spanish-default
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [app, using-the-system, slideover, modal, toast, alert]
since: 1.8.0
updated: 2026-11-04
---

# ADR-0071: CnApp gives the built-in text of Nuxt UI a Spanish default

## Context

The storefront (DSR-13, ER-04, es-MX) found that its built-in Nuxt UI text is English. The close button of a slideover is announced as "Close", and so are the close buttons of a modal, a toast, and an alert. Nuxt UI 4.11.2 reads these labels from the `locale` prop of `UApp`, and falls back to English when it is not set. It has no module option for a default, because `UApp` provides the locale itself and so hides an app-level one.

The storefront cannot fix it: `ButtonProps` takes no `aria-label`, a custom `#close` slot would copy the design system's styling (CR-27), and a direct `@nuxt/ui` dependency breaks its own pin rule.

The owner chose how to reach a Spanish default on 2026-11-04, after a comparison page of three options:

- **A. `CnApp`**, a small component that wraps `UApp` with `es` as the default and a `locale` prop to override it.
- **B.** The layer replaces `UApp`, so every `<UApp>` is Spanish with no change in the consumer.
- **C.** The layer only re-exports the `es` locale, and each consumer passes it to `UApp`.

## Decision

1. **`CnApp` is a custom component that wraps `UApp`.** It sets the Nuxt UI `es` locale unless the `locale` prop gives another one. Every other `UApp` prop falls through to `UApp`, and the default slot is the app (option A, the owner's choice).
2. **It holds no copy.** The labels are the `es` locale that Nuxt UI ships (A-11). The component has no text node, and its names (`CnApp`, `locale`) use no forbidden domain term (REQ-022 AC1).
3. **A consumer can choose another language.** `<CnApp :locale="en">`, with `en` imported from `#ui/locale` (the alias that Nuxt UI adds, so the app needs no `@nuxt/ui` dependency), shows English. The locale is the Nuxt UI one, so any of its locales works. The language is one setting for the whole app: Nuxt UI shares its locale on the client, so a nested `CnApp` does not change the text inside it (found in a real browser).
4. **It replaces `UApp` in the consuming app.** An app that keeps `<UApp>` stays English, because the layer does not change `UApp`. The docs say so, and the consumer fixture and the showcase render `CnApp`, so an app that follows the docs is Spanish.
5. **It adds no brand value.** There is no token, color, size, or motion. No TBD item is opened.

## Consequences

- A new doc, `docs/02-components/organisms/app.md`, with `source: custom` and a "Why custom" paragraph (REQ-020 AC2). SPEC.md 1.62 lists it, with the owner's approval in chat.
- `using-the-system.md` says how a consuming app turns it on: replace `<UApp>` with `<CnApp>` in `app.vue`.
- The storefront changes one tag in `app.vue`. It adds no `@nuxt/ui` dependency and no styling.
- The silent failure is an app that keeps `<UApp>`: nothing breaks, and the labels stay English. The consumer fixture test and the docs guard against it. A consumer can also find it by looking for `UApp` in its `app.vue`.
- A new Nuxt UI release can add or change labels in the `es` locale. The showcase page lists the built-in text it covers, and a test fails when the covered list changes.
- The showcase keeps its own chrome in English, because its docs are English (ER-10): it renders `<CnApp :locale="en">`.
