<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Campo de formulario</h1>
    <div class="flex w-full max-w-sm flex-col gap-6">
      <UFormField label="Correo electrónico" help="Lo usamos solo para avisarte." required>
        <UInput type="email" placeholder="nombre@ejemplo.mx" class="w-full" />
      </UFormField>
      <UFormField label="Correo de contacto" error="Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.">
        <UInput type="email" class="w-full" />
      </UFormField>
    </div>
  </main>
</template>
