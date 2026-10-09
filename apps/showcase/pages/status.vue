<script setup lang="ts">
// T5.4 (SPEC.md §4.6): the page exists; the dashboard is T6.4 (REQ-057 AC2).
import { useSeoMeta } from 'nuxt/app'

useSeoMeta({ title: 'Status' })
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold text-highlighted">Status</h1>
    <PendingNotice task="T6.4" />
  </div>
</template>
