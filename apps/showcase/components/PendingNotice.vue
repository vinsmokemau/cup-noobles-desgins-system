<script setup lang="ts">
// T5.4: marks a showcase page whose content a later task writes (SPEC.md §4.4, "content pending").
defineProps<{ task: string }>()
</script>

<template>
  <UAlert
    color="neutral"
    variant="outline"
    title="Content pending"
    :description="`This page is written in ${task}.`"
    data-testid="pending-notice"
  />
</template>
