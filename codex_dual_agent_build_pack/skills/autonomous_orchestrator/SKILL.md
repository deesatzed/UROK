---
name: autonomous_orchestrator
description: Run an autonomous multi-agent coding loop using Codex as orchestrator and Claude Code as a bounded parallel worker. Continue until the project is complete, objectively blocked, or unsafe to proceed.
---

# Autonomous Orchestrator Skill

Codex is the orchestrator and final decision-maker.

Claude Code may be used as a bounded parallel worker or reviewer through the local `claude` CLI.

## Goal

Continue the project without human interruption until one of these terminal states occurs:

1. Finished: all acceptance criteria are satisfied and verification passes.
2. Blocked: progress requires missing credentials, unavailable external services, unclear user decision, impossible environment setup, or unavailable permission.
3. Unsafe: the next step would risk secrets, PHI/PII, destructive operations, production deployment, or unapproved external access.

## Required Files

Before starting, read:

- AGENTS.md
- GOAL.md
- STANDARDS.md
- IMPLEMENT.md
- DECISIONS.md
- PROGRESS.md
- TASK_QUEUE.md if present

If TASK_QUEUE.md does not exist, create it from IMPLEMENT.md and PROGRESS.md.

## Operating Loop

Repeat until Finished, Blocked, or Unsafe:

1. Read the current project-control files.
2. Identify the next Ready task.
3. Decide whether Codex, Claude, or both should work on it.
4. Claim the task in TASK_QUEUE.md.
5. Create an implementation packet.
6. Run the assigned worker.
7. Collect patch or output.
8. Run tests or documented verification.
9. Run adversarial review.
10. Accept, reject, or revise the patch.
11. Update DECISIONS.md if a meaningful decision was made.
12. Update PROGRESS.md.
13. Update TASK_QUEUE.md.
14. Continue to the next task.

## Parallel Work Rules

Use parallel work only when tasks are independent.

Safe examples:

- Codex implements feature while Claude writes tests.
- Codex refactors one module while Claude reviews another.
- Codex builds UI while Claude audits edge cases.
- Codex creates implementation while Claude performs loophole review.

Unsafe examples:

- both agents editing the same file,
- both agents changing architecture,
- both agents modifying dependencies,
- both agents changing database schema,
- both agents editing auth/security code.

## Patch Acceptance Rules

A patch may be accepted only if:

- it addresses the claimed task,
- it does not violate STANDARDS.md,
- it passes or documents verification,
- it does not introduce obvious regressions,
- it does not expand scope,
- conflicts are resolved,
- PROGRESS.md and TASK_QUEUE.md are updated.

## Blocker Rules

Mark Blocked only when the next step requires:

- missing API key,
- unavailable account login,
- missing paid service,
- impossible local dependency,
- ambiguous user choice that changes scope,
- unsafe operation,
- access to private resource not available,
- repeated failed attempts after first-principles and alien-goggles review.

When blocked, document:

- exact blocker,
- evidence,
- attempted mitigations,
- what the user must provide,
- safest next option.

## No Fake Completion

Do not claim the build is complete unless:

- all required tasks are Done,
- acceptance criteria are met,
- tests or verification were run,
- release readiness passes,
- no critical or high-severity review issues remain.
