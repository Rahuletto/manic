# manic-framework Skill

## Purpose
Authoritative operating manual for agents working on Manic framework repositories.

## Hard rules
- Use Bun only for runtime, install, scripts, and build orchestration.
- Use OXC for lint/format/transform/minify in framework-owned paths.
- Do not introduce Vite/Webpack/Rollup/esbuild/Turbopack/Rspack as core build path replacements.
- Keep plugin/provider boundaries clean and provider-agnostic.
- Follow umbrella submodule workflow strictly: commit in submodule first, then umbrella pointer commit.
- Do not use git commit trailers unless explicitly required by maintainers.

## Execution checklist
1. Identify if the change belongs to umbrella, submodule, or both.
2. Validate quality gates before completion: lint, format, typecheck, build, tests.
3. If package/plugin changes can affect runtime behavior, validate `demo` build path.
4. Report exactly what was run and what was not run.

## Definition of done
- No architecture regressions.
- No CI quality gate failures.
- No undocumented scope drift.
- No temporary hacks without follow-up issue references.
