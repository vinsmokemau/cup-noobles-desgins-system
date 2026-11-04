<script setup lang="ts">
// The state matrix of the radio group (REQ-026 AC2). Each cell shows a group of three radios in one state. A radio group
// cannot take `data-cn-state` on one radio, so the cell's wrapper carries it and the first radio shows hover or
// focus-visible, which a static page cannot reach by itself; the real pseudo-classes are covered by the keyboard and pointer
// tests. The disabled cell has the first radio selected, so it shows a disabled checked and a disabled unchecked radio.
// The `touch-target` cell shows `size="2xl"` (ADR-0070): every row is at least 44 px tall, in the storefront's cases (short labels in
// a horizontal group, and a sold-out label). Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'checked', 'disabled', 'touch-target'] as const
const forced: string[] = ['hover', 'focus-visible']
const touchItems = [
  { label: 'M', value: 'm' },
  { label: 'L', value: 'l' },
  { label: 'negro', value: 'negro' },
  { label: 'blanco · Agotado', value: 'blanco', disabled: true },
]
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
        <URadioGroup
          v-if="state === 'touch-target'"
          id="radio-group-touch-target"
          legend="Talla"
          size="2xl"
          orientation="horizontal"
          :items="touchItems"
          default-value="m"
          loop
        />
        <div v-else :data-cn-state="forced.includes(state) ? state : undefined">
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
