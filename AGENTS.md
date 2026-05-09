# Manic Framework: The Comprehensive Engineering Manual

Manic is a high-performance, production-grade React framework built from the ground up on Bun and Hono. It features a custom, ultra-fast bundler and builder system leveraging OXC for transformation and minification. We prioritize reliability, speed, and zero-config DX, intentionally replacing existing solutions like Vite, Webpack, or Turbopack with our own optimized stack.

**Documentation:** [manic-docs.vercel.app](https://manic-docs.vercel.app/)

**LLM / agent context (plain text):** [llms.txt](https://manic-docs.vercel.app/llms.txt) (index of doc URLs) · [llms-full.txt](https://manic-docs.vercel.app/llms-full.txt) (full docs in one file)

---

## 🧭 Polyrepo + Bun Workspace Model

This is a **polyrepo with local workspace linking** for development.

**Architecture:**
- 16 independent repositories under `manic-js` org (core, bundler, providers, 7 plugins, create-manic, tui, docs, examples)
- Rahuletto/manic is **workspace coordinator** (not source)
- Local dev: all repos cloned into one directory, linked via Bun workspaces
- Each repo publishes independently to npm

**Setup:**
```bash
./setup.sh          # Clones all 16 manic-js/* repos
bun install         # Links via workspaces, creates bun.lock
```

### Required Polyrepo Workflow

1. **Clone repos locally** (done via `setup.sh`):
   ```bash
   cd ~/manic-workspace
   ./setup.sh
   bun install
   ```

2. **Edit in workspace directory:**
   ```bash
   cd plugins/tailwind/src
   # Edit files directly
   ```

3. **Push to independent repo:**
   ```bash
   cd plugins/tailwind
   git add src/index.ts
   git commit -m "feat: ..."
   git push origin main  # Pushes to manic-js/plugin-tailwind
   ```

4. **Rahuletto/manic (umbrella):** Only push if updating DEVELOPMENT.md, setup.sh, or .gitignore
   ```bash
   cd ~/manic-workspace
   git add DEVELOPMENT.md
   git commit -m "docs: ..."
   git push origin main  # Pushes to Rahuletto/manic
   ```

**Key:** Each directory under `packages/`, `plugins/`, etc. is a full git repository with independent CI/CD, releases, and version management.

---

## 📂 Repository Structure

### Core Workspace (Submodules + Local App/Test Surfaces)

| Path                     | Purpose                                                           |
| :----------------------- | :---------------------------------------------------------------- |
| `packages/manic/`        | Submodule: the core framework engine (CLI, runtime, router, server).         |
| `packages/create-manic/` | Submodule: CLI scaffolding tool (`bun create manic`) and project templates.  |
| `packages/providers/`    | Submodule: deployment adapters for Vercel, Netlify, Cloudflare, and more.    |
| `demo/`                  | The primary development testbench for local feature verification. |
| `examples/`              | Curated reference applications and integration patterns.          |
| `plugins/`               | Submodules for first-party Manic plugins.                          |

### Framework Internals (`packages/manic/src/`)

| Directory      | Responsibility                             | Key Files                                                            |
| :------------- | :----------------------------------------- | :------------------------------------------------------------------- |
| `cli/`         | Command orchestrator & toolchain.          | `index.ts`, `commands/build.ts`, `commands/dev.ts`, `plugins/oxc.ts` |
| `server/`      | Production Hono server & SSR engine.       | `index.ts`, `lib/discovery.ts` (route scanning)                      |
| `router/`      | Type-safe React router & View Transitions. | `Router.tsx`, `lib/matcher.ts`, `lib/Link.tsx`, `lib/context.ts`     |
| `plugins/`     | Core framework extensions & middleware.    | `lib/api.ts` (API loader), `lib/static.ts`                           |
| `config/`      | Schema-driven configuration engine.        | `index.ts` (loadConfig/defineConfig), `client.ts`                    |
| `env/`         | Environment variable management.           | `client.ts`                                                          |
| `theme/`       | Built-in styling & theme utilities.        | `index.ts`                                                           |
| `transitions/` | View Transitions API React components.     | `index.ts`                                                           |

---

## 🛠 The Manic Build Engine (Custom Toolchain)

Manic does NOT use Vite or Rollup. It implements a proprietary build pipeline built with Bun and OXC.

1. **Auto-Linting**: Mandatory `oxlint` pass ensures production-grade reliability before bundling.
2. **Client Bundling**: `Bun.build` + `oxcPlugin` + `bun-plugin-tailwind`. Target: `browser`.
3. **API Bundling**: Each folder in `app/api/` (with an `index.ts`) is bundled into a standalone JS file in `dist/api/`.
4. **Server Entry Transformation**:
   - Reads `~manic.ts`.
   - Replaces `import app from './app/index.html'` with a `Bun.file()` read of the built HTML.
   - Bundles the entire server for the `bun` target.
5. **OXC Minification**: `oxc-minify` runs in parallel over all output directories. es2022 target, mangling enabled.

---

## 🛣 Routing & Client Lifecycle

### The `~` (Tilde) Convention

- `~manic.ts`: Mandatory server entry point.
- `app/~routes.generated.ts`: Auto-generated manifest. Contains dynamic `import()` for all pages.
- `app/routes/~*.tsx`: Files prefixed with `~` are ignored by the router (useful for components/layouts/utils).

---

## 🔌 Plugin & Provider Architecture

### `ManicPlugin` Interface

```ts
interface ManicPlugin {
  name: string;
  /** Absolute path to a Bun plugin script — auto-injected as --preload in dev, Bun.plugin() in build */
  preload?: string;
  /** TOML snippet for bunfig.toml — manic dev merges all [serve.static] entries automatically */
  bunfig?: string;
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}
```

### First-Party Plugins

| Package | Purpose |
| :--- | :--- |
| `@manicjs/tailwind` | Tailwind CSS v4 via `bun-plugin-tailwind` |
| `@manicjs/unocss` | UnoCSS via `bun-plugin-unocss` |
| `@manicjs/mdx` | MDX with GFM, frontmatter, TOC extraction |
| `@manicjs/seo` | Meta tags, Open Graph, canonical URLs |
| `@manicjs/sitemap` | Auto-generates `sitemap.xml` |
| `@manicjs/mcp` | Model Context Protocol endpoint |
| `@manicjs/api-docs` | Scalar API reference UI |

### `createPlugin` Helper

Use `createPlugin` from `manicjs/config` instead of returning a plain object.

### Plugin Checklist

When creating or modifying a plugin, ensure:

- [ ] Use `createPlugin` from `manicjs/config`
- [ ] Static files use the `staticFiles` shorthand (not manual `addRoute` + `emitClientFile`)
- [ ] `injectHtml` is called (not a hardcoded script tag in `index.html`) for any injected scripts/meta
- [ ] No provider-specific imports or logic inside the plugin
- [ ] `addLinkHeader` is called for any discovery endpoint (RFC 8288)

### Plugin Developer Workflow (Required)

For contributors building plugins in this monorepo:

1. Read and follow `plugins/AGENTS.md` before editing any plugin package.
2. Use `bunx manic plugin add <package>` and `bunx manic plugin remove <package>` in test apps to validate install/config behavior.
3. Validate plugin behavior in both dev and prod:
   - `bunx manic dev`
   - `bunx manic build && bunx manic start`
4. Keep plugin output provider-agnostic; emit files through `emitClientFile` / `staticFiles` rather than provider-specific logic.

---

## 🚀 Technical Standards & Requirements

### The Stack

- **Runtime**: Bun (Mandatory - uses `Bun.serve`, `Bun.build`, `Bun.Glob`, `Bun.spawn`, `Bun.file`).
- **Server**: Hono (High-performance middleware & routing).
- **Transform**: `oxc-transform` (Ultra-fast JSX/TS compilation).
- **Minify**: `oxc-minify` (Production-grade code compression).
- **Resolve**: `oxc-resolver` (Node/Bun compatible module resolution).
- **Lint**: `oxlint` (Blazing fast diagnostics).
- **Format**: `oxfmt` (OXC formatter - single source of truth).

### Engineering Principles

- **Reliability First**: Production builds in `demo/` are the ultimate source of truth.
- **Speed & Lightness**: Avoid non-essential dependencies. Prefer Bun built-ins.
- **Zero-Config**: Framework should "just work" by scanning `app/` structure.
- **Type Safety**: Maintain strict TypeScript contracts across router, config, and plugins.
- **Workspace Integrity**: Always use `bun install` at the root.
- **Polyrepo Integrity**: Each repo's CI/CD must pass independently.

---

## 🤖 AI Agent Code Quality Standards

**All AI agents (including Claude/Cursor) MUST follow these standards when working on Manic.**

### Required Quality Checks (Before Commit)

1. **Linting with oxlint:**
   ```bash
   oxlint --config .oxlintrc.json .
   ```
   - **No warnings or errors.** Every linting failure must be fixed.
   - Config: [.oxlintrc.json](./.oxlintrc.json) (React plugins, strict correctness/perf/suspicious)

2. **Formatting with oxfmt:**
   ```bash
   oxfmt --config .oxfmt.json --check .
   # or auto-fix:
   oxfmt --config .oxfmt.json --write .
   ```
   - **Single source of truth.** No manual formatting debates.
   - Config: [.oxfmt.json](./.oxfmt.json) (80 char width, strict semicolons, singleQuote)

3. **Type checking:**
   ```bash
   bun run typecheck  # or tsc --noEmit in repo root
   ```
   - **Zero TypeScript errors** in production code.
   - Warnings acceptable only with explicit ignore comments.

4. **Tests (if applicable):**
   ```bash
   bun test
   ```
   - **All tests pass** before pushing.
   - Smoke tests mandatory for plugins and core packages.

### Workflow for AI Agents

**When working on any file in Manic:**

1. **Read relevant AGENTS.md** first (this file or repo-specific one)
2. **Read existing code patterns** in the same directory
3. **Make changes** following Manic's standards
4. **Run all checks:**
   ```bash
   # In the specific package directory
   bunx oxlint --config .oxlintrc.json .
   bunx oxfmt --config .oxfmt.json --check .
   bun typecheck
   bun test
   ```
5. **Verify in demo:**
   ```bash
   cd demo && bun dev
   # Test your changes with hot reload
   ```
6. **Commit with message:**
   - Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
   - Include scope: `feat(plugin-tailwind): add dark mode`
7. **Push to correct repo:**
   ```bash
   cd packages/core  # or plugins/tailwind, etc
   git push origin main
   ```

### CI/CD Pipeline Requirements

**Every repo under manic-js/ must pass these checks in CI:**

- ✅ `oxlint` (linting)
- ✅ `oxfmt --check` (formatting)
- ✅ `tsc --noEmit` (TypeScript)
- ✅ `bun test` (unit/integration tests)
- ✅ `smoke tests` (for plugins)

**Agents MUST ensure all checks pass locally before pushing.** CI failures block merges.

### What NOT to Do

- ❌ **Never disable oxlint rules** without explicit approval (document in code)
- ❌ **Never manual format code** — let oxfmt handle it
- ❌ **Never merge with type errors** — fix them first
- ❌ **Never ignore test failures** — investigate and fix
- ❌ **Never commit to main directly** — always create PRs
- ❌ **Never work across multiple independent repos in one commit** — push each separately

### per-Repo CI Configuration

Each independent repo (core, plugins, etc.) has:
- `.github/workflows/ci.yml` — Linting, formatting, tests
- `.oxlintrc.json` — Lint rules
- `.oxfmt.json` — Format rules
- `package.json` scripts: `ci:lint`, `ci:format`, `ci:typecheck`, `ci:test`, `ci:compliance`

Repos sync these configs periodically from root AGENTS.md. **If you modify .oxlintrc.json or .oxfmt.json here, cascade to all repos.**

---

## 📝 Development Workflow

1. **Setup:** `./setup.sh && bun install` (one-time)
2. **Edit in workspace:** Make changes in `packages/`, `plugins/`, etc.
3. **Local validation:**
   - `cd plugins/tailwind && oxlint . && oxfmt --check . && bun test`
   - `cd demo && bun dev` (verify with hot reload)
4. **Commit & push per repo:**
   ```bash
   cd plugins/tailwind
   git add .
   git commit -m "feat: ..."
   git push origin main
   ```
5. **Only push to Rahuletto/manic if:** Updating DEVELOPMENT.md, setup.sh, AGENTS.md, or .gitignore
6. **Publish/Release:** Each repo publishes independently via CI/CD

---

## 📚 Docs Source Generation Rule (Required)

- `docs/.source/*` is auto-generated typing output used by Twoslash in framework docs.
- Do not manually edit files under `docs/.source/*`.
- If `docs/.source/*` changes appear from generation/build/doc workflows, include them in the commit set even when those lines were not directly authored by the agent.
