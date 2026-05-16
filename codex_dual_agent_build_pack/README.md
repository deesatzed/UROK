# Codex Dual-Agent Build Pack

A novice-friendly add-on for a Codex project that lets Codex orchestrate a build while Claude Code can help as a bounded parallel worker or reviewer.

## What this does

This pack adds a safer autonomous loop:

- Codex creates and follows project-control files.
- Codex manages the task queue.
- Claude Code can help with bounded work, reviews, debugging, or tests.
- Codex decides what to accept.
- Tests and verification arbitrate.
- Markdown files remember progress and decisions.

Core rule:

> Codex decides. Claude contributes. Tests arbitrate. Markdown remembers.

## What this does not do

This is not magic one-click production software. It gives Codex and Claude a structured workflow so they can continue until the project is finished or truly blocked.

The system should stop only for real blockers, such as:

- missing API key
- missing login/account
- unsafe or destructive operation
- private data risk
- impossible local setup
- repeated failed attempts after mitigation
- product decision that cannot safely be assumed

## Requirements

You need:

1. Codex available in your coding environment.
2. Claude Code installed if you want Claude participation.
3. A Git repository.
4. A terminal.

Check Claude Code:

```bash
claude --version
```

If that fails, install Claude Code from Anthropic's official instructions before using the Claude worker scripts.
