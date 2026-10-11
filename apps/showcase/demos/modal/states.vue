<script setup lang="ts">
// The state matrix of the modal (REQ-026 AC2). A modal has one visible state, `default`: open and at rest. Closed, it renders
// nothing. The cell shows the real UModal, open, drawn inline instead of in the page portal: `transform-gpu` makes the cell the
// containing block of its fixed backdrop and panel, so the matrix and its baseline keep the dialog inside the cell. The
// opening movement is off (`transition`), and `dismissible` is false so the specimen stays open. The behavior (focus trap,
// Escape, inert page) is covered by the keyboard tests on the playground, where the modal opens in the page portal. The close
// button takes the brand ghost look through `close`. Copy is es-MX and has no domain content (REQ-022).
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="relative h-96 transform-gpu overflow-hidden">
        <div class="p-4">
          <p class="font-medium">Noche de juegos</p>
          <p class="text-sm">Viernes a las 7 p. m.</p>
        </div>
        <UModal
          open
          :portal="false"
          :transition="false"
          :dismissible="false"
          title="Confirmar lugar"
          description="Te guardamos una mesa para cuatro personas."
          :close="{ color: 'primary', variant: 'ghost' }"
        >
          <template #body>
            <p>Trae tus dados y tu mazo favorito.</p>
          </template>
          <template #footer>
            <UButton color="primary" variant="solid" label="Confirmar" />
            <UButton color="primary" variant="ghost" label="Cancelar" />
          </template>
        </UModal>
      </div>
    </div>
  </div>
</template>
