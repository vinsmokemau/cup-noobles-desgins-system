---
title: Microcopy
slug: microcopy
layer: content
status: stable
lang: en
brandRules: [BR-05, BR-06]
tbd: []
related: [voice-and-tone, formatting, button, form-field, alert, toast, modal, forms, feedback, empty-states, error-pages, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Microcopy

## Purpose

Microcopy is the short text a person reads while they act: button labels, error messages, empty states, and confirmations. This doc sets the mechanics for writing it, so every message says what happened and what to do, in the brand voice (BR-05) and in words that are easy to read (BR-06). The voice itself is in [Voice and tone](voice-and-tone.md). The patterns that place this text on screen are [Forms](../03-patterns/forms.md), [Feedback](../03-patterns/feedback.md), [Empty states](../03-patterns/empty-states.md), and [Error pages](../03-patterns/error-pages.md).

Components hold no copy of their own. All text arrives through props or slots, so the words are always the product's to write (A-11).

## Usage rules

### When to use

#### Button labels

- Start with a verb, and add the object when it helps: "Crear partida", "Guardar cambios".
- Use one to three words, in sentence case, with no final period.
- Say what will happen, not what the person does with the mouse: never "Aceptar", "OK", "Sí", or "Haz clic aquí".
- Name the two actions of a decision with different verbs: the action, and "Cancelar".
- Give an icon-only button an accessible name that is the same verb phrase.

```copy es-MX
Crear partida
Guardar cambios
Enviar mensaje
Borrar borrador
Cancelar
```

```copy-bad es-MX
Aceptar
OK
Sí
Haz clic aquí
ENVIAR
```

#### Error messages

Write an error in this order, and stop when you run out of useful things to say:

1. **What happened**, or what to fix. This part is always present.
2. **Why**, when it is known and the person can use it.
3. **What to do next.** This part is always present.

- Write one sentence for a field error, and one or two for a message. End each with a period.
- Say "no pudimos" when the failure is ours, and do not blame the person.
- Never show a code, a status, or a technical word as the whole message.
- Never start with "Error" or write the message in capital letters.
- Keep the message next to what it is about, and name the field it concerns.

```copy es-MX
No pudimos subir la portada
El archivo es demasiado grande. Elige una imagen más ligera e inténtalo de nuevo.
Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.
No pudimos guardar
Revisa tu conexión e inténtalo de nuevo.
```

```copy-bad es-MX
Error 500
ERROR: archivo inválido
Escribiste mal el correo
Algo salió mal
```

#### Empty-state text

An empty state has three parts, written as in the [Empty states](../03-patterns/empty-states.md) pattern:

1. **A title** that says what is empty, in a few words.
2. **One sentence** that says what the person can do.
3. **An action** that is a verb with its object, when there is a useful one.

- Name the search in a no-results state, so the person sees what was looked for.
- Never blame the person for the emptiness.

```copy es-MX
Aún no tienes partidas
Aquí verás las partidas que crees. Empieza con la primera.
Crear partida
Sin resultados para «dados»
Revisa la ortografía o prueba con otra palabra.
```

```copy-bad es-MX
Sin datos
No hay nada aquí
No hiciste nada todavía
```

#### Confirmation text

A confirmation is one of two things, and each is written differently.

- **A result**, after the action. Write it as what is now true, with the object first: "Cambios guardados", "Partida creada". Add one sentence only when the person needs it.
- **A decision**, before the action. Write the title as the action and its object, write one sentence that says what will change or be lost, and write the buttons as verbs. The button that does the action repeats its verb: "Borrar borrador", next to "Cancelar".

Never ask "¿Está seguro?". Say what will happen instead.

```copy es-MX
Cambios guardados
Tu perfil ya está actualizado.
Borrar borrador
No podrás recuperarlo después.
Borrar borrador
Cancelar
```

```copy-bad es-MX
¿Está seguro de que desea continuar?
Operación exitosa
¡¡Listo!!
Sí
No
```

### When not to use

- Never fill a space with text that says nothing, such as "Bienvenido" above a page that has a heading.
- Never put a message only in an icon, an image, or a color. The words carry the meaning.
- Never leave a placeholder in a field as its label. A label stays visible (see [Forms](../03-patterns/forms.md)).
- Never use an exclamation mark, a string of capital letters, or an emoji for emphasis.
- Never write a number, a currency amount, a date, or a time by hand. Format it as [Formatting](formatting.md) says.
- Never write the interface copy in English. Docs are English, and customer-facing copy is es-MX (ER-04).

## Do and don't

| Do | Don't |
|---|---|
| Start a button label with a verb, and name the object. | Use "Aceptar", "OK", or "Sí". |
| Say what happened, and what to do next. | Show an error code with no sentence. |
| Say "no pudimos" when the failure is ours. | Say "Escribiste mal" and blame the person. |
| Name what is empty, and the action that fills it. | Say "Sin datos" and stop. |
| Name the consequence in a confirmation. | Ask "¿Está seguro?". |
| Keep one voice across buttons, errors, and confirmations. | Switch between formal and casual in the same screen. |

## Accessibility

- A control's accessible name starts with its visible label, so people who use speech input can say what they see (WCAG 2.2 SC 2.5.3).
- A button or link says its purpose in its own words, so the label makes sense out of context (SC 2.4.4). Never use "Haz clic aquí" or "Ver más" alone.
- An error is identified in text and says how to fix it (SC 3.3.1 and 3.3.3). Color or an icon alone never carries it.
- A message that appears without moving focus is a `role="status"` or `role="alert"` region, so a screen reader announces it (SC 4.1.3).
- Mark the language of the page as `es-MX` (SC 3.1.1).
- Write sentences a person can read at a glance. A long message is split into short sentences, and the instruction comes first.

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: button labels, error message structure, empty-state text, and confirmation text, with es-MX examples (T9.3) — awaiting owner approval
- 0.1.0 — Approved as stable by the owner — ADR-0037
