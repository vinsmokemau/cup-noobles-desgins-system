<script setup lang="ts">
// CnStickerFrame (REQ-029): the sticker-style border motif (BR-14). The border artwork is not supplied (TBD-18), so the
// frame is a plain outline with no artwork, drawn from tokens only. It wraps whatever its default slot holds. It is
// decorative: `aria-hidden` hides it from assistive technology (REQ-029 AC1), and `inert` makes everything inside it
// unfocusable, so a link or button placed in the slot cannot take focus by mistake. It holds no text of its own (A-11).
</script>

<template>
  <div class="cn-sticker-frame" aria-hidden="true" inert>
    <slot />
  </div>
</template>
