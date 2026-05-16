#!/usr/bin/env bash
set -euo pipefail

mkdir -p agent_handoff/inbox agent_handoff/outbox

DIFF_FILE="agent_handoff/inbox/current_diff.patch"
PROMPT_FILE="agent_handoff/inbox/claude_review_prompt.md"
OUTPUT_FILE="agent_handoff/outbox/CLAUDE_REVIEW.md"

git diff > "$DIFF_FILE"

cat > "$PROMPT_FILE" <<'PROMPT'
# Claude Code Review Request

You are reviewing a code change made by another coding agent.

Do not modify files.
Return a structured review only.

## Review Priorities

1. Correctness
2. Regression risk
3. Security/privacy risk
4. Test gaps
5. Simplicity
6. Maintainability
7. Scope creep

## Required Output

# CLAUDE_REVIEW.md

## Summary

## Findings

| Severity | Finding | Evidence | Suggested Fix |
|---|---|---|---|

## Must Fix Before Merge

## Should Fix Later

## Test Gaps

## Final Recommendation

Use one of:
- Approve
- Approve with minor fixes
- Block until fixed
PROMPT

{
  echo ""
  echo "## Current Git Diff"
  echo '```diff'
  cat "$DIFF_FILE"
  echo '```'
} >> "$PROMPT_FILE"

"$(dirname "$0")/ask_claude.sh" "$PROMPT_FILE" "$OUTPUT_FILE"
