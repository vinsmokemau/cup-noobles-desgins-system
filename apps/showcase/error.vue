<script setup lang="ts">
// T5.4 (SPEC.md §4.6): the 404 page, built from the design system itself (Nuxt UI's UError inside the app layout).
// The static build writes it as 404.html, which a static host serves for any unknown path.
import { useSeoMeta, type NuxtError } from 'nuxt/app'

defineProps<{ error: NuxtError }>()

// A page needs a title (WCAG 2.4.2); the error page has none of its own.
useSeoMeta({ title: 'Page not found' })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <!-- The layout already provides the main region. -->
      <UError as="div" :error="error" />
    </NuxtLayout>
  </UApp>
</template>
