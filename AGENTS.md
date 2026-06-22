# Manic Framework: The Comprehensive Engineering Manual

Manic is a high-performance, production-grade React framework built from the ground up on Bun and Hono. It features a custom, ultra-fast bundler and builder system leveraging OXC for transformation and minification. We prioritize reliability, speed, and zero-config DX, intentionally replacing existing solutions like Vite, Webpack, or Turbopack with our own optimized stack.

**Documentation:** [manic-docs.vercel.app](https://manic-docs.vercel.app/)

**LLM / agent context (plain text):** [llms.txt](https://manic-docs.vercel.app/llms.txt) (index of doc URLs) · [llms-full.txt](https://manic-docs.vercel.app/llms-full.txt) (full docs in one file)

---

## 🧭 Monorepo Workspace Model

This is a **monorepo with workspaces** for framework core packages.

**Architecture:**
- Packages are consolidated under the `packages/` directory (manic, bundler, tui, create-manic, rosetta)
- Workspace resolution is linked natively via Bun workspaces
- Versioning and publication are managed via Changesets (`.changeset/config.json`)

**Setup:**
```bash
bun install         # Links via workspaces, creates bun.lock
```

### Development Workflow

1. **Setup workspace:**
   ```bash
   git clone https://github.com/manic-js/manic.git
   cd manic
   bun install
   ```

2. **Edit package files directly:**
   ```bash
   cd packages/manic/src
   # Edit files directly
   ```

3. **Verify changes using local demo:**
   ```bash
   bun run dev         # Runs Turborepo development pipeline
   ```

4. **Verify, commit, and push:**
   ```bash
   bun run lint
   bun run format
   git add .
   git commit -m "feat(manic): ..."
   git push origin main
   ```

---

## 📂 Repository Structure

### Monorepo Workspaces

| Path                      | Purpose                                                           |
| :------------------------ | :---------------------------------------------------------------- |
| `packages/manic/`         | The core framework engine (CLI, runtime, router, server).         |
| `packages/bundler/`       | Standalone bundling module utilizing Bun and OXC resolver.         |
| `packages/tui/`           | Console TUI widgets and logging formats.                          |
| `packages/create-manic/`  | CLI project initialization scaffold.                              |
| `packages/rosetta/`       | Vite plugin translation adapter layer.                            |
| `demo/`                   | Local application testbench.                                      |

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

## 🔌 Plugin Architecture

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

### `createPlugin` Helper

Use `createPlugin` from `manicjs/config` instead of returning a plain object.

### Plugin Checklist

When creating or modifying a plugin, ensure:

- [ ] Use `createPlugin` from `manicjs/config`
- [ ] Static files use the `staticFiles` shorthand (not manual `addRoute` + `emitClientFile`)
- [ ] `injectHtml` is called (not a hardcoded script tag in `index.html`) for any injected scripts/meta
- [ ] `addLinkHeader` is called for any discovery endpoint (RFC 8288)

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

---

## 🤖 AI Agent Code Quality Standards

**All AI agents (including Claude/Cursor) MUST follow these standards when working on Manic.**

### Required Quality Checks (Before Commit)

1. **Linting with oxlint:**
   ```bash
   bun run lint
   ```
   - **No warnings or errors.** Every linting failure must be fixed.
   - Config: [.oxlintrc.json](./.oxlintrc.json) (React plugins, strict correctness/perf/suspicious)

2. **Formatting with oxfmt:**
   ```bash
   bun run format
   ```
   - **Single source of truth.** No manual formatting debates.
   - Config: [.oxfmt.json](./.oxfmt.json) (80 char width, strict semicolons, singleQuote)

3. **Type checking:**
   ```bash
   bun run typecheck
   ```
   - **Zero TypeScript errors** in production code.

4. **Tests (if applicable):**
   ```bash
   bun run test
   ```
   - **All tests pass** before pushing.

### Workflow for AI Agents

**When working on any file in Manic:**

1. **Read relevant AGENTS.md** first (this file or repo-specific one)
2. **Read existing code patterns** in the same directory
3. **Make changes** following Manic's standards
4. **Run all checks:**
   ```bash
   bun run lint
   bun run format
   bun run typecheck
   bun run test
   ```
5. **Verify in demo:**
   ```bash
   cd demo && bun dev
   # Test your changes with hot reload
   ```
6. **Commit with message:**
   - Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
   - Include scope: `feat(manic): add dark mode`
7. **Create a Pull Request** to the main branch.

### CI/CD Pipeline Requirements

Every commit must pass:
- ✅ `oxlint` (linting)
- ✅ `oxfmt --check` (formatting)
- ✅ `tsc --noEmit` (TypeScript)
- ✅ `bun test` (unit/integration tests)

---

## 📝 Development Workflow

1. **Setup:** `bun install`
2. **Edit in workspace:** Make changes in `packages/`
3. **Local validation:** Run quality checks and verify on local `demo`.
4. **Publish/Release:** Handled automatically via Changesets CI integration.

---

## 📚 Docs Source Generation Rule (Required)

- `docs/.source/*` is auto-generated typing output used by Twoslash in framework docs.
- Do not manually edit files under `docs/.source/*`.
- If `docs/.source/*` changes appear from generation/build/doc workflows, include them in the commit set even when those lines were not directly authored by the agent.

