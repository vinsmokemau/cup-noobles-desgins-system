<script setup lang="ts">
// The state matrix of the icon (REQ-026 AC2). An icon is not interactive, so it has one state. The cell shows a decorative
// icon (`UIcon` hides itself from assistive technology), an icon that carries a meaning (wrapped in `role="img"` with a
// label), two sizes, and an icon on a pink fill. The icon names are Phosphor Bold glyphs, the
// set the owner chose (ADR-0012). Copy is es-MX.
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-wrap items-center gap-6 p-6">
        <span class="inline-flex items-center gap-2">
          <UIcon name="i-ph-star-bold" class="size-5" data-icon="decorative" />
          Favoritos
        </span>
        <span class="inline-flex" role="img" aria-label="Advertencia" data-icon="meaningful">
          <UIcon name="i-ph-warning-bold" class="size-6" />
        </span>
        <UIcon name="i-ph-star-bold" class="size-4" data-icon="size-4" />
        <UIcon name="i-ph-star-bold" class="size-8" data-icon="size-8" />
        <span class="cn-icon-on-pink inline-flex items-center gap-2 px-2 py-1" data-icon="on-pink">
          <UIcon name="i-ph-star-bold" class="size-5" />
          Sobre rosa
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cn-icon-on-pink {
  color: var(--cn-color-text-inverted);
  background-color: var(--cn-color-brand-primary);
}
</style>
