<script setup lang="ts">
// T11.1 (REQ-056, ADR-0002 §5, ADR-0043): the global search. Nuxt UI's `UContentSearch` is the modal and the shortcut (ER-01): a
// modal with a command palette in it, so focus is trapped, Escape closes it, and the arrow keys and Enter pick a result. It
// listens for Ctrl+K, or Cmd+K on macOS (`meta_k`), from every page that uses the default layout. The button that also
// opens it is `UContentSearchButton` in the header; both share the `open` state.
//
// The data is not part of the page. The first time the palette opens, it reads /search-sections.json (the prerendered
// sections and frontmatter, server/routes/search-sections.json.ts) and `tokens.flat.json`, so a page that is never
// searched pays nothing. `lib/search.ts` turns them into the three groups: pages, sections, and tokens.
//
// `UContentSearch` also has a color-mode command. The site is dark-only (REQ-031, A-02), so `color-mode` is off.
//
// The palette sits in the `content` slot, as `UContentSearch` itself renders it, with two changes that the component gives
// no prop for (ADR-0043): the listbox gets an accessible name (axe `aria-input-field-name`), and the scrolling list can take
// focus (axe `scrollable-region-focusable`, because Reka UI gives every result `tabindex="-1"`), both set below. The list
// that scrolls is the listbox itself: a `role="presentation"` element cannot take focus without becoming a child that a
// listbox does not allow (axe `aria-required-children`).
import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import type { DocEntry } from '../lib/doc-routes'
import { buildGroups, SEARCH_DATA_FILE, SEARCH_FUSE, type PaletteGroup, type SearchData } from '../lib/search'
import { siteBase } from '../lib/site'
import type { FlatToken } from '../lib/token-filter'

const { open } = useContentSearch()
const config = useRuntimeConfig()
const docs = config.public.docs as DocEntry[]

const searchTerm = ref('')
const groups = shallowRef<PaletteGroup[]>([])
const status = ref<'idle' | 'loading' | 'ready'>('idle')
// Set when the last load failed, so the empty list says why instead of "no result".
const failed = ref(false)

async function load() {
  status.value = 'loading'
  failed.value = false
  try {
    const [response, tokens] = await Promise.all([
      fetch(`${siteBase}${SEARCH_DATA_FILE}`),
      import('../../../packages/tokens/dist/json/tokens.flat.json'),
    ])
    if (!response.ok) throw new Error(`${SEARCH_DATA_FILE} answered ${response.status}`)
    const data = (await response.json()) as SearchData
    groups.value = buildGroups(data, docs, tokens.default as unknown as Record<string, FlatToken>)
    status.value = 'ready'
  } catch {
    // Back to idle, so the next time the palette opens it tries again.
    status.value = 'idle'
    groups.value = []
    failed.value = true
  }
}

watch(open, (isOpen) => {
  if (isOpen && status.value === 'idle') void load()
})

// Choosing a result navigates (each row is a link) and closes the search, with an empty box for the next time.
function onSelect() {
  open.value = false
  searchTerm.value = ''
}

// ADR-0043: two attributes that no prop of the palette reaches. The listbox (Reka UI's `ListboxContent`) is named, and it
// is the part that scrolls (see `ui` below), so it takes `tabindex="0"`: a scrolling region has to be reachable by
// keyboard. The listbox is drawn again each time the results come and go, so one observer sets them again while the
// search is open.
let observer: MutationObserver | undefined
function dressPalette() {
  for (const listbox of document.querySelectorAll('[role="dialog"] [role="listbox"]')) {
    if (!listbox.hasAttribute('aria-label')) listbox.setAttribute('aria-label', 'Search results')
    listbox.setAttribute('tabindex', '0')
  }
}
watch(open, async (isOpen) => {
  observer?.disconnect()
  if (!isOpen) return
  await nextTick()
  dressPalette()
  observer = new MutationObserver(dressPalette)
  observer.observe(document.body, { childList: true, subtree: true })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :color-mode="false"
    title="Search"
    description="Search the docs by page title, heading, token path, or component name."
  >
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :groups="groups"
        :loading="status === 'loading'"
        :fuse="SEARCH_FUSE"
        :ui="{ content: 'overflow-auto', viewport: 'overflow-visible' }"
        preserve-group-order
        close
        placeholder="Search pages, sections, tokens, and components"
        @update:model-value="onSelect"
        @update:open="open = $event"
      >
        <!-- Nuxt UI's own label puts the page, the title, and the component name in three spans with nothing between them,
             which a screen reader reads as one word ("ButtonUButton"). The same parts, with a space between them. -->
        <!-- `labelHtml` and `suffixHtml` are Nuxt UI's own highlight output: the text is HTML-escaped and only the
             `<mark>` around the matched part is markup (utils/search.js). -->
        <!-- eslint-disable vue/no-v-html -->
        <template #item-label="{ item, ui }">
          <span v-if="item.prefix" data-slot="itemLabelPrefix" :class="ui.itemLabelPrefix()">{{ item.prefix }}</span>
          {{ ' ' }}
          <span v-if="item.labelHtml" data-slot="itemLabelBase" :class="ui.itemLabelBase()" v-html="item.labelHtml" />
          <span v-else data-slot="itemLabelBase" :class="ui.itemLabelBase()">{{ item.label }}</span>
          {{ ' ' }}
          <span
            v-if="item.suffixHtml"
            data-slot="itemLabelSuffix"
            :class="ui.itemLabelSuffix()"
            v-html="item.suffixHtml"
          />
          <span v-else-if="item.suffix" data-slot="itemLabelSuffix" :class="ui.itemLabelSuffix()">{{
            item.suffix
          }}</span>
        </template>
        <!-- eslint-enable vue/no-v-html -->

        <template #empty="{ searchTerm: term }">
          <span v-if="failed" data-testid="search-error"
            >The search data could not be loaded. Close the search and open it again.</span
          >
          <span v-else-if="status === 'loading'">Loading the search data.</span>
          <span v-else>No result for "{{ term }}".</span>
        </template>
      </UCommandPalette>
    </template>
  </UContentSearch>
</template>
