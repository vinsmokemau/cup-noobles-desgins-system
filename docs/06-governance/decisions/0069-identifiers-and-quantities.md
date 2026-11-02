---
title: "ADR-0069: Identifiers and quantities in number formatting"
slug: adr-0069-identifiers-and-quantities
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [formatting, key-value-list]
since: 1.5.0
updated: 2026-11-02
---

# ADR-0069: Identifiers and quantities in number formatting

## Context

The storefront's attribute table, built on `CnKeyValueList`, showed raw numbers, and `formatting.md` said "format every number". A year formatted with `Intl.NumberFormat('es-MX')` gives "2,024" (checked in Chromium 153), and 1200 gives "1,200".

## Decision

1. A quantity is a number that people add, compare, or average. It uses `Intl.NumberFormat('es-MX')` with decimals set on purpose.
2. An identifier (year, figure number, edition number, code) is plain text with no grouping.
3. The test is: would anyone add it to another one? If not, it is an identifier.
4. The consumer decides per attribute. `CnKeyValueList` does not change (A-11).

The owner chose this wording (option A, with the test question) in chat on 2026-11-02, after comparing it with a fixed list of identifier kinds and with no new rule.

## Consequences

- The "Numbers" section replaces the old one-line identifier bullet in "When not to use".
- A doc-only change, released in the next lockstep minor version.
