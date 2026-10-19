<script setup lang="ts">
import { computed } from 'vue'
// The playground of the featured media card. The controls in controls.ts set these props. `linked` makes the whole card a
// link, `decorative` marks the thumbnail as repeating the title, and `tagCount` sets how many tag badges show. `source` picks
// the picture: the golden d20, a plain grey stand-in of 3:2, 5:7, or 1:1 (example content, to show that the 4:3 frame never
// crops, ADR-0056), no picture, or a file that fails to load (both show the fallback d20, ADR-0057).
const props = withDefaults(
  defineProps<{
    title?: string
    alt?: string
    decorative?: boolean
    linked?: boolean
    tagCount?: number
    source?: 'd20' | '3:2' | '5:7' | '1:1' | 'missing' | 'broken'
  }>(),
  {
    title: 'Noche de juegos de mesa',
    alt: 'Un dado de veinte caras dorado',
    decorative: false,
    linked: true,
    tagCount: 2,
    source: 'd20',
  },
)
const thumbnail = new URL('../../../../packages/nuxt/assets/brand/D20-CN.svg', import.meta.url).href
const stand = (width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="gray"/></svg>`,
  )}`
const SOURCES = {
  d20: thumbnail,
  '3:2': stand(300, 200),
  '5:7': stand(250, 350),
  '1:1': stand(300, 300),
  broken: '/_demo/media-card/no-such-picture.png',
} as const
const src = computed(() => (props.source === 'missing' ? undefined : SOURCES[props.source]))
const TAGS = ['Anime', 'Cartas', 'Mesa', 'Torneo', 'Retro']
const tags = computed(() => TAGS.slice(0, Math.max(0, Math.min(TAGS.length, props.tagCount))))
</script>

<template>
  <div class="p-6">
    <CnMediaCard v-if="!src" :title="title" decorative :tags="tags" :to="linked ? '/' : undefined" />
    <CnMediaCard
      v-else-if="decorative"
      :title="title"
      :src="src"
      decorative
      :tags="tags"
      :to="linked ? '/' : undefined"
    />
    <CnMediaCard v-else :title="title" :src="src" :alt="alt" :tags="tags" :to="linked ? '/' : undefined" />
  </div>
</template>
