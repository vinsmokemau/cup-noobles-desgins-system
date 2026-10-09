<script setup lang="ts">
// The state matrix of the link (REQ-026 AC2). Each cell shows a text link, a link with a trailing icon, and an icon-only
// link in one state. `data-cn-state` forces hover, active, and focus-visible, which a static page cannot reach by itself;
// the real pseudo-classes are covered by the keyboard and pointer tests. The icons are Phosphor Bold glyphs
// (ADR-0012). Copy is es-MX.
const states = ['default', 'hover', 'focus-visible', 'active', 'disabled'] as const
const forced: string[] = ['hover', 'active', 'focus-visible']
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-wrap items-center gap-6 p-6">
        <ULink
          to="/"
          :disabled="state === 'disabled'"
          :data-cn-state="forced.includes(state) ? state : undefined"
          data-link="text"
        >
          Ver las reglas del torneo
        </ULink>
        <ULink
          to="/"
          :disabled="state === 'disabled'"
          :data-cn-state="forced.includes(state) ? state : undefined"
          class="inline-flex items-center gap-1"
          data-link="icon"
        >
          Ir al catálogo
          <UIcon name="i-ph-arrow-right-bold" />
        </ULink>
        <ULink
          to="/"
          aria-label="Buscar en el catálogo"
          :disabled="state === 'disabled'"
          :data-cn-state="forced.includes(state) ? state : undefined"
          class="inline-flex size-8 items-center justify-center"
          data-link="icon-only"
        >
          <UIcon name="i-ph-magnifying-glass-bold" class="size-5" />
        </ULink>
      </div>
    </div>
  </div>
</template>
