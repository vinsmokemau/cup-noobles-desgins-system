<script setup lang="ts">
// The state matrix of the sparkle (REQ-026 AC2). A sparkle is decorative and not interactive, so it has no hover, focus,
// active, or disabled state. It has two: `default`, which is still, and `animated`, which fades slowly. The fade stops under
// reduced motion (REQ-029 AC2). The motif artwork is not supplied (TBD-18), so each cell shows the placeholder. A sparkle is
// hidden from assistive technology and holds no focusable element (REQ-029 AC1).
const states = ['default', 'animated'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex items-center gap-6 p-6">
        <CnSparkle :animated="state === 'animated'" />
      </div>
    </div>
  </div>
</template>
