---
name: ranked_options
description: Rank competing software approaches by estimated chance of achieving the user goal, including risks and when to choose each option.
---

# Ranked Options Skill

Use this skill when multiple implementation, architecture, library, migration, or feature-scope options exist.

## Output

Create `RANKED_OPTIONS.md`.

## Format

```markdown
# RANKED_OPTIONS.md

## Decision Needed

## Goal Being Optimized

## Options

| Rank | Option | Estimated Chance of Achieving Goal | Why | Main Risk | When To Choose |
|---:|---|---:|---|---|---|

## Recommended Option

## Why Not The Others

## Confidence Level

## Evidence Used

## Assumptions

## Decision To Record
```

## Rules

- Percentages must be honest estimates.
- Do not present all options as equal.
- Favor lower-risk, repo-consistent paths unless there is a strong reason not to.
- If no option is safe enough, mark the decision blocked.
