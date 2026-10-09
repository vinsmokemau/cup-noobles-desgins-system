<script setup lang="ts">
// The state matrix of the progress bar (REQ-026 AC2). A progress bar is not interactive, so its states are the values it
// can show: some progress, none yet, finished, and an unknown amount (indeterminate, which has no `aria-valuenow`). Each cell
// shows the bar with a visible label, and the bar takes its accessible name from the same text through `get-value-label`
// (REQ-027). Under reduced motion the indeterminate bar is still. Copy is es-MX.
const states = ['default', 'empty', 'complete', 'indeterminate'] as const
const values = { default: 62, empty: 0, complete: 100, indeterminate: null } as const
const labels = {
  default: 'Subiendo portada',
  empty: 'Preparando archivo',
  complete: 'Portada subida',
  indeterminate: 'Procesando imagen',
} as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col gap-2 p-6">
        <span class="text-sm">{{ labels[state] }}</span>
        <UProgress :model-value="values[state]" size="lg" :get-value-label="() => labels[state]" />
      </div>
    </div>
  </div>
</template>
