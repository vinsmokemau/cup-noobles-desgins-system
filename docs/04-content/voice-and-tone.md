---
title: Voice and tone
slug: voice-and-tone
layer: content
status: stable
lang: en
brandRules: [BR-05, BR-06, BR-17]
tbd: []
related: [microcopy, formatting, principles, forms, feedback, empty-states, error-pages, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Voice and tone

## Purpose

This doc says how Cup Noobles sounds when it writes to a person: in buttons, messages, labels, and empty states. The voice comes from two brand rules, and it adds no brand value of its own. The words themselves are Spanish (es-MX), and every example here is labelled with its locale (ER-04, A-06). The mechanics of short UI text are in [Microcopy](microcopy.md), and the formats of numbers, currency, and dates are in [Formatting](formatting.md).

## Usage rules

### When to use

The brand voice comes from these two rules:

> **BR-05:** The brand is premium, fun, and energetic. It is **never childish or generic.**
>
> **BR-17:** The overall feel conveys anticipation, hype, energy, gamer/geek identity, visual professionalism, and memorable branding.

Apply them to every sentence that a person reads in the interface:

- Write like a well-built geek brand: confident, warm, and precise. Energy comes from being specific, not from volume.
- Let hype build anticipation about the content. It never hides the content or gets in the way of the task (see [Principles](../00-overview/principles.md), principle 4).
- Use the vocabulary of the culture when it helps the person, and say it plainly when a newcomer might not know it.
- Address the person as "tú", in the second person singular, as the approved pattern docs already do. Never use "usted".
- Say what is true and useful first. Put the feeling second, and keep it short.
- Keep the tone steady across the product, and lower the energy when the person is stuck or something failed. Serious moments are written plainly, and they do not blame the person.

### When not to use

- Never write copy that is childish: no baby talk, no "¡Yupi!", no praise for finishing a normal task (BR-05).
- Never write copy that is generic: "Operación realizada con éxito" could belong to any brand (BR-05).
- Never joke about a failure, a loss, or the person's situation.
- Never use hype where there is nothing to be excited about. An empty promise is noise.
- Never put the voice before legibility: a short plain sentence beats a clever long one (BR-06).
- Never write in English in the interface. Docs are English, and customer-facing copy is es-MX (ER-04).

## Do and don't

The five "this, not that" pairs below state the voice attributes of BR-05 and BR-17 as a choice between two ways of writing. The owner approved them (TBD-21, ADR-0037).

Each pair has the attribute from the brand rules, what to do, and what to avoid. The examples are samples of how the pair reads in es-MX. They are not final copy.

| Voice attribute | This | Not that |
|---|---|---|
| Premium (BR-05, BR-17) | Clear and polished | Stiff and bureaucratic |
| Fun (BR-05) | Light and playful, with a point | Childish and over-excited |
| Energetic (BR-05, BR-17) | Lively and concrete | Loud and shouting |
| Gamer and geek identity (BR-17) | Fluent in the culture, and welcoming | Insider-only, with jargon that shuts people out |
| Anticipation and hype (BR-17) | Specific about what is coming | Hollow promises |

### Premium, not stiff

```copy es-MX
Tu partida ya está lista.
Cambios guardados
```

```copy-bad es-MX
Se ha completado satisfactoriamente la operación solicitada.
Su solicitud ha sido procesada.
```

### Fun, not childish

```copy es-MX
Partida creada. Falta invitar a tu mesa.
Todavía no hay jugadores. Comparte el enlace para que se sumen.
```

```copy-bad es-MX
¡Yupi! ¡Lo lograste, campeón!
Uy, qué vacío está esto
```

### Energetic, not loud

```copy es-MX
Empieza tu primera partida
Nuevo evento este sábado
```

```copy-bad es-MX
¡¡¡EMPIEZA YA!!!
¡¡NO TE LO PUEDES PERDER!!
```

### Geek-fluent, not insider-only

```copy es-MX
Crea una mesa para jugar con tu grupo.
Elige el juego y la fecha. Los demás verán tu partida y podrán apuntarse.
```

```copy-bad es-MX
Arma tu LFG para el próximo raid y sube tu build.
Haz el setup de tu party antes del drop.
```

### Hype with substance, not hollow

```copy es-MX
Faltan 3 días para el torneo.
El torneo empieza el sábado. Ya puedes apuntarte.
```

```copy-bad es-MX
¡Algo épico viene pronto!
Prepárate para lo que nunca has visto
```

## Accessibility

- Set the language of the page to `es-MX`, and mark a passage in another language with its own `lang`, so a screen reader pronounces it correctly (WCAG 2.2 SC 3.1.1 and 3.1.2).
- Write short sentences in plain words. Voice never makes a message harder to understand, and it never replaces the instruction the person needs.
- Do not use capital letters or exclamation marks for emphasis. Choose the words that carry the emphasis.
- Do not use an emoji or a symbol to carry meaning. A screen reader reads an emoji by its name, so one inside a sentence interrupts it.
- Do not use sound, color, or position to say what the words must say, so the message works for everyone (BR-06).

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: the brand voice from BR-05 and BR-17, and five proposed "this, not that" pairs (T9.3) — awaiting owner approval (TBD-21)
- 0.1.0 — Approved as stable by the owner, including the five "this, not that" pairs; TBD-21 is resolved — ADR-0037
