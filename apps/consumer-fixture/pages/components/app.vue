<script setup lang="ts">
// T15.16 (DSR-13): the built-in text of Nuxt UI is Spanish, because the root of the app is the layer's app component. Nothing here sets a label: the
// close buttons come from the locale.
const toast = useToast()

function showToast() {
  toast.add({
    title: 'Cambios guardados',
    description: 'Tu perfil ya está actualizado.',
    color: 'success',
    close: true,
  })
}
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Aplicación</h1>
    <section aria-labelledby="es-title" class="flex flex-col items-start gap-4">
      <h2 id="es-title">Texto de Nuxt UI</h2>
      <UAlert title="Aviso" description="Este mensaje se puede cerrar." close />
      <UModal title="Confirmar lugar" description="Revisa los datos antes de seguir.">
        <UButton label="Abrir ventana" />
        <template #body><p>Dos lugares, mesa uno.</p></template>
      </UModal>
      <USlideover title="Filtros" description="Elige qué juegos quieres ver." side="right">
        <UButton label="Abrir filtros" />
        <template #body><p>Sin filtros activos.</p></template>
      </USlideover>
      <UButton label="Mostrar aviso" @click="showToast" />
    </section>
  </main>
</template>
