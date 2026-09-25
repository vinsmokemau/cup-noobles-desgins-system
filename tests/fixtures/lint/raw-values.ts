// Fixture: deliberate REQ-016 violations in a Nuxt UI theme config. Arbitrary test data, not brand values.
export default {
  ui: {
    button: {
      slots: { base: 'rounded-[8px] shadow-[0_0_4px_#abcdef]' },
    },
  },
  radius: '0.25rem',
  duration: 200,
}
