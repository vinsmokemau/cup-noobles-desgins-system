<script setup lang="ts">
// The state matrix of the alert (REQ-026 AC2). The alert is a static message with no hover or press state of its own, so
// its states are the four feedback types and the focus ring of its close button. `default` is the informational type.
// Every cell has a title, a description, an icon, and a close button, because the type is told apart by the icon and the
// title, never by color alone (WCAG 1.4.1). `data-cn-state` forces focus-visible on the close button, which a static page
// cannot reach by itself; the real pseudo-class is covered by the keyboard test. Copy is es-MX.
const states = ['default', 'success', 'warning', 'error', 'focus-visible'] as const

const types = {
  default: {
    color: 'info',
    icon: 'i-ph-info-bold',
    title: 'Nueva versión disponible',
    description: 'Recarga la página para verla.',
  },
  success: {
    color: 'success',
    icon: 'i-ph-check-circle-bold',
    title: 'Cambios guardados',
    description: 'Tu perfil ya está actualizado.',
  },
  warning: {
    color: 'warning',
    icon: 'i-ph-warning-bold',
    title: 'Tu sesión termina pronto',
    description: 'Guarda lo que estás haciendo.',
  },
  error: {
    color: 'error',
    icon: 'i-ph-x-circle-bold',
    title: 'No pudimos guardar',
    description: 'Revisa tu conexión e inténtalo de nuevo.',
  },
  'focus-visible': {
    color: 'info',
    icon: 'i-ph-info-bold',
    title: 'Nueva versión disponible',
    description: 'Recarga la página para verla.',
  },
} as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6">
        <UAlert
          :color="types[state].color"
          variant="outline"
          :icon="types[state].icon"
          :title="types[state].title"
          :description="types[state].description"
          :close="{
            'aria-label': 'Cerrar aviso',
            'data-cn-state': state === 'focus-visible' ? 'focus-visible' : undefined,
          }"
        />
      </div>
    </div>
  </div>
</template>
