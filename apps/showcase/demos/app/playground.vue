<script setup lang="ts">
// The playground of the app. The control in controls.ts sets `locale`: `es` is the default of CnApp, and `en` is the English
// locale from Nuxt UI. Nuxt UI shares one language for the whole app, so the page shows the text the chosen locale gives
// to the close button of each part, read from the locale. No label is written in this file.
import { computed } from 'vue'
import { en, es } from '#ui/locale'

const props = withDefaults(defineProps<{ locale?: 'es' | 'en' }>(), { locale: 'es' })
const messages = computed(() => (props.locale === 'en' ? en : es).messages as Record<string, { close: string }>)
const parts = ['alert', 'modal', 'slideover', 'toast'] as const
</script>

<template>
  <dl class="grid grid-cols-2 gap-2 p-6">
    <template v-for="part in parts" :key="part">
      <dt>{{ part }}</dt>
      <dd>{{ messages[part]!.close }}</dd>
    </template>
  </dl>
</template>
