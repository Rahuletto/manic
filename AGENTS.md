# Manic Framework: The Comprehensive Engineering Manual

Manic is a high-performance, production-grade React framework built from the ground up on Bun and Hono. It features a custom, ultra-fast bundler and builder system leveraging OXC for transformation and minification. We prioritize reliability, speed, and zero-config DX, intentionally replacing existing solutions like Vite, Webpack, or Turbopack with our own optimized stack.

**Documentation:** [manic-docs.vercel.app](https://manic-docs.vercel.app/)

**LLM / agent context (plain text):** [llms.txt](https://manic-docs.vercel.app/llms.txt) (index of doc URLs) · [llms-full.txt](https://manic-docs.vercel.app/llms-full.txt) (full docs in one file)

---

## 🧭 Umbrella Repository Model

This repository is now an umbrella repository that assembles the Manic ecosystem using git submodules.

- `packages/*` and `plugins/*` are submodule gitlinks, each pointing to a separate repository under `manic-js`.
- Changes made inside submodule directories must be committed and pushed in the submodule repository first.
- The umbrella repository must then commit the updated submodule pointers.

### Required Submodule Workflow

When working in this umbrella repository, always follow this sequence:

1. Edit inside submodule (e.g. `packages/manic`)
2. Commit + push in that submodule repo
3. Go to umbrella root `Coding/manic`
4. Commit the submodule pointer change
5. Push umbrella

The umbrella pre-commit hook auto-stages submodule pointer changes, but you still need to commit and push them from the umbrella repo.

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

### Engineering Principles

- **Reliability First**: Production builds in `demo/` are the ultimate source of truth.
- **Speed & Lightness**: Avoid non-essential dependencies. Prefer Bun built-ins.
- **Zero-Config**: Framework should "just work" by scanning `app/` structure.
- **Type Safety**: Maintain strict TypeScript contracts across router, config, and plugins.
- **Workspace Integrity**: Always use `bun install` at the root.

---

## 📝 Development Workflow

1. **Feature Work**: Modify code inside the relevant submodule directory.
2. **Submodule Commit**: Commit and push in that submodule repository first.
3. **Umbrella Pointer Sync**: Commit updated submodule pointers in umbrella root.
4. **Local Validation**: Run `bun dev` or `bun build && bun start` in `demo/` as needed.
5. **Publish/Release**: Use umbrella scripts only as orchestrators; source of truth is each submodule repo.
