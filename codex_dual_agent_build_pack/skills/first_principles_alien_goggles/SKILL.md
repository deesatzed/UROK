---
name: first_principles_alien_goggles
description: Reduce a task to first principles, then search for overlooked or non-obvious alternatives before choosing a strategy.
---

# First Principles + Alien Goggles Skill

Use this skill before architecture, strategy, migration, difficult design choices, or after failed debugging attempts.

## Output

Create `FIRST_PRINCIPLES_REVIEW.md`.

## Format

```markdown
# FIRST_PRINCIPLES_REVIEW.md

## Actual Goal

## Basic Truths

## Real Constraints

## Assumed Constraints

## Smallest Useful Outcome

## Obvious Solution

## Alien Goggles Alternatives

| Alternative | Estimated Chance of Success | Why It Might Work | Why It Might Fail |
|---|---:|---|---|

## Recommended Path

## Why This Path Wins

## What To Avoid

## Confidence Estimate

## Remaining Unknowns
```

## Rules

- Do not use alien-goggles ideas to create scope creep.
- Use weird alternatives to improve the chosen strategy.
- Percentages are estimates, not guarantees.
- If confidence is low, recommend `ranked_options` or `loophole_hunter` next.
