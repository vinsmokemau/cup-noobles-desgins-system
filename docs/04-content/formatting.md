---
title: Formatting
slug: formatting
layer: content
status: draft
lang: en
brandRules: []
tbd: []
related: [voice-and-tone, microcopy, forms, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Formatting

## Purpose

This doc says how numbers, currency amounts, dates, and times are written in the interface for es-MX. Every one of them is produced by the browser's `Intl` APIs, never by hand, so it follows the conventions of the locale and stays correct in every runtime. It sets display rules only: it contains no commerce logic, and it never decides what an amount is or how it is computed. Short UI text is in [Microcopy](microcopy.md), and the voice is in [Voice and tone](voice-and-tone.md).

## Usage rules

### When to use

#### Use the `Intl` APIs with `es-MX`

Pass the locale `es-MX` to every formatter, and use one API per kind of value:

| Value | API | Main options |
|---|---|---|
| Number | `Intl.NumberFormat` | `maximumFractionDigits`, `minimumFractionDigits`, `notation: 'compact'` |
| Percentage | `Intl.NumberFormat` | `style: 'percent'` |
| Currency amount | `Intl.NumberFormat` | `style: 'currency'`, `currency` |
| Date | `Intl.DateTimeFormat` | `dateStyle`, `timeZone` |
| Time | `Intl.DateTimeFormat` | `timeStyle`, `timeZone` |
| Relative time | `Intl.RelativeTimeFormat` | `numeric: 'auto'` |
| List of items | `Intl.ListFormat` | `type: 'conjunction'` |
| Singular or plural | `Intl.PluralRules` | none |

- Never write a separator, a month name, a currency symbol, or "a. m." by hand, and never build a date or a number from parts.
- Create a formatter once and reuse it. Keep the locale in one place, so it is not repeated in components.
- The text a formatter returns is copy. It is not stored, compared, or parsed. Keep the value as a number or a date, and format it only when it is shown.

#### Numbers

- Format every number with `Intl.NumberFormat('es-MX')`. In es-MX the comma groups thousands and the period starts the decimals.
- Set the number of decimals on purpose with `minimumFractionDigits` and `maximumFractionDigits`, so a column of numbers aligns.
- Use `notation: 'compact'` only where space is tight, and never for a number the person must read exactly.
- Format a percentage as a ratio, with `style: 'percent'`: pass `0.256`, not `25.6`.

```copy es-MX
1,234,567
1,234,567.891
1,234.50
26%
25.6%
1.2 M
```

#### Currency

**Currency amounts are display-only.**

- The design system formats an amount that it is given. It never adds, converts, rounds for accounting, or compares amounts, and it never decides which currency applies. The project that owns the amount does all of that.
- Pass the ISO 4217 code of the currency the project gives you in `currency`. Never hardcode it in a component, and never write the symbol by hand.
- Keep the amount as a number, or as the string the project sends, and format it only when it is shown.
- Show the same number of decimals for every amount in the same list or column.

```copy es-MX
$1,234.50
USD 1,234.50
```

#### Dates and times

- Format a date with `dateStyle`, and a time with `timeStyle`. Use the locale's own result, and do not force `hour12` or `hourCycle`.
- Use `dateStyle: 'long'` in a sentence, and `dateStyle: 'medium'` in a card or a list. Use `dateStyle: 'short'` only in a dense table, because a number-only date is easy to misread.
- Always pass `timeZone` explicitly. On the server and in the browser the default zone can differ, and the text then differs between the two (ER-03).
- Keep a date as an ISO 8601 value in data, and format it only when it is shown.
- Say "ayer" or "dentro de 3 días" with `Intl.RelativeTimeFormat` when the distance matters more than the date. Show the date as well when the person must act on it.

```copy es-MX
11 de octubre de 2026
11 oct 2026
11/10/26
2:30 p.m.
11 de octubre de 2026 a las 2:30 p.m.
ayer
dentro de 3 días
```

#### Lists and plurals

- Join the items of a list with `Intl.ListFormat`, so the last separator is "y".
- Choose a singular or a plural form with `Intl.PluralRules`. Never write "campo(s)".

```copy es-MX
dados, cartas y fichas
Revisa 1 campo
Revisa 3 campos
```

### When not to use

- Never use these rules to compute a value. Formatting turns a value into text, and nothing else.
- Never format an identifier, such as a number that names something and that nobody adds. Show it as it is.
- Never format a value that a person types as they type it. Format it when they leave the field.
- Never use them for another locale. A project that serves another locale passes that locale to the same APIs, and this doc is not its rule.

## Do and don't

| Do | Don't |
|---|---|
| Format with `Intl` and the locale `es-MX`. | Write separators, month names, or symbols by hand. |
| Keep a number or a date as data, and format it when it is shown. | Store the formatted text, or parse it back. |
| Pass the currency code that the project gives you. | Hardcode a currency or its symbol in a component. |
| Pass `timeZone` explicitly. | Rely on the default zone of the server or the browser. |
| Use a long or a medium date in text. | Use a number-only date where it can be misread. |
| Show the same decimals for every amount in a list. | Mix amounts with two decimals and with none. |

```copy es-MX
1,234.50
11 de octubre de 2026
dentro de 3 días
```

```copy-bad es-MX
1.234,50
1234.5
11 Octubre 2026
```

## Accessibility

- Show a date the person must act on in its long or medium form. A number-only date is easy to misread, and a screen reader reads it as a string of digits.
- Wrap a date or a time in the `<time datetime>` element, so assistive technology can read the machine value.
- Give a compact number such as "1.2 M" its full form in an accessible name or a tooltip when the exact value matters.
- Never use color alone to show that an amount is negative or positive. Write the sign.
- Keep the formatted text in the document language, `es-MX`, so a screen reader pronounces the digits and the month names correctly (WCAG 2.2 SC 3.1.1).

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: numbers, currency (display-only), dates, and times for es-MX with `Intl`, with es-MX examples (T9.3) — awaiting owner approval
