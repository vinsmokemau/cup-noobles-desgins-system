<script setup lang="ts">
// The pictures are brand assets that the layer ships, imported the way any consumer would.
import d20 from '@vinsmokemau/cup-noobles-nuxt/assets/brand/D20-CN.svg'
import ramen from '@vinsmokemau/cup-noobles-nuxt/assets/brand/Ramen-Cup-CN.svg'

const items = [
  { src: d20, alt: 'Un dado de veinte caras dorado' },
  { src: ramen, alt: 'Un vaso de ramen rosa con detalles de videojuego' },
]
const labels = {
  previous: 'Imagen anterior',
  next: 'Imagen siguiente',
  dots: 'Imágenes',
  dot: (position: number) => `Ir a la imagen ${position}`,
  position: (position: number, total: number) => `Imagen ${position} de ${total}`,
}
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Galería de imágenes</h1>
    <div class="w-full max-w-md">
      <CnImageGallery :items="items" label="Fotos de ejemplo" :labels="labels" />
    </div>
  </main>
</template>
