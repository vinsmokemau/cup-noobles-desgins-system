<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Área de texto</h1>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="comentarios" class="text-sm">Comentarios</label>
      <UTextarea id="comentarios" :rows="3" placeholder="Cuéntanos qué necesitas" />
    </div>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="comentarios-off" class="text-sm">Notas</label>
      <UTextarea id="comentarios-off" :rows="3" disabled />
    </div>
  </main>
</template>
