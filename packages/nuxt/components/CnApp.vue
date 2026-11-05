<script setup lang="ts">
// CnApp (T15.16, DSR-13): the root of an app, `UApp` with Spanish as its default language. Nuxt UI reads the text of its
// built-in controls (the close button of a modal, a slideover, a toast, and an alert, and more) from the `locale` prop of
// `UApp`, and falls back to English when it is not set. `UApp` hides an app-level default, so the layer wraps it (ADR-0071).
//
// It wraps a Nuxt UI component, so it is custom only for the default (REQ-020 AC2). It holds no text of its own (A-11): the
// labels are the `es` locale that Nuxt UI ships, and the `locale` prop sets another locale. Every other `UApp` prop (`toaster`,
// `tooltip`, `portal`, `dir`, `scrollBody`, `nonce`) falls through to `UApp`, and the default slot is the app.
import { es } from '@nuxt/ui/locale'
import type { AppProps } from '@nuxt/ui'

withDefaults(
  defineProps<{
    /** The Nuxt UI locale for the built-in text. Spanish (`es`) when it is not set. Import another from `@nuxt/ui/locale`. */
    locale?: AppProps['locale']
  }>(),
  { locale: () => es },
)
defineSlots<{
  /** The app: usually the page, or the layout around it. */
  default?(): unknown
}>()
</script>

<template>
  <UApp :locale="locale">
    <slot />
  </UApp>
</template>
