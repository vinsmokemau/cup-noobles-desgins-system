<script setup lang="ts">
// T11.3 (REQ-062 AC2, SPEC.md §4.6): renders CHANGELOG.md. The file's own `# Changelog` is the page heading.
import { createError, useAsyncData, useSeoMeta } from 'nuxt/app'

const { data: page } = await useAsyncData('changelog', () => queryCollection('changelog').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({ title: 'Changelog' })
</script>

<template>
  <!-- An unbroken string in inline code wraps instead of pushing the page wider (REQ-061 AC1). -->
  <article v-if="page" class="min-w-0 [&_:not(pre)>code]:wrap-anywhere" data-testid="changelog">
    <ContentRenderer :value="page" />
  </article>
</template>
