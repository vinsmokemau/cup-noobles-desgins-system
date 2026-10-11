<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Campo de texto</h1>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="correo" class="text-sm">Correo electrónico</label>
      <UInput id="correo" type="email" placeholder="nombre@ejemplo.mx" />
    </div>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="correo-error" class="text-sm">Correo de contacto</label>
      <UInput id="correo-error" type="email" aria-invalid="true" aria-describedby="correo-error-message" />
      <p id="correo-error-message" class="text-sm">Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.</p>
    </div>
    <div class="flex w-full max-w-sm flex-col gap-2">
      <label for="correo-off" class="text-sm">Correo alterno</label>
      <UInput id="correo-off" type="email" disabled />
    </div>
  </main>
</template>
