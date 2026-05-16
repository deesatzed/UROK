---
name: release_readiness
description: Check whether a repo, feature, or change is ready to ship by reviewing tests, build, lint, security, docs, env vars, blockers, and rollback path.
---

# Release Readiness Skill

Use this skill before shipping, merging, tagging, deploying, or declaring work complete.

## Output

Create `RELEASE_CHECKLIST.md`.

## Format

```markdown
# RELEASE_CHECKLIST.md

## Release Scope

## Go / No-Go Decision

Go / No-Go / Conditional Go

## Checklist

| Area | Status | Evidence | Notes |
|---|---|---|---|
| Build |  |  |  |
| Tests |  |  |  |
| Lint/Typecheck |  |  |  |
| Security |  |  |  |
| Privacy |  |  |  |
| Environment Variables |  |  |  |
| Documentation |  |  |  |
| Error Handling |  |  |  |
| Logging |  |  |  |
| Rollback |  |  |  |

## Known Blockers

## Accepted Risks

## Required Fixes Before Release

## Rollback Plan
```

## Rules

- Do not say ready unless there is evidence.
- If tests cannot run, use Conditional Go or No-Go.
- Surface hidden release risks plainly.
