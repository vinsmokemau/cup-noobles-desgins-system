<script setup lang="ts">
// The state matrix of the image gallery (REQ-026 AC2). `data-cn-state` on the gallery forces hover on the dots that are not
// current and focus-visible on the frame, which a static page cannot reach by itself; the real pseudo-classes and the keys are
// covered by the keyboard and pointer tests. `selected` opens on the second picture, `disabled` on the last, where the next
// control is disabled as the previous one is on the first, `error` has a picture that fails to load and one with no `src`, and
// `empty` has no pictures, so it renders nothing. The pictures are brand artwork, used only as example content. Copy is es-MX and
// has no domain content (REQ-022).
const states = ['default', 'hover', 'focus-visible', 'selected', 'disabled', 'error', 'empty'] as const
const forced: string[] = ['hover', 'focus-visible']
const art = (name: string) => new URL(`../../../../packages/nuxt/assets/brand/${name}.svg`, import.meta.url).href
const pictures = [
  { src: art('D20-CN'), alt: 'Un dado de veinte caras dorado' },
  { src: art('Ramen-Cup-CN'), alt: 'Un vaso de ramen rosa con detalles de videojuego' },
  { src: art('Sparkle-CN'), alt: 'Una estrella brillante' },
]
const failing = [
  { src: '/_demo/image-gallery/no-such-picture.png', alt: 'Una imagen que no carga' },
  { alt: 'Una imagen sin archivo' },
]
const labels = {
  previous: 'Imagen anterior',
  next: 'Imagen siguiente',
  dots: 'Imágenes',
  dot: (position: number) => `Ir a la imagen ${position}`,
  position: (position: number, total: number) => `Imagen ${position} de ${total}`,
}
const itemsOf = (state: string) => (state === 'empty' ? [] : state === 'error' ? failing : pictures)
const startOf = (state: string) => (state === 'selected' ? 1 : state === 'disabled' ? pictures.length - 1 : 0)
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="min-h-16 p-6">
        <CnImageGallery
          :items="itemsOf(state)"
          :start-index="startOf(state)"
          :label="`Fotos de ejemplo, ${state}`"
          :labels="labels"
          :data-cn-state="forced.includes(state) ? state : undefined"
        />
      </div>
    </div>
  </div>
</template>
