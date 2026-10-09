// The controls of the textarea playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'rows', type: 'number', default: 3 },
  { name: 'placeholder', type: 'string', default: 'Cuéntanos qué necesitas' },
  { name: 'disabled', type: 'boolean', default: false },
  { name: 'error', type: 'boolean', default: false },
]
