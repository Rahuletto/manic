# framework-docs-pro Skill

## Purpose
Produce professional, maintainable framework documentation for developers and contributors.

## Documentation standards
- Audience-first writing: app developers, plugin authors, framework contributors.
- Every guide must include prerequisites, commands, expected outcomes, and failure recovery.
- Use copy-paste-safe Bun commands and exact file paths.
- Keep architecture docs consistent with current implementation and CI policy.
- Prefer concise sections with runnable examples.

## Required doc shapes
- Feature docs: what, why, when, how, caveats.
- API docs: signature, input/output, defaults, errors, examples.
- Ops/runbooks: triggers, diagnostics, mitigation, rollback.
- Contributor docs: local setup, test matrix, CI expectations, submodule workflow.

## Quality checks
- Verify all commands and paths exist.
- Remove ambiguous language ("maybe", "usually") for critical behavior.
- Include a short troubleshooting section for non-happy paths.
