<script setup lang="ts">
// T6.2 (REQ-054 AC1, AC4): a swatch for every color token, with its contrast ratio against color.bg.base and a verdict.
// A tbd token carries the hatched overlay and a "TBD-NN" badge (SPEC.md §4.4); a derived-pending token carries its status
// badge. The overlay is drawn from tokens only, in em, so the page holds no raw value (REQ-016).
import flat from '../../../packages/tokens/dist/json/tokens.flat.json'
import { BASE, MINIMUM, ratioText, toSwatches, type Verdict } from '../lib/color-preview'
import type { FlatToken } from '../lib/token-filter'

const swatches = toSwatches(flat as unknown as Record<string, FlatToken>)

const VERDICTS: Record<Verdict, string> = {
  pass: 'Pass',
  fail: 'Fail',
  unverified: 'Unverified',
  reference: 'Reference',
}
</script>

<template>
  <section aria-labelledby="color-previews" class="mt-8 space-y-4" data-testid="color-previews">
    <h2 id="color-previews" class="text-xl font-bold text-highlighted">Color previews</h2>
    <p class="text-muted">
      Every color token, with its contrast ratio against <code>{{ BASE }}</code
      >. Pass means at least {{ ratioText(MINIMUM) }}, the WCAG AA minimum for text (UI parts need 3:1). A hatched
      swatch is a token with no value yet: the color shown is a placeholder, so its ratio is not measured.
    </p>
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="swatch in swatches"
        :key="swatch.path"
        class="rounded-md border border-default p-3"
        data-testid="swatch"
        :data-path="swatch.path"
      >
        <div class="swatch-box relative h-20 rounded-md border border-default" aria-hidden="true">
          <div class="absolute inset-0 rounded-md" :style="{ backgroundColor: `var(${swatch.cssVar})` }" />
          <div v-if="swatch.status === 'tbd'" class="swatch-hatch absolute inset-0 rounded-md" data-testid="hatch" />
        </div>
        <p class="mt-2 font-bold break-all text-highlighted">
          <code>{{ swatch.path }}</code>
        </p>
        <p class="text-sm break-all text-muted">
          <code data-testid="swatch-var">{{ swatch.cssVar }}</code> ·
          <code data-testid="swatch-value">{{ swatch.value }}</code>
        </p>
        <p class="mt-1 text-sm">
          <span data-testid="ratio">{{ swatch.ratio === null ? 'Not measured' : ratioText(swatch.ratio) }}</span>
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          <UBadge
            :label="VERDICTS[swatch.verdict]"
            color="neutral"
            variant="outline"
            data-testid="verdict"
            :data-verdict="swatch.verdict"
          />
          <StatusBadge :status="swatch.status" />
          <UBadge
            v-for="id in swatch.tbd"
            :key="id"
            :label="id"
            color="neutral"
            variant="solid"
            data-testid="tbd-badge"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* Diagonal stripes of the page base over the swatch: the color underneath stays visible, but cannot pass for a real one. */
.swatch-hatch {
  background-image: repeating-linear-gradient(
    45deg,
    var(--cn-color-bg-base) 0,
    var(--cn-color-bg-base) 0.35em,
    transparent 0.35em,
    transparent 0.7em
  );
}
</style>
