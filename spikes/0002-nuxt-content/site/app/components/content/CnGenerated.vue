<script setup lang="ts">
// Showcase-only renderer for <!-- cn:generated --> blocks. The real one swaps in swatches,
// specimens, and so on per token type (SPEC.md §4.5 mechanic 2).
defineProps<{ tokens: string, format: string }>()
</script>

<template>
  <section data-cn-generated :data-tokens="tokens" :data-format="format">
    <p>Rich preview for <code>{{ tokens }}</code> ({{ format }})</p>
    <slot />
  </section>
</template>
