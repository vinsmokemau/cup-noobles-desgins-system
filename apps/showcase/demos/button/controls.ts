// The controls of the button playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'variant', type: 'select', options: ['primary', 'secondary', 'ghost'], default: 'primary' },
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'label', type: 'string', default: 'Continuar' },
  { name: 'disabled', type: 'boolean', default: false },
  { name: 'loading', type: 'boolean', default: false },
]
