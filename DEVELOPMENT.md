# Manic Development Setup

This is the official monorepo for the Manic framework, coordinating all core framework packages under one repository workspace.

## Architecture

```
~/manic-workspace/
├── packages/
│   ├── manic/            (core framework engine)
│   ├── bundler/          (custom build engine)
│   ├── rosetta/          (Vite to Manic plugin adapter)
│   ├── create-manic/     (CLI scaffolding tool)
│   └── tui/              (TUI / terminal output primitives)
├── demo/                 (framework testbench application)
│
├── package.json          (workspace root config)
├── bun.lock              (shared lockfile)
└── DEVELOPMENT.md        (this file)
```

## Initial Setup

### 1. Clone workspace
```bash
git clone https://github.com/manic-js/manic.git manic-workspace
cd manic-workspace
```

### 2. Install dependencies
```bash
bun install         # Links all workspaces, creates shared bun.lock
```

This command creates symlinks in `node_modules` pointing to each workspace, enabling hot reload during development.

## Development Workflow

### Working on a package

Edit directly in the workspace packages directory:

```bash
# Edit core CLI command execution
edit packages/manic/src/cli/commands/dev.ts

# Changes are immediately reflected in demo via symlinks
cd demo && bun dev
```

## Commands

### Start demo dev server

```bash
bun run dev         # Equivalent to: turbo dev (running demo app)
```

All workspace packages are symlinked and hot-reload on changes.

### Build all packages

```bash
bun run build       # Runs build in each workspace via Turbo
```

### Run tests

```bash
bun run test        # Runs test in each workspace via Turbo
```

### Format & Lint

```bash
bun run format      # Auto-formats all packages using oxfmt
bun run lint        # Verifies packages correctness using oxlint
```

## Releases & Changesets

We use Changesets to manage versions and releases:

```bash
# Add a changeset describing changes made
bun changeset

# Version packages locally (bumps package versions and updates changelogs)
bun run version-packages

# Release packages to NPM
bun run release
```

## Running Turborepo Commands

We use Turbo to manage tasks across workspaces. Key scripts:

```bash
# Boot the demo dev server with workspace file-watching active
bun run dev

# Run build across all workspaces in parallel in dependency order
bun run build

# Run unit tests across all workspaces
bun run test

# Typecheck all workspace packages
bun run typecheck
```

## FAQ

### Q: Where are first-party plugins and examples?
Plugins now live in a separate `manic-js/plugins` monorepo. Examples live in `manic-js/examples`.

### Q: What happens to bun.lock?
The workspace root `bun.lock` **is committed to the repository** to ensure reproducible builds across developers and CI.

## Questions?

Open an issue in the appropriate repo:
- Core framework: https://github.com/manic-js/core/issues
- Specific plugin: https://github.com/manic-js/plugin-{name}/issues
- Demo/testbench: https://github.com/Rahuletto/manic/issues
