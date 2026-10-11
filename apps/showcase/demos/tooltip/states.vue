<script setup lang="ts">
// The state matrix of the tooltip (REQ-026 AC2). A tooltip is closed until its control is hovered or focused. `default` is
// the closed tooltip, `hover` is the open one, and `focus-visible` is the open one with the focus ring on its control.
// The open cells hold the tooltip open with `open` and render it in place (`portal` false), because a static page cannot
// hover or focus; the real hover and focus are covered by the pointer and keyboard tests. `data-cn-state` forces the focus
// ring on the control. Copy is es-MX.
const states = ['default', 'hover', 'focus-visible'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6 pb-16">
        <UTooltip
          text="Guardar los cambios"
          :open="state === 'default' ? false : true"
          :portal="false"
          :content="{ side: 'bottom' }"
        >
          <UButton label="Guardar" :data-cn-state="state === 'focus-visible' ? 'focus-visible' : undefined" />
        </UTooltip>
      </div>
    </div>
  </div>
</template>
