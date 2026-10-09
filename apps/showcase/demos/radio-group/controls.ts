// The controls of the radio group playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'orientation', type: 'select', options: ['vertical', 'horizontal'], default: 'vertical' },
  { name: 'disabled', type: 'boolean', default: false },
]
