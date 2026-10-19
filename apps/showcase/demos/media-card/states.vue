<script setup lang="ts">
// The state matrix of the featured media card (REQ-026 AC2). A linked card has `default`, `hover`, `focus-visible`, and
// `active`; the card has no disabled state, because a card that is not a link is simply not linked. `data-cn-state` forces
// hover, active, and focus-visible, which a static page cannot reach by itself; the real pseudo-classes are covered by the
// keyboard and pointer tests. The thumbnail is the golden d20 of the brand, used here only as example content. Copy is es-MX and has no domain content (REQ-022).
const states = ['default', 'hover', 'focus-visible', 'active'] as const
const forced: string[] = ['hover', 'active', 'focus-visible']
const thumbnail = new URL('../../../../packages/nuxt/assets/brand/D20-CN.svg', import.meta.url).href
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6">
        <CnMediaCard
          title="Noche de juegos de mesa"
          :src="thumbnail"
          alt="Un dado de veinte caras dorado"
          :tags="['Anime', 'Cartas']"
          to="/"
          :data-cn-state="forced.includes(state) ? state : undefined"
        />
      </div>
    </div>
  </div>
</template>
