<script setup lang="ts">
import { computed } from 'vue'
// The playground of the featured media card. The controls in controls.ts set these props. `linked` makes the whole card a
// link, `decorative` marks the thumbnail as repeating the title, and `tagCount` sets how many tag badges show.
const props = withDefaults(
  defineProps<{
    title?: string
    alt?: string
    decorative?: boolean
    linked?: boolean
    tagCount?: number
  }>(),
  {
    title: 'Noche de juegos de mesa',
    alt: 'Un dado de veinte caras dorado',
    decorative: false,
    linked: true,
    tagCount: 2,
  },
)
const thumbnail = new URL('../../../../packages/nuxt/assets/brand/D20-CN.svg', import.meta.url).href
const TAGS = ['Anime', 'Cartas', 'Mesa', 'Torneo', 'Retro']
const tags = computed(() => TAGS.slice(0, Math.max(0, Math.min(TAGS.length, props.tagCount))))
</script>

<template>
  <div class="p-6">
    <CnMediaCard
      v-if="decorative"
      :title="title"
      :src="thumbnail"
      decorative
      :tags="tags"
      :to="linked ? '/' : undefined"
    />
    <CnMediaCard v-else :title="title" :src="thumbnail" :alt="alt" :tags="tags" :to="linked ? '/' : undefined" />
  </div>
</template>
