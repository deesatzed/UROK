---
name: debug_matrix
description: Diagnose bugs using 3-5 likely root causes, three checks or mitigations per cause, likelihood ranking, and a minimal safe fix path.
---

# Debug Matrix Skill

Use this skill before fixing unclear bugs, failing tests, crashes, broken builds, bad output, or repeated implementation failures.

Do not patch first. Diagnose first.

## Output

Create `DEBUG_MATRIX.md`.

## Format

```markdown
# DEBUG_MATRIX.md

## Symptom

## Reproduction Steps

## Known Facts

## Unknowns

## Root Cause Matrix

| Root Cause | Likelihood | Evidence For | Evidence Against | Diagnostic Check | Mitigation 1 | Mitigation 2 | Mitigation 3 |
|---|---:|---|---|---|---|---|---|

## First Diagnostic To Run

## Minimal Safe Fix

## Regression Test Needed

## If This Fails

If the first fix fails, run `first_principles_alien_goggles` before attempting another patch.
```

## Rules

- Identify 3-5 root causes.
- Include three checks or mitigations per root cause.
- Rank by likelihood.
- Try the smallest safe diagnostic first.
- Do not apply broad rewrites as a first fix.
