// T6.2: the WCAG 2.x contrast math, with no Node in it. `check-contrast` (REQ-015) and the showcase's color previews
// (REQ-054 AC1) both import it, so the ratio on a swatch is the ratio `check-contrast` prints.

export type Usage = 'text' | 'large-text' | 'ui'

// REQ-015 AC2: WCAG 2.2 AA minimums.
export const MINIMUMS: Record<Usage, number> = { text: 4.5, 'large-text': 3, ui: 3 }

export type Rgba = [number, number, number, number]

export const parse = (hex: string): Rgba => {
  const channel = (i: number) => parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16) / 255
  return [channel(0), channel(1), channel(2), hex.length === 9 ? channel(3) : 1]
}

// WCAG 2.x relative luminance of an sRGB color.
function luminance([r, g, b]: Rgba): number {
  const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

// WCAG 2.x contrast ratio of a foreground over an opaque background. A translucent foreground is first blended
// over the background; a translucent background has no single color, so it throws.
export function contrastRatio(foreground: string, background: string): number {
  const bg = parse(background)
  if (bg[3] < 1) throw new Error(`${background} is translucent, so the color behind it is unknown`)
  const fg = parse(foreground)
  const blended = [0, 1, 2].map((i) => fg[i]! * fg[3] + bg[i]! * (1 - fg[3])) as unknown as Rgba
  const [lighter, darker] = [luminance(blended), luminance(bg)].sort((a, b) => b - a) as [number, number]
  return (lighter + 0.05) / (darker + 0.05)
}

export const round = (ratio: number) => Math.round(ratio * 100) / 100
