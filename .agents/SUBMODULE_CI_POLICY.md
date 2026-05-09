# Manic Submodule CI Enforcement Policy

This policy is binding for all `packages/*` and `plugins/*` submodule repositories.

## Required CI Contract

Every submodule MUST expose the following `package.json` scripts:

- `ci:compliance`
- `ci:lint`
- `ci:format`
- `ci:typecheck`
- `ci:build`
- `ci:test`

Each submodule `.github/workflows/ci.yml` MUST run these scripts in that exact order after Bun install.

## Open Source Compliance

- `ci:compliance` MUST fail if any required governance file is missing.
- Minimum required files per package/plugin repo:
  - `CODE_OF_CONDUCT.md`
  - `LICENSE`
  - `README.md`

## Toolchain Rules

- CI MUST use Bun (`oven-sh/setup-bun`, `bun install`, `bun run ...`).
- Lint/format checks MUST use OXC tooling (`oxlint`, `oxfmt`) through scripts.
- Non-Bun package managers and non-OXC lint/format paths are not allowed in core framework repos.

## Failure Policy

- Any failure in required CI scripts is merge-blocking.
- Any submodule pointer change in umbrella MUST pass `Submodule Integration` (`demo` build gate).
- If a package/plugin change causes `demo` integration failure, the change is considered regressive and MUST be fixed before merge.

## Workflow Hygiene

- Submodule changes are committed/pushed in the submodule first.
- Umbrella then commits only submodule pointer updates.
- Agent-authored commits MUST NOT use git trailers unless maintainers explicitly require them.
