<script setup lang="ts">
const items = [
  { label: 'Cartas', value: 'cartas' },
  { label: 'Juegos de mesa', value: 'juegos' },
  { label: 'Figuras', value: 'figuras' },
]
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Grupo de opciones</h1>
    <URadioGroup legend="Categoría" :items="items" default-value="cartas" loop />
  </main>
</template>
