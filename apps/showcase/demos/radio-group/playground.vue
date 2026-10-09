<script setup lang="ts">
// The playground of the radio group. The controls in controls.ts set these props.
withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    orientation?: 'vertical' | 'horizontal'
    disabled?: boolean
  }>(),
  { size: 'md', orientation: 'vertical', disabled: false },
)
const items = [
  { label: 'Cartas', value: 'cartas' },
  { label: 'Juegos de mesa', value: 'juegos' },
  { label: 'Figuras', value: 'figuras' },
]
</script>

<template>
  <div class="p-6">
    <URadioGroup
      id="radio-group-playground"
      legend="Categoría"
      :items="items"
      :size="size"
      :orientation="orientation"
      :disabled="disabled"
      loop
    />
  </div>
</template>
