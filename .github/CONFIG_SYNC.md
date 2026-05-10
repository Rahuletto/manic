# Configuration Sync Guide

This document explains how to keep quality standards consistent across all manic-js/* repositories.

## Files That Must Sync

The following files should be **identical or nearly identical** across all repos:

| File | Source | Purpose | Repos |
|------|--------|---------|-------|
| `.oxlintrc.json` | root | OXC lint rules | all |
| `.oxfmt.json` | root | OXC format rules | all |
| `.github/workflows/ci.yml` | template | CI pipeline | all |
| `.github/workflows/codeql.yml` | `.github/codeql-template.yml` | CodeQL (JS/TS) on push/PR/merge queue + weekly | core, bundler, providers, create-manic, tui, all plugins, umbrella |
| `.github/workflows/dependency-review.yml` | `.github/dependency-review-template.yml` | Dependency Review on PRs (each push to the PR) | core, bundler, providers, create-manic, tui, all plugins, umbrella |
| `AGENTS.md` (partial) | root | Agent standards | core, all plugins |
| `package.json` (scripts) | each repo | Standard CI scripts | all |

## When to Sync

**Trigger sync when:**
- [ ] Changes to `.oxlintrc.json` or `.oxfmt.json` in root
- [ ] New linting rules added to AGENTS.md
- [ ] CI/CD improvements in `.github/ci-template.yml`
- [ ] Updates to `.github/codeql-template.yml` or `.github/dependency-review-template.yml`
- [ ] Major version updates (Bun, OXC, TypeScript)

## How to Sync

### 1. Update Root Files

Edit in Rahuletto/manic:
- `.oxlintrc.json`
- `.oxfmt.json`
- `.github/ci-template.yml`
- `AGENTS.md` (AI Agent Code Quality Standards section)

### 2. Distribute to manic-js/* Repos

**Option A: Semi-automatic (recommended)**

```bash
#!/bin/bash
# sync-configs.sh - Run from Rahuletto/manic root

REPOS=(
  "manic-js/core"
  "manic-js/bundler"
  "manic-js/providers"
  "manic-js/create-manic"
  "manic-js/tui"
  "manic-js/plugin-tailwind"
  "manic-js/plugin-unocss"
  "manic-js/plugin-mdx"
  "manic-js/plugin-mcp"
  "manic-js/plugin-seo"
  "manic-js/plugin-sitemap"
  "manic-js/plugin-api-docs"
)

for repo in "${REPOS[@]}"; do
  echo "Syncing $repo..."
  
  # Clone to temp location
  tmpdir=$(mktemp -d)
  git clone "https://github.com/$repo.git" "$tmpdir"
  cd "$tmpdir"
  
  # Copy files
  cp "../.oxlintrc.json" .
  cp "../.oxfmt.json" .
  cp "../.github/ci-template.yml" ".github/workflows/ci.yml"
  
  # Update package.json scripts (merge, don't replace)
  # This is done manually per repo to preserve repo-specific scripts
  
  # Commit & push
  git add .oxlintrc.json .oxfmt.json .github/workflows/ci.yml
  git commit -m "chore: sync quality configs from root"
  git push origin main
  
  cd -
  rm -rf "$tmpdir"
done
```

**Option B: Manual**

For each repo under manic-js/:

1. Clone locally:
   ```bash
   git clone https://github.com/manic-js/plugin-tailwind.git
   cd plugin-tailwind
   ```

2. Copy files from root:
   ```bash
   cp ../../.oxlintrc.json .
   cp ../../.oxfmt.json .
   cp ../../.github/ci-template.yml .github/workflows/ci.yml
   ```

3. Review and commit:
   ```bash
   git add .oxlintrc.json .oxfmt.json .github/workflows/ci.yml
   git commit -m "chore: sync quality configs from Rahuletto/manic"
   git push origin main
   ```

## CodeQL and Dependency Review

- **`codeql.yml`** — Code scanning for `javascript-typescript` via `github/codeql-action` v4. Triggers on **push** and **pull_request** to `main` / `canary`, **`merge_group`** (merge queue), and a **weekly** `schedule`. Requires default **Actions: Read repository contents** and **Security events: Write** for uploading SARIF (handled in the workflow `permissions`).
- **`dependency-review.yml`** — Uses `actions/dependency-review-action` v4 on **`pull_request`** targeting `main` / `canary`. That includes **every new commit pushed to an open PR** (`synchronize`). It does **not** run on direct pushes to `main` without a PR; GitHub’s Dependency Review API is diff-based. **Dependency graph** must be enabled for the repo (on by default for public repos). Private repos need appropriate GitHub plan/features per [Dependency review](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review).

Copy from `.github/codeql-template.yml` and `.github/dependency-review-template.yml` when adding new package repositories.

## Package.json Scripts

Each repo should have these standard CI scripts in `package.json`:

```json
{
  "scripts": {
    "ci:lint": "bunx oxlint --config .oxlintrc.json .",
    "ci:format": "bunx oxfmt --config .oxfmt.json --check .",
    "ci:typecheck": "if [ -f tsconfig.json ]; then bunx tsc --noEmit; else bunx tsc --noEmit --module esnext --moduleResolution bundler --target es2022 src/index.ts; fi",
    "ci:test": "bun test --timeout 30000",
    "ci:compliance": "test -f CODE_OF_CONDUCT.md && test -f LICENSE && test -f README.md"
  }
}
```

## Repo-Specific Overrides

**When a repo needs different rules:**

1. Document the override in the repo's `.oxlintrc.json`:
   ```json
   {
     "_comment": "Extends root config, but allows X because of Y",
     "rules": {
       "some-rule": "off"
     }
   }
   ```

2. Update root `AGENTS.md` to note the exception
3. Get approval before merging (PR required)

## Verification

After syncing, verify all repos are in sync:

```bash
for dir in core bundler providers plugins/* create-manic tui; do
  if [ -d "$dir" ]; then
    echo "=== $dir ==="
    cd "$dir"
    bunx oxlint --config .oxlintrc.json . > /tmp/lint.out 2>&1 && echo "✓ Lint passes" || echo "✗ Lint fails"
    bunx oxfmt --config .oxfmt.json --check . > /tmp/fmt.out 2>&1 && echo "✓ Format OK" || echo "✗ Format differs"
    cd -
  fi
done
```

## CI/CD Automation (Future)

Consider automating sync via:
- GitHub Action that runs on commits to root AGENTS.md
- Renovate/Dependabot for dependency syncing
- Workflow dispatch button in GitHub Actions

## Questions?

Refer to:
- `AGENTS.md` — AI agent standards
- `DEVELOPMENT.md` — Local dev setup
- `.oxlintrc.json` — Lint rule details
- `.oxfmt.json` — Format rule details
