---
name: ensemble_review
description: Combine Codex self-review and Claude Code review into one adjudicated review report before accepting or merging changes.
---

# Ensemble Review Skill

Use this skill after meaningful changes and before marking a task Done.

## Review Sources

- Codex self-review
- Claude Code review if available
- Test results
- Static checks if available

## Required Output

Create ENSEMBLE_REVIEW.md with:

| Finding | Source | Severity | Accepted? | Reason | Required Fix |
|---|---|---|---|---|---|

## Final Decision

Use one of:

- Approve
- Approve with minor fixes
- Block until fixed

## Rules

Codex must not blindly accept Claude's findings.
Codex must explain accepted and rejected findings.
Critical or high-severity accepted findings must be fixed before the task is marked Done.
