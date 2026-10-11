<script setup lang="ts">
// The playground of the toast. The controls in controls.ts set these props, and the button shows a toast with them through
// `useToast()`, the way an app does. The toaster here is the real one, in the corner of the demo page. `close` shows the
// close button, and `action` adds an action button, which keeps the toast open until it is closed (WCAG 2.2.1).
const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'error'
    title?: string
    description?: string
    close?: boolean
    action?: boolean
  }>(),
  {
    type: 'info',
    title: 'Cambios guardados',
    description: 'Tu perfil ya está actualizado.',
    close: true,
    action: false,
  },
)

const icons = {
  info: 'i-ph-info-bold',
  success: 'i-ph-check-circle-bold',
  warning: 'i-ph-warning-bold',
  error: 'i-ph-x-circle-bold',
} as const

const toast = useToast()

function show() {
  toast.add({
    title: props.title,
    description: props.description,
    color: props.type,
    icon: icons[props.type],
    close: props.close ? { 'aria-label': 'Cerrar aviso' } : false,
    // A toast with an action stays until it is closed: a timer can take it away before the person reaches the action.
    duration: props.action ? 0 : undefined,
    actions: props.action ? [{ label: 'Deshacer', color: 'neutral', variant: 'outline' }] : undefined,
  })
}
</script>

<template>
  <div class="p-6">
    <UButton label="Mostrar aviso" @click="show" />
    <UToaster />
  </div>
</template>
