<script setup lang="ts">
// The state matrix of the toast (REQ-026 AC2). A toast needs the toaster's provider and viewport to render, and the real
// toaster is a fixed corner of the page. Each cell therefore has a toaster of its own whose viewport is not portaled and
// not fixed (`portal` false, a static viewport), with one `UToast` in its default slot that is held open. The page's own
// toaster is off on demo routes (app.vue), so nothing is shown twice. The toast is a message with no hover or press state, so
// its states are the four feedback types and the focus ring. `data-cn-state` forces focus-visible, which a static page
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

const viewport = 'static h-auto w-full sm:w-full data-[expanded=true]:h-auto'
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6">
        <UToaster :portal="false" :class="viewport">
          <UToast
            :open="true"
            :color="types[state].color"
            :icon="types[state].icon"
            :title="types[state].title"
            :description="types[state].description"
            :close="{ 'aria-label': 'Cerrar aviso' }"
            :data-cn-state="state === 'focus-visible' ? 'focus-visible' : undefined"
          />
        </UToaster>
      </div>
    </div>
  </div>
</template>
