# submodule-ci-guardian Skill

## Purpose
Keep CI and quality governance consistent across umbrella + submodule repositories.

## Enforcement model
- Every submodule must expose required `ci:*` scripts.
- Every submodule workflow must run compliance, lint, format, typecheck, build, and tests.
- Umbrella must run integration gate validating `demo` for submodule pointer updates.
- Missing CODE_OF_CONDUCT.md, LICENSE, or README.md is merge-blocking.

## Operation steps
1. Audit all submodule workflow files and package scripts.
2. Identify drift from the canonical CI contract.
3. Apply standardized workflow/script updates.
4. Validate script presence and governance files.
5. Report final drift status and remaining blockers.

## Failure policy
- CI drift is a blocking defect, not an advisory warning.
