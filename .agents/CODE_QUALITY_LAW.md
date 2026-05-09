# Manic Agent Code-Quality Law

Status: Binding policy for all agents operating in this repository.

This law is strict by default. If any rule below is violated, the work is considered invalid until corrected.

## Agent Oath

I will preserve Manic's architecture, protect reliability, and refuse shortcuts that lower framework quality. I will use Bun and OXC-native tooling, follow the approved plan, and only ship work that is verifiably correct.

## 1) Toolchain Sovereignty (Non-Negotiable)

1. Agents MUST use Bun as the runtime and package manager for framework work.
2. Agents MUST use Bun's native bundling pipeline (`Bun.build`) for framework build behavior.
3. Agents MUST use OXC tooling where applicable (`oxlint`, `oxc-transform`, `oxc-minify`).
4. Agents MUST NOT introduce or migrate framework core build paths to Vite, Webpack, Rollup, esbuild, Turbopack, or Rspack.
5. Agents MUST NOT add alternate bundler abstractions that bypass Bun+OXC in core framework execution paths.
6. Any exception is a BLOCKER unless explicitly approved by repository maintainers in writing.

## 2) Commit Hygiene Law

1. Agents MUST keep commits clean, intentional, and scoped.
2. Agents MUST NOT add git commit trailers by default.
3. Agents MUST NOT use `git commit --trailer ...`.
4. Agents MUST NOT append trailer blocks such as `Signed-off-by:`, `Co-authored-by:`, or similar metadata unless maintainers explicitly require it for a specific change.
5. If a tool auto-inserts trailers, agents MUST remove them before finalizing commits unless explicitly required.
6. `docs/.source/*` is auto-generated Twoslash typing output. Agents MUST NOT edit these files manually.
7. If `docs/.source/*` changes are present from generation steps, agents MUST include those changes in the relevant commit, even if the agent did not directly author each line.

## 3) Plan-First Execution Discipline

1. Agents MUST work from an explicit plan/spec before implementing non-trivial changes.
2. Agents MUST stay within agreed scope.
3. Agents MUST NOT perform opportunistic refactors outside the plan unless they are required to fix a direct blocker.
4. If scope must change, agents MUST document the reason and impact in their final report.
5. “Stick to the plan” is mandatory unless a correctness or safety issue requires deviation.

## 4) Quality Bar for Production Framework Code

1. Agents MUST preserve or improve readability in every changed file.
2. Agents MUST NOT ship dead code, commented-out legacy blocks, or placeholder hacks.
3. Agents MUST NOT introduce silent failures (`catch {}` / ignored promises / swallowed errors) without explicit handling strategy.
4. Agents MUST avoid `any` and unsafe type erasure in TypeScript unless justified inline and narrowly scoped.
5. Agents MUST avoid hidden global side effects and implicit runtime coupling.
6. Agents MUST keep changes minimal-but-complete: no partial migrations left in unstable intermediate states.
7. Agents MUST prefer deterministic behavior over “best effort” heuristics in core framework paths.

## 5) Architecture Integrity for Manic

1. Agents MUST preserve Manic's Bun+Hono+OXC-first architecture.
2. Agents MUST protect zero-config behavior and route/app discovery conventions.
3. Agents MUST keep plugin and provider boundaries clean (no provider-specific logic leaking into generic plugin behavior).
4. Agents MUST use existing framework extension points instead of hardcoding one-off behavior.
5. Agents MUST NOT regress the umbrella/submodule workflow defined in repository AGENTS guidance.

## 6) Verification Before Marking Work Done

1. Agents MUST run relevant validation before declaring completion.
2. Minimum expectation: lint and type/build checks relevant to touched areas.
3. For runtime-impacting changes, agents MUST run a practical local verification path (dev and/or production path as appropriate).
4. Agents MUST report exactly what was run and what was not run.
5. Agents MUST NOT claim “done” when critical checks are skipped or failing.

## 7) Merge-Blocking Conditions

Any of the following is a BLOCKER:

1. Non-Bun or non-OXC toolchain drift in core framework paths.
2. Commit trailers added without explicit maintainer requirement.
3. Unplanned scope expansion with no documented rationale.
4. Failing lint/build/type/test checks relevant to the change.
5. Known regressions left unresolved.
6. Architecture boundary violations (plugin/provider/runtime coupling regressions).
7. Missing verification evidence for high-impact changes.

## 8) Reference Standard (Inspiration Baseline)

This law follows the operational rigor expected in top-tier framework engineering ecosystems (e.g. Next.js, Vite, Astro, Turbopack/Rspack disciplines):

1. Reliability over speed of merge.
2. Deterministic build/runtime behavior.
3. Explicit architectural constraints.
4. Strict quality gates before integration.

## 9) Fast Examples

Accepted:

```bash
bun run lint
bun run build
git commit -m "router: fix dynamic segment precedence"
```

Rejected:

```bash
git commit --trailer "Co-authored-by: Agent <agent@example.com>" -m "fix"
npm run build
```

---

Enforcement note: Reviewers and agents MUST treat this document as binding policy for all future agent-authored changes in this repository.
