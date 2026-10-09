<script setup lang="ts">
// T5.4 (SPEC.md §4.6): the index of a section: one card per doc with its status badge. The order and the labels come
// from DESIGN.md (the sidebar's source); the status comes from each doc's frontmatter.
import { computed } from 'vue'
import { createError, useAsyncData, useRoute, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import type { NavSection } from '../lib/design-nav'
import { INDEX_SECTIONS } from '../lib/doc-routes'

const LAYER_OF_SECTION: Record<string, string> = {
  foundations: 'foundation',
  components: 'component',
  patterns: 'pattern',
  content: 'content',
  email: 'email',
  governance: 'governance',
}

const section = useRoute().path.split('/')[1] ?? ''
if (!INDEX_SECTIONS.includes(section))
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: pages } = await useAsyncData(`index:${section}`, () =>
  queryCollection('docs').where('layer', '=', LAYER_OF_SECTION[section]!).all(),
)

const nav = useRuntimeConfig().public.nav as NavSection[]
// The heading is the section's name in DESIGN.md. The inventory doc supplies its own heading on `/components`.
const title =
  section === 'components'
    ? undefined
    : nav.find((s) => s.groups.some((g) => g.links.some((l) => l.to.startsWith(`/${section}/`))))?.title
if (title) useSeoMeta({ title })

const groups = computed(() => {
  const byRoute = new Map((pages.value ?? []).map((p) => [`/${section}/${p.slug}`, p]))
  return nav
    .flatMap((s) => s.groups)
    .map((group) => ({
      title: group.title,
      cards: group.links
        .filter((link) => link.to.startsWith(`/${section}/`))
        .map((link) => ({ ...link, page: byRoute.get(link.to) })),
    }))
    .filter((group) => group.cards.length > 0)
})
</script>

<template>
  <div class="space-y-8">
    <h1 v-if="title" class="text-2xl font-bold text-highlighted">{{ title }}</h1>
    <section v-for="group in groups" :key="group.title ?? 'all'">
      <h2 v-if="group.title" class="mb-4 text-xl font-bold text-highlighted">{{ group.title }}</h2>
      <UPageGrid>
        <UPageCard v-for="card in group.cards" :key="card.to" :title="card.label" :to="card.to">
          <template #footer>
            <div class="flex gap-2">
              <StatusBadge :status="card.page?.status" />
              <UBadge v-if="card.page?.source" :label="card.page.source" color="neutral" variant="subtle" />
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </section>
    <slot />
  </div>
</template>
