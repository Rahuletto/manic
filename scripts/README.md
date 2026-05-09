# Scripts Inventory

This directory contains umbrella-level automation scripts.

## Active scripts

- `install-local-hooks.sh`:
  Installs local git hooks for this umbrella repo.
- `stage-submodule-pointers.sh`:
  Pre-commit helper that stages all submodule gitlink pointer changes.
- `run-workspace-tests.sh`:
  Runs Bun test suites across all workspace packages/plugins.
  Use `RUN_MANIC_INTEGRATION_TESTS=1` to include `packages/manic` integration tests.
- `verify-framework-gate.sh`:
  Runs umbrella framework gate checks (`bun run build`).
- `verify-submodule-quality.sh`:
  Runs best-available quality checks in a submodule (`ci:*`, `validate`, or `lint`).
- `benchmark-canary.ts`:
  Performance baseline benchmarking script for canary runtime comparisons.
- `generate-plugin-agents.ts`:
  Generates plugin-focused `AGENTS.md` templates.

## Standard root commands

- `bun run test:workspace`
- `bun run test:workspace:full`
- `bun run verify:framework`
- `bun run verify:submodule`
