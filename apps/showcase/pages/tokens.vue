<script setup lang="ts">
// T5.4 (SPEC.md §4.6): the page exists; the token explorer is T6.1 (REQ-053).
import { useSeoMeta } from 'nuxt/app'

useSeoMeta({ title: 'Tokens' })
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold text-highlighted">Tokens</h1>
    <PendingNotice task="T6.1" />
  </div>
</template>
