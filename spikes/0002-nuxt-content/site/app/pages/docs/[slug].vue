<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)

const { data: doc } = await useAsyncData(`doc-${slug}`, () =>
  queryCollection('docs').where('slug', '=', slug).first()
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: `No doc with slug ${slug}` })
}
</script>

<template>
  <main>
    <p data-status>{{ doc!.status }}</p>
    <ContentRenderer :value="doc!" />
  </main>
</template>
