---
title: App
slug: app
layer: component
level: organism
source: custom
component: CnApp
status: stable
lang: en
brandRules: []
tokens: []
demos: [states, playground]
tbd: []
related: [modal, slideover, toast, alert, using-the-system, accessibility]
since: 1.8.0
updated: 2026-11-04
---

# App

## Purpose

`CnApp` is the root of a Cup Noobles app. It wraps Nuxt UI's `UApp` and gives the built-in text of Nuxt UI a Spanish default (ER-04, DSR-13). Nuxt UI writes some text itself, such as the name of the close button of a modal, a slideover, a toast, and an alert. It reads that text from the `locale` prop of `UApp`, and it uses English when no locale is set. A page in `<CnApp>` announces "Cerrar", and a page in `<UApp>` announces "Close".

**Why custom:** the component starts from Nuxt UI's `UApp`, which has no way to set a default language: `UApp` provides the locale itself, so an app-level or module-level default is hidden (ADR-0071). `CnApp` wraps `UApp` only to set `es` unless the app gives another locale. It adds no markup, no style, and no copy of its own.

## Anatomy

1. **app**: `UApp`, with the locale set. It provides the toaster, the tooltip provider, the overlay provider, and the portal target, as `UApp` always does.
2. **content**: the default slot, which is the page or the layout around it.

`CnApp` renders nothing else. It has no element, no class, and no style of its own.

## Tokens and specs

Not applicable.

## Variants

| Variant | Props | What changes |
|---|---|---|
| Spanish (default) | none | The built-in text of Nuxt UI is the Nuxt UI `es` locale. |
| Another language | `locale` | The built-in text is that locale. Import it from `#ui/locale`, such as `en`. |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The built-in text is Spanish. | None |
| `english` | The built-in text is English, because the app gave the `en` locale. | None |

`CnApp` is not interactive and draws nothing, so it has no hover, focus-visible, active, disabled, loading, or error state. The state matrix on the component page lists the text that each locale gives to the close button of the alert, the modal, the slideover, and the toast, read from the locales themselves. A demo page cannot show two languages at once, because the language is one setting for the whole app. The component has no pixels of its own, so it has no visual baseline.

## Usage rules

### When to use

- Render `<CnApp>` once, at the root of the app, in place of `<UApp>`. In a Nuxt app that is `app.vue`:

  ```vue
  <template>
    <CnApp>
      <NuxtPage />
    </CnApp>
  </template>
  ```

- Pass the other `UApp` props to `CnApp` as you would to `UApp`: `toaster`, `tooltip`, `portal`, `dir`, `scrollBody`, and `nonce`.
- To use another language, give `locale` a Nuxt UI locale: `import { en } from '#ui/locale'` and `<CnApp :locale="en">`. The `#ui` alias comes with the layer, so the app needs no `@nuxt/ui` dependency of its own.
- Use `CnApp` for the error page too (`error.vue`), which has its own root.

### When not to use

- Never keep `<UApp>` at the root of an app that uses the system. The layer does not change `UApp`, so the labels stay English and nothing reports it. Search the app for `<UApp` after the upgrade.
- Never expect two languages in one app. Nuxt UI shares one locale across the whole app on the client, so a second `CnApp` inside the first does not change the text of the controls inside it. Set the language once, at the root.
- Never write a label to hide a missing locale, such as `:close="{ 'aria-label': 'Cerrar' }"`. It copies text into the app and drifts from the locale. Fix the root instead.
- Never add copy to `CnApp` (A-11). The text is the Nuxt UI locale, and the app's own text comes through props and slots.

## Do and don't

| Do | Don't |
|---|---|
| Render one `CnApp` at the root. | Keep `UApp` and set `locale` on it by hand in every app. |
| Pass another language through `locale`. | Wrap the app twice to change a label. |
| Write the app's own text in es-MX through props and slots. | Expect the locale to translate the app's own text. It translates only Nuxt UI's built-in text. |

## Accessibility

- The built-in text is part of the accessible name of controls, such as the close button of a dialog, so it must match the page language (WCAG 3.1.2, language of parts). `CnApp` makes it Spanish on an es-MX page. The app still sets the language of the page itself, with `lang` on `<html>`.
- `CnApp` adds no element, no role, and no `aria-*` attribute, and it takes no focus.
- The locale also sets the reading direction (`dir`) of the app. The Spanish locale is left to right.
- Keyboard map: not applicable, because `CnApp` is not interactive. The controls inside it keep their own keyboard behavior.
- Verified in a browser on the consumer fixture, at 360, 768, and 1280 px with axe: the close buttons of an alert, a modal, a slideover, and a toast are announced "Cerrar", and the same page with the English locale (`?locale=en` in the fixture) announces "Close".

### What the Spanish locale covers

The Nuxt UI `es` locale (version 4.11.2) translates all 74 built-in messages of the English locale, and none stays English. The messages the system uses are:

| Built-in text | English | Spanish |
|---|---|---|
| Alert, modal, slideover, toast, and drawer: close button | Close | Cerrar |
| Header: open and close the menu | Open menu · Close menu | Abrir menú · Cerrar menú |
| Carousel: previous, next, and the dots | Previous · Next | Anterior · Siguiente |
| Error page: clear the error | Back to home | Volver al inicio |

Messages for components the system does not use, such as the calendar and the command palette, are in the same locale. A new Nuxt UI release can add or change messages, and a test fails when the covered list changes.

## Content

- `CnApp` has no copy. The Spanish text is Nuxt UI's `es` locale. If a message reads wrong for the brand voice, report it to the owner instead of overriding it in an app.
- The app's own text follows [Voice and tone](../../04-content/voice-and-tone.md) and is es-MX.

## Responsive behavior

`CnApp` draws nothing, so it has no layout at any width. The controls inside it are responsive as their own docs say.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnApp` (`packages/nuxt/components/CnApp.vue`) |
| Theme | None |
| Tokens | None |
| Demos | `apps/showcase/demos/app/` |

| Prop | Type | Notes |
|---|---|---|
| `locale` | Nuxt UI locale | Optional. The Nuxt UI `es` locale when it is not set. |

Every other `UApp` prop falls through to `UApp`.

| Slot | Notes |
|---|---|
| `default` | The app: the page, or the layout around it. |

```vue
<script setup lang="ts">
import { en } from '#ui/locale'
</script>

<template>
  <CnApp :locale="en">
    <NuxtPage />
  </CnApp>
</template>
```

## Open items

Not applicable.

## Changelog

- 1.8.0 — First version: `CnApp`, `UApp` with the Nuxt UI `es` locale as its default and a `locale` prop to override it — DSR-13, T15.16, ADR-0071
