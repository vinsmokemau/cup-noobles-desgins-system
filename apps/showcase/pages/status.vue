<script setup lang="ts">
// T6.4 (REQ-057 AC2, SPEC.md §4.6): the status dashboard. The only source is reports/tbd-report.json (written by
// `pnpm check:tbd`, which the `generate` script runs first), imported here, so the app keeps no count of its own.
// Every item links to the docs that carry its callout or to the tokens that stand in for it.
import { useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import report from '../../../reports/tbd-report.json'
import type { DocEntry } from '../lib/doc-routes'
import { docLink, itemRows, pendingTokens, type StatusReport } from '../lib/status'

useSeoMeta({ title: 'Status' })

const data = report as unknown as StatusReport
const docs = useRuntimeConfig().public.docs as DocEntry[]
const s = data.summary
const items = itemRows(data, docs)
const draftDocs = data.drafts.docs.map((doc) => docLink(doc.file, docs))
const derived = pendingTokens(data, 'derived-pending')
const tbdTokens = pendingTokens(data, 'tbd')

const counts = [
  { id: 'open-items', label: 'Open TBD items', value: s.openItems },
  { id: 'tbd-tokens', label: 'TBD tokens', value: s.tokens },
  { id: 'derived-pending-tokens', label: 'Derived-pending tokens', value: s.derivedPendingTokens },
  { id: 'draft-docs', label: 'Draft docs', value: s.draftDocs },
  { id: 'content-pending', label: 'Content-pending callouts', value: s.contentPending },
  { id: 'draft-callouts', label: 'Draft callouts', value: s.draftCallouts },
]
</script>

<template>
  <div class="space-y-8" data-testid="status-dashboard">
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-highlighted">Status</h1>
      <p class="text-muted">
        What is still open in the design system, read from <code>reports/tbd-report.json</code>. A TBD item is a brand
        value nobody has supplied yet; a draft doc is one the owner has not approved.
      </p>
    </div>

    <section aria-labelledby="status-counts" class="space-y-4">
      <h2 id="status-counts" class="text-xl font-bold text-highlighted">Counts</h2>
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="count in counts" :key="count.id" class="rounded-md border border-default p-4">
          <dt class="text-sm text-muted">{{ count.label }}</dt>
          <dd class="text-2xl font-bold text-highlighted" :data-testid="`count-${count.id}`">{{ count.value }}</dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="status-items" class="space-y-4">
      <h2 id="status-items" class="text-xl font-bold text-highlighted">Open TBD items</h2>
      <div
        class="overflow-x-auto rounded-md outline-primary/25 focus-visible:outline-3"
        tabindex="0"
        role="region"
        aria-label="Open TBD items table"
      >
        <table class="w-full border-separate border-spacing-0 text-left text-sm">
          <caption class="sr-only">
            Open TBD items
          </caption>
          <thead>
            <tr>
              <th
                v-for="heading in ['ID', 'Item', 'Docs', 'Tokens']"
                :key="heading"
                scope="col"
                class="border-b border-default px-3 py-2 font-bold text-highlighted"
              >
                {{ heading }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" data-testid="item-row" :data-id="item.id">
              <th scope="row" class="border-b border-default px-3 py-2 align-top font-normal">
                <code>{{ item.id }}</code>
              </th>
              <td class="border-b border-default px-3 py-2 align-top">{{ item.item }}</td>
              <td class="border-b border-default px-3 py-2 align-top">
                <ul v-if="item.docs.length > 0" class="space-y-1">
                  <li v-for="doc in item.docs" :key="doc.file" class="break-all">
                    <NuxtLink :to="doc.to" class="underline" data-testid="item-doc">{{ doc.file }}</NuxtLink>
                  </li>
                </ul>
                <span v-else class="text-muted" data-testid="item-no-doc">No doc names it yet</span>
              </td>
              <td class="border-b border-default px-3 py-2 align-top">
                <details v-if="item.tokens.length > 0">
                  <summary>
                    <span data-testid="item-token-count">{{ item.tokens.length }}</span>
                    {{ item.tokens.length === 1 ? 'token' : 'tokens' }}
                  </summary>
                  <ul class="mt-1 space-y-1">
                    <li v-for="token in item.tokens" :key="token.path" class="break-all">
                      <NuxtLink :to="token.to" class="underline" data-testid="item-token">
                        <code>{{ token.path }}</code>
                      </NuxtLink>
                    </li>
                  </ul>
                </details>
                <span v-else class="text-muted" data-testid="item-no-token">No token uses it yet</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="status-drafts" class="space-y-4">
      <h2 id="status-drafts" class="text-xl font-bold text-highlighted">Draft docs</h2>
      <ul class="space-y-1" data-testid="draft-list">
        <li v-for="doc in draftDocs" :key="doc.file" class="break-all" data-testid="draft-doc">
          <NuxtLink :to="doc.to" class="underline">{{ doc.file }}</NuxtLink>
        </li>
      </ul>
    </section>

    <section aria-labelledby="status-derived" class="space-y-4">
      <h2 id="status-derived" class="text-xl font-bold text-highlighted">Derived-pending tokens</h2>
      <p class="text-muted">
        These hold a stand-in value until the owner decides (SPEC.md C-06). Do not copy them into another project.
      </p>
      <ul class="space-y-1" data-testid="derived-list">
        <li v-for="token in derived" :key="token.path" class="break-all" data-testid="derived-token">
          <NuxtLink :to="token.to" class="underline">
            <code>{{ token.path }}</code>
          </NuxtLink>
          <span class="text-muted"> · {{ token.tbd.join(', ') }}</span>
        </li>
      </ul>
    </section>

    <section v-if="tbdTokens.length > 0" aria-labelledby="status-tbd-tokens" class="space-y-4">
      <h2 id="status-tbd-tokens" class="text-xl font-bold text-highlighted">TBD tokens</h2>
      <ul class="space-y-1" data-testid="tbd-token-list">
        <li v-for="token in tbdTokens" :key="token.path" class="break-all" data-testid="tbd-token">
          <NuxtLink :to="token.to" class="underline">
            <code>{{ token.path }}</code>
          </NuxtLink>
          <span class="text-muted"> · {{ token.tbd.join(', ') }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
