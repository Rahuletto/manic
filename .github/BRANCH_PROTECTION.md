# Branch Protection Runbook

This runbook defines required branch-protection settings for `main` and `canary` in the umbrella repository.

## Required checks

For umbrella repository:

- `Framework Integration`

For each submodule repository (`packages/*`, `plugins/*`), require:

- `CI / quality`

## Required branch rules

Enable all of the following:

- Require a pull request before merging
- Require approvals: minimum 0 (solo maintainer friendly)
- Dismiss stale pull request approvals when new commits are pushed
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Do not allow force pushes
- Do not allow deletions

## Apply via GitHub CLI

Prerequisite:

```bash
gh auth login -h github.com
```

Set protection for `main`:

```bash
gh api \
  -X PUT \
  repos/Rahuletto/manic/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Framework Integration"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_linear_history": false,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON
```

Set protection for `canary`:

```bash
gh api \
  -X PUT \
  repos/Rahuletto/manic/branches/canary/protection \
  -H "Accept: application/vnd.github+json" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Framework Integration"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_linear_history": false,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON
```

## Verify

```bash
gh api repos/Rahuletto/manic/branches/main/protection
gh api repos/Rahuletto/manic/branches/canary/protection
```

## Notes for submodules

Branch protection must also be configured in each submodule repository, because their CI checks run in those repos.
