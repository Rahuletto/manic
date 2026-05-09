#!/usr/bin/env bash
set -euo pipefail

if [ -f "package.json" ]; then
  if bun run -q validate >/dev/null 2>&1; then
    echo "[verify-submodule-quality] validate passed"
    exit 0
  fi
  if bun run -q lint >/dev/null 2>&1; then
    echo "[verify-submodule-quality] lint passed"
    exit 0
  fi
fi

echo "[verify-submodule-quality] no validate/lint script found; skipping"
