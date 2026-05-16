---
name: code_review_adversary
description: Review code or a diff like a skeptical senior engineer across correctness, security, tests, maintainability, UX, and regression risk.
---

# Code Review Adversary Skill

Use this skill before finalizing a change, PR, merge, or final answer.

## Output

Create `REVIEW.md`.

## Format

```markdown
# REVIEW.md

## Review Scope

## Summary Judgment

Proceed / Needs Fixes / Blocked

## Findings

| Severity | Category | Finding | Why It Matters | Required Fix |
|---|---|---|---|---|

## Correctness

## Security and Privacy

## Tests

## Maintainability

## Performance

## UI/UX Impact

## Regression Risk

## Scope Creep Check

## Required Fixes Before Done

## Optional Improvements
```

## Rules

- Be skeptical but practical.
- Separate required fixes from optional improvements.
- Do not invent requirements beyond project scope.
- If a serious flaw exists, mark the work blocked.
