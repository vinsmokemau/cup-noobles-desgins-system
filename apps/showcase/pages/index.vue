<script setup lang="ts">
// T6.5 (REQ-062 AC1, REQ-052, SPEC.md §4.6): the home page. Each number has one source and the app keeps no count of
// its own: the version is the layer package's (nuxt.config.ts), the tokens are tokens.flat.json, the components are
// the component docs' frontmatter, and the open TBD items are reports/tbd-report.json (`pnpm check:tbd`).
import { useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import flat from '../../../packages/tokens/dist/json/tokens.flat.json'
import report from '../../../reports/tbd-report.json'
import type { NavSection } from '../lib/design-nav'
import { componentCount, layerCards, type DocMeta } from '../lib/home'

useSeoMeta({ title: 'Home' })

const config = useRuntimeConfig().public
const metas = config.docMeta as DocMeta[]
const cards = layerCards(metas, config.nav as NavSection[])

const counts = [
  { id: 'version', label: 'Package version', value: `v${config.version as string}` },
  { id: 'tokens', label: 'Tokens', value: String(Object.keys(flat).length) },
  { id: 'components', label: 'Components', value: String(componentCount(metas)) },
  { id: 'open-tbd', label: 'Open TBD items', value: String(report.summary.openItems), to: '/status' },
]
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-highlighted">Cup Noobles Design System</h1>
      <p class="text-muted">
        The brand rules, tokens, and components for every Cup Noobles project. Pick a doc from the menu.
      </p>
    </div>

    <section aria-labelledby="home-counts" class="space-y-4">
      <h2 id="home-counts" class="text-xl font-bold text-highlighted">At a glance</h2>
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="count in counts" :key="count.id" class="rounded-md border border-default p-4">
          <dt class="text-sm text-muted">{{ count.label }}</dt>
          <dd class="text-2xl font-bold text-highlighted" :data-testid="`home-${count.id}`">{{ count.value }}</dd>
          <dd v-if="count.to" class="text-sm">
            <NuxtLink :to="count.to" class="underline">See what is open</NuxtLink>
          </dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="home-layers" class="space-y-4">
      <h2 id="home-layers" class="text-xl font-bold text-highlighted">Layers</h2>
      <UPageGrid>
        <UPageCard v-for="card in cards" :key="card.to" :title="card.title" :to="card.to" data-testid="layer-card">
          <template #footer>
            <div class="flex flex-wrap gap-2">
              <UBadge :label="`${card.docs} docs`" color="neutral" variant="subtle" />
              <UBadge
                v-for="(total, status) in card.statuses"
                :key="status"
                :label="`${total} ${status}`"
                color="neutral"
                variant="outline"
                data-testid="layer-status"
              />
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </section>
  </div>
</template>
