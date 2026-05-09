# AI Agent Quick Reference Checklist

**Before you start working on Manic, follow this checklist.**

## Pre-Work

- [ ] Read `AGENTS.md` (quality standards + polyrepo workflow)
- [ ] Read `DEVELOPMENT.md` (how to set up local workspace)
- [ ] Run `./setup.sh && bun install` (clone all repos, link workspaces)
- [ ] Understand which repo you're editing (core, plugin-tailwind, etc.)

## During Work

### Code Changes

- [ ] Follow existing code patterns in the directory
- [ ] Use TypeScript strictly (no `any` without justification)
- [ ] Add JSDoc comments for public APIs
- [ ] Use conventional commit format (`feat:`, `fix:`, `refactor:`, `docs:`)
- [ ] Include scope in commits: `feat(plugin-tailwind): add dark mode`

### Verification (Before Pushing)

```bash
# In the repo you're editing (e.g., plugins/tailwind)
cd plugins/tailwind

# 1. Lint
bunx oxlint --config .oxlintrc.json .
# Must pass with ZERO warnings/errors

# 2. Format
bunx oxfmt --config .oxfmt.json --write .
# Run this to auto-fix formatting

# 3. Type check
bun run typecheck  # or: bunx tsc --noEmit

# 4. Tests
bun test

# 5. Integration test
cd ../demo && bun dev
# Your changes should work with hot reload
```

All checks must pass before commit.

## Commit & Push

```bash
# Commit in the specific repo
cd plugins/tailwind
git add .
git commit -m "feat(plugin-tailwind): add dark mode support"
git push origin main  # Push to manic-js/plugin-tailwind
```

**Never push to Rahuletto/manic directly** unless updating:
- DEVELOPMENT.md
- setup.sh
- AGENTS.md
- .gitignore

## What NOT to Do

❌ Don't disable oxlint rules without documented reason  
❌ Don't manually format code (let oxfmt handle it)  
❌ Don't commit with TypeScript errors  
❌ Don't skip tests  
❌ Don't work across multiple repos in one commit  
❌ Don't push to main directly — always create PRs  
❌ Don't modify other repos' AGENTS.md without syncing  

## Polyrepo Structure Reminder

```
~/manic-workspace/
├── core/                 ← Full git repo (manic-js/core)
├── bundler/
├── providers/
├── plugins/
│   ├── tailwind/       ← Full git repo (manic-js/plugin-tailwind)
│   ├── mdx/
│   ├── seo/
│   └── ...
├── create-manic/
├── tui/
├── demo/               ← Test app
├── docs/
└── package.json        ← Workspace coordinator
```

Each `*/` is independent. You push to each independently.

## Quick Command Reference

| Task | Command |
|------|---------|
| Clone everything | `./setup.sh && bun install` |
| Start dev server | `cd demo && bun dev` |
| Lint current repo | `bunx oxlint --config .oxlintrc.json .` |
| Fix formatting | `bunx oxfmt --config .oxfmt.json --write .` |
| Run tests | `bun test` |
| Type check | `bun run typecheck` |
| Push to repo | `cd plugins/tailwind && git push origin main` |

## File Locations

| What | Where |
|------|-------|
| Lint rules | `.oxlintrc.json` (root) |
| Format rules | `.oxfmt.json` (root) |
| This checklist | `AI_AGENT_CHECKLIST.md` (root) |
| Detailed standards | `AGENTS.md` (root) |
| Dev setup | `DEVELOPMENT.md` (root) |
| Config sync | `.github/CONFIG_SYNC.md` |
| CI template | `.github/ci-template.yml` |

## Help

- **Questions about architecture?** → Read `AGENTS.md`
- **How to develop locally?** → Read `DEVELOPMENT.md`
- **CI/CD failing?** → Check `.github/workflows/ci.yml` in the repo
- **Lint/format issues?** → Run oxfmt --write, then oxlint
- **TypeScript errors?** → Run `bun run typecheck` to see all

---

**Remember:** AI agents must follow all quality standards. CI failures on main block the whole team. Take time to verify locally first.
