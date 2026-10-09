// The controls of the logo playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'variant', type: 'select', options: ['icon', 'vertical', 'horizontal'], default: 'horizontal' },
  { name: 'decorative', type: 'boolean', default: false },
  { name: 'label', type: 'string', default: 'Cup Noobles' },
]
