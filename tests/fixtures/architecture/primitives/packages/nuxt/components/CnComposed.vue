<!-- Fixture: composing Nuxt UI primitives is allowed; REQ-020 AC3 must not flag this file. -->
<template>
  <UModal>
    <UPopover>
      <span role="img" aria-hidden="true" />
      <div role="menuitem" />
      <slot />
    </UPopover>
  </UModal>
</template>
