<script setup lang="ts">
// The state matrix of the site footer (REQ-026 AC2). The footer is a landmark, not a control, so it has one visible state,
// `default`: at rest, with the pink line above it. The links inside show their own states in their own docs. Copy is es-MX and
// has no domain content (REQ-022).
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="relative">
        <UFooter>
          <template #left>
            <p class="text-sm">© 2026 Cup Noobles</p>
          </template>
          <nav aria-label="Pie de página">
            <ul class="flex flex-wrap items-center justify-center gap-4">
              <li><ULink to="#ayuda">Ayuda</ULink></li>
              <li><ULink to="#terminos">Términos</ULink></li>
              <li><ULink to="#privacidad">Privacidad</ULink></li>
            </ul>
          </nav>
          <template #right>
            <UButton color="primary" variant="ghost" label="Contacto" />
          </template>
        </UFooter>
      </div>
    </div>
  </div>
</template>
