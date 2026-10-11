// T8.2 (REQ-025 AC2): the thumbnail rule of CnMediaCard as a plain function, so a unit test can run it (REQ-025 AC2 allows
// the type check or the development warning test). A thumbnail needs `alt`, or the explicit `decorative` flag. The component
// warns in development with the returned message. It returns nothing when the card is fine.
export interface ThumbnailInput {
  hasThumbnail: boolean
  decorative?: boolean
  alt?: string
}

export function thumbnailProblem({ hasThumbnail, decorative, alt }: ThumbnailInput): string | undefined {
  if (!hasThumbnail || decorative || alt?.trim()) return undefined
  return '[CnMediaCard] Pass `alt` for the thumbnail, or set `decorative` when the title already says it (REQ-025 AC2).'
}
