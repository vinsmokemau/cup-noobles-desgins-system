<script setup lang="ts">
// T8.7 (REQ-022 AC3, REQ-071 AC1): the index of the fixture. It links one page per component in the inventory. The links are
// the page files themselves, so a new page is listed without editing this file; tests/consumer-fixture.test.ts compares
// them with the component docs. Copy is es-MX.
const slugs = Object.keys(import.meta.glob('./components/*.vue'))
  .map((path) => path.replace(/^\.\/components\/(.+)\.vue$/, '$1'))
  .sort()
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Fixture del sistema</h1>
    <UButton label="Jugar" />
    <nav aria-label="Componentes">
      <ul class="flex flex-wrap gap-x-6 gap-y-3">
        <li v-for="slug in slugs" :key="slug">
          <ULink :to="`/components/${slug}`">{{ slug }}</ULink>
        </li>
      </ul>
    </nav>
  </main>
</template>
