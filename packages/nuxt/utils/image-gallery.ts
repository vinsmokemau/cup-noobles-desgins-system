// T15.3 (REQ-025 AC2 applied to the gallery, ADR-0066): the picture rule of CnImageGallery as plain functions, so a unit test can
// run them. Every picture needs `alt`, or the explicit `decorative` flag, as the thumbnail of CnMediaCard does. The component
// warns in development with the returned message. A picture without a `src` shows the brand d20 and needs neither.
export interface GalleryPicture {
  src?: string
  alt?: string
  decorative?: boolean
}

export function pictureProblem(items: GalleryPicture[]): string | undefined {
  const position = items.findIndex((item) => item.src && !item.decorative && !item.alt?.trim())
  if (position === -1) return undefined
  return `[CnImageGallery] Picture ${position + 1} needs \`alt\`, or set \`decorative\` when the text near the gallery already says it (REQ-025 AC2).`
}

/** The position that a carousel `select` event reports, kept inside the pictures that exist. */
export function clampPosition(position: number, total: number): number {
  return Math.min(Math.max(position, 0), Math.max(total - 1, 0))
}
