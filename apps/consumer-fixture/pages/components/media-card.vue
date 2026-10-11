<script setup lang="ts">
// The thumbnail is a brand asset that the layer ships, imported the way any consumer would.
import thumbnail from '@vinsmokemau/cup-noobles-nuxt/assets/brand/D20-CN.svg'
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Tarjeta de medios</h1>
    <div class="w-full max-w-sm">
      <CnMediaCard
        title="Noche de juegos de mesa"
        :src="thumbnail"
        alt="Un dado de veinte caras dorado"
        :tags="['Anime', 'Cartas']"
        to="/"
      />
    </div>
  </main>
</template>
