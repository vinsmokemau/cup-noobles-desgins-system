<script setup lang="ts">
// The playground of the select. The controls in controls.ts set these props. `error` sets `aria-invalid` and shows a
// message that the select names with `aria-describedby`.
withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    placeholder?: string
    disabled?: boolean
    error?: boolean
  }>(),
  { size: 'md', placeholder: 'Elige una categoría', disabled: false, error: false },
)
const items = ['Cartas', 'Juegos de mesa', 'Figuras']
</script>

<template>
  <div class="flex flex-col gap-2 p-6">
    <label for="select-playground" class="text-sm">Categoría</label>
    <USelect
      id="select-playground"
      :items="items"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? 'select-playground-error' : undefined"
      class="w-full"
    />
    <p
      v-if="error"
      id="select-playground-error"
      class="flex items-center gap-1 text-sm text-[var(--cn-input-error-fg)]"
    >
      <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
      Elige una categoría de la lista.
    </p>
  </div>
</template>
