// The controls of the switch playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'checked', type: 'boolean', default: false },
  { name: 'disabled', type: 'boolean', default: false },
]
