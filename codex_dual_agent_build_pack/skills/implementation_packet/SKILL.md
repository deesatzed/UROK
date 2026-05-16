---
name: implementation_packet
description: Create a pre-flight implementation packet before making non-trivial code changes.
---

# Implementation Packet Skill

Use this skill before making non-trivial code changes.

The goal is to prevent premature coding and force a clear, reviewable plan.

## Output

Create `IMPLEMENTATION_PACKET.md`.

## Format

```markdown
# IMPLEMENTATION_PACKET.md

## Task Being Attempted

## Actual User Goal

## Files Expected To Change

| File | Expected Change | Risk |
|---|---|---|

## Existing Patterns To Follow

## Assumptions

## Non-Goals For This Pass

## Step-by-Step Plan

## Acceptance Criteria

## Verification Plan

## Rollback Plan

## Risks

| Risk | Mitigation |
|---|---|

## Proceed / Block Decision
```

## Rules

- Prefer the smallest useful change.
- Do not include speculative improvements.
- If the plan is high risk, run `loophole_hunter` first.
- If multiple approaches exist, run `ranked_options` first.
