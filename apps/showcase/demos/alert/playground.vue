<script setup lang="ts">
// The playground of the alert. The controls in controls.ts set these props. `type` picks one of the four feedback types, and
// the icon follows it, so the type is never told by color alone. `close` shows the close button.
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'error'
    title?: string
    description?: string
    close?: boolean
  }>(),
  { type: 'info', title: 'Nueva versión disponible', description: 'Recarga la página para verla.', close: true },
)

const icons = {
  info: 'i-ph-info-bold',
  success: 'i-ph-check-circle-bold',
  warning: 'i-ph-warning-bold',
  error: 'i-ph-x-circle-bold',
} as const
// The close button asks the page to hide the alert (update:open), so the page owns the state. Changing a control shows it again.
const open = ref(true)
watch(props, () => (open.value = true))
const closeProps = computed(() => (props.close ? { 'aria-label': 'Cerrar aviso' } : false))
</script>

<template>
  <div class="p-6">
    <UAlert
      v-if="open"
      :color="type"
      variant="outline"
      :icon="icons[type]"
      :title="title"
      :description="description"
      :close="closeProps"
      @update:open="open = false"
    />
  </div>
</template>
