---
name: test_gap_finder
description: Analyze current or proposed changes and identify missing unit, integration, regression, smoke, and edge-case tests.
---

# Test Gap Finder Skill

Use this skill after implementing behavior, changing code paths, fixing bugs, or before finalizing a PR.

## Output

Create `TEST_PLAN.md`.

## Format

```markdown
# TEST_PLAN.md

## Behavior Changed

## Existing Test Coverage

## Missing Tests

| Test Type | Scenario | Why Needed | Priority |
|---|---|---|---|

## Edge Cases

## Regression Tests

## Manual Smoke Tests

## Commands To Run

| Purpose | Command | Expected Result |
|---|---|---|

## Coverage Gaps Accepted For Now

## Done Criteria
```

## Rules

- Do not mark a feature done without verification.
- If tests cannot be run, document why and provide manual checks.
- Prefer targeted tests over broad brittle tests.
