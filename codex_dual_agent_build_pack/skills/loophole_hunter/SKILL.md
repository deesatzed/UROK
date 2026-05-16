---
name: loophole_hunter
description: Stress-test a proposed strategy by finding loopholes, edge cases, false assumptions, and fixes before implementation.
---

# Loophole Hunter Skill

Use this skill before trusting a new strategy, architecture, migration, security decision, or high-risk implementation plan.

## Output

Create `LOOPHOLE_REVIEW.md`.

## Format

```markdown
# LOOPHOLE_REVIEW.md

## Strategy Under Review

## Confidence Estimate Before Review

| Area | Confidence | Reason |
|---|---:|---|

## Loopholes Found

| Loophole | Severity | Why It Matters | Fix |
|---|---|---|---|

## Revised Strategy

## Confidence Estimate After Fixes

## Remaining Uncertainty

## Proceed / Do Not Proceed Decision

## Required Verification
```

## Rules

- Never claim 100% certainty unless directly verified.
- If confidence cannot become high enough, mark the plan blocked.
- Search for security, privacy, dependency, deployment, UX, data, testing, and scope loopholes.
- Fix the strategy, then reassess confidence.
