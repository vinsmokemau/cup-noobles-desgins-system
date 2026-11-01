// T14.7: the raster logo for the email header (REQ-041 AC4, DSR-05, ADR-0063). Most email clients do not render SVG, so
// the `{{ logo_url }}` slot needs a PNG. This script renders the horizontal wordmark, `LogoHorizontal-CN.svg`, as it is
// (no redrawing, no recoloring) on a transparent background, at twice the display height for high-density screens.
// The display height is `logo.rule.minHeight.horizontal`, read from the tokens, and the width follows the SVG's aspect
// ratio. Usage: node packages/email/logo.ts [--svg file] [--out file].
import { chromium } from '@playwright/test'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

export const DEFAULT_SVG = resolve(here, '../nuxt/assets/brand/LogoHorizontal-CN.svg')
export const DEFAULT_PNG = resolve(here, 'assets/logo-horizontal.png')
// The horizontal wordmark is shown at `logo.rule.minHeight.horizontal` (36px, ADR-0016); the file has twice that.
export const DISPLAY_HEIGHT = 36
export const PIXEL_RATIO = 2

/** The width and height of an SVG's `viewBox`. */
export function svgSize(svg: string): { width: number; height: number } {
  const match = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/.exec(svg)
  if (!match) throw new Error('The SVG has no viewBox')
  return { width: Number(match[1]), height: Number(match[2]) }
}

/** The pixel size of the PNG: `PIXEL_RATIO` times the display height, and the width that keeps the aspect ratio. */
export function pngSize(svg: string): { width: number; height: number } {
  const { width, height } = svgSize(svg)
  const pixelHeight = DISPLAY_HEIGHT * PIXEL_RATIO
  return { width: Math.round((width / height) * pixelHeight), height: pixelHeight }
}

export async function buildLogo({ svgFile = DEFAULT_SVG, outFile = DEFAULT_PNG } = {}): Promise<{
  width: number
  height: number
}> {
  const svg = readFileSync(svgFile, 'utf8')
  const size = pngSize(svg)
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: size })
    // The SVG fills the page exactly: `width` and `height` set on the root element, with the viewBox scaling it.
    const sized = svg.replace(/<svg\b/, `<svg width="${size.width}" height="${size.height}"`)
    await page.setContent(
      `<!doctype html><html><body style="margin:0;background:transparent">${sized.replace(/^<\?xml[^>]*\?>/, '')}</body></html>`,
    )
    const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, ...size } })
    mkdirSync(dirname(outFile), { recursive: true })
    writeFileSync(outFile, png)
  } finally {
    await browser.close()
  }
  return size
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flag = (name: string) => {
    const at = process.argv.indexOf(name)
    const value = at === -1 ? undefined : process.argv[at + 1]
    return value === undefined ? undefined : resolve(value)
  }
  const { width, height } = await buildLogo({
    svgFile: flag('--svg') ?? DEFAULT_SVG,
    outFile: flag('--out') ?? DEFAULT_PNG,
  })
  console.log(`Logo: ${width}x${height} px (shown at ${width / PIXEL_RATIO}x${height / PIXEL_RATIO}).`)
}
