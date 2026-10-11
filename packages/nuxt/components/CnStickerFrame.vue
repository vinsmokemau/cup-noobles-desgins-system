<script setup lang="ts">
// CnStickerFrame (REQ-029): the sticker-style border motif (BR-14). It shows the border the owner chose (ADR-0024) as an image
// file, never edited, recoloured, or inlined, the way CnSparkle and CnLogo show theirs. The artwork is a fixed frame of about
// 8:5 with an empty centre, so the frame keeps that shape, scales as one piece with its width, and holds its slot content in
// the centre; what does not fit inside the centre is clipped (ADR-0025, the owner's choice A). It is decorative:
// `aria-hidden` hides it from assistive technology (REQ-029 AC1), and `inert` makes everything inside it unfocusable, so a
// link or button placed in the slot cannot take focus by mistake. It holds no text of its own (A-11).
const SOURCE = new URL('../assets/brand/Sticker-Border-CN.svg', import.meta.url).href
</script>

<template>
  <div class="cn-sticker-frame" aria-hidden="true" inert>
    <img class="cn-sticker-frame__artwork" :src="SOURCE" alt="" aria-hidden="true" draggable="false" />
    <div class="cn-sticker-frame__content">
      <slot />
    </div>
  </div>
</template>
