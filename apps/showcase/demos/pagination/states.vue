<script setup lang="ts">
// The state matrix of the pagination (REQ-026 AC2). Each cell shows nine pages with the controls for the previous and next
// page. `data-cn-state` on the cell forces hover and focus-visible on the page after the current one, which a static page
// cannot reach by itself; the real pseudo-classes and the keys are covered by the keyboard and pointer tests. The `selected`
// cell has page 3 as the current page, and the `disabled` cell disables the whole control. Nuxt UI's accessible names for the
// page numbers and the controls are English, so the demo sets es-MX ones through the slots. Copy is es-MX and has no domain
// content (REQ-022).
const states = ['default', 'hover', 'focus-visible', 'selected', 'disabled'] as const
const forced: string[] = ['hover', 'focus-visible']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" :data-cn-state="forced.includes(state) ? state : undefined" class="p-6">
        <UPagination
          :total="90"
          :items-per-page="10"
          :default-page="state === 'selected' ? 3 : 2"
          :sibling-count="1"
          :show-controls="false"
          show-edges
          :disabled="state === 'disabled'"
        >
          <template #prev>
            <UButton color="neutral" variant="outline" icon="i-ph-caret-left-bold" aria-label="Página anterior" />
          </template>
          <template #item="{ item, page }">
            <UButton
              :color="page === item.value ? 'primary' : 'neutral'"
              :variant="page === item.value ? 'solid' : 'outline'"
              :label="String(item.value)"
              :aria-label="`Página ${item.value}`"
              square
            />
          </template>
          <template #next>
            <UButton color="neutral" variant="outline" icon="i-ph-caret-right-bold" aria-label="Página siguiente" />
          </template>
        </UPagination>
      </div>
    </div>
  </div>
</template>
