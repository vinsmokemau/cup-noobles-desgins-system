// The controls of the icon playground (REQ-055): the prop name, its type, and, for a select, its options. The icon names
// are Phosphor Bold glyphs (ADR-0012).
export default [
  {
    name: 'name',
    type: 'select',
    options: ['i-ph-star-bold', 'i-ph-magnifying-glass-bold', 'i-ph-warning-bold', 'i-ph-arrow-right-bold'],
    default: 'i-ph-star-bold',
  },
  { name: 'size', type: 'select', options: ['size-4', 'size-5', 'size-6', 'size-8'], default: 'size-6' },
  { name: 'label', type: 'string', default: '' },
]
