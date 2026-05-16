# Install and Run Commands

## 1. Unzip

```bash
unzip codex_dual_agent_build_pack.zip
```

## 2. Install

```bash
cd codex_dual_agent_build_pack
bash install.sh
```

## 3. Check Claude Code

```bash
claude --version
```

If that command fails, Claude Code is not installed or not on your PATH. You can still use the Codex-only parts of the pack.

## 4. Enter your project repo

```bash
cd /path/to/your/project
```

## 5. Initialize the project in Codex

Paste this into Codex:

```text
Use the project_initializer skill.

Create the project-control files for this project.

User instruction:
[PASTE YOUR PROJECT IDEA HERE]
```

## 6. Start the autonomous dual-agent loop in Codex

Paste this into Codex:

```text
Use the autonomous_orchestrator skill.

Build as much as possible without human interruption.
Use Claude Code as a bounded parallel worker or reviewer when it can safely help.
Stop only if the build is finished, unsafe, or truly blocked.
Update PROGRESS.md, DECISIONS.md, and TASK_QUEUE.md after meaningful work.
```

## 7. Optional: Run Claude review from terminal

```bash
./agent_handoff/scripts/claude_review.sh
```

The Claude review output will appear here:

```text
agent_handoff/outbox/CLAUDE_REVIEW.md
```
