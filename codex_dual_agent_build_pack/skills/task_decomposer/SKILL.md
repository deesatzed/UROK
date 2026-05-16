---
name: task_decomposer
description: Break a large software request into atomic, Codex-sized tasks with acceptance criteria, verification, and rollback notes.
---

# Task Decomposer Skill

Use this skill when a request is too large, vague, risky, or multi-step for one safe coding pass.

## Output

Create or update `TASKS.md` and `PROGRESS.md` if present.

## TASKS.md Format

```markdown
# TASKS.md

## Task Overview

## Assumptions

## Atomic Tasks

### Task 1: [Name]

**Purpose:**

**Description:**

**Likely Files:**

**Acceptance Criteria:**

- [ ] Criterion 1
- [ ] Criterion 2

**Verification:**

**Rollback Plan:**

**Depends On:**

**Estimated Risk:** Low / Medium / High
```

## Rules

- Each task must be small enough for one focused Codex run.
- Put critical path first.
- Do not hide risks.
- Include tests or manual verification for each task.
- Mark unclear tasks as blocked rather than guessing silently.
