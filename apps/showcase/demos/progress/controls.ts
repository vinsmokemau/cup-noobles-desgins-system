// The controls of the progress playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'value', type: 'number', default: 62, min: 0, max: 100, step: 1 },
  { name: 'indeterminate', type: 'boolean', default: false },
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'lg' },
  { name: 'status', type: 'boolean', default: true },
]
