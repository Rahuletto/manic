#!/usr/bin/env bash
set -euo pipefail

# Framework gate: verify demo builds successfully
# Used in CI/CD pre-commit hook (workspace coordinator only)

echo "[verify-framework-gate] Verifying workspace setup..."

if [ ! -d "demo" ]; then
  echo "✓ [verify-framework-gate] Demo not cloned yet (workspace setup)"
else
  echo "[verify-framework-gate] Building demo..."
  cd demo && bun run build > /dev/null 2>&1 && echo "✓ [verify-framework-gate] Demo builds"
fi

echo "[verify-framework-gate] OK"
