<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Esqueleto</h1>
    <div role="status" aria-busy="true" aria-label="Cargando contenido" class="flex w-full max-w-sm flex-col gap-2 p-1">
      <USkeleton as="span" aria-hidden="true" class="block h-4 w-full" />
      <USkeleton as="span" aria-hidden="true" class="block h-4 w-full" />
      <USkeleton as="span" aria-hidden="true" class="block size-16 rounded-full" />
    </div>
  </main>
</template>
