<script setup lang="ts">
// The state matrix of the sticker frame (REQ-026 AC2). A sticker frame is decorative and not interactive, so it has one
// state. The cell shows the frame around three kinds of content: a short text, a long word with no break, and a block wider
// than the screen. None of them makes the page wider (REQ-028 AC1). The frame is hidden from assistive technology, and
// nothing inside it can take focus (REQ-029 AC1). The border artwork is not supplied (TBD-18), so the frame is a plain
// outline. Copy is es-MX.
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col items-start gap-6 p-6">
        <CnStickerFrame>
          <p>¡Nuevo ingreso!</p>
        </CnStickerFrame>
        <CnStickerFrame>
          <p>Superlargapalabrasinningunespacioquedebeajustarseaanchodelmarcoenpantallaspequeñas</p>
        </CnStickerFrame>
        <CnStickerFrame>
          <div class="w-screen">Contenido más ancho que la pantalla</div>
        </CnStickerFrame>
      </div>
    </div>
  </div>
</template>
