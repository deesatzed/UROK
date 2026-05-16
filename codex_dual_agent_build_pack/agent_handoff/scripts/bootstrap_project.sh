#!/usr/bin/env bash
set -euo pipefail

mkdir -p agent_handoff/{queue,inbox,outbox,logs,scripts}

if [ ! -f TASK_QUEUE.md ]; then
  cat > TASK_QUEUE.md <<'QUEUE'
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
QUEUE
fi

if [ ! -f PROGRESS.md ]; then
  cat > PROGRESS.md <<'PROGRESS'
# PROGRESS.md

## Project Status Marker

PROJECT_STATUS: INITIALIZING

Allowed values:
- INITIALIZING
- IN_PROGRESS
- REVIEW_NEEDED
- BLOCKED
- UNSAFE
- FINISHED

## Status Overview

0% complete – Initialization phase.

## Next Actions

1. Run the project_initializer skill if project-control files do not exist.
2. Run the autonomous_orchestrator skill to create or refine TASK_QUEUE.md.
3. Begin the next Ready task.
PROGRESS
fi

echo "Project bootstrap complete."
echo "Created agent_handoff folders and TASK_QUEUE.md / PROGRESS.md if missing."
