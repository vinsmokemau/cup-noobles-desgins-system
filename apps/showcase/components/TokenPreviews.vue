<script setup lang="ts">
// T6.3 (REQ-054 AC2, AC3, AC4): the previews of the foundation pages, for every token type but color. The doc's generated
// blocks pick the tokens (`prefixes`, SPEC.md §4.5 mechanic 2), and tokens.flat.json supplies them. Every sample is painted
// with `var(--cn-*)` and nothing else (REQ-016).
import flat from '../../../packages/tokens/dist/json/tokens.flat.json'
import type { FlatToken } from '../lib/token-filter'
import {
  SPECIMEN_LOCALE,
  SPECIMEN_TEXT,
  cssVarOf,
  specimenStyle,
  toPreviews,
  toSections,
  type Preview,
} from '../lib/token-preview'

const props = defineProps<{ prefixes: string[] }>()

const sections = toSections(toPreviews(flat as unknown as Record<string, FlatToken>, props.prefixes))
const first = (preview: Preview) => preview.tokens[0]!.cssVar
const role = (preview: Preview) => preview.role as keyof typeof SPECIMEN_TEXT
</script>

<template>
  <section
    v-if="sections.length > 0"
    aria-labelledby="token-previews"
    class="mt-8 space-y-6"
    data-testid="token-previews"
  >
    <h2 id="token-previews" class="text-xl font-bold text-highlighted">Token previews</h2>
    <p class="text-muted">
      Every sample below is painted with its own token. The sample text is an example in es-MX, not brand copy. A
      hatched band marks a token with no value yet: the sample shows a placeholder, not a brand value.
    </p>
    <section
      v-for="section in sections"
      :key="section.kind"
      :aria-labelledby="`previews-${section.kind}`"
      :data-testid="`previews-${section.kind}`"
    >
      <h3 :id="`previews-${section.kind}`" class="text-lg font-bold text-highlighted">{{ section.title }}</h3>
      <p class="mb-3 text-sm text-muted">{{ section.note }}</p>
      <ul :class="section.kind === 'type' ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'">
        <PreviewCard v-for="preview in section.previews" :key="preview.id" :preview="preview">
          <p
            v-if="preview.kind === 'type'"
            :lang="SPECIMEN_LOCALE"
            :style="specimenStyle(preview)"
            class="break-words text-default"
            data-testid="specimen"
          >
            {{ SPECIMEN_TEXT[role(preview)] }}
          </p>
          <div v-else-if="preview.kind === 'space'" aria-hidden="true">
            <div
              class="h-4 bg-transparent"
              :style="{ width: `var(${first(preview)})`, backgroundColor: 'var(--cn-color-brand-primary)' }"
              data-testid="space-bar"
            />
          </div>
          <div v-else-if="preview.kind === 'stroke'" aria-hidden="true">
            <div
              :style="{ borderTop: `var(${first(preview)}) solid var(--cn-color-brand-primary)` }"
              data-testid="stroke-line"
            />
          </div>
          <div v-else-if="preview.kind === 'radius'" aria-hidden="true">
            <div
              class="h-20"
              :style="{
                borderRadius: `var(${first(preview)})`,
                border: 'var(--cn-border-width-default) solid var(--cn-color-brand-primary)',
              }"
              data-testid="radius-box"
            />
          </div>
          <div v-else-if="preview.kind === 'glow' || preview.kind === 'elevation'" aria-hidden="true">
            <div
              class="h-20 rounded-md border border-default"
              :style="{ boxShadow: `var(${first(preview)})`, backgroundColor: 'var(--cn-color-bg-base)' }"
              data-testid="shadow-box"
            />
          </div>
          <MotionDemo
            v-else-if="preview.kind === 'motion'"
            :duration-var="cssVarOf(preview, `motion.duration.${preview.role}`)"
            :easing-var="cssVarOf(preview, `motion.easing.${preview.role}`)"
          />
        </PreviewCard>
      </ul>
    </section>
  </section>
</template>
