<script setup lang="ts">
// The state matrix of the standard card (REQ-026 AC2). A card shows content and is not a control, so it has the one `default`
// state. The cell shows all three slots: header, body, and footer. A card with one slot missing is a composition, not a
// state. Copy is es-MX and has no domain content (REQ-022).
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="p-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold">Noche de juegos</h3>
          </template>
          <p>Trae tus dados y tu mazo favorito. Hay mesas para cuatro personas.</p>
          <template #footer>
            <p class="text-sm">Viernes a las 7 p. m.</p>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
