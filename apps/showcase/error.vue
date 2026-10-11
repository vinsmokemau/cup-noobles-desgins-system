<script setup lang="ts">
// T5.4, T9.2 (SPEC.md §4.6): the 404 page, built from the error-pages pattern (docs/03-patterns/error-pages.md) through
// the same ErrorPage component as the pattern's composed demo, inside the app layout. It says what happened, says what to
// do, and offers one action, and it never shows the technical message. The static build writes it as 404.html, which a
// static host serves for any unknown path.
import { computed } from 'vue'
import { clearError, useSeoMeta, type NuxtError } from 'nuxt/app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => (notFound.value ? 'Page not found' : 'Something went wrong'))
const message = computed(() =>
  notFound.value
    ? 'This page does not exist or has moved. Go back to the home page and look for it from there.'
    : 'We could not show this page. Go back to the home page and try again.',
)

// A page needs a title (WCAG 2.4.2); the error page has none of its own.
useSeoMeta({ title })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <!-- The layout already provides the main region. -->
      <ErrorPage
        :status="error.statusCode"
        :title="title"
        :message="message"
        action-label="Back to home"
        @action="clearError({ redirect: '/' })"
      />
    </NuxtLayout>
  </UApp>
</template>
