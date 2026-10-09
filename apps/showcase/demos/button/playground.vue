<script setup lang="ts">
// The playground of the button. The controls in controls.ts set these props. The brand variant (BR-11) maps to the
// Nuxt UI props the way the doc's Variants table says.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    label?: string
    disabled?: boolean
    loading?: boolean
  }>(),
  { variant: 'primary', size: 'md', label: 'Continuar', disabled: false, loading: false },
)

const nuxtUi = computed(() => {
  if (props.variant === 'secondary') return { color: 'secondary', variant: 'solid' } as const
  if (props.variant === 'ghost') return { color: 'primary', variant: 'ghost' } as const
  return { color: 'primary', variant: 'solid' } as const
})
</script>

<template>
  <div class="p-6">
    <UButton
      :label="label"
      :size="size"
      :color="nuxtUi.color"
      :variant="nuxtUi.variant"
      :disabled="disabled"
      :loading="loading"
      :aria-busy="loading ? 'true' : undefined"
    />
  </div>
</template>
