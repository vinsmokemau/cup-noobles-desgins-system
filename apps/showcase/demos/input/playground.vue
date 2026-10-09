<script setup lang="ts">
// The playground of the input. The controls in controls.ts set these props. `error` sets `aria-invalid` and shows a message
// that the input names with `aria-describedby`.
withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    placeholder?: string
    disabled?: boolean
    error?: boolean
  }>(),
  { size: 'md', placeholder: 'nombre@ejemplo.mx', disabled: false, error: false },
)
</script>

<template>
  <div class="flex flex-col gap-2 p-6">
    <label for="input-playground" class="text-sm">Correo electrónico</label>
    <UInput
      id="input-playground"
      type="email"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? 'input-playground-error' : undefined"
    />
    <p v-if="error" id="input-playground-error" class="flex items-center gap-1 text-sm text-[var(--cn-input-error-fg)]">
      <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
      Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.
    </p>
  </div>
</template>
