# Branch Protection Runbook

This runbook defines required branch-protection settings for `main` and `canary` in the umbrella repository.

## Required checks

For umbrella repository:

- `Submodule Integration / Demo Build Gate`

For each submodule repository (`packages/*`, `plugins/*`), require:

- `CI / quality`

## Required branch rules

Enable all of the following:

- Require a pull request before merging
- Require approvals: minimum 1
- Dismiss stale pull request approvals when new commits are pushed
- Require review from Code Owners
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
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]='Submodule Integration / Demo Build Gate' \
  -F enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.require_code_owner_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_conversation_resolution=true \
  -f restrictions=
```

Set protection for `canary`:

```bash
gh api \
  -X PUT \
  repos/Rahuletto/manic/branches/canary/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]='Submodule Integration / Demo Build Gate' \
  -F enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.require_code_owner_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_conversation_resolution=true \
  -f restrictions=
```

## Verify

```bash
gh api repos/Rahuletto/manic/branches/main/protection
gh api repos/Rahuletto/manic/branches/canary/protection
```

## Notes for submodules

Branch protection must also be configured in each submodule repository, because their CI checks run in those repos.
