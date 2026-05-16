---
name: decision_logger
description: Record meaningful architecture, scope, security, dependency, data model, workflow, or UX decisions in DECISIONS.md.
---

# Decision Logger Skill

Use this skill whenever a meaningful decision is made or changed.

## Output

Update `DECISIONS.md`.

## Decision Entry Format

Use this table format:

```markdown
| ID | Date | Category | Decision | Rationale | Alternatives Considered | Status |
|---|---|---|---|---|---|---|
```

Allowed statuses:

- Proposed
- Accepted
- Superseded
- Rejected
- Needs User Input

Categories:

- Architecture
- Scope
- Security
- Privacy
- Data Model
- UI/UX
- Testing
- Performance
- Dependency
- Deployment
- Agent Workflow

## Rules

- Update existing decisions instead of duplicating them.
- Mark outdated decisions as Superseded rather than deleting them.
- Include alternatives considered.
- Explain tradeoffs plainly.
- Link decisions to `PROGRESS.md` tasks when relevant.
- Ask the user when a decision materially changes scope, risk, cost, privacy, or user experience.
