<!-- Fixture: values REQ-016 allows. cn/no-raw-values must report nothing here. -->
<script setup lang="ts">
const gap = 'var(--cn-space-2)'
const reset = '0px'
const tint = 'rgb(var(--cn-color-brand-primary-rgb) / 50%)'
const anchor = '#main'
</script>

<template>
  <div class="p-0" style="margin: 0" :style="{ gap, padding: reset, color: tint }">
    <a :href="anchor" />
  </div>
</template>

<style scoped>
/* Comments may mention 12px or #123456. */
#abc {
  margin: 0;
  padding: 0rem;
}
@media (min-width: 768px) {
  .fixture {
    gap: var(--cn-space-2);
  }
}
</style>
