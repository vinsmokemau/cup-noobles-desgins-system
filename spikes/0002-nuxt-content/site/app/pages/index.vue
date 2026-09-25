<script setup lang="ts">
const { data: docs } = await useAsyncData('docs-index', () =>
  queryCollection('docs').select('title', 'slug', 'status').order('slug', 'ASC').all()
)
</script>

<template>
  <main>
    <h1>Spike 0002 docs</h1>
    <ul>
      <li v-for="doc in docs" :key="doc.slug">
        <NuxtLink :to="`/docs/${doc.slug}`">{{ doc.title }}</NuxtLink> ({{ doc.status }})
      </li>
    </ul>
  </main>
</template>
