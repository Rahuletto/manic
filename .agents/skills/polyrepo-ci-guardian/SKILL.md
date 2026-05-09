# polyrepo-ci-guardian Skill

## Purpose

Keep CI and quality governance consistent across all independent manic-js/* repositories.

## Enforcement Model

- Every manic-js/* repo must expose required `ci:*` scripts
- Every repo must have standardized `.github/workflows/ci.yml`
- Lint/format/typecheck/test must all pass before commit
- Missing CODE_OF_CONDUCT.md, LICENSE, or README.md is merge-blocking
- Configuration sync: `.oxlintrc.json`, `.oxfmt.json`, workflows stay in sync

## Operation Steps

1. Audit all manic-js/* repos for CI/script compliance
2. Verify `.oxlintrc.json` and `.oxfmt.json` are consistent
3. Check `.github/workflows/ci.yml` follows template
4. Identify drift from canonical CI contract
5. Apply standardized updates across repos
6. Validate governance files present
7. Ensure demo build passes with changes

## Required Scripts (per repo)

```json
{
  "scripts": {
    "ci:lint": "bunx oxlint --config .oxlintrc.json .",
    "ci:format": "bunx oxfmt --config .oxfmt.json --check .",
    "ci:typecheck": "bun run typecheck",
    "ci:test": "bun test",
    "ci:compliance": "test -f CODE_OF_CONDUCT.md && test -f LICENSE && test -f README.md"
  }
}
```

## Failure Policy

- CI drift is a blocking defect (not advisory)
- Missing scripts = can't release
- Format/lint failures = PR blocked
- Test failures = PR blocked
- Missing governance files = PR blocked

## Sync Requirements

Use `.github/CONFIG_SYNC.md` in Rahuletto/manic to:
- Distribute `.oxlintrc.json` updates to all repos
- Distribute `.oxfmt.json` updates to all repos
- Distribute `.github/workflows/ci.yml` template updates

When to sync:
- Linting rules change
- Formatting rules change
- CI/CD improvements needed
- Major version updates (Bun, OXC, TypeScript)

## Key Files

- **Root:** Rahuletto/manic/.oxlintrc.json (source of truth)
- **Root:** Rahuletto/manic/.oxfmt.json (source of truth)
- **Root:** Rahuletto/manic/.github/workflows/ci-template.yml (template)
- **Each repo:** Own `.github/workflows/ci.yml` (based on template)
- **Each repo:** Own `.oxlintrc.json` and `.oxfmt.json` (synced from root)
