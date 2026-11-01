<script setup lang="ts">
// The playground of the image gallery. The controls in controls.ts set these props. `count` is how many pictures show, `source`
// picks them: the brand artwork, a plain grey stand-in of 3:2, 5:7, or 1:1 (example content, to show that the 4:3 frame never
// crops, ADR-0056), no picture, or files that fail to load (both show the fallback d20, ADR-0057). `decorative` marks every
// picture as repeating the text near the gallery. The pictures are brand artwork or stand-ins, used only as example content.
// Copy is es-MX and has no domain content (REQ-022).
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    count?: number
    source?: 'brand' | '3:2' | '5:7' | '1:1' | 'missing' | 'broken'
    decorative?: boolean
  }>(),
  { count: 3, source: 'brand', decorative: false },
)
const art = (name: string) => new URL(`../../../../packages/nuxt/assets/brand/${name}.svg`, import.meta.url).href
const BRAND = [
  { src: art('D20-CN'), alt: 'Un dado de veinte caras dorado' },
  { src: art('Ramen-Cup-CN'), alt: 'Un vaso de ramen rosa con detalles de videojuego' },
  { src: art('Sparkle-CN'), alt: 'Una estrella brillante' },
  { src: art('Chopsticks-CN'), alt: 'Un par de palillos' },
  { src: art('Noodle-Wave-CN'), alt: 'Una onda de fideos' },
]
const stand = (width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="gray"/></svg>`,
  )}`
const SIZES = { '3:2': [300, 200], '5:7': [250, 350], '1:1': [300, 300] } as const
const items = computed(() => {
  const total = Math.max(0, Math.min(BRAND.length, props.count))
  const picture = (index: number) => {
    const base = BRAND[index]!
    const src =
      props.source === 'brand'
        ? base.src
        : props.source === 'missing'
          ? undefined
          : props.source === 'broken'
            ? `/_demo/image-gallery/no-such-picture-${index}.png`
            : stand(SIZES[props.source][0], SIZES[props.source][1])
    return props.decorative
      ? { src, decorative: true as const }
      : { src, alt: props.source === 'brand' ? base.alt : `Imagen de ejemplo ${index + 1}` }
  }
  return Array.from({ length: total }, (_, index) => picture(index))
})
const labels = {
  previous: 'Imagen anterior',
  next: 'Imagen siguiente',
  dots: 'Imágenes',
  dot: (position: number) => `Ir a la imagen ${position}`,
  position: (position: number, total: number) => `Imagen ${position} de ${total}`,
}
</script>

<template>
  <div class="mx-auto max-w-md p-6">
    <CnImageGallery :items="items" label="Fotos de ejemplo" :labels="labels" />
  </div>
</template>
