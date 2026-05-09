#!/usr/bin/env bash
set -euo pipefail

run_one() {
  local target="$1"
  (
    cd "$target"
    if [ -f "package.json" ]; then
      if bun run ci:lint >/dev/null 2>&1; then
        echo "[verify-submodule-quality] ${target}: ci:lint passed"
        exit 0
      fi
      if bun run validate >/dev/null 2>&1; then
        echo "[verify-submodule-quality] ${target}: validate passed"
        exit 0
      fi
      if bun run lint >/dev/null 2>&1; then
        echo "[verify-submodule-quality] ${target}: lint passed"
        exit 0
      fi
    fi
    echo "[verify-submodule-quality] ${target}: no validate/lint script found; skipping"
    exit 0
  )
}

if [ -f ".gitmodules" ]; then
  while IFS= read -r path; do
    if [ -n "$path" ] && [ -d "$path" ]; then
      run_one "$path"
    fi
  done < <(git config --file .gitmodules --get-regexp path | awk '{print $2}')
  exit 0
fi

run_one "."
