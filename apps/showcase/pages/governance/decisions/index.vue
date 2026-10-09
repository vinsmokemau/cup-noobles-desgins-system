<script setup lang="ts">
// T5.4 (SPEC.md §4.6): the ADR index. The decision log (T11.2) will link the same pages.
import { useAsyncData, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { DECISIONS_ROUTE, type DocEntry } from '../../../lib/doc-routes'

useSeoMeta({ title: 'Decision records' })

const adrs = (useRuntimeConfig().public.docs as DocEntry[]).filter((doc) => doc.route.startsWith(`${DECISIONS_ROUTE}/`))
const { data: pages } = await useAsyncData('index:decisions', () =>
  queryCollection('docs').where('layer', '=', 'adr').all(),
)
const cards = adrs.map((adr) => ({ ...adr, page: pages.value?.find((p) => p.path === adr.path) }))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-highlighted">Decision records</h1>
    <UPageGrid class="mt-6">
      <UPageCard v-for="card in cards" :key="card.route" :title="card.page?.title ?? card.route" :to="card.route">
        <template #footer>
          <StatusBadge :status="card.page?.status" />
        </template>
      </UPageCard>
    </UPageGrid>
  </div>
</template>
