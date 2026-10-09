// The controls of the skeleton playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'shape', type: 'select', options: ['line', 'block', 'circle'], default: 'line' },
  { name: 'lines', type: 'number', default: 3, min: 1, max: 6, step: 1 },
]
