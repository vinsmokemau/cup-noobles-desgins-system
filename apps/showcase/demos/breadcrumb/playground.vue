<script setup lang="ts">
import { computed } from 'vue'
// The playground of the breadcrumb. The controls in controls.ts set these props. `current` is the label of the last item,
// the current page, which is not a link.
const props = withDefaults(
  defineProps<{
    current?: string
  }>(),
  { current: 'Dados' },
)
const items = computed(() => [
  { label: 'Inicio', to: '#inicio' },
  { label: 'Juegos', to: '#juegos' },
  { label: props.current, active: true },
])
</script>

<template>
  <div class="p-6">
    <UBreadcrumb :items="items" />
  </div>
</template>
