---
name: claude_parallel_worker
description: Delegate a bounded implementation, test-writing, review, or debugging task to Claude Code in parallel while Codex remains orchestrator.
---

# Claude Parallel Worker Skill

Use this skill when Claude Code should perform a bounded task in parallel with Codex.

## Requirements

Before delegating:

- identify the exact task ID,
- identify files Claude may read,
- identify files Claude may edit,
- define acceptance criteria,
- define verification commands,
- define what Claude must not touch.

## Claude Prompt Format

Create a prompt with:

# Claude Worker Assignment

## Task ID

## Task Goal

## Relevant Project Files

## Allowed Files To Edit

## Forbidden Files

## Current Standards

## Acceptance Criteria

## Verification Commands

## Output Required

Claude must return:

1. summary of changes,
2. patch or changed file list,
3. verification performed,
4. remaining risks,
5. whether task is complete or blocked.

## Safety

Prefer asking Claude for a patch instead of direct uncontrolled edits.

If Claude edits files directly, it must be in a separate branch or worktree.

Codex must review the diff before accepting.
