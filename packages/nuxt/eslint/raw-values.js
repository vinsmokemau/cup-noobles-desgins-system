// Finds the raw visual values that REQ-016 AC1 forbids in packages/nuxt and apps/showcase: color literals
// (hex, rgb(), hsl(), and the other CSS color functions) and px, rem, or ms dimensions. Zero is the one
// allowed exception, with or without a unit. A color function that wraps a var() is not a literal.

const colorLiteral = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([^()]*\)/gi
// `_` may surround a value: Tailwind arbitrary values use it for spaces, as in `shadow-[0_0_4px_…]`.
const dimensionLiteral = /(?<![a-z0-9.])-?(?:\d+\.?\d*|\.\d+)(?:px|rem|ms)(?![a-z0-9])/gi

/** @returns {{ index: number, text: string }[]} every raw value in `text`, in order */
export function findRawValues(text) {
  const found = []
  for (const match of text.matchAll(colorLiteral)) found.push({ index: match.index, text: match[0] })
  for (const match of text.matchAll(dimensionLiteral)) {
    if (Number.parseFloat(match[0]) !== 0) found.push({ index: match.index, text: match[0] })
  }
  return found.sort((a, b) => a.index - b.index)
}

// In CSS, only declarations carry visual values, so selectors (`#id`) and at-rule preludes
// (`@media (min-width: …)`) are skipped. `@apply` counts, because it applies utility classes.
const declarationValue = /(?:(?<=^|[;{}])\s*(?:--[\w-]+|[a-z-]+)\s*:|@apply\s)([^;{}]*)(?=[;}]|$)/gi

/** @returns {{ index: number, text: string }[]} every raw value inside a declaration of `css` */
export function findRawValuesInCss(css) {
  const code = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => ' '.repeat(comment.length))
  const found = []
  for (const match of code.matchAll(declarationValue)) {
    const value = match[1] ?? ''
    const start = match.index + match[0].length - value.length
    for (const raw of findRawValues(value)) found.push({ index: start + raw.index, text: raw.text })
  }
  return found
}
