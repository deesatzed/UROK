#!/usr/bin/env bash
set -euo pipefail

MAX_ITERATIONS="${MAX_ITERATIONS:-20}"
ITERATION=1

mkdir -p agent_handoff/inbox agent_handoff/outbox agent_handoff/logs

while [ "$ITERATION" -le "$MAX_ITERATIONS" ]; do
  echo "=== Autonomous build iteration $ITERATION ==="

  if grep -qi "PROJECT_STATUS: FINISHED" PROGRESS.md 2>/dev/null; then
    echo "Project marked finished."
    exit 0
  fi

  if grep -qi "PROJECT_STATUS: BLOCKED" PROGRESS.md 2>/dev/null; then
    echo "Project marked blocked."
    exit 2
  fi

  if grep -qi "PROJECT_STATUS: UNSAFE" PROGRESS.md 2>/dev/null; then
    echo "Project marked unsafe."
    exit 3
  fi

  echo "Open Codex and run the autonomous_orchestrator skill for the next task."
  echo "This script watches status markers; exact Codex CLI invocation depends on your local setup."
  echo "Recommended prompt is in examples/start_autonomous_build.txt"

  ITERATION=$((ITERATION + 1))
  exit 0

done

echo "Reached MAX_ITERATIONS without finished/blocked status."
exit 4
