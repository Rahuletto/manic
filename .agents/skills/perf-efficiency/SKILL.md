# perf-efficiency Skill

## Purpose
Drive performance, efficiency, and cost-aware implementation decisions in Manic.

## Optimization rules
- Prefer Bun-native primitives before adding dependencies.
- Optimize hot paths first: route discovery, bundling, server request path, plugin hooks.
- Preserve startup and build performance; avoid expensive synchronous I/O in request path.
- Avoid unnecessary allocations and repeated parsing in loops.
- Keep bundle outputs deterministic and cache-friendly.

## Required evaluation
1. Identify the likely hot path.
2. Measure baseline (build time, route matching, request latency, bundle size) when feasible.
3. Apply smallest change with measurable gain.
4. Re-check correctness and regression risk.

## Anti-patterns
- Premature micro-optimizations without a measured bottleneck.
- Runtime complexity increases for marginal or unverified gains.
