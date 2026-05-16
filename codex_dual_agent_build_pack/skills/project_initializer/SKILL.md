---
name: project_initializer
description: Convert a raw user instruction into five persistent Markdown control files for a long-running Codex coding project.
---

# Project Initializer Skill

Use this skill when the user asks to initialize a project, clarify a coding goal, prepare Codex instructions, structure a repo build, or convert a vague request into durable project-control files.

Output exactly these five files in this order, each wrapped in its own Markdown code block:

1. `GOAL.md`
2. `STANDARDS.md`
3. `IMPLEMENT.md`
4. `DECISIONS.md`
5. `PROGRESS.md`

Do not implement code. Create durable control documents for future Codex runs.

## GOAL.md

Include:

- Ultimate Goal: one sentence.
- Primary Objectives: measurable objectives with why and success signal.
- User Value.
- In Scope.
- Out of Scope.
- Assumptions.
- Non-Goals.

## STANDARDS.md

Include non-negotiable standards for:

- engineering quality,
- repository awareness,
- security and privacy,
- testing,
- UI/UX if applicable,
- performance,
- documentation,
- agent behavior,
- definition of done.

## IMPLEMENT.md

Include:

- Recommended Agent Workflow: Orchestrator, Implementer, Reviewer, Tester.
- Upfront Repository Reconnaissance.
- Clarification Questions That Would Have Been Ideal.
- Architecture Decisions Needed.
- Implementation Phases.
- Atomic Task Format.
- Risks and Mitigations.
- Open Decisions.

## DECISIONS.md

Include:

- Decision Log Overview.
- Active Decisions table.
- Initial Default Decisions.
- Superseded Decisions.
- Decision Rules for Future Agents.
- Pending Decision Questions.

## PROGRESS.md

Include:

- Status Overview starting with `0% complete – Initialization phase`.
- Current Assumptions.
- Task Tracker table with Task, Status, Owner, Notes.
- Decision Links.
- Current Milestone.
- Next Actions.
- Blockers.
- Questions for User.

## Rules

- Be ruthlessly clear.
- Make reasonable assumptions and document them.
- Do not invent major features.
- Prefer maintainable, secure, testable solutions.
- Every task must be actionable by a coding agent.
- Every acceptance criterion must be objectively checkable.
