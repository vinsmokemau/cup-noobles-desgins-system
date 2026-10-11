<script setup lang="ts">
// The playground of the tooltip. The controls in controls.ts set these props. The tooltip opens when the button is hovered
// or focused. `side` picks where the bubble sits, and `text` is its content.
withDefaults(
  defineProps<{
    text?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    disabled?: boolean
  }>(),
  { text: 'Guardar los cambios', side: 'bottom', disabled: false },
)
</script>

<template>
  <div class="p-6 pb-16">
    <UTooltip :text="text" :disabled="disabled" :content="{ side }">
      <UButton label="Guardar" />
    </UTooltip>
  </div>
</template>
