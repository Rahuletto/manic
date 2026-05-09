# Manic Polyrepo CI/CD Policy

This policy is binding for all independent repositories under the `manic-js` organization.

## Required CI Contract

Every repository MUST expose the following `package.json` scripts:

- `ci:lint` — Run oxlint checks
- `ci:format` — Check code formatting
- `ci:typecheck` — TypeScript type checking
- `ci:test` — Run tests
- `ci:compliance` — Verify required governance files

Each repo's `.github/workflows/ci.yml` MUST run these scripts in order after Bun install.

## Open Source Compliance

- `ci:compliance` MUST fail if required files are missing
- Minimum required files per repo:
  - `CODE_OF_CONDUCT.md`
  - `LICENSE`
  - `README.md`

## Toolchain Requirements

- **Runtime:** Bun (mandatory, `oven-sh/setup-bun`, `bun install`, `bun run ...`)
- **Lint/Format:** OXC tooling only (`oxlint`, `oxfmt`)
- **No exceptions:** Core framework + plugins must use consistent toolchain

## Failure Policy

- Any CI script failure is merge-blocking
- Demo build failure (if applicable) blocks the change
- Agents MUST verify locally before pushing

## Workflow

1. Clone all repos: `./setup.sh && bun install`
2. Edit in workspace directory
3. Run checks locally:
   ```bash
   bunx oxlint --config .oxlintrc.json .
   bunx oxfmt --config .oxfmt.json --check .
   bun run typecheck
   bun run test
   ```
4. Commit & push to independent repo
5. CI runs automatically in manic-js/*

## Sync Requirements

- `.oxlintrc.json`, `.oxfmt.json`, `.github/workflows/ci.yml` must sync across all repos
- Use `.github/CONFIG_SYNC.md` in Rahuletto/manic for distribution
- Update cadence: when quality standards change
