#!/usr/bin/env bash
set -euo pipefail

PROMPT_FILE="${1:-}"
OUTPUT_FILE="${2:-agent_handoff/outbox/claude_response.md}"

if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: Claude Code CLI is not installed or not on PATH." >&2
  exit 1
fi

if [ -z "$PROMPT_FILE" ] || [ ! -f "$PROMPT_FILE" ]; then
  echo "ERROR: Provide a valid prompt file." >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_FILE")"
claude -p "$(cat "$PROMPT_FILE")" > "$OUTPUT_FILE"
echo "Claude response written to $OUTPUT_FILE"
