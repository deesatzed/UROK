# TASK_QUEUE.md

## Rules

- Each task must be small, specific, and verifiable.
- Only one agent may claim a task at a time.
- Agents must not edit files outside the task scope unless they document why.
- Completed work must include verification notes.
- Blocked work must include the blocker reason and required user action.

## Task Status Values

- Ready
- Claimed
- In Progress
- Review Needed
- Accepted
- Rejected
- Blocked
- Done

## Queue

| ID | Task | Status | Assigned Agent | Files Allowed | Verification | Notes |
|---|---|---|---|---|---|---|
| T001 | Inspect repository and identify setup commands | Ready | Unassigned | Any read-only | REPO_MAP.md created | Initial reconnaissance |
