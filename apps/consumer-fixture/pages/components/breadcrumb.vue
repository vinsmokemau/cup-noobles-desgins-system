<script setup lang="ts">
const items = [{ label: 'Inicio', to: '/' }, { label: 'Juegos', to: '/components/card' }, { label: 'Dados' }]
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Ruta de navegación</h1>
    <UBreadcrumb :items="items" />
  </main>
</template>
