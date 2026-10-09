<script setup lang="ts">
// T5.4: `/foundations`, `/patterns`, and the other section indexes (SPEC.md §4.6). `/components` is also the inventory
// doc, which is shown above the cards. DocIndex rejects any other first segment, so an unknown path is a 404.
import { useRoute, useRuntimeConfig } from 'nuxt/app'
import type { DocEntry } from '../../lib/doc-routes'

const route = useRoute()
const hasDoc = (useRuntimeConfig().public.docs as DocEntry[]).some((doc) => doc.route === route.path)
</script>

<template>
  <div>
    <DocView v-if="hasDoc" class="mb-8" />
    <DocIndex>
      <UButton
        v-if="route.path === '/governance'"
        to="/governance/decisions"
        label="Decision records"
        variant="outline"
      />
    </DocIndex>
  </div>
</template>
