<script setup lang="ts">
// T5.3 (REQ-052 AC2): the documentation menu, in DESIGN.md order. The desktop sidebar and the mobile slideover both render it.
import { computed } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import type { NavSection } from '../lib/design-nav'

interface MenuItem {
  label: string
  to?: string
  type?: 'label'
}

const sections = useRuntimeConfig().public.nav as NavSection[]

// One flat list per section; the `###` groups become labels inside it.
const items = computed<MenuItem[][]>(() =>
  sections.map((section) => [
    { label: section.title, type: 'label' },
    ...section.groups.flatMap((group): MenuItem[] => [
      ...(group.title ? [{ label: group.title, type: 'label' as const }] : []),
      ...group.links.map((link) => ({ label: link.label, to: link.to })),
    ]),
  ]),
)
</script>

<template>
  <UNavigationMenu orientation="vertical" :items="items" aria-label="Documentation" />
</template>
