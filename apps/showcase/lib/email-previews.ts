// T10.5 (REQ-058): which compiled emails each `/email/*` page previews. A name is the file name of a build output in
// `packages/email/dist/` without `.html` (packages/email/build.ts), so the preview shows the file itself (SPEC.md §4.6).
// It is plain TypeScript with no Nuxt or Vite imports, so the page, the component, and the unit tests share it. Reading
// the files is in demo-registry.ts.

/** REQ-058 AC1: the widths of the toggle. 320 px is the narrowest phone, and 600 px is the email body width (A-08). */
export const EMAIL_WIDTHS = [320, 600] as const

/**
 * The `sandbox` attribute of the preview iframe. It is the strict set: no script runs, no form is sent, no popup opens,
 * and the page cannot be navigated. `allow-same-origin` only lets the showcase measure the height of the frame, and it is
 * safe without `allow-scripts`, because nothing in the frame can run.
 */
export const EMAIL_SANDBOX = 'allow-same-origin'

/** The title of each compiled email, as the preview heading shows it. */
export const EMAIL_TITLES: Record<string, string> = {
  header: 'Header with logo',
  'content-section': 'Content section',
  card: 'Card',
  button: 'Button',
  divider: 'Divider',
  footer: 'Footer',
  reference: 'Reference layout',
}

/**
 * The previews of each email doc, by doc slug. The foundations doc has no component of its own, so it shows the
 * reference layout, which applies the fallbacks that doc describes. Every other doc shows its own subject.
 */
export const EMAIL_PREVIEWS: Record<string, string[]> = {
  'email-foundations': ['reference'],
  'email-components': ['header', 'content-section', 'card', 'button', 'divider', 'footer'],
  'email-layouts': ['reference'],
}

/** The names of the emails a doc previews. A doc that is not an email doc has none. */
export const emailPreviewsFor = (slug: string | null | undefined): string[] =>
  slug ? (EMAIL_PREVIEWS[slug] ?? []) : []
