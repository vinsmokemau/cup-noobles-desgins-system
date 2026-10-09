// The controls of the select playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'placeholder', type: 'string', default: 'Elige una categoría' },
  { name: 'disabled', type: 'boolean', default: false },
  { name: 'error', type: 'boolean', default: false },
]
