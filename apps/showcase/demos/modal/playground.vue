<script setup lang="ts">
// The playground of the modal. The controls in controls.ts set these props. The modal opens in the page portal, as it does in an
// app, so the keyboard tests can check the focus trap, Escape, the restored focus, and the inert page behind it. The button and
// the link outside the modal are the page behind: they must not be reachable while it is open. Copy is es-MX.
withDefaults(
  defineProps<{
    title?: string
    description?: string
    dismissible?: boolean
  }>(),
  { title: 'Confirmar lugar', description: 'Te guardamos una mesa para cuatro personas.', dismissible: true },
)
</script>

<template>
  <div class="flex flex-col items-start gap-4 p-6">
    <p>Noche de juegos</p>
    <a href="#detalle" data-testid="page-link">Ver detalles</a>
    <UModal
      :title="title"
      :description="description"
      :dismissible="dismissible"
      :close="{ color: 'primary', variant: 'ghost' }"
    >
      <UButton data-testid="open" color="primary" variant="solid" label="Apartar lugar" />
      <template #body>
        <label for="modal-name" class="mb-2 block text-sm">Nombre</label>
        <UInput id="modal-name" class="w-full" />
      </template>
      <template #footer="{ close }">
        <UButton color="primary" variant="solid" label="Confirmar" @click="close" />
        <UButton color="primary" variant="ghost" label="Cancelar" @click="close" />
      </template>
    </UModal>
    <UButton data-testid="page-button" color="primary" variant="ghost" label="Otra acción" />
  </div>
</template>
