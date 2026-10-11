<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Progreso</h1>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <span class="text-sm">Subiendo portada</span>
      <UProgress :model-value="62" size="lg" status :get-value-label="() => 'Subiendo portada'" />
    </div>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <span class="text-sm">Preparando mesas</span>
      <UProgress :model-value="null" size="lg" :get-value-label="() => 'Preparando mesas'" />
    </div>
  </main>
</template>
