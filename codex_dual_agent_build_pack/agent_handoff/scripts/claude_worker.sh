#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"
PROMPT_FILE="agent_handoff/inbox/claude_worker_${TASK_ID}.md"
OUTPUT_FILE="agent_handoff/outbox/claude_worker_${TASK_ID}_response.md"

if [ -z "$TASK_ID" ]; then
  echo "ERROR: Provide TASK_ID, for example: ./agent_handoff/scripts/claude_worker.sh T001" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: Claude Code CLI not installed or not on PATH." >&2
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "ERROR: Missing prompt file: $PROMPT_FILE" >&2
  echo "Create this prompt from Codex using the claude_parallel_worker skill." >&2
  exit 1
fi

claude -p "$(cat "$PROMPT_FILE")" > "$OUTPUT_FILE"
echo "Claude worker response written to $OUTPUT_FILE"
