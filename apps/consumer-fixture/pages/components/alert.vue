<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Alerta</h1>
    <div class="flex w-full max-w-lg flex-col gap-4">
      <UAlert
        color="info"
        variant="outline"
        icon="i-ph-info-bold"
        title="Nueva versión disponible"
        description="Recarga la página para verla."
      />
      <UAlert
        color="success"
        variant="outline"
        icon="i-ph-check-circle-bold"
        title="Cambios guardados"
        description="Tu perfil ya está actualizado."
      />
      <UAlert
        color="warning"
        variant="outline"
        icon="i-ph-warning-bold"
        title="Cupo casi lleno"
        description="Quedan pocas mesas."
      />
      <UAlert
        color="error"
        variant="outline"
        icon="i-ph-x-circle-bold"
        title="No se pudo guardar"
        description="Revisa tu conexión e inténtalo de nuevo."
      />
    </div>
  </main>
</template>
