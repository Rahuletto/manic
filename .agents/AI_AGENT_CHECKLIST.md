# AI Agent Quick Reference Checklist

**Before you start working on Manic, follow this checklist.**

## Pre-Work

- [ ] Read `AGENTS.md` (quality standards + workspace workflow)
- [ ] Read `DEVELOPMENT.md` (how to set up local workspace)
- [ ] Run `bun install` (install and link workspaces)
- [ ] Understand which package you're editing (`packages/manic`, `packages/bundler`, etc.)

## During Work

### Code Changes

- [ ] Follow existing code patterns in the directory
- [ ] Use TypeScript strictly (no `any` without justification)
- [ ] Add JSDoc comments for public APIs
- [ ] Use conventional commit format (`feat:`, `fix:`, `refactor:`, `docs:`)
- [ ] Include scope in commits: `feat(manic): add view transitions`

### Verification (Before Pushing)

```bash
# In the package you're editing (e.g., packages/manic)
cd packages/manic

# 1. Lint
bunx oxlint --config ../../.oxlintrc.json .
# Must pass with ZERO warnings/errors

# 2. Format
bunx oxfmt --config ../../.oxfmt.json --write .
# Run this to auto-fix formatting

# 3. Type check
bunx tsc --noEmit

# 4. Tests
bun test

# 5. Integration test
cd ../../demo && bun dev
# Your changes should work with hot reload
```

All checks must pass before commit.

## Commit & Push

```bash
# Commit in the root or push packages changes
git add .
git commit -m "feat(manic): add features"
git push origin main
```

## What NOT to Do

❌ Don't disable oxlint rules without documented reason  
❌ Don't manually format code (let oxfmt handle it)  
❌ Don't commit with TypeScript errors  
❌ Don't skip tests  
❌ Don't work across multiple repos in one commit if they are distinct monorepos  
❌ Don't push to main directly — always create PRs  

## Workspace Structure

```
~/manic-workspace/
├── packages/
│   ├── manic/            ← Core framework (manicjs)
│   ├── bundler/          ← Custom builder (@manicjs/bundler)
│   ├── rosetta/          ← Vite plugins adapter (@manicjs/rosetta)
│   ├── create-manic/     ← Scaffolder (create-manic)
│   └── tui/              ← Terminal UI utilities (@manicjs/tui)
├── demo/                 ← Test app
└── package.json          ← Monorepo workspace coordinator
```

## Quick Command Reference

| Task | Command |
|------|---------|
| Install workspaces | `bun install` |
| Start dev server | `bun run dev` (runs demo dev server) |
| Lint packages | `bun run lint` (runs Turbo lint) |
| Fix formatting | `bun run format` (runs oxfmt write) |
| Run tests | `bun run test` |
| Type check | `bun run typecheck` |

## File Locations

| What | Where |
|------|-------|
| Lint rules | `.oxlintrc.json` (root) |
| Format rules | `.oxfmt.json` (root) |
| This checklist | `.agents/AI_AGENT_CHECKLIST.md` |
| Detailed standards | `AGENTS.md` (root) |
| Dev setup | `DEVELOPMENT.md` (root) |
| Changesets configuration | `.changeset/config.json` |

## Help

- **Questions about architecture?** → Read `AGENTS.md`
- **How to develop locally?** → Read `DEVELOPMENT.md`
- **CI/CD failing?** → Check `.github/workflows/ci.yml`
- **Lint/format issues?** → Run format scripts, then check lint
- **TypeScript errors?** → Run `bun run typecheck` to see all

---

**Remember:** AI agents must follow all quality standards. CI failures on main block the whole team. Take time to verify locally first.

