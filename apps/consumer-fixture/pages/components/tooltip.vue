<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Información emergente</h1>
    <div class="pb-16">
      <UTooltip text="Guardar los cambios" :content="{ side: 'bottom' }">
        <UButton label="Guardar" />
      </UTooltip>
    </div>
  </main>
</template>
