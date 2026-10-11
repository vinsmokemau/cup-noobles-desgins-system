<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Botón</h1>
    <div class="flex flex-wrap items-center gap-4">
      <UButton label="Jugar" />
      <UButton label="Ver reglas" color="secondary" />
      <UButton label="Cancelar" variant="ghost" />
      <UButton label="No disponible" disabled />
      <UButton label="Guardando" loading aria-busy="true" />
    </div>
  </main>
</template>
