<script setup lang="ts">
const items = ['Cartas', 'Juegos de mesa', 'Figuras']
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Selector</h1>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="categoria" class="text-sm">Categoría</label>
      <USelect id="categoria" :items="items" placeholder="Elige una categoría" class="w-full" />
    </div>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="categoria-off" class="text-sm">Categoría fija</label>
      <USelect id="categoria-off" :items="items" placeholder="Elige una categoría" disabled class="w-full" />
    </div>
  </main>
</template>
