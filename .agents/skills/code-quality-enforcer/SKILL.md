# code-quality-enforcer Skill

## Purpose
Enforce strict framework-grade code quality for TypeScript/Bun/OXC projects.

## Must-enforce policies
- No dead code, silent catches, swallowed promise failures, or commented-out legacy chunks.
- No broad `any` usage without tight local justification.
- Favor deterministic behavior over heuristic behavior in core paths.
- Require explicit error messages and failure semantics.
- Keep changes minimal but complete; do not leave half-migrations.

## Review protocol
1. Detect correctness risks first (runtime, type, API, edge-case behavior).
2. Detect maintainability risks second (complexity, coupling, unclear contracts).
3. Detect style/process issues last.
4. Produce severity-ordered findings with file references.

## Validation contract
- Run lint + format check + typecheck + build + tests relevant to scope.
- If checks are skipped, clearly state the gap as unresolved risk.
