<script setup lang="ts">
// `useToast()` is auto-imported by Nuxt UI. The toaster is the one UApp renders in app.vue.
const toast = useToast()

function show() {
  toast.add({
    title: 'Cambios guardados',
    description: 'Tu perfil ya está actualizado.',
    color: 'success',
    icon: 'i-ph-check-circle-bold',
    close: { 'aria-label': 'Cerrar aviso' },
  })
}
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Aviso emergente</h1>
    <UButton label="Mostrar aviso" @click="show" />
  </main>
</template>
