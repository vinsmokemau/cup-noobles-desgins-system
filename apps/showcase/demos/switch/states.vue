<script setup lang="ts">
// The state matrix of the switch (REQ-026 AC2). Each cell shows the switch with its label in one state. `data-cn-state`
// forces hover and focus-visible, which a static page cannot reach by itself; the real pseudo-classes are covered by the
// keyboard and pointer tests. The disabled cell shows an off and an on switch. Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'checked', 'disabled'] as const
const forced: string[] = ['hover', 'focus-visible']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col gap-3 p-6">
        <USwitch
          :id="`switch-${state}`"
          label="Avisos de lanzamientos"
          :default-value="state === 'checked'"
          :disabled="state === 'disabled'"
          :data-cn-state="forced.includes(state) ? state : undefined"
        />
        <USwitch
          v-if="state === 'disabled'"
          id="switch-disabled-checked"
          label="Avisos de ofertas"
          :default-value="true"
          disabled
        />
      </div>
    </div>
  </div>
</template>
