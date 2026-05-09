#!/usr/bin/env bash
set -euo pipefail

echo "[verify-framework-gate] Running umbrella quality checks..."
bun run build
echo "[verify-framework-gate] OK"
