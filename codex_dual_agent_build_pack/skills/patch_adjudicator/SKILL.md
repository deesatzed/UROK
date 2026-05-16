---
name: patch_adjudicator
description: Compare Codex and Claude patches, accept the best parts, reject unsafe changes, resolve conflicts, and update project memory.
---

# Patch Adjudicator Skill

Use this skill when multiple agents produce competing or complementary outputs.

## Inputs

- Codex patch
- Claude patch
- GOAL.md
- STANDARDS.md
- IMPLEMENT.md
- DECISIONS.md
- PROGRESS.md
- TASK_QUEUE.md
- test results

## Adjudication Matrix

Evaluate each change:

| Change | Source | Accept/Reject/Modify | Reason | Risk | Test Needed |
|---|---|---|---|---|---|

## Rules

Accept changes that:

- satisfy task acceptance criteria,
- are simpler,
- are safer,
- fit existing repo patterns,
- have tests,
- avoid scope creep.

Reject changes that:

- modify unrelated files,
- hide errors,
- weaken security,
- add unneeded dependencies,
- reduce maintainability,
- are unsupported by tests,
- conflict with STANDARDS.md.

## Required Output

Create or update:

- ADJUDICATION.md
- PROGRESS.md
- DECISIONS.md if needed
- TASK_QUEUE.md
