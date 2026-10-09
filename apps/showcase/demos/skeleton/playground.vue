<script setup lang="ts">
import { computed } from 'vue'

// The playground of the skeleton. The controls in controls.ts set these props: the shape of the placeholder and, for a text
// placeholder, how many lines it has. The group is named once by a `status` wrapper.
const props = withDefaults(defineProps<{ shape?: 'line' | 'block' | 'circle'; lines?: number }>(), {
  shape: 'line',
  lines: 3,
})
const count = computed(() => Math.max(1, Math.round(props.lines)))
</script>

<template>
  <div class="p-6">
    <div role="status" aria-busy="true" aria-label="Cargando contenido" class="flex flex-col gap-2 p-1">
      <template v-if="shape === 'line'">
        <USkeleton v-for="n in count" :key="n" as="span" aria-hidden="true" class="block h-4 w-full" />
      </template>
      <USkeleton v-else-if="shape === 'block'" as="span" aria-hidden="true" class="block h-32 w-full" />
      <USkeleton v-else as="span" aria-hidden="true" class="block size-16 rounded-full" />
    </div>
  </div>
</template>
