<script setup lang="ts">
// The state matrix of the badge (REQ-026 AC2). A badge shows information and cannot be hovered, pressed, focused, or
// disabled, so it has one state. The cell shows the three brand variants (BR-12) in two sizes. The icon is an example,
// not a chosen set (TBD-19). Copy is es-MX.
const states = ['default'] as const
const brands = [
  { label: 'Nuevo', color: 'primary', variant: 'solid' },
  { label: 'Preventa', color: 'primary', variant: 'outline' },
  { label: 'Juegos de mesa', color: 'secondary', variant: 'solid' },
] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-wrap items-center gap-4 p-6">
        <UBadge
          v-for="brand in brands"
          :key="brand.label"
          :label="brand.label"
          :color="brand.color"
          :variant="brand.variant"
        />
        <UBadge
          v-for="brand in brands"
          :key="`${brand.label}-lg`"
          :label="brand.label"
          :color="brand.color"
          :variant="brand.variant"
          size="lg"
        />
        <UBadge label="Con ícono" color="primary" variant="solid" leading-icon="i-lucide-star" />
      </div>
    </div>
  </div>
</template>
