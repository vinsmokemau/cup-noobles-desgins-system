<script setup lang="ts">
// T9.2 (REQ-035 AC2): the error page of the error-pages pattern. The showcase 404 (error.vue) and the composed demo of the
// pattern both render this one component, so the 404 is built from the pattern and not beside it. It has four parts, in
// this order: the status code, a title in a real `h1` that says what happened, one sentence that says what to do, and one
// primary action. It never shows technical details. The action is a link when `to` is passed, and a button that emits
// `action` otherwise (the 404 clears the Nuxt error and goes home). All text arrives through props (A-11).
defineProps<{
  status: number | string
  title: string
  message: string
  actionLabel: string
  to?: string
}>()
defineEmits<{ action: [] }>()
</script>

<template>
  <div class="px-4 py-12 flex flex-col items-center gap-4 text-center" data-testid="error-page">
    <p class="text-sm font-semibold text-primary" data-testid="error-status">{{ status }}</p>
    <h1 class="text-3xl font-bold text-highlighted">{{ title }}</h1>
    <p class="max-w-md text-muted">{{ message }}</p>
    <UButton v-if="to" :to="to" color="primary" variant="solid" size="lg" :label="actionLabel" />
    <UButton v-else color="primary" variant="solid" size="lg" :label="actionLabel" @click="$emit('action')" />
  </div>
</template>
