<script setup lang="ts">
// The state matrix of the select (REQ-026 AC2). Each cell shows the select with its label in one state. `data-cn-state`
// forces hover and focus-visible, which a static page cannot reach by itself; the real pseudo-classes are covered by the
// keyboard and pointer tests. The error state sets `aria-invalid` and links its message with `aria-describedby`
// (REQ-027). The message and its icon are the page's own markup: FormField (T8.1) wires them for an app. Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'disabled', 'error'] as const
const forced: string[] = ['hover', 'focus-visible']
const items = ['Cartas', 'Juegos de mesa', 'Figuras']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col gap-2 p-6">
        <label :for="`select-${state}`" class="text-sm">Categoría</label>
        <USelect
          :id="`select-${state}`"
          :items="items"
          placeholder="Elige una categoría"
          class="w-full"
          :disabled="state === 'disabled'"
          :aria-invalid="state === 'error' ? 'true' : undefined"
          :aria-describedby="state === 'error' ? `select-${state}-error` : undefined"
          :data-cn-state="forced.includes(state) ? state : undefined"
        />
        <p
          v-if="state === 'error'"
          :id="`select-${state}-error`"
          class="flex items-center gap-1 text-sm text-[var(--cn-input-error-fg)]"
        >
          <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
          Elige una categoría de la lista.
        </p>
      </div>
    </div>
  </div>
</template>
