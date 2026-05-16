---
name: blocker_detector
description: Determine whether the autonomous build loop is truly blocked, should continue with mitigations, or should switch strategy using first principles and alien goggles.
---

# Blocker Detector Skill

Use when a task fails, repeats, or cannot proceed.

## Required Analysis

For the current blocker:

1. State the exact failure.
2. Identify 3–5 possible root causes.
3. Provide 3 mitigations per root cause.
4. Rank root causes by likelihood.
5. Try the smallest safe diagnostic first.
6. If still blocked, run first-principles and alien-goggles analysis.
7. Decide whether to continue, change strategy, or stop for user input.

## True Blockers

Only these justify stopping:

- missing API key or credential,
- missing user account or login,
- required paid service unavailable,
- destructive action requires approval,
- private data access unavailable,
- legal/compliance concern,
- unclear product decision that changes scope,
- repeated verification failure after mitigation attempts,
- unsafe requested behavior.

## Not True Blockers

These should be worked around:

- missing optional dependency,
- failing test with visible error,
- unclear code structure,
- outdated README,
- lint errors,
- type errors,
- package install issue with known alternatives,
- ambiguous implementation detail where assumption can be documented.

## Required Output

Update PROGRESS.md with:

- Blocked / Continue / Change Strategy
- evidence,
- attempted fixes,
- next action,
- user question only if truly necessary.
