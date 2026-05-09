# Manic Development Setup

This is a **Bun workspace** coordinating development across independent repositories in the `manic-js` organization.

## Architecture

```
~/manic-workspace/
├── core/                 (manic-js/core - main framework)
├── bundler/              (manic-js/bundler - standalone bundler)
├── providers/            (manic-js/providers - deployment adapters)
├── create-manic/         (manic-js/create-manic - CLI scaffolding)
├── tui/                  (manic-js/tui - terminal UI)
├── plugins/
│   ├── tailwind/         (manic-js/plugin-tailwind)
│   ├── unocss/           (manic-js/plugin-unocss)
│   ├── mdx/              (manic-js/plugin-mdx)
│   ├── mcp/              (manic-js/plugin-mcp)
│   ├── seo/              (manic-js/plugin-seo)
│   ├── sitemap/          (manic-js/plugin-sitemap)
│   └── api-docs/         (manic-js/plugin-api-docs)
├── docs/                 (manic-js/docs — cloned locally; not tracked in Rahuletto/manic)
├── examples/
│   ├── starter/        (manic-js/example-starter)
│   └── chatbot/        (manic-js/example-chatbot)
├── demo/                 (Rahuletto/manic - testbench)
│
├── package.json          (workspace root config)
├── bun.lock              (shared lockfile - LOCAL ONLY)
└── DEVELOPMENT.md        (this file)
```

## Initial Setup

### 1. Clone workspace root

```bash
# Use HTTPS (default)
git clone https://github.com/Rahuletto/manic manic-workspace
cd manic-workspace

# OR use SSH (if you have SSH keys configured)
git clone git@github.com:Rahuletto/manic.git manic-workspace
cd manic-workspace
```

Run setup to clone all manic-js/* repos:

```bash
./setup.sh          # Clones all 16 manic-js/* repos into subdirectories
```

The setup script automatically detects your git protocol (SSH or HTTPS) from your git config and uses the same for cloning all repos.

**Note on demo:** The `demo/` directory is included in the Rahuletto/manic repository (this repo). It is NOT cloned separately by setup.sh to avoid recursive cloning. The demo is the primary testbench for verifying framework changes.

### 2. Install dependencies

Run **`./setup.sh` before the first `bun install`** so every workspace directory
(including `examples/starter` and `examples/chatbot`) exists; otherwise Bun will
report missing workspaces.

```bash
bun install         # Links all workspaces, creates shared bun.lock
```

**Important:** The `bun.lock` file at the workspace root is committed to the repository. It ensures:
- Reproducible builds across developers and CI/CD
- Consistent dependency versions for the integrated workspace
- All workspace packages see the same dependency tree locally

**Note:** Individual packages (core, plugins, etc.) may have their own bun.lock files when used standalone outside the workspace.

This command creates symlinks in `node_modules` pointing to each workspace, enabling hot reload during development.

## Development Workflow

### Working on a package

Edit directly in the workspace directory:

```bash
# Edit a plugin
edit plugins/tailwind/src/index.ts

# Changes are immediately reflected in demo via symlinks
cd demo && bun dev
```

### Push changes to individual repo

Each directory is a full git repository. Push changes normally:

```bash
cd plugins/tailwind
git add src/index.ts
git commit -m "feat: update tailwind integration"
git push origin main     # Pushes to manic-js/plugin-tailwind
```

### Update root workspace

Only change DEVELOPMENT.md, setup.sh, or package.json here. Rarely needed.

```bash
git add DEVELOPMENT.md
git commit -m "docs: update setup instructions"
git push origin main     # Pushes to Rahuletto/manic
```

## Commands

### Start demo dev server

```bash
bun run dev         # Equivalent to: cd demo && bun dev
```

All workspace packages are symlinked and hot-reload on changes.

### Build all packages

```bash
bun run build       # Runs `bun run build` in each workspace
```

### Run tests

```bash
bun run test        # Runs `bun run test` in each workspace
```

### Release packages

```bash
bun run release     # Publishes all packages to npm (coordinated)
```

## Hot Reload & Local Linking

When you run `bun install`, Bun automatically:

1. Detects workspaces in `package.json`
2. Creates symlinks in `node_modules/@manicjs/*` → to each package's `src/`
3. Watches files in demo

```bash
# Example: edit plugin-tailwind
edit plugins/tailwind/src/index.ts
# save → demo's dev server detects change → hot reloads
```

**No build step needed.** Direct source file watching.

## FAQ

### Q: How do I add a new package to the workspace?

1. Clone the repo into the appropriate directory
2. Add it to `workspaces` in `package.json`
3. Run `bun install` again

### Q: What if I want to work on one repo only?

Clone it standalone:

```bash
git clone https://github.com/manic-js/plugin-mdx
cd plugin-mdx
bun install
bun test
```

The workspace is optional; each repo works independently.

### Q: How are releases coordinated?

Each repo publishes independently via CI/CD. Optional: use `scripts/release.sh` to batch-publish all at once.

### Q: Can I push to multiple repos at once?

No. Each repo has its own git history. Push individually:

```bash
cd core && git push
cd ../bundler && git push
cd ../plugins/tailwind && git push
# etc
```

### Q: What happens to bun.lock?

The workspace root `bun.lock` **IS committed to the repository**. This is critical because:

- ✅ Ensures reproducible builds across developers
- ✅ Prevents "works on my machine" dependency issues
- ✅ Provides exact version pinning for the integrated workspace
- ✅ Required by CI/CD pipelines for consistency

**Each independent repo** (core, plugins, etc.) may also have its own `bun.lock` file when used standalone outside the workspace context.

**Do not ignore the root bun.lock.** Commit it with your changes.

### Q: How do submodules compare?

**Submodules (❌ old):** Tracked commit pointers in umbrella, merge conflicts, complex workflow.

**Workspaces (✅ new):** Just symlinked directories, each repo is independent, simple push flow.

## Troubleshooting

### Hot reload not working?

Ensure demo is running with `bun dev`:

```bash
cd demo && bun dev
```

Check that the package is listed in demo's `package.json` dependencies.

### Lockfile conflicts?

The workspace `bun.lock` is local. Delete and regenerate:

```bash
rm bun.lock
bun install
```

### Examples still under `example-starter/` or `example-chatbot/` at repo root?

Older setups cloned those at the top level. Remove the old folders (each is its own git
repo — keep any work you need, then delete) and run `./setup.sh` again. New clones go to
`examples/starter` and `examples/chatbot`.

### Clone failed?

Check GitHub token:

```bash
gh auth status
```

Ensure you have access to manic-js org repos.

## Resources

- **Bun Workspaces:** https://bun.sh/docs/cli/install#workspaces
- **Manic Docs:** https://manic-docs.vercel.app
- **Contributing:** See CONTRIBUTING.md in each repo

## Questions?

Open an issue in the appropriate repo:
- Core framework: https://github.com/manic-js/core/issues
- Specific plugin: https://github.com/manic-js/plugin-{name}/issues
- Demo/testbench: https://github.com/Rahuletto/manic/issues
