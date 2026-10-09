<script setup lang="ts">
// T6.1 (REQ-053, SPEC.md §4.6): the token explorer. The only source is packages/tokens dist/json/tokens.flat.json
// (§4.5), imported here, so the app keeps no copy of any token. `pnpm build:tokens` must run before the app is built.
// The copy buttons use text, not icons: the icon set is TBD-19.
import { computed, onMounted, ref } from 'vue'
import { useSeoMeta } from 'nuxt/app'
import flat from '../../../packages/tokens/dist/json/tokens.flat.json'
import { tokenAnchor } from '../lib/status'
import {
  ALL,
  NO_STATUS,
  emptyFilters,
  filterRows,
  groupsOf,
  rawText,
  statusesOf,
  tiersOf,
  toRows,
  type FlatToken,
} from '../lib/token-filter'

useSeoMeta({ title: 'Tokens' })

const rows = toRows(flat as unknown as Record<string, FlatToken>)
const filters = ref(emptyFilters())
const shown = computed(() => filterRows(rows, filters.value))

const options = (label: string, values: string[]) => [
  { label, value: ALL },
  ...values.map((value) => ({ label: value === NO_STATUS ? 'no status' : value, value })),
]
const tierItems = options('All tiers', tiersOf(rows))
const groupItems = options('All groups', groupsOf(rows))
const statusItems = options('All statuses', statusesOf(rows))

// Static pages render before the script runs. Tests wait for this flag so they never type into an inert page.
const ready = ref(false)
onMounted(() => {
  ready.value = true
})

// The last text copied, announced in a live region. The clipboard needs a secure context; a static site on
// GitHub Pages and localhost both are one.
const notice = ref('')
async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text)
    notice.value = `Copied ${what}: ${text}`
  } catch {
    notice.value = `Could not copy ${what}`
  }
}

const reset = () => {
  filters.value = emptyFilters()
}
</script>

<template>
  <div class="space-y-4" data-testid="token-explorer" :data-ready="ready">
    <h1 class="text-2xl font-bold text-highlighted">Tokens</h1>
    <p class="text-muted">
      Every design token, read from <code>tokens.flat.json</code>. Filter by tier, group, or status, or search the text.
    </p>

    <form class="flex flex-wrap items-end gap-4" role="search" aria-label="Filter tokens" @submit.prevent>
      <UFormField label="Search" class="w-full sm:w-72">
        <UInput
          v-model="filters.query"
          type="search"
          placeholder="Path, variable, value, or description"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Tier">
        <USelect v-model="filters.tier" :items="tierItems" class="w-40" />
      </UFormField>
      <UFormField label="Group">
        <USelect v-model="filters.group" :items="groupItems" class="w-40" />
      </UFormField>
      <UFormField label="Status">
        <USelect v-model="filters.status" :items="statusItems" class="w-44" />
      </UFormField>
      <UButton type="button" color="neutral" variant="outline" label="Reset filters" @click="reset" />
    </form>

    <p data-testid="token-count" role="status">
      Showing <strong data-testid="token-shown">{{ shown.length }}</strong> of
      <strong data-testid="token-total">{{ rows.length }}</strong> tokens
    </p>
    <p class="sr-only" role="status" data-testid="copy-notice">{{ notice }}</p>

    <div
      class="overflow-x-auto rounded-md outline-primary/25 focus-visible:outline-3"
      tabindex="0"
      role="region"
      aria-label="Token table"
    >
      <table class="w-full border-separate border-spacing-0 text-left text-sm" data-testid="token-table">
        <caption class="sr-only">
          Design tokens
        </caption>
        <thead>
          <tr>
            <th
              v-for="heading in [
                'Path',
                'CSS variable',
                'Raw value',
                'Resolved value',
                'Tier',
                'Status',
                'Description',
              ]"
              :key="heading"
              scope="col"
              class="border-b border-default px-3 py-2 font-bold text-highlighted"
            >
              {{ heading }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in shown"
            :id="tokenAnchor(row.path)"
            :key="row.path"
            data-testid="token-row"
            :data-path="row.path"
          >
            <th scope="row" class="border-b border-default px-3 py-2 align-top font-normal break-all">
              <code>{{ row.path }}</code>
            </th>
            <td class="border-b border-default px-3 py-2 align-top">
              <code class="break-all" data-testid="css-var">{{ row.cssVar }}</code>
              <UButton
                class="mt-1 block"
                size="sm"
                color="neutral"
                variant="outline"
                label="Copy variable"
                :aria-label="`Copy CSS variable ${row.cssVar}`"
                data-testid="copy-var"
                @click="copy(row.cssVar, 'CSS variable')"
              />
            </td>
            <td class="border-b border-default px-3 py-2 align-top">
              <code class="break-all" data-testid="raw-value">{{ rawText(row.raw) }}</code>
            </td>
            <td class="border-b border-default px-3 py-2 align-top">
              <code class="break-all" data-testid="resolved-value">{{ row.value }}</code>
              <UButton
                class="mt-1 block"
                size="sm"
                color="neutral"
                variant="outline"
                label="Copy value"
                :aria-label="`Copy resolved value of ${row.path}`"
                data-testid="copy-value"
                @click="copy(String(row.value), 'value')"
              />
            </td>
            <td class="border-b border-default px-3 py-2 align-top" data-testid="tier">{{ row.tier }}</td>
            <td class="border-b border-default px-3 py-2 align-top">
              <StatusBadge :status="row.status ?? NO_STATUS" />
              <span v-if="row.tbd" class="mt-1 block text-xs text-muted">{{ row.tbd.join(', ') }}</span>
            </td>
            <td class="border-b border-default px-3 py-2 align-top text-muted">{{ row.description }}</td>
          </tr>
          <tr v-if="shown.length === 0">
            <td colspan="7" class="px-3 py-6 text-center text-muted" data-testid="token-empty">
              No token matches these filters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
