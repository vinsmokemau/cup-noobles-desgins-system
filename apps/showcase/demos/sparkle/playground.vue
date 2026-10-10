<script setup lang="ts">
// The playground of the sparkle. The controls in controls.ts set these props. `animated` fades the sparkle slowly; the fade
// stops under reduced motion (REQ-029 AC2).
withDefaults(defineProps<{ animated?: boolean }>(), { animated: false })
</script>

<template>
  <div class="p-6">
    <CnSparkle :animated="animated" />
  </div>
</template>
