#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"

mkdir -p "$CODEX_HOME/skills"
mkdir -p "$CODEX_HOME/agent_handoff/scripts"

cp -R "$SOURCE_DIR/skills/"* "$CODEX_HOME/skills/"
cp "$SOURCE_DIR/AGENTS.md" "$CODEX_HOME/AGENTS.md"
cp -R "$SOURCE_DIR/agent_handoff/scripts/"* "$CODEX_HOME/agent_handoff/scripts/" 2>/dev/null || true
chmod +x "$CODEX_HOME/agent_handoff/scripts/"*.sh 2>/dev/null || true

echo "Installed Codex Dual-Agent Build Pack to: $CODEX_HOME"
echo ""
echo "Next steps:"
echo "1. cd into your project repo"
echo "2. Open Codex"
echo "3. Paste the command from QUICKSTART.md"
echo ""
if command -v claude >/dev/null 2>&1; then
  echo "Claude Code detected: $(claude --version 2>/dev/null || echo installed)"
else
  echo "Claude Code not detected. Codex-only skills will still work."
fi
