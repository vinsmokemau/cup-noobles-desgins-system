// The controls of the separator playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'orientation', type: 'select', options: ['horizontal', 'vertical'], default: 'horizontal' },
  { name: 'label', type: 'string', default: '' },
  { name: 'decorative', type: 'boolean', default: false },
]
