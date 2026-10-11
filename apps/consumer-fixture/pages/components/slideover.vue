<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Panel lateral</h1>
    <USlideover
      title="Filtros"
      description="Elige qué juegos quieres ver."
      side="right"
      :close="{ color: 'primary', variant: 'ghost' }"
    >
      <UButton label="Abrir filtros" />
      <template #body>
        <label for="buscar" class="mb-2 block text-sm">Buscar</label>
        <UInput id="buscar" class="w-full" />
      </template>
      <template #footer="{ close }">
        <UButton label="Aplicar" @click="close" />
        <UButton label="Cancelar" variant="ghost" @click="close" />
      </template>
    </USlideover>
  </main>
</template>
