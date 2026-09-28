---
title: Principles
slug: principles
layer: overview
status: draft
lang: en
brandRules: [BR-04, BR-05, BR-06, BR-09, BR-17]
tbd: []
related: [brand-identity, using-the-system, glossary]
since: 0.1.0
updated: 2026-09-27
---

# Principles

## Purpose

These principles guide decisions that no foundation, component, or pattern doc settles. They are derived only from the brand rules BR-04, BR-05, BR-06, BR-09, and BR-17, and they add no brand value of their own. Every principle is a draft until the owner approves it (REQ-009).

## Usage rules

Each principle below quotes the brand rules it comes from, then proposes how to apply them.

### 1. Geek culture, built well

From the brand rules:

> **BR-04:** The aesthetic is geek, gaming, anime, TCG, and board game culture, with a retro-arcade, neon, "sticker mascot logo" style.
>
> **BR-05:** The brand is premium, fun, and energetic. It is **never childish or generic.**

Proposed principle:

> **Draft:** Draw every choice from geek, gaming, anime, TCG, and board game culture, and execute it with premium care. A choice that reads as childish or generic is wrong, even when it is fun.

### 2. Legibility wins

From the brand rules:

> **BR-06:** The UI is high-contrast, vibrant, and legible.

Proposed principle:

> **Draft:** When vibrancy and legibility conflict, choose legibility. Decoration never lowers the contrast of text or of a control below the minimums that `check-contrast` enforces (REQ-015).

### 3. Bold presence, easy reading

From the brand rules:

> **BR-09:** Type feels bold, geek, and premium, with strong presence and easy legibility.

Proposed principle:

> **Draft:** Give type its presence through the type hierarchy, not through decoration. Strong presence never costs easy legibility.

### 4. Build the hype, keep it professional

From the brand rules:

> **BR-17:** The overall feel conveys anticipation, hype, energy, gamer/geek identity, visual professionalism, and memorable branding.

Proposed principle:

> **Draft:** Use energy to build anticipation, and keep every screen professional. Hype supports the content; it never hides the content or gets in its way.

### When to use

- Use these principles to decide a question that no other doc answers.
- Use them to choose between two options that both follow every rule in the other docs.
- Cite a principle by number and name when you record a decision in an ADR.

### When not to use

- Never use a principle to override a BR rule, a token, or a rule in another doc. The specific rule wins.
- Never use a principle as the source of a brand value such as a color, size, or typeface. Brand values come only from SPEC.md §2.1, an ADR, or the owner (SPEC.md §0.1).

## Open items

> **Draft:** Principles 1 to 4 are proposals derived from BR-04, BR-05, BR-06, BR-09, and BR-17. They await the owner's approval. This doc becomes `stable` only when its changelog references that approval or an ADR (REQ-009 AC2).

## Changelog

- 0.1.0 — First draft of principles 1 to 4, derived from BR-04, BR-05, BR-06, BR-09, and BR-17 (T4.1) — awaiting owner approval
