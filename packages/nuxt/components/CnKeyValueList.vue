<script setup lang="ts">
// CnKeyValueList (T15.2, DSR-02): a list of attributes, each a label and a value, such as a table of details. Nuxt UI has
// no equivalent (REQ-020 AC2, ADR-0065), so it is custom. It is a description list: a <dl> with a <dt> for each label and
// a <dd> for each value, grouped in a <div> per row. At 360 px each row stacks, the label over the value; from the `md`
// breakpoint the label and the value sit side by side.
//
// The component holds no text of its own (A-11). Labels and values arrive through `items`, and the `value` slot draws a
// value in another way, such as a badge. A list with no items renders nothing. The layer declares no `vue` dependency (Nuxt provides it).
type Item = {
  label: string
  value: string
}

defineProps<{
  /** The rows, in order: a label and its value. A list with no rows renders nothing. */
  items: Item[]
}>()
defineSlots<{
  /** Draws the value of one row in place of its text. It receives the row and its position. Keep it non-interactive text or a badge. */
  value?(props: { item: Item; index: number }): unknown
}>()
</script>

<template>
  <dl v-if="items.length" class="cn-key-value-list">
    <div v-for="(item, index) in items" :key="index" class="cn-key-value-list__row">
      <dt class="cn-key-value-list__label">{{ item.label }}</dt>
      <dd class="cn-key-value-list__value">
        <slot name="value" :item="item" :index="index">{{ item.value }}</slot>
      </dd>
    </div>
  </dl>
</template>
