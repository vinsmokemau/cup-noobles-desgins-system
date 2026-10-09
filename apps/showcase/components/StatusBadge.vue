<script setup lang="ts">
// T5.4 (REQ-057 AC1): a doc's status as a badge. No feedback colors exist yet (TBD-07), so every status uses a neutral
// outline, and the word itself carries the meaning.
defineProps<{ status: string | null | undefined }>()
</script>

<template>
  <UBadge v-if="status" :label="status" color="neutral" variant="outline" data-testid="status-badge" />
</template>
