<script setup lang="ts">
// The playground of the form field. The controls in controls.ts set these props. `error` shows an error message in place of
// the help text; Nuxt UI then sets `aria-invalid` and `aria-describedby` on the input. The help and the error slot are
// passed only when they apply, because Nuxt UI lists the id of every help it was given, and hides the help text whenever
// the `error` slot exists.
withDefaults(
  defineProps<{
    label?: string
    help?: string
    required?: boolean
    disabled?: boolean
    error?: boolean
  }>(),
  {
    label: 'Correo electrónico',
    help: 'Lo usamos solo para avisarte.',
    required: false,
    disabled: false,
    error: false,
  },
)
</script>

<template>
  <div class="p-6">
    <UFormField
      :label="label"
      :help="error ? undefined : help"
      :required="required"
      :error="error ? 'Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.' : undefined"
    >
      <UInput type="email" placeholder="nombre@ejemplo.mx" class="w-full" :disabled="disabled" />
      <template v-if="error" #error="{ error: message }">
        <span class="flex items-center gap-1">
          <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
          {{ message }}
        </span>
      </template>
    </UFormField>
  </div>
</template>
