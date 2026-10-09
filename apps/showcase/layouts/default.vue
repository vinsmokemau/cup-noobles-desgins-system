<script setup lang="ts">
// T5.3: the app layout. A skip link, a header with the package version, a sidebar from md up, and below md the same
// menu inside a Nuxt UI slideover (REQ-052 AC2, REQ-061 AC2). There is no color-mode toggle (REQ-031 AC1).
import { ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const version = useRuntimeConfig().public.version as string
const menuOpen = ref(false)
</script>

<template>
  <div>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-default focus:p-2 focus:text-highlighted"
    >
      Skip to content
    </a>

    <UHeader title="Cup Noobles Design System" to="/" :toggle="false">
      <template #right>
        <UBadge :label="`v${version}`" color="neutral" variant="outline" data-testid="version" />
        <UButton
          class="md:hidden"
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          aria-label="Open navigation"
          @click="menuOpen = true"
        />
      </template>
    </UHeader>

    <USlideover v-model:open="menuOpen" title="Navigation" description="Documentation sections" side="left">
      <template #body>
        <DocsNav />
      </template>
    </USlideover>

    <div class="mx-auto flex w-full max-w-(--ui-container)">
      <aside
        class="sticky top-(--ui-header-height) hidden h-[calc(100vh-var(--ui-header-height))] w-64 shrink-0 overflow-y-auto p-4 md:block"
      >
        <DocsNav />
      </aside>
      <main id="main-content" class="min-w-0 flex-1 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
