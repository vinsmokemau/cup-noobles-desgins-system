<script setup lang="ts">
// T15.16 (DSR-13): the root is CnApp, so Nuxt UI's built-in text is Spanish. `?locale=en` gives it the English locale, which
// the end-to-end tests use to show that a consumer can still choose another language.
import { en } from '#ui/locale'

const route = useRoute()
const locale = computed(() => (route.query.locale === 'en' ? en : undefined))
</script>

<template>
  <CnApp :locale="locale">
    <NuxtPage />
  </CnApp>
</template>
