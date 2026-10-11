<script setup lang="ts">
// T5.3, T8.6: the app layout. A skip link, the design system's own site header and footer (themed `UHeader` and `UFooter`,
// ADR-0030), and a sidebar from md up. Below md the same menu is the header's own slideover (REQ-061 AC2): `mode="slideover"`
// moves the navigation into a Nuxt UI slideover, opened from the toggle, so focus is trapped, Escape closes it, and the page
// behind is inert. Nuxt UI hides the toggle below `lg`, and the sidebar appears at `md`, so the `ui` classes hide the toggle
// and the menu from md, where the sidebar takes over. There is no color-mode toggle (REQ-031 AC1).
import { useRuntimeConfig } from 'nuxt/app'

const version = useRuntimeConfig().public.version as string
</script>

<template>
  <div>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-default focus:p-2 focus:text-highlighted"
    >
      Skip to content
    </a>

    <UHeader
      title="Cup Noobles Design System"
      to="/"
      mode="slideover"
      toggle-side="right"
      :toggle="{ color: 'primary', variant: 'ghost' }"
      :menu="{ side: 'left', title: 'Navigation', description: 'Documentation sections' }"
      :ui="{ toggle: 'md:hidden', content: 'md:hidden', overlay: 'md:hidden' }"
    >
      <template #right>
        <!-- T11.1 (REQ-056): icon only, so it fits at 360 px. The palette itself is <SiteSearch /> below. -->
        <UContentSearchButton aria-keyshortcuts="Control+K Meta+K" />
        <UBadge :label="`v${version}`" color="neutral" variant="outline" data-testid="version" />
      </template>
      <template #body>
        <DocsNav />
      </template>
    </UHeader>

    <SiteSearch />

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

    <UFooter>
      <template #left>
        <p class="text-sm">Cup Noobles Design System</p>
      </template>
      <nav aria-label="Footer">
        <ul class="flex flex-wrap items-center justify-center gap-4">
          <li><ULink to="/changelog">Changelog</ULink></li>
          <li><ULink to="/status">Status</ULink></li>
          <li><ULink to="/tokens">Tokens</ULink></li>
        </ul>
      </nav>
    </UFooter>
  </div>
</template>
