<script setup lang="ts">
// The state matrix of the checkbox (REQ-026 AC2). Each cell shows the checkbox with its label in one state. `data-cn-state`
// forces hover and focus-visible, which a static page cannot reach by itself; the real pseudo-classes are covered by the
// keyboard and pointer tests. The disabled cell shows an unchecked and a checked checkbox. The `touch-target` cell shows `size="2xl"` (ADR-0070): a row at least 44 px tall.
// Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'checked', 'indeterminate', 'disabled', 'touch-target'] as const
const forced: string[] = ['hover', 'focus-visible']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col gap-3 p-6">
        <template v-if="state === 'touch-target'">
          <UCheckbox id="checkbox-touch-target" size="2xl" label="Nendoroid (2)" />
          <UCheckbox id="checkbox-touch-target-checked" size="2xl" label="Figma (5)" :default-value="true" />
        </template>
        <UCheckbox
          v-else
          :id="`checkbox-${state}`"
          label="Recibir avisos de lanzamientos"
          :default-value="state === 'checked' ? true : state === 'indeterminate' ? 'indeterminate' : false"
          :disabled="state === 'disabled'"
          :data-cn-state="forced.includes(state) ? state : undefined"
        />
        <UCheckbox
          v-if="state === 'disabled'"
          id="checkbox-disabled-checked"
          label="Recibir avisos de ofertas"
          :default-value="true"
          disabled
        />
      </div>
    </div>
  </div>
</template>
