<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Ventana modal</h1>
    <UModal
      title="Confirmar lugar"
      description="Te guardamos una mesa para cuatro personas."
      :close="{ color: 'primary', variant: 'ghost' }"
    >
      <UButton label="Apartar lugar" />
      <template #body>
        <label for="nombre" class="mb-2 block text-sm">Nombre</label>
        <UInput id="nombre" class="w-full" />
      </template>
      <template #footer="{ close }">
        <UButton label="Confirmar" @click="close" />
        <UButton label="Cancelar" variant="ghost" @click="close" />
      </template>
    </UModal>
  </main>
</template>
