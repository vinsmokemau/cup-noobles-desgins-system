<script setup lang="ts">
// The state matrix of the form field (REQ-026 AC2). Each cell shows a field with its label, its help text, and an input.
// `data-cn-state` forces hover and focus-visible on the input, which a static page cannot reach by itself; the real
// pseudo-classes are covered by the keyboard and pointer tests. The error cell passes `error` and no `help`, because the
// error takes the place of the help text. The `error` slot is rendered only in the error state: Nuxt UI hides the help text
// whenever that slot exists. Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'disabled', 'error'] as const
const forced: string[] = ['hover', 'focus-visible']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6">
        <UFormField
          label="Correo electrónico"
          :help="state === 'error' ? undefined : 'Lo usamos solo para avisarte.'"
          :error="state === 'error' ? 'Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.' : undefined"
        >
          <UInput
            type="email"
            placeholder="nombre@ejemplo.mx"
            class="w-full"
            :disabled="state === 'disabled'"
            :data-cn-state="forced.includes(state) ? state : undefined"
          />
          <template v-if="state === 'error'" #error="{ error }">
            <span class="flex items-center gap-1">
              <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
              {{ error }}
            </span>
          </template>
        </UFormField>
      </div>
    </div>
  </div>
</template>
