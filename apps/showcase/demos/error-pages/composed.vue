<script setup lang="ts">
// The composed demo of the error-pages pattern (REQ-035 AC2), on neutral content (a community events site). It shows the
// two pages the pattern covers, one under the other: a page that does not exist (404) and a failure on our side (500).
// Both are the showcase's ErrorPage component, the one the showcase 404 uses too: the status code, a title that says what
// happened, one sentence that says what to do, and one primary action. Neither shows a technical detail. Copy is es-MX.
</script>

<template>
  <div class="flex flex-col gap-8">
    <section aria-label="Página que no existe" class="rounded-lg border border-default">
      <ErrorPage
        status="404"
        title="No encontramos esta página"
        message="Puede que se haya movido o que la dirección tenga un error. Vuelve al inicio y búscala desde ahí."
        action-label="Volver al inicio"
        to="#inicio"
      />
    </section>
    <section aria-label="Falla del servicio" class="rounded-lg border border-default">
      <ErrorPage
        status="500"
        title="Algo salió mal de nuestro lado"
        message="No pudimos mostrar esta página. Vuelve a intentarlo en unos minutos."
        action-label="Volver a intentar"
        to="#reintentar"
      />
    </section>
  </div>
</template>
