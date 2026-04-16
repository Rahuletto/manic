# Manic Monorepo Structure

This is a monorepo for the **Manic** React framework.

## Directory Structure

| Path                     | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `packages/manic/`        | The core framework (runtime, CLI, router, etc.)          |
| `packages/create-manic/` | CLI tool to scaffold new Manic apps (`bun create manic`) |
| `packages/providers/`    | Deployment adapters (Vercel, Netlify, Cloudflare)        |
| `demo/`                  | Testbench to test framework changes locally              |
| `examples/`              | Example apps shown to users                              |

## How It Works

1. **Development**: Make changes in `packages/manic/`
2. **Testing**: Run `bun dev` in `demo/` to test changes
3. **Scaffolding**: `packages/create-manic/` generates new projects using templates
4. **Examples**: `examples/` contain sample apps users can reference

## Key Files

- `packages/manic/src/cli/` - CLI commands (dev, build, start, deploy, lint, fmt)
- `packages/create-manic/template/` - Template files for new projects

## Running Commands

- `bun install` - Install all dependencies (workspace-aware)
- `bun dev` - Start demo dev server
- `bun build` - Build demo

## Linting & Formatting

- `manic lint` - Run oxlint on the project
- `manic fmt` - Format code with oxfmt
