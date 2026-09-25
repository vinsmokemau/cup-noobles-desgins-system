<!-- Fixture: REQ-020 AC3 violations (hand-rolled dialog, listbox, and menu). -->
<template>
  <div role="dialog" aria-modal="true">
    <ul role="listbox">
      <slot />
    </ul>
    <div :role="'menu'" />
    <dialog open />
  </div>
</template>
