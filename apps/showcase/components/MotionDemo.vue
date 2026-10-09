<script setup lang="ts">
// T6.3 (REQ-054 AC3): the play-on-demand motion demo. Play moves a dot along a track with the duration and easing tokens.
// Under `prefers-reduced-motion: reduce` the dot does not move at all (REQ-029 AC2): the movement and its transition are
// declared only inside `prefers-reduced-motion: no-preference`, so without that preference there is nothing to run.
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ durationVar: string; easingVar: string }>()

const moved = ref(false)
const reduced = ref(false)
let query: ReturnType<typeof globalThis.matchMedia> | undefined
const sync = () => {
  reduced.value = query?.matches ?? false
}
onMounted(() => {
  query = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
  sync()
  query.addEventListener('change', sync)
})
onBeforeUnmount(() => query?.removeEventListener('change', sync))
</script>

<template>
  <div
    class="motion-demo"
    :style="{ '--demo-duration': `var(${props.durationVar})`, '--demo-easing': `var(${props.easingVar})` }"
    data-testid="motion-demo"
  >
    <div class="relative h-8 rounded-md border border-default" aria-hidden="true">
      <div
        class="motion-dot absolute top-1 size-5 rounded-full"
        :class="{ 'is-moved': moved }"
        data-testid="motion-dot"
      />
    </div>
    <div class="mt-3 flex flex-wrap items-center gap-3">
      <UButton label="Play" color="neutral" variant="outline" data-testid="motion-play" @click="moved = !moved" />
      <p class="text-sm text-muted" role="status" data-testid="motion-note">
        <template v-if="reduced">Reduced motion is on, so this demo does not move.</template>
        <template v-else>{{ moved ? 'At the end. Play again to go back.' : 'At the start.' }}</template>
      </p>
    </div>
  </div>
</template>

<style scoped>
.motion-dot {
  inset-inline-start: 0.25em;
  background-color: var(--cn-color-brand-primary);
}

@media (prefers-reduced-motion: no-preference) {
  .motion-dot {
    transition:
      inset-inline-start var(--demo-duration) var(--demo-easing),
      translate var(--demo-duration) var(--demo-easing);
  }

  .motion-dot.is-moved {
    inset-inline-start: calc(100% - 0.25em);
    translate: -100% 0;
  }
}
</style>
