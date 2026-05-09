# Scripts Inventory

This directory contains workspace-level automation scripts.

## Active Scripts

- `install-local-hooks.sh`:
  Installs local git hooks for the workspace.
- `verify-framework-gate.sh`:
  Runs framework verification checks on demo build.

## Dev Scripts (`scripts/dev/`)

- `benchmark-canary.ts`:
  Performance baseline benchmarking (optional, for perf analysis).
- `generate-plugin-agents.ts`:
  Generates plugin-specific AGENTS.md documentation (optional).

## Root Commands

```bash
bun run dev              # Start demo dev server
bun run build            # Build all workspaces
bun run test             # Run tests in all workspaces
```

## Notes

- Each independent repo (core, plugins, etc.) has its own CI/CD via `.github/workflows/ci.yml`
- No umbrella-level test orchestration needed
- Use `cd plugins/tailwind && bun test` to test individual packages
