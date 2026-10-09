<script setup lang="ts">
// The state matrix of the radio group (REQ-026 AC2). Each cell shows a group of three radios in one state. A radio group
// cannot take `data-cn-state` on one radio, so the cell's wrapper carries it and the first radio shows hover or
// focus-visible, which a static page cannot reach by itself; the real pseudo-classes are covered by the keyboard and pointer
// tests. The disabled cell has the first radio selected, so it shows a disabled checked and a disabled unchecked radio.
// Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'checked', 'disabled'] as const
const forced: string[] = ['hover', 'focus-visible']
const items = [
  { label: 'Cartas', value: 'cartas' },
  { label: 'Juegos de mesa', value: 'juegos' },
  { label: 'Figuras', value: 'figuras' },
]
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6">
        <div :data-cn-state="forced.includes(state) ? state : undefined">
          <URadioGroup
            :id="`radio-group-${state}`"
            legend="Categoría"
            :items="items"
            :default-value="state === 'checked' || state === 'disabled' ? 'cartas' : undefined"
            :disabled="state === 'disabled'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
