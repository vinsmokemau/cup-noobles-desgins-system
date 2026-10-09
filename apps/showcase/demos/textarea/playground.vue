<script setup lang="ts">
// The playground of the textarea. The controls in controls.ts set these props. `error` sets `aria-invalid` and shows a
// message that the textarea names with `aria-describedby`.
withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    rows?: number
    placeholder?: string
    disabled?: boolean
    error?: boolean
  }>(),
  { size: 'md', rows: 3, placeholder: 'Cuéntanos qué necesitas', disabled: false, error: false },
)
</script>

<template>
  <div class="flex flex-col gap-2 p-6">
    <label for="textarea-playground" class="text-sm">Comentarios del pedido</label>
    <UTextarea
      id="textarea-playground"
      :size="size"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? 'textarea-playground-error' : undefined"
    />
    <p
      v-if="error"
      id="textarea-playground-error"
      class="flex items-center gap-1 text-sm text-[var(--cn-input-error-fg)]"
    >
      <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
      Escribe al menos 10 caracteres.
    </p>
  </div>
</template>
