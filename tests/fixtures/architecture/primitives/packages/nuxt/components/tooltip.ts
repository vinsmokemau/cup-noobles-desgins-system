// Fixture: REQ-020 AC3 violations in a render function and a trap library.
import { h } from 'vue'
import { createFocusTrap } from 'focus-trap'

export const Tip = () => h('div', { role: 'tooltip' })
export const trap = createFocusTrap
