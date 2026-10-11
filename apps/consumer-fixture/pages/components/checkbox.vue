<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Casilla</h1>
    <UCheckbox label="Recibir avisos de lanzamientos" />
    <UCheckbox label="Aceptar las reglas" :default-value="true" />
    <UCheckbox label="Opción no disponible" disabled />
  </main>
</template>
