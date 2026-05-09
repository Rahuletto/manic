# Dev Scripts

Optional development utility scripts. These are **not required** for normal workflow.

## benchmark-canary.ts

Performance baseline benchmarking. Run periodically to track build performance.

```bash
bun scripts/dev/benchmark-canary.ts
```

Outputs: `.tmp/canary-baseline.json`

## generate-plugin-agents.ts

Generate plugin-specific AGENTS.md documentation for consistency.

```bash
bun scripts/dev/generate-plugin-agents.ts
```

Use when:
- Adding a new plugin
- Updating plugin development guidelines
- Syncing standards across plugins

---

**Note:** These are optional. Normal development doesn't require running these.
