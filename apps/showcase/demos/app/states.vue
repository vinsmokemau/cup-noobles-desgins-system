<script setup lang="ts">
// The state matrix of the app (REQ-026 AC2). CnApp draws nothing of its own: what a person sees is the built-in text of Nuxt UI
// in the language of the app, and that language is one setting for the whole app (Nuxt UI shares it), so a demo page cannot
// hold two. The cells therefore list the text the locale gives, read from the locales themselves: `default` is the Spanish
// the app has when it sets nothing, and `english` is what an app sees when it gives `CnApp` the English locale. No label is
// written in this file.
import { en, es } from '#ui/locale'

const states = ['default', 'english'] as const
const locales = { default: es, english: en }
const parts = [
  ['alert', 'Alert'],
  ['modal', 'Modal'],
  ['slideover', 'Slideover'],
  ['toast', 'Toast'],
] as const
const messages = (state: (typeof states)[number]) => locales[state].messages as Record<string, { close: string }>
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <dl :data-state="state" class="grid grid-cols-2 gap-2 p-6">
        <template v-for="[key, name] in parts" :key="key">
          <dt>{{ name }}</dt>
          <dd>{{ messages(state)[key]!.close }}</dd>
        </template>
      </dl>
    </div>
  </div>
</template>
