<script setup lang="ts">
// The playground of the badge. The controls in controls.ts set these props. The brand variant (BR-12) maps to the Nuxt UI
// props the way the doc's Variants table says. The icon is a Phosphor Bold glyph (ADR-0012).
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'tag'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    label?: string
    withIcon?: boolean
  }>(),
  { variant: 'primary', size: 'md', label: 'Juegos de mesa', withIcon: false },
)

const nuxtUi = computed(() => {
  if (props.variant === 'outline') return { color: 'primary', variant: 'outline' } as const
  if (props.variant === 'tag') return { color: 'secondary', variant: 'solid' } as const
  return { color: 'primary', variant: 'solid' } as const
})
</script>

<template>
  <div class="p-6">
    <UBadge
      :label="label"
      :size="size"
      :color="nuxtUi.color"
      :variant="nuxtUi.variant"
      :leading-icon="withIcon ? 'i-ph-star-bold' : undefined"
    />
  </div>
</template>
