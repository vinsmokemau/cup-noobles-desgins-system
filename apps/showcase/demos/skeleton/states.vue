<script setup lang="ts">
// The state matrix of the skeleton (REQ-026 AC2). A skeleton is not interactive, and it has one state: the placeholder shown
// while content loads. The cell shows a card-like layout of shapes, a circle and two lines of text, and a wide block. Nuxt UI
// gives each skeleton `role="alert"`, `aria-busy`, and a fixed English label; the page overrides them. A group of shapes is
// named once, by a `status` wrapper with an es-MX label, and its single shapes are hidden from assistive technology. A lone
// shape takes the `status` role and the label itself. Under reduced motion the shapes do not fade (REQ-029). Copy is es-MX.
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col gap-6 p-6">
        <div role="status" aria-busy="true" aria-label="Cargando tarjeta" class="flex items-center gap-4 p-1">
          <USkeleton as="span" aria-hidden="true" class="size-12 shrink-0 rounded-full" />
          <span class="flex min-w-0 flex-1 flex-col gap-2">
            <USkeleton as="span" aria-hidden="true" class="block h-4 w-full" />
            <USkeleton as="span" aria-hidden="true" class="block h-4 w-3/5" />
          </span>
        </div>
        <USkeleton role="status" aria-label="Cargando imagen" class="h-32 w-full" />
      </div>
    </div>
  </div>
</template>
