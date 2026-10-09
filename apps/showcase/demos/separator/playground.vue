<script setup lang="ts">
// The playground of the separator. The controls in controls.ts set these props. A vertical line needs a parent with a height,
// so the vertical case sits in a row of fixed height.
withDefaults(defineProps<{ orientation?: 'horizontal' | 'vertical'; label?: string; decorative?: boolean }>(), {
  orientation: 'horizontal',
  label: '',
  decorative: false,
})
</script>

<template>
  <div class="p-6">
    <div v-if="orientation === 'horizontal'" class="flex flex-col gap-4 text-sm">
      <p>Envíos</p>
      <USeparator :label="label || undefined" :decorative="decorative" />
      <p>Pagos</p>
    </div>
    <div v-else class="flex h-8 items-center gap-4 text-sm">
      <span>Cartas</span>
      <USeparator orientation="vertical" :label="label || undefined" :decorative="decorative" />
      <span>Juegos de mesa</span>
    </div>
  </div>
</template>
