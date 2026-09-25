<!-- Fixture: deliberate REQ-016 violations. Every flagged value is listed in tests/lint-rules.test.ts. -->
<!-- The values are arbitrary test data, not brand values. -->
<script setup lang="ts">
const accent = '#123456'
const shadow = `0 0 12px rgb(1, 2, 3)`
</script>

<template>
  <div class="p-[4px] bg-[hsl(1,2%,3%)]" style="width: 10rem" :style="{ transitionDuration: '150ms', color: accent }">
    <span :data-shadow="shadow" />
  </div>
</template>

<style scoped>
.fixture {
  border-radius: 6px;
  margin: -0.5rem;
}
</style>
