<script setup lang="ts">
// The playground of the slideover. The controls in controls.ts set these props. `side` picks the edge the panel slides from.
// The slideover opens in the page portal, as it does in an app, so the keyboard tests can check the focus trap, Escape, the
// restored focus, and the inert page behind it. The button and the link outside it are the page behind. Copy is es-MX.
withDefaults(
  defineProps<{
    title?: string
    description?: string
    side?: 'right' | 'left' | 'top' | 'bottom'
    dismissible?: boolean
  }>(),
  { title: 'Filtros', description: 'Elige qué juegos quieres ver.', side: 'right', dismissible: true },
)
</script>

<template>
  <div class="flex flex-col items-start gap-4 p-6">
    <p>Noche de juegos</p>
    <a href="#detalle" data-testid="page-link">Ver detalles</a>
    <USlideover
      :title="title"
      :description="description"
      :side="side"
      :dismissible="dismissible"
      :close="{ color: 'primary', variant: 'ghost' }"
    >
      <UButton data-testid="open" color="primary" variant="solid" label="Abrir filtros" />
      <template #body>
        <label for="slideover-search" class="mb-2 block text-sm">Buscar</label>
        <UInput id="slideover-search" class="w-full" />
      </template>
      <template #footer="{ close }">
        <UButton color="primary" variant="solid" label="Aplicar" @click="close" />
        <UButton color="primary" variant="ghost" label="Cancelar" @click="close" />
      </template>
    </USlideover>
    <UButton data-testid="page-button" color="primary" variant="ghost" label="Otra acción" />
  </div>
</template>
