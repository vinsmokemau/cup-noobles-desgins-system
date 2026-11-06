<script setup lang="ts">
// The state matrix of the skip link (REQ-026 AC2). The link is fixed to the top of the page, so each cell is a stage that
// contains it (`contain: paint` makes the stage the containing block of a fixed element and clips what is outside it): the
// header of a page is drawn under it, and the link is hidden above the top edge (`default`) or shown over the header
// (`focus-visible`). A page cannot hold keyboard focus for a screenshot, so the shown cell forces the state with
// `data-cn-state`, the way the other component pages do. The keyboard tests drive the real focus. Copy is es-MX and has no
// domain content (REQ-022).
const states = ['default', 'focus-visible'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="relative h-24 overflow-hidden [contain:paint]">
        <CnSkipLink
          label="Saltar al contenido"
          :data-cn-state="state === 'focus-visible' ? 'focus-visible' : undefined"
        />
        <div class="flex h-16 items-center gap-4 border-b-4 border-primary px-6">
          <CnLogo variant="icon" label="Cup Noobles" />
          <nav aria-label="Principal">
            <ul class="flex items-center gap-4">
              <li><ULink to="#juegos">Juegos</ULink></li>
              <li><ULink to="#eventos">Eventos</ULink></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
