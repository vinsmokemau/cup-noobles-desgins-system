<script setup lang="ts">
// The state matrix of the breadcrumb (REQ-026 AC2). Every cell shows the same trail: two links and the current page. The
// current page is always the last item, so it is part of every state and not a state of its own. `data-cn-state` on the cell
// forces hover and focus-visible on the first link, which a static page cannot reach by itself; the real pseudo-classes are
// covered by the keyboard and pointer tests. Copy is es-MX and has no domain content (REQ-022).
const states = ['default', 'hover', 'focus-visible'] as const
const forced: string[] = ['hover', 'focus-visible']
const items = [
  { label: 'Inicio', to: '#inicio' },
  { label: 'Juegos', to: '#juegos' },
  { label: 'Dados', active: true },
]
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" :data-cn-state="forced.includes(state) ? state : undefined" class="p-6">
        <UBreadcrumb :items="items" />
      </div>
    </div>
  </div>
</template>
