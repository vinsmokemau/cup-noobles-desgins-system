<script setup lang="ts">
// T15.18 (DSR-14): the markup an app needs. The skip link is the first element of the page, before the header, and the
// main region is CnMain, so the two agree on the default id `main` and focus moves to the content.
</script>

<template>
  <div>
    <CnSkipLink label="Saltar al contenido" />
    <header class="flex items-center gap-4 p-6">
      <nav aria-label="Principal">
        <ul class="flex items-center gap-4">
          <li><ULink to="#juegos">Juegos</ULink></li>
          <li><ULink to="#eventos">Eventos</ULink></li>
        </ul>
      </nav>
    </header>
    <CnMain class="flex flex-col items-start gap-6 p-6">
      <h1>Enlace para saltar</h1>
      <p>Pulsa Tab para mostrar el enlace.</p>
    </CnMain>
  </div>
</template>
