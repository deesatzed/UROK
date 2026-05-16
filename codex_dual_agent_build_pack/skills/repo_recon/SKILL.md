---
name: repo_recon
description: Inspect an unfamiliar repository before coding and produce a concise repo map, risks, commands, and next steps without modifying code.
---

# Repo Recon Skill

Use this skill before modifying an unfamiliar repository or when Codex lacks confidence about the current architecture.

Do not modify code during repo recon unless the user explicitly asks.

## Required Output

Create or update:

- `REPO_MAP.md`
- `RISK_NOTES.md`
- `PROGRESS.md` if present
- `DECISIONS.md` if meaningful decisions are discovered or needed

## Inspect

Identify:

- language and framework,
- package manager,
- build commands,
- test commands,
- lint/typecheck commands,
- app entry points,
- major folders,
- configuration files,
- environment variable patterns,
- data storage patterns,
- existing tests,
- current documentation,
- likely files involved in the requested task,
- current known failures or missing setup.

## REPO_MAP.md Format

```markdown
# REPO_MAP.md

## Project Type

## Tech Stack

## Package Manager

## Commands

| Purpose | Command | Verified |
|---|---|---|

## Entry Points

## Major Folders

## Existing Patterns To Preserve

## Tests and Verification

## Likely Files For Current Task

## Unknowns
```

## RISK_NOTES.md Format

```markdown
# RISK_NOTES.md

## Risks

| Risk | Severity | Why It Matters | Mitigation |
|---|---|---|---|

## Safe Next Step
```

## Rule

End with the smallest safe next step. Do not suggest large rewrites unless clearly justified.
