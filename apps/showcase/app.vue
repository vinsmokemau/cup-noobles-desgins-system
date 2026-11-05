<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { en } from '#ui/locale'
// T8.3: a demo route owns its toaster. The toast demos render toasts in a toaster of their own, and the page's toaster would
// show every toast a second time, so it is off on `/_demo/` routes (`null` turns it off, `undefined` keeps the default).
const route = useRoute()
const toaster = computed(() => (route.path.includes('/_demo/') ? null : undefined))
</script>

<template>
  <CnApp :locale="en" :toaster="toaster">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </CnApp>
</template>
