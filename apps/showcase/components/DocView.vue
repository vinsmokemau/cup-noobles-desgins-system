<script setup lang="ts">
// T5.4: renders the doc behind the current route (REQ-051, REQ-052 AC1): a status banner (REQ-057 AC1), the Markdown
// body, and an on-page table of contents (SPEC.md §4.6). Generated blocks stay plain tables until P6.
import { computed } from 'vue'
import { createError, useAsyncData, useRoute, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { FIXED_TITLES, rewriteDocLinks, type DocEntry } from '../lib/doc-routes'

const BANNERS: Record<string, string> = {
  tbd: 'This doc has no content yet. Its sections are placeholders.',
  draft: 'This doc is a draft. The owner has not approved it, and it can still change.',
  deprecated: 'This doc is deprecated. Do not use it for new work.',
}

const route = useRoute()
const docs = useRuntimeConfig().public.docs as DocEntry[]
const path = route.path.length > 1 ? route.path.replace(/\/$/, '') : route.path
const entry = docs.find((doc) => doc.route === path)
if (!entry) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: page } = await useAsyncData(`doc:${entry.route}`, async () => {
  const found = await queryCollection('docs').path(entry.path).first()
  // Docs link each other by file; the site needs routes.
  if (found) rewriteDocLinks(found.body.value, entry.file, docs)
  return found
})
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({ title: FIXED_TITLES[entry.file] ?? page.value.title })

const banner = computed(() => (page.value?.status ? BANNERS[page.value.status] : undefined))
const toc = computed(() => page.value?.body.toc?.links ?? [])
const isEmail = entry.route.startsWith('/email/')
</script>

<template>
  <div v-if="page" class="lg:flex lg:gap-8" :data-doc-source="`docs/${entry.file}`">
    <article class="min-w-0 flex-1">
      <UAlert
        v-if="banner"
        class="mb-4"
        color="neutral"
        variant="outline"
        :title="`Status: ${page.status}`"
        :description="banner"
        data-testid="status-banner"
      />
      <ContentRenderer :value="page" />
      <PendingNotice v-if="isEmail" class="mt-8" task="T10.5" />
    </article>
    <aside v-if="toc.length > 0" aria-label="On this page" class="lg:w-64 lg:shrink-0">
      <UContentToc title="On this page" :links="toc" />
    </aside>
  </div>
</template>
