// The controls of the icon playground (REQ-055): the prop name, its type, and, for a select, its options. The icon names
// are examples, not a chosen set (TBD-19).
export default [
  {
    name: 'name',
    type: 'select',
    options: ['i-lucide-star', 'i-lucide-search', 'i-lucide-triangle-alert', 'i-lucide-arrow-right'],
    default: 'i-lucide-star',
  },
  { name: 'size', type: 'select', options: ['size-4', 'size-5', 'size-6', 'size-8'], default: 'size-6' },
  { name: 'label', type: 'string', default: '' },
]
