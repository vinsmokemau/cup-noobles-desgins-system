---
title: "ADR-0004: MJML version, token injection, slot survival, inlining, and output size"
slug: adr-0004-mjml-email-spike
layer: adr
status: draft
lang: en
brandRules: [BR-01, BR-03]
tbd: []
related: [adr-0003-style-dictionary-dtcg-spike]
since: 0.1.0
updated: 2026-09-25
---

# ADR-0004: MJML version, token injection, slot survival, inlining, and output size

## Context

OD-12 is decided: email sources are written in MJML (OA-6, A-14). This ADR records that decision. §4.9 says MJML sources reference tokens with the build-time syntax `$cn(color.brand.primary)`, and that `build.ts` replaces these references with values from `email-tokens.json` **before** MJML compiles. Content slots use `{{ slot_name }}` and must reach the output untouched. REQ-041 AC2 requires the compiled HTML to contain no `<link rel="stylesheet">`, no `var(`, no `<script>`, and no external CSS. REQ-044 AC1 forbids backend template tags (`{%`, `<%`, `@{`).

Task T0.4 built the smallest possible spike in `spikes/0004-email/`:

- `src/button.mjml` holds one `mj-button` whose fill and label color come from `$cn(button.primary.bg)` and `$cn(button.primary.label)`. The label is the `{{ label }}` slot. The spike also puts a `{{ url }}` slot in `href`, to test a slot inside an attribute.
- `email-tokens.json` is a hand-written fixture in the shape that ADR-0003 fixed for `dist/email/email-tokens.json` (a flat map from DTCG path to literal). It holds two values only: `#ef80ae` (BR-01) for the fill, and `#000000` (BR-03) for the label, because §2.1 (derived facts) requires labels on primary-filled buttons to be black. The token names are spike names. T3.x defines the real ones.
- `build.mjs` replaces `$cn(...)` on the MJML source, compiles each `src/*.mjml` with MJML, and writes `dist/<name>.html`.
- `verify.mjs` runs two builds in separate Node processes, checks the output, and runs five control compiles (see "Evidence").

Versions used by the spike: Node 24.19.0, pnpm 12.6.0, and `mjml` 5.4.1.

## Decision

### 1. Version and license

Pin `mjml` to exactly **5.4.1** (the `latest` dist-tag on 2026-09-25), which is licensed **MIT**. It is a **devDependency** of `packages/email` only. The published package ships compiled HTML, so it has no runtime dependency on MJML. Any upgrade is its own task, with a rerun of these checks.

MJML 5's `mjml2html(input, options)` is **async**: it returns a promise of `{ html, errors }`. `build.ts` must `await` it.

### 2. Token injection: a plain string replacement before MJML

`$cn(path)` is replaced with `email-tokens.json[path]` by a regular expression on the MJML source, before MJML parses it. MJML never sees `$cn(`. The replacement must **throw on an unknown path**, which the spike proves with a control compile. This is the only injection mechanism. MJML's own `mj-attributes` and `mj-class` stay available for structure, but never carry literal values (REQ-042 AC2).

### 3. Compile options that REQ-041 needs

`build.ts` must pass these options to MJML:

| Option | Value | Why |
|---|---|---|
| `fonts` | `{}` | By default, MJML adds a Google Fonts `<link>` and an `@import url(...)` whenever a `font-family` matches one of its built-in fonts (Open Sans, Droid Sans, Lato, Roboto, Ubuntu). `mj-button` defaults to Ubuntu, so a plain compile violates REQ-041 AC2. A control compile without `fonts: {}` shows the `<link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700">`. If TBD-01 resolves to a font that is available on the web, loading it is a separate ADR (see REQ-040 on font fallback). |
| `validationLevel` | `'strict'` | The default, `'soft'`, compiles invalid markup and only returns warnings. `'strict'` throws, which the spike proves with an illegal attribute. |
| `minify` | `false` (default) | Minification keeps both slots intact, but it saves only about 140 B gzipped on the button (see "Output size"), and it makes the HTML harder to review and to port. T10.2 can revisit this. |

### 4. `{{ }}` slots survive compilation

`{{ label }}` in text content and `{{ url }}` inside `href` both reach the output byte for byte, including the inner spaces. They also survive `mj-style inline="inline"` (juice) and `minify: true`. MJML does not escape or URL-encode them.

### 5. Inlining behavior

- **Component attributes become inline styles.** MJML writes each `mj-button` attribute directly into `style="..."` and `bgcolor` on the generated table cell and link: `background:#ef80ae` and `color:#000000`. No inliner is needed for this.
- **MJML keeps some CSS in `<head>`.** The output has 4 `<style>` blocks: MJML's reset, the responsive column media queries, and an Outlook-only fix. These are embedded, not external, so REQ-041 AC2 allows them. They cannot be inlined, because media queries need a stylesheet.
- **`mj-style inline="inline"` runs juice.** CSS in such a block is inlined into the matching elements (a control compile proves it). Plain `mj-style` stays in `<head>`.
- **MJML fills every attribute you leave unset with its own default.** The spike output contains `font-family:Ubuntu, Helvetica, Arial, sans-serif`, `font-size:13px`, `border-radius:3px`, and `padding:10px 25px`. **These are MJML defaults, not brand values.** T10.2 and T10.3 must set every brand-relevant attribute from a `$cn(...)` token (a TBD placeholder until TBD-01, TBD-03, TBD-10, and TBD-11 are resolved), so no MJML default reaches a component.
- **`<html lang>` defaults to `und`.** T10.2 must set `lang` on the root `<mjml>` element.
- The Outlook conditional block contains a `<noscript>` element. It is not a `<script>`, and the REQ-041 AC2 test should match `<script\b`, as the spike does.

### 6. Output size

For the single button: **4,331 B** (1,372 B gzipped) by default, and 3,333 B (1,234 B gzipped) with `minify: true`. About 4 KB of this is MJML's fixed document skeleton, so per-component growth will be much smaller. Gmail clips messages above roughly 102 KB, so the reference layout (T10.4) should report its size.

Two builds produced byte-identical HTML, and no output contains CR characters.

## Consequences

- `packages/email/build.ts` (T10.2) copies this spike's pattern: the `$cn()` replacement that throws on unknown paths, then `await mjml2html(source, { fonts: {}, validationLevel: 'strict' })`, and it fails on any returned error.
- The REQ-041 AC2 and REQ-044 AC1 tests can reuse the checks in `verify.mjs`: no `<link`, no `<script\b`, no `var(`, no `@import` or `url(`, no `{%`, `<%`, or `@{`, and every hex in the output present in `email-tokens.json` (REQ-042 AC1).
- Every brand-relevant MJML attribute in the real components must come from a token, so no MJML default leaks through (section 5). REQ-042 AC2 (no hex literals in MJML sources) does not catch MJML defaults. T10.2 should add a test that the output contains no `Ubuntu` font and no MJML default size or radius.
- The spike checks MJML behavior only. It does not test rendering in real email clients (R-05). `spikes/` is deleted in T1.1.
- Revisit this ADR when upgrading `mjml` past 5.4.1, especially if the default `fonts` map, the default `mj-button` attributes, the async API, or template-syntax handling during minification changes.

### Evidence

Run from `spikes/0004-email`: `pnpm install`, then `pnpm verify`.

```text
PASS  Build into .verify/a exits 0
PASS  Build into .verify/b exits 0
PASS  Byte-identical across two builds  [8ef9e4b47503]
PASS  Injected hex present: button.primary.bg
PASS  Injected hex present: button.primary.label
PASS  No $cn( left in output
PASS  {{ label }} intact (text slot)
PASS  {{ url }} intact (attribute slot)
PASS  No var(
PASS  No <link> (no external stylesheet)
PASS  No <script>
PASS  No @import or url( (no external CSS)
PASS  No backend template tags ({%, <%, @{)
PASS  Every hex in output is in email-tokens.json  [#ef80ae,#000000]
PASS  No CR line endings
PASS  Observed: component attributes render as inline style=""
PASS  Observed: MJML keeps its reset and media queries in <head> <style> blocks  [4 blocks]
PASS  Observed: <noscript> inside the Outlook conditional (not a <script>)
PASS  Observed: MJML defaults fill unset attributes (not brand values)  [font-family:Ubuntu, Helvetica, Arial, sans-serif | font-size:13px | border-radius:3px | padding:10px 25px]
PASS  Observed: <html lang> defaults to "und"
PASS  Control: mj-style inline="inline" is inlined by juice
PASS  Control: {{ label }} and {{ url }} survive juice inlining
PASS  Control: without fonts: {}, MJML adds a Google Fonts <link> and @import  [https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700]
PASS  Control: an unknown $cn() path fails the build  [Unknown token in $cn(button.primary.missing)]
PASS  Control: validationLevel strict rejects an invalid attribute  [Line 5 of ...\spikes\0004-email (mj-button) — Attribute bogus is illegal]
PASS  Control: minify keeps {{ label }} and {{ url }}

Output size of button.html:
  default:    4331 B (gzip 1372 B)
  minify:true 3333 B (gzip 1234 B)

SHA-256 button.html: 8ef9e4b47503140467f0f5421f3a0bb374e6918470d7b105de2d22acd0d7354c
```

The button cell and link in the compiled HTML:

```html
<td
   align="center" bgcolor="#ef80ae" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#ef80ae;" valign="middle"
>
  <a
     href="{{ url }}" style="display:inline-block;background:#ef80ae;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"
  >
    {{ label }}
  </a>
</td>
```
