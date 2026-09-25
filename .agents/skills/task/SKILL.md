---
name: task
description: Execute exactly one task from SPEC.md by its ID, following the SDD protocol and Definition of Done.
argument-hint: "[task-id, e.g. T0.1]"
disable-model-invocation: true
---

Execute task $ARGUMENTS from SPEC.md. Do only this task.

## 1. Load context
- Read SPEC.md §0 and §2.
- Find the task block for $ARGUMENTS in SPEC.md §6. Read every REQ it lists in §3, and the §4 sections those REQs mention.
- If DESIGN.md exists, read it.

## 2. Check the gate (stop and report if any check fails)
- Every task under "Depends on" is marked `[x]` in SPEC.md §6.
- Every OD named on the task is marked decided in SPEC.md §7.2.
- `git status` shows a clean working tree. This check doesn't apply to T0.1 before the repository exists.

## 3. Plan
In 5 to 10 lines, state the files you will create or change, the tests you will add, and how each acceptance criterion and the "Done when" statement will be proven. Then proceed, unless the plan needs a decision from the owner. In that case, ask and stop.

## 4. Implement
- Follow SPEC.md exactly. Never invent brand values; use the TBD convention (§4.4).
- If the spec is ambiguous or contradicts itself, quote the passages and ask. Do not pick one.
- For steps only the owner can do (for example GitHub settings), list them for the owner. Never fake or skip them.

## 5. Verify
- Run every check that exists so far (§0.3). Before T1.2, there are none.
- Go through the Definition of Done in §0.2 and report each item as pass or fail, with evidence.

## 6. Close
- If any Definition of Done item fails, do not mark the task done. Report what failed and stop.
- Otherwise, commit the work as `$ARGUMENTS: <task title>`.
- Then mark the task `[x]` in SPEC.md §6, adding today's date and that commit's short SHA, and commit that change as `$ARGUMENTS: mark done`.
- Do not push.
- Report what changed, the Definition of Done results, any open questions, and the next tasks whose dependencies are now met.
