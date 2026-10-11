// mjml ships no types. This declares the part of its API that build.ts uses (ADR-0004: `mjml2html` is async in MJML 5).
declare module 'mjml' {
  interface MjmlError {
    line?: number
    message: string
    tagName?: string
  }

  interface MjmlOptions {
    fonts?: Record<string, string>
    keepComments?: boolean
    minify?: boolean
    validationLevel?: 'strict' | 'soft' | 'skip'
  }

  export default function mjml2html(
    input: string,
    options?: MjmlOptions,
  ): Promise<{ html: string; errors: MjmlError[] }>
}
