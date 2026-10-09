<script setup lang="ts">
// T5.4: renders the doc behind the current route (REQ-051, REQ-052 AC1): a status banner (REQ-057 AC1), the Markdown
// body, and an on-page table of contents (SPEC.md §4.6). Generated blocks stay plain tables; the token previews of
// P6 follow the body (T6.2: color, T6.3: the other foundations).
import { computed } from 'vue'
import { createError, useAsyncData, useRoute, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import flat from '../../../packages/tokens/dist/json/tokens.flat.json'
import { FIXED_TITLES, rewriteDocLinks, type DocEntry } from '../lib/doc-routes'
import type { FlatToken } from '../lib/token-filter'
import { toPreviews } from '../lib/token-preview'
import { demoControls, demoSource } from '../lib/demo-registry'
import { PLAYGROUND_DEMO, PLAYGROUND_HEADING, splitAfterSections, STATES_DEMO, STATES_HEADING } from '../lib/demos'

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
const hasColorPreviews = entry.file === '01-foundations/color.md'
// T6.3: the other foundation docs get the previews their generated blocks name (SPEC.md §4.5, mechanic 2).
const previewPrefixes = (useRuntimeConfig().public.previewBlocks as Record<string, string[]>)[entry.file] ?? []
const hasTokenPreviews = toPreviews(flat as unknown as Record<string, FlatToken>, previewPrefixes).length > 0
// The previews follow the body, so their heading joins the contents (the id is ColorPreviews' heading id).
const toc = computed(() => [
  ...(page.value?.body.toc?.links ?? []),
  ...(hasColorPreviews ? [{ id: 'color-previews', depth: 2, text: 'Color previews' }] : []),
  ...(hasTokenPreviews ? [{ id: 'token-previews', depth: 2, text: 'Token previews' }] : []),
])
const isEmail = entry.route.startsWith('/email/')

// T7.1 (REQ-055): a component doc that lists demos in its frontmatter gets the state matrix after "States" and the
// playground after "Code reference" (SPEC.md §4.5, mechanic 3). The body is cut at the end of those sections.
const demoNames = page.value.demos ?? []
const hasStates = demoNames.includes(STATES_DEMO)
const hasPlayground = demoNames.includes(PLAYGROUND_DEMO)
const { data: demoData } = await useAsyncData(`demos:${entry.route}`, async () => {
  const slug = page.value!.slug!
  return {
    states: hasStates ? await demoSource(slug, STATES_DEMO) : '',
    playground: hasPlayground ? await demoSource(slug, PLAYGROUND_DEMO) : '',
    controls: hasPlayground ? await demoControls(slug) : [],
  }
})
const segments = computed(() => {
  const current = page.value!
  if (!hasStates && !hasPlayground) return [{ page: current, panels: [] as string[] }]
  return splitAfterSections(current.body.value, [STATES_HEADING, PLAYGROUND_HEADING]).map((segment) => ({
    page: { ...current, body: { ...current.body, value: segment.nodes } },
    panels: segment.panels,
  }))
})
</script>

<template>
  <div v-if="page" class="lg:flex lg:gap-8" :data-doc-source="`docs/${entry.file}`">
    <!-- An unbroken string in inline code (a path, a URL) wraps instead of pushing the page wider (REQ-061 AC1). -->
    <article class="min-w-0 flex-1 [&_:not(pre)>code]:wrap-anywhere">
      <UAlert
        v-if="banner"
        class="mb-4"
        color="neutral"
        variant="outline"
        :title="`Status: ${page.status}`"
        :description="banner"
        data-testid="status-banner"
      />
      <template v-for="(segment, index) in segments" :key="index">
        <ContentRenderer :value="segment.page" />
        <StateMatrix
          v-if="hasStates && segment.panels.includes(STATES_HEADING)"
          :slug="page.slug!"
          :source="demoData!.states"
        />
        <Playground
          v-if="hasPlayground && segment.panels.includes(PLAYGROUND_HEADING)"
          :slug="page.slug!"
          :controls="demoData!.controls"
          :source="demoData!.playground"
        />
      </template>
      <ColorPreviews v-if="hasColorPreviews" />
      <TokenPreviews v-if="hasTokenPreviews" :prefixes="previewPrefixes" />
      <PendingNotice v-if="isEmail" class="mt-8" task="T10.5" />
    </article>
    <aside v-if="toc.length > 0" aria-label="On this page" class="lg:w-64 lg:shrink-0">
      <!-- The toc's default negative margins pull it past the page padding, which overflows from sm up (REQ-061 AC1). -->
      <UContentToc class="mx-0 sm:mx-0" title="On this page" :links="toc" />
    </aside>
  </div>
</template>
