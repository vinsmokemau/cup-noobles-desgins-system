---
title: Doc title
slug: doc-title
layer: component
level: atom
source: nuxt-ui
nuxtUi: UComponentName
component: null
status: tbd
lang: en
brandRules: []
tokens: []
demos: []
tbd: []
related: []
since: 0.1.0
updated: YYYY-MM-DD
---

# Doc title

<!--
How to use this template (SPEC.md §4.2 and §4.3). This file is not published, and it is exempt from REQ-002 and REQ-003.
1. Copy this file into the folder for its layer (see SPEC.md §4.1). ADRs start from docs/06-governance/decisions/0000-adr-template.md instead.
2. Fill in the frontmatter. It must validate against docs/_schema/frontmatter.schema.json:
   - Required on every doc: title, slug (unique, kebab-case), layer, status, lang (always `en`), since, updated (ISO date).
   - layer: overview | foundation | component | pattern | content | email | governance | adr.
   - Component docs only: level (atom | molecule | organism) and source (nuxt-ui | custom).
     source nuxt-ui requires nuxtUi (for example UButton). source custom requires component (a Cn* name).
     Delete level, source, nuxtUi, and component on every other layer.
   - status: tbd | draft | stable | deprecated. A rule not sourced from BC, an ADR, or the owner keeps the doc `draft` (REQ-009).
   - brandRules, tokens, tbd, related: lists, may be empty. demos: component and pattern docs only.
3. Set the H1 to exactly the frontmatter `title`.
4. Keep only the H2 headings your layer requires, in the order below, and delete the rest. Each heading's comment names
   the layers that require it. Optional H3 subsections are free.
5. A required section that does not apply contains the single line `Not applicable.` and nothing else (REQ-003 AC2).
6. Never invent brand values (SPEC.md §0.1 rule 4). Record unknowns as `> **TBD (TBD-NN):** …` callouts (§4.4).
7. Delete every guidance comment, including this one.
-->

## Purpose

<!--
Required for: overview, foundation, component, pattern, content, email, governance.
Two or three sentences: what this is and which problem it solves. Name the BR IDs it implements.
-->

## Anatomy

<!--
Required for: component.
A numbered list of named parts, for example 1. container, 2. label, 3. leading icon, 4. glow.
Use the same part names in token paths.
-->

## Tokens and specs

<!--
Required for: foundation, component, email.
A generated block only (§4.5), written by `pnpm sync:docs`. Never type token values by hand (REQ-004).
The block opens with a `cn:generated` marker comment that has `tokens` and `format` attributes (table, contrast, or inventory),
and closes with a `/cn:generated` marker comment. Hand-written notes may follow the block.
-->

## Variants

<!--
Required for: component.
A table of the variants.
-->

## States

<!--
Required for: component.
A table listing every state from REQ-026 AC1 that applies, with the tokens that change in each.
-->

## Usage rules

<!--
Required for: overview, foundation, component, pattern, content, email.
Imperative statements, for example "Use `primary` for the single main action per view."
-->

### When to use

<!-- Imperative statements. -->

### When not to use

<!-- Imperative statements. -->

## Do and don't

<!--
Required for: foundation, component, pattern, content.
Paired rows. Each row names a demo example from apps/showcase/demos/<slug>/*.example.vue when one exists.
-->

## Accessibility

<!--
Required for: foundation, component, pattern, content, email.
Keyboard map (key → result), roles and ARIA attributes, contrast pairs used, and focus behavior.
-->

## Content

<!--
Required for: component, pattern.
Label rules, with UI copy examples in fenced blocks tagged `copy es-MX` or `copy-bad es-MX` (REQ-007).
-->

## Responsive behavior

<!--
Required for: foundation, component, pattern.
Behavior at each breakpoint token. Until TBD-13 is resolved, use 360, 768, and 1280 px.
-->

## Email notes

<!--
Required for: foundation, component.
The email equivalent, or `Not applicable.`
-->

## Code reference

<!--
Required for: foundation, component, pattern, email.
nuxt-ui components: the Nuxt UI component name, the props used, and where the theme is configured.
custom components: the import path and a props, slots, and events table.
email: the partial filename and its slots.
Snippets live in demo files; show the smallest usage example only.
-->

## Policy and process

<!--
Required for: governance.
The policy, and the steps that carry it out.
-->

## Context

<!--
Required for: adr. §4.2 row 14 (Context · Decision · Consequences) is three H2 headings, as in
docs/06-governance/decisions/0000-adr-template.md.
The problem, the forces at play, and the SPEC.md items involved. Facts only.
-->

## Decision

<!--
Required for: adr.
What was decided, stated as imperative rules, with each value's source.
-->

## Consequences

<!--
Required for: adr.
What becomes easier or harder, follow-up tasks, and what would trigger revisiting the decision.
-->

## Open items

<!--
Required for: overview, foundation, component, pattern, content, email, governance.
TBD callouts (`> **TBD (TBD-NN):** …`, REQ-005) and draft callouts (`> **Draft:** …`, REQ-009).
-->

## Changelog

<!--
Required for: overview, foundation, component, pattern, content, email, governance.
One line per change: `version — change — ADR/approval reference`.
-->
