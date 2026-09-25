# Cup Noobles Design System

This repository is built with Spec-Driven Development. `SPEC.md` is the contract: code is built from it, never the other way around.

## How work arrives
- Work comes as exactly one task from SPEC.md §6, usually through `/task <id>` (for example `/task T0.1`).
- Do one task per session. Never start the next task, even if it looks small.
- Before changing anything, read SPEC.md §0 (execution protocol, Definition of Done) and §2 (rules, conflicts, assumptions, TBD register). Once `DESIGN.md` exists, read it as well.

## Hard rules
- Never invent brand values: colors, typefaces, sizes, radii, stroke widths, glow, spacing, motion, icons, logos, or artwork. Valid sources are SPEC.md §2.1, an ADR in `docs/06-governance/decisions/`, or the owner in chat. Anything else follows the TBD convention in SPEC.md §4.4.
- Never edit `docs/00-overview/brand-context-source.md`. It is hash-locked.
- If SPEC.md, the brand source, and an ADR disagree, stop. Quote both passages and ask the owner.
- Only change SPEC.md to tick the finished task's checkbox. Any other amendment needs the owner (SPEC.md §8).
- Never push, publish packages, deploy, or change GitHub settings unless the task says so and the owner confirms in chat.

## Instruction mirrors
- `AGENTS.md` is an exact copy of `CLAUDE.md`, and `.agents/skills/` is an exact copy of `.claude/skills/`, for other coding agents (owner decision, 2026-09-25).
- Whenever `CLAUDE.md` or a file in `.claude/skills/` changes, apply the same change to its mirror in the same commit.

## Commands
The commands in SPEC.md §0.3 (`pnpm test`, `pnpm test:all`, `pnpm check:docs`, and others) exist from Phase 1 onward. Before a task reports done, the full suite must pass.
