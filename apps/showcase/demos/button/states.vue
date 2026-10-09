<script setup lang="ts">
// The state matrix of the button (REQ-023 AC4, REQ-026 AC2). Each cell shows the three brand variants in one state.
// `data-cn-state` forces hover, active, and focus-visible, which a static page cannot reach by itself; the real
// pseudo-classes are covered by the keyboard and pointer tests. Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'active', 'disabled', 'loading'] as const
const brands = [
  { label: 'Continuar', color: 'primary', variant: 'solid' },
  { label: 'Volver', color: 'secondary', variant: 'solid' },
  { label: 'Cancelar', color: 'primary', variant: 'ghost' },
] as const
const forced: string[] = ['hover', 'active', 'focus-visible']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-wrap gap-4 p-6">
        <UButton
          v-for="brand in brands"
          :key="brand.label"
          :label="brand.label"
          :color="brand.color"
          :variant="brand.variant"
          :disabled="state === 'disabled'"
          :loading="state === 'loading'"
          :aria-busy="state === 'loading' ? 'true' : undefined"
          :data-cn-state="forced.includes(state) ? state : undefined"
        />
      </div>
    </div>
  </div>
</template>
