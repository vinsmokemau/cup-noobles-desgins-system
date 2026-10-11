<script setup lang="ts">
// The state matrix of the tabs (REQ-026 AC2). Each cell shows one tab list of three tabs. `data-cn-state` on the cell forces
// hover and focus-visible on the second tab, which a static page cannot reach by itself; the real pseudo-classes and the arrow
// keys are covered by the keyboard and pointer tests. The `selected` cell selects the second tab, and the `disabled` cell
// disables the third. Copy is es-MX and has no domain content (REQ-022).
const states = ['default', 'hover', 'focus-visible', 'selected', 'disabled'] as const
const forced: string[] = ['hover', 'focus-visible']
const itemsOf = (state: string) => [
  { label: 'Reglas', value: 'reglas' },
  { label: 'Mesas', value: 'mesas' },
  { label: 'Torneos', value: 'torneos', disabled: state === 'disabled' },
]
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" :data-cn-state="forced.includes(state) ? state : undefined" class="p-6">
        <UTabs
          :items="itemsOf(state)"
          :default-value="state === 'selected' ? 'mesas' : 'reglas'"
          :content="false"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>
