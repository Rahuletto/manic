# manic-framework-builder Skill

## Purpose
Implement Manic framework features with strict doc-to-code parity and zero-hallucination behavior.

## Core mandate
- Build exactly what is specified in Manic docs and repository contracts.
- Documentation and implementation MUST match 1:1 for behavior, commands, file paths, and APIs.
- If docs and code disagree, do not invent behavior: reconcile by evidence and report mismatch explicitly.

## Source-of-truth order
1. Local repository code (current implementation).
2. Repository governance docs (`AGENTS.md`, `.agents/*`, submodule AGENTS).
3. Official Manic docs content (`docs/` and referenced manic docs URLs).
4. Existing tests and CI contracts.

## Build workflow (required)
1. Read relevant docs and identify exact expected behavior.
2. Locate real implementation entrypoints before coding.
3. Produce a minimal implementation plan tied to concrete files.
4. Implement only scoped behavior; no speculative extras.
5. Update docs when behavior changes, in the same change set.
6. Validate with required checks (lint, format, typecheck, build, tests, and demo gate when relevant).

## Anti-hallucination rules
- Never claim an API/flag/route exists without confirming in code/docs.
- Never fabricate benchmark numbers or compatibility claims.
- Never infer behavior from memory when files can be inspected.
- Mark unknowns as unknown and resolve by reading source.

## 1:1 parity checklist
- Commands in docs are runnable with Bun.
- Paths in docs exist.
- Public APIs in docs match exported symbols.
- Config examples match real schema and defaults.
- CI expectations in docs match actual workflows.

## Definition of done
- Implementation passes required quality gates.
- Docs updated or explicitly confirmed unchanged.
- No unresolved doc/code mismatches left unreported.
