# Quickstart for Novice Users

## Step 1 — Install the pack

Download and unzip this folder, then run:

```bash
cd codex_dual_agent_build_pack
bash install.sh
```

This installs the skills and helper scripts into your home `.codex` folder.

## Step 2 — Go to your project repo

```bash
cd /path/to/your/project
```

## Step 3 — Start with the project initializer

In Codex, paste:

```text
Use the project_initializer skill.

Create the project-control files for this project.

User instruction:
[PASTE YOUR APP OR REPO IDEA HERE]
```

Codex should create or output:

```text
GOAL.md
STANDARDS.md
IMPLEMENT.md
DECISIONS.md
PROGRESS.md
```

Save those files in the root of your repo if Codex does not create them automatically.

## Step 4 — Add a task queue

In Codex, paste:

```text
Use the autonomous_orchestrator skill.

Read GOAL.md, STANDARDS.md, IMPLEMENT.md, DECISIONS.md, and PROGRESS.md.
Create TASK_QUEUE.md from the implementation plan if it does not already exist.
Do not code yet.
```

## Step 5 — Start autonomous work

In Codex, paste:

```text
Use the autonomous_orchestrator skill.

Build as much as possible without human interruption.
Use Claude Code as a bounded parallel worker or reviewer when it can safely help.
Stop only if the build is finished, unsafe, or truly blocked.
Update PROGRESS.md, DECISIONS.md, and TASK_QUEUE.md after meaningful work.
```

## Step 6 — Use Claude review when helpful

After Codex makes a change, you can ask:

```text
Use the claude_parallel_worker skill to ask Claude Code for a skeptical review of the current diff.
Codex must evaluate Claude's findings before accepting any changes.
```

Or run the helper script from your repo:

```bash
./agent_handoff/scripts/claude_review.sh
```

## Simple mental model

```text
Plan → Queue → Codex works → Claude checks or helps → Codex decides → tests verify → progress updates
```

## How you know it is done

The project should not be considered finished until `PROGRESS.md` says:

```text
PROJECT_STATUS: FINISHED
```

And all required tasks in `TASK_QUEUE.md` are `Done`.
