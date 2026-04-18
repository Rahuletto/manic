# Manic Framework — Complete Technical Analysis

> **Purpose**: Comprehensive technical reference for documentation writers and AI agents.
> **Scope**: All packages — `packages/`, `plugins/`. Excludes demo, docs, testbench.
> **Version**: manicjs 0.12.0 (December 2025)

---

# Table of Contents

1. [Framework Identity](#1-framework-identity)
2. [Package Architecture](#2-package-architecture)
3. [CLI System](#3-cli-system)
4. [Server System](#4-server-system)
5. [Router System](#5-router-system)
6. [Configuration System](#6-configuration-system)
7. [Theme System](#7-theme-system)
8. [View Transitions](#8-view-transitions)
9. [Environment System](#9-environment-system)
10. [Plugin System](#10-plugin-system)
11. [Build System](#11-build-system)
12. [Deployment Providers](#12-deployment-providers)
13. [Scaffolding (create-manic)](#13-scaffolding-create-manic)
14. [File Conventions](#14-file-conventions)
15. [Complete Type Reference](#15-complete-type-reference)
16. [API Reference Tables](#16-api-reference-tables)
17. [Internal Implementation Details](#17-internal-implementation-details)
18. [Built-in Components](#18-built-in-components)
19. [Agent & AI Support](#19-agent--ai-support)
20. [OXC Toolchain](#20-oxc-toolchain)
21. [Caveats and Limitations](#21-caveats-and-limitations)

---

# 1. Framework Identity

## Core Information

| Property         | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| **Package Name** | `manicjs`                                                      |
| **Version**      | 0.12.0                                                         |
| **Description**  | React SPA framework powered by Bun, OXC, Hono, and Tailwind v4 |
| **License**      | GPL-3.0                                                        |
| **Author**       | Rahuletto                                                      |
| **Repository**   | https://github.com/Rahuletto/manic                             |

## Runtime Requirements

| Requirement | Version                        |
| ----------- | ------------------------------ |
| Bun         | >= 1.0.0                       |
| React       | >= 18.0.0 (React 19 supported) |
| React DOM   | >= 18.0.0                      |

## Core Dependencies

```
hono: ^4.12.14              # HTTP server framework (replaced Elysia at v0.7.x)
bun-plugin-tailwind: ^0.1.2 # Tailwind CSS compilation
colorette: ^2.0.20          # Terminal colors
oxc-transform               # JSX/TS transforms
oxc-minify                  # Production minification
oxc-resolver                # Module resolution
oxlint                      # Linting binary
```

> **⚠️ BREAKING CHANGE FROM v0.5.x**: Elysia is completely gone. The framework now uses Hono for all server-side routing, API routes, and middleware. API routes export Hono instances, not Elysia instances. Plugins use raw `Request → Response` handlers, not Elysia's context object.

## What Makes Manic Fast

1. **Bun.build()** — Native bundler, no esbuild/Rollup/Webpack
2. **Bun.serve()** — Native HTTP server with built-in HMR websocket
3. **OXC transform** — Rust-based JSX/TS transform (faster than Babel/swc)
4. **OXC minify** — Rust-based minification (parallel across client/api/server)
5. **oxc-resolver** — Rust-based module resolution
6. **No transpilation step** — Bun runs TypeScript directly
7. **Minimal dependencies** — hono + oxc-\* + colorette + bun-plugin-tailwind

---

# 2. Package Architecture

## Monorepo Structure

```
packages/
├── manic/                    # Core framework (npm: manicjs)
│   ├── index.ts              # Main barrel exports
│   ├── package.json
│   └── src/
│       ├── cli/              # CLI entry + commands
│       │   ├── index.ts      # manic binary, arg parsing
│       │   ├── plugins/
│       │   │   └── oxc.ts    # OXC transform BunPlugin
│       │   └── commands/
│       │       ├── dev.ts    # manic dev
│       │       ├── build.ts  # manic build (404 lines)
│       │       ├── start.ts  # manic start
│       │       ├── deploy.ts # manic deploy
│       │       ├── lint.ts   # manic lint (oxlint wrapper)
│       │       └── fmt.ts    # manic fmt (oxfmt wrapper)
│       ├── components/       # Built-in React components
│       │   ├── NotFound/
│       │   │   ├── index.tsx       # 404 page
│       │   │   └── DotBackground.tsx # Animated canvas background
│       │   └── ServerError/
│       │       └── index.tsx       # Error overlay (670 lines, 0 deps)
│       ├── config/           # Configuration system
│       │   ├── index.ts      # defineConfig, loadConfig, ManicConfig
│       │   └── client.ts     # createClient (Hono RPC helper)
│       ├── env/              # Environment variable handling
│       │   ├── index.ts      # Server-side env
│       │   └── client.ts     # Client-side env
│       ├── plugins/          # Framework Hono plugins
│       │   └── lib/
│       │       ├── api.ts    # apiLoaderPlugin — Hono API route loader
│       │       └── static.ts # fileImporterPlugin (unused by framework)
│       ├── router/           # Client-side router
│       │   ├── index.ts      # Re-exports
│       │   └── lib/
│       │       ├── Router.tsx   # Router component (370 lines)
│       │       ├── Link.tsx     # Navigation link (63 lines)
│       │       ├── context.ts   # React context definition
│       │       ├── matcher.ts   # RouteRegistry, route matching (147 lines)
│       │       └── types.ts     # Shared types
│       ├── server/           # Server bootstrap
│       │   ├── index.ts      # createManicServer (354 lines)
│       │   └── lib/
│       │       ├── discovery.ts # Route scanning, manifest, file watching (212 lines)
│       │       └── markdown.ts  # HTML → Markdown converter (110 lines)
│       ├── theme/            # Dark/light mode system
│       │   └── index.ts      # ThemeProvider, useTheme, ThemeToggle, initTheme
│       └── transitions/      # View Transitions API
│           └── index.ts      # ViewTransitions object
│
├── create-manic/             # Scaffolding CLI (npm: create-manic) v0.9.0
│   ├── index.ts              # Interactive prompts
│   └── template/             # Project template (mirrors demo app)
│
└── providers/                # Deployment adapters (npm: @manicjs/providers) v0.8.0
    └── src/
        ├── index.ts          # Re-exports
        ├── types.ts          # ManicProvider, BuildContext
        ├── middleware.ts     # agentMiddleware code generator (173 lines)
        ├── vercel/           # Vercel Build Output API v3
        ├── cloudflare/       # Cloudflare Pages
        └── netlify/          # Netlify Functions

plugins/
├── api-docs/                 # @manicjs/api-docs v0.6.0 (Scalar UI)
│   └── src/index.ts
├── seo/                      # @manicjs/seo v0.5.0 (robots.txt, Link headers)
│   └── src/
│       ├── index.ts
│       └── robots.ts
├── sitemap/                  # @manicjs/sitemap v0.6.0
│   └── src/
│       ├── index.ts
│       └── generate.ts
└── mcp/                      # @manicjs/mcp v0.5.0 (MCP server)
    └── src/
        ├── index.ts          # Plugin entry (178 lines)
        ├── handler.ts        # JSON-RPC handler (70 lines)
        ├── tool.ts           # defineTool + Zod schema conversion (60 lines)
        ├── default-tools.ts  # Built-in MCP tools (79 lines)
        ├── discovery.ts      # Well-known discovery docs (98 lines)
        └── console.ts        # Browser console log capture (38 lines)
```

## Package Export Maps

### `manicjs` Export Paths

| Import Path           | Key Symbols                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manicjs`             | `Router`, `Link`, `NotFound`, `ServerError`, `navigate`, `useRouter`, `useQueryParams`, `defineConfig`, `loadConfig`, `ThemeProvider`, `useTheme`, `ThemeToggle`, `ViewTransitions`, `createClient` |
| `manicjs/router`      | `Router`, `Link`, `RouterContext`, `useRouter`, `useQueryParams`, `navigate`, `setViewTransitions`, `preloadRoute`, types                                                                           |
| `manicjs/server`      | `createManicServer`                                                                                                                                                                                 |
| `manicjs/config`      | `defineConfig`, `loadConfig`, `ManicConfig`, `ManicPlugin`, `ManicPluginContext`, `ManicServerPluginContext`, `ManicBuildPluginContext`, `ManicProvider`, `BuildContext`, `PageRoute`, `ApiRoute`   |
| `manicjs/plugins`     | `apiLoaderPlugin`, `fileImporterPlugin`                                                                                                                                                             |
| `manicjs/theme`       | `ThemeProvider`, `useTheme`, `ThemeToggle`, `initTheme`                                                                                                                                             |
| `manicjs/transitions` | `ViewTransitions`                                                                                                                                                                                   |
| `manicjs/env`         | `getEnv`, `getPublicEnv`                                                                                                                                                                            |
| `manicjs/client`      | `createClient`                                                                                                                                                                                      |

### `@manicjs/providers` Export Paths

| Import Path                     | Exports                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `@manicjs/providers`            | `vercel`, `cloudflare`, `netlify`, `ManicProvider`, `BuildContext` |
| `@manicjs/providers/vercel`     | `vercel`, `VercelOptions`                                          |
| `@manicjs/providers/cloudflare` | `cloudflare`, `CloudflareOptions`                                  |
| `@manicjs/providers/netlify`    | `netlify`, `NetlifyOptions`                                        |

### Plugin Packages

| Package             | Import                                           | Main Export                    |
| ------------------- | ------------------------------------------------ | ------------------------------ |
| `@manicjs/api-docs` | `import { apiDocs } from '@manicjs/api-docs'`    | `apiDocs(options?)`            |
| `@manicjs/seo`      | `import { seo } from '@manicjs/seo'`             | `seo(config)`                  |
| `@manicjs/sitemap`  | `import { sitemap } from '@manicjs/sitemap'`     | `sitemap(config)`              |
| `@manicjs/mcp`      | `import { mcp, defineTool } from '@manicjs/mcp'` | `mcp(config?)`, `defineTool()` |

---

# 3. CLI System

## Binary Entry Point

**Location**: `packages/manic/src/cli/index.ts`
**Binary**: `manic` (via package.json `bin` field)
**Shebang**: `#!/usr/bin/env bun`

> **Note**: `--version` reports `v0.6.0` hardcoded — actual package.json version is `0.12.0`. Known cosmetic bug.

## Commands Overview

| Command        | Description                                     |
| -------------- | ----------------------------------------------- |
| `manic dev`    | Start dev server with HMR                       |
| `manic build`  | Production build → `.manic/`                    |
| `manic start`  | Run production server from `.manic/server.js`   |
| `manic deploy` | Build + run configured provider deploy commands |
| `manic lint`   | Run oxlint across the project                   |
| `manic fmt`    | Run oxfmt formatter                             |

## `manic dev`

**File**: `packages/manic/src/cli/commands/dev.ts`

```typescript
interface DevOptions {
  port?: number;
  network?: boolean;
}
async function dev({ port, network }: DevOptions): Promise<void>;
```

**Behavior**:

1. Loads config via `loadConfig()`.
2. Determines port: CLI `--port` → `config.server.port` → env `$PORT` → `6070`.
3. Sets hostname: `--network` → `"0.0.0.0"` : `"localhost"`.
4. Spawns: `bun --watch ~manic.ts`.
5. Passes environment vars: `PORT`, `HOST`, `NETWORK`.
6. Handles `SIGINT`/`SIGTERM` for child process cleanup.

## `manic build`

**File**: `packages/manic/src/cli/commands/build.ts` (404 lines)

**Build Steps (in order)**:

1. **Load config** via `loadConfig()`
2. **Lint** — runs `oxlint`. Build exits with code `1` if lint fails. Non-negotiable.
3. **Clean output** — `rmSync(dist, { recursive: true, force: true })`
4. **Write routes manifest** — `writeRoutesManifest('app/~routes.generated.ts')`
5. **Resolve entry** — `oxc-resolver` resolves `./app/main` to `./app/main.tsx`
6. **Client bundle** — `Bun.build` (browser target, OXC plugin, bun-plugin-tailwind)
7. **HTML transform** — replaces `href="tailwindcss"` and `src="./main.tsx"` with hashed filenames
8. **Copy assets** — `assets/` → `.manic/client/assets/`
9. **Plugin build hooks** — calls `plugin.build(ctx)` for each plugin
10. **API bundle** — each `app/api/**/index.ts` bundled separately (`bun` target, `external: ['*']`)
11. **API catalog** — writes `/.well-known/api-catalog` JSON (RFC 9727)
12. **Server bundle** — transforms `~manic.ts` (HTML import → `Bun.file()` read), bundles
13. **Minify** — `oxc-minify` runs in parallel across client, API, and server directories; ES2022 target, mangling enabled
14. **Stats** — prints build output sizes and timing
15. **Provider hooks** — calls `provider.build(ctx)` for each configured provider

**Client `Bun.build` options**:

```typescript
await Bun.build({
  entrypoints: ['./app/main.tsx'],
  outdir: `${dist}/client`,
  target: 'browser',
  naming: {
    entry: '[name]-[hash].[ext]',
    chunk: 'chunks/[name]-[hash].[ext]',
    asset: 'assets/[name]-[hash].[ext]',
  },
  plugins: [oxcPlugin(false), bunPluginTailwind],
});
```

**API `Bun.build` options** (per route):

```typescript
await Bun.build({
  entrypoints: [entry],
  outdir: `${dist}/api`,
  target: 'bun',
  external: ['*'], // ALL deps are external — critical for manic start
  naming: `${routeName}.js`,
});
```

**Server `Bun.build` options**:

```typescript
await Bun.build({
  entrypoints: [transformedServerEntry],
  outdir: dist,
  target: 'bun',
  naming: { entry: 'server.js' },
});
```

**Build Output**:

```
.manic/
├── client/
│   ├── index.html            # Transformed HTML
│   ├── main-[hash].js        # Client bundle
│   ├── [hash].css            # Bundled Tailwind CSS
│   ├── chunks/               # Code-split chunks
│   │   └── [name]-[hash].js
│   ├── assets/               # Copied from assets/
│   └── .well-known/
│       └── api-catalog       # RFC 9727 API catalog
├── api/
│   └── [route].js            # Bundled API routes (external deps)
└── server.js                 # Bundled server entry
```

## `manic start`

```typescript
async function start({ port, network }: StartOptions): Promise<void>;
```

**Behavior**: Checks `.manic/server.js` exists, then spawns `bun .manic/server.js` with `NODE_ENV=production`.

## `manic deploy`

```typescript
async function deploy(): Promise<void>;
```

**Behavior**:

1. Checks providers in config — exits if none.
2. Builds if `.manic/` doesn't exist.
3. For each provider, shows and optionally runs deploy command:
   - **Vercel**: `bunx vercel deploy`
   - **Cloudflare**: `bunx wrangler pages deploy dist --project-name <name>`
   - **Netlify**: `bunx netlify deploy --prod`
4. `--run` / `-r` flag executes the commands.
5. Generates `vercel.json` / `netlify.toml` if missing.

## `manic lint` / `manic fmt`

```bash
# lint
bun x oxlint --config .oxlintrc.json .

# fmt
bun x oxfmt -c .oxfmt.json .
```

---

# 4. Server System

## `createManicServer`

**File**: `packages/manic/src/server/index.ts` (354 lines)

```typescript
interface CreateManicServerOptions {
  html: HTMLBundle | string | (() => string); // Bun HTML import, raw string, or function
  config?: ManicConfig; // If omitted, loadConfig() is called automatically
  routes?: RouteInfo[]; // If omitted, discoverRoutes() is called automatically
  envKeys?: string[]; // Keys loaded from env files (for console display)
  startTime?: number; // performance.now() at process start (for "Ready in Xms")
}

async function createManicServer(
  options: CreateManicServerOptions
): Promise<Server>;
```

## Server Initialization Sequence

```
1. Load config + discover routes (in parallel if not provided)
2. Detect if html is HTMLBundle (has .index property) vs raw string
3. Build serveHtml() function:
   a. Adds RFC 8288 Link headers
   b. Handles Accept: text/markdown → htmlToMarkdown() response
   c. Handles ?mode=agent → JSON metadata response
4. If HTMLBundle in dev: creates nonce route /__manic_html_[uuid] for catch-all proxy
5. Register static routes for all discovered page paths → bunRoutes object
6. If fullstack mode:
   a. Load API routes via apiLoaderPlugin()
   b. Register /api/* → Hono app
   c. Register /openapi.json → auto-generated spec
   d. Register /.well-known/api-catalog
7. Add built-in RFC 8288 Link headers (OpenAPI, API catalog, MCP if plugin present)
8. Run plugin.configureServer(ctx) for each plugin
9. Start Bun.serve({ routes: bunRoutes, development: { hmr: true } }) in dev
10. Start watchRoutes() in dev (file watcher → regenerate manifest)
11. Log server info (URL, env keys, routes discovered, etc.)
12. Return Bun.serve() server instance
```

## Bun.serve Routes Object

```typescript
const bunRoutes = {
  '/': htmlHandler, // Root
  '/about': htmlHandler, // Each discovered page route
  '/blog/:slug': htmlHandler, // Dynamic routes
  '/_manic/open': editorHandler, // Dev only: open file in $EDITOR
  '/assets/*': staticHandler, // Static files from assets/
  '/api/*': honoHandler, // Hono API (fullstack mode)
  '/openapi.json': specHandler, // OpenAPI spec (fullstack mode)
  '/.well-known/*': discoveryHandler, // API catalog + plugin endpoints
  '/*': catchAllHandler, // SPA fallback → HTML shell
};
```

## Two Modes

| Mode                  | Description                        |
| --------------------- | ---------------------------------- |
| `fullstack` (default) | Hono API routes + SPA serving      |
| `frontend`            | SPA-only, no Hono API, no `/api/*` |

Set via `config.mode` or prompts in `create-manic`.

## HTML Handler Modes

```typescript
// Dev: html is an HTMLBundle (from import app from './app/index.html')
// HTMLBundle has .index property. Bun handles it natively.
// Framework creates a nonce proxy route to add custom headers.

// Prod: html is a string (read from .manic/client/index.html)
const htmlHandler = () =>
  new Response(htmlString, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      Link: linkHeaders.join(', '),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
```

## Built-in Routes

| Route                      | Description                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `/_manic/open`             | Opens file in editor (`$EDITOR` or `code`). Params: `file`, `line`, `column`. **Dev only.** |
| `/assets/*`                | Static file serving from `assets/`                                                          |
| `/api/*`                   | Hono API routes (fullstack mode)                                                            |
| `/openapi.json`            | Auto-generated OpenAPI 3.0.0 spec                                                           |
| `/.well-known/api-catalog` | RFC 9727 API catalog                                                                        |
| `/*`                       | SPA catch-all → HTML shell                                                                  |

## Cache Headers

| Context                | Header                                  |
| ---------------------- | --------------------------------------- |
| Prod: `.manic/client/` | `public, max-age=31536000, immutable`   |
| Prod: `/assets/*`      | `public, max-age=3600, must-revalidate` |
| Dev: all static        | `no-cache, no-store, must-revalidate`   |

## Content Negotiation

Every page request is checked for:

1. **`Accept: text/markdown`** → converts HTML to markdown, returns `Content-Type: text/markdown; charset=utf-8`, `Vary: Accept`, `x-markdown-tokens: <count>`.
2. **`?mode=agent`** → returns JSON:
   ```json
   {
     "name": "App Name",
     "mcp": "/.well-known/mcp/server-card.json",
     "openapi": "/openapi.json",
     "docs": "/docs",
     "agentSkills": "/.well-known/agent-skills/index.json",
     "discovery": "/.well-known/api-catalog"
   }
   ```
   with `Access-Control-Allow-Origin: *`.

## Dev Route Watching

`watchRoutes()` in `server/lib/discovery.ts`:

- Uses `fs/promises watch()` with `{ recursive: true }`.
- Filters for `.tsx`/`.ts` renames not starting with `~`.
- On change: regenerates `app/~routes.generated.ts` and touches `~manic.ts` (triggers Bun `--watch` restart).
- Debounced at 50ms.

---

# 5. Router System

## Architecture

Client-side SPA router with:

- Lazy loading via dynamic `import()` — components loaded on demand
- Component cache (`Map<string, ComponentType>`) — once loaded, never re-fetched
- Route scoring by specificity (static > dynamic > catch-all)
- `document.startViewTransition` integration
- Route preloading on hover/focus via `Link`
- `ErrorBoundary` wrapping all page components
- HMR: `import.meta.hot.accept` clears cache on reload

## Window Globals

```typescript
// Set in app/main.tsx
window.__MANIC_ROUTES__: Record<string, () => Promise<{ default: ComponentType }>>

// Set by Router component — used by navigate()
window.__MANIC_NAVIGATE__: (to: string, options?: { replace?: boolean }) => void

// Set in app/main.tsx (when ~404.tsx / ~500.tsx exist)
window.__MANIC_ERROR_PAGES__: {
  notFound?: () => Promise<{ default: ComponentType }>;
  error?: () => Promise<{ default: ComponentType }>;
}

// NOT SET by framework yet (incomplete feature)
window.__MANIC_ENV__: Record<string, string>
```

## `RouteRegistry` Class

**File**: `packages/manic/src/router/lib/matcher.ts`

```typescript
class RouteRegistry {
  register(def: RouteDef): void; // Add route. Deduplicates by path.
  match(path: string): RouteMatch | null; // Sort routes (lazy, once), then O(n) scan.
}
```

**Scoring system** (higher wins):

| Segment Type                          | Points | Example                |
| ------------------------------------- | ------ | ---------------------- |
| Static                                | 100    | `/about` → 100         |
| Dynamic (`:id` or `[id]`)             | 10     | `/blog/:slug` → 110    |
| Catch-all (`:...slug` or `[...slug]`) | 1      | `/docs/:...path` → 101 |

Ties broken by path length (longer wins).

**Pattern matching** (compiled to regex per route):

| Pattern           | Regex             | Captures              |
| ----------------- | ----------------- | --------------------- |
| `/about`          | `^/about$`        | none                  |
| `/blog/:slug`     | `^/blog/([^/]+)$` | `slug`                |
| `/blog/[slug]`    | `^/blog/([^/]+)$` | `slug` (identical)    |
| `/docs/:...path`  | `^/docs/(.+)$`    | `path` (captures `/`) |
| `/docs/[...path]` | `^/docs/(.+)$`    | `path` (identical)    |

Both `:param` and `[param]` syntax work. Files use `[param]`, internal manifest uses `:param`.

## Router Component

**File**: `packages/manic/src/router/lib/Router.tsx` (370 lines)

```typescript
function Router({
  routes?: Record<string, () => Promise<{ default: ComponentType }>>
}): React.ReactElement
```

**State**:

```typescript
const [currentPath, setCurrentPath] = useState(window.location.pathname);
const [LoadedComponent, setLoadedComponent] = useState<ComponentType | null>(
  null
);
const [routeParams, setRouteParams] = useState<Record<string, string>>({});
const [errorDetails, setErrorDetails] = useState<Error | null>(null);
```

**Navigation flow** (`loadAndTransition`):

1. Abort any in-flight navigation via `AbortController`.
2. Match path via `RouteRegistry`.
3. If no match → render `~404.tsx` or built-in `NotFound`.
4. Lazy-load component (or return from cache).
5. If View Transitions enabled and not popstate: `document.startViewTransition(() => flushSync(updateState))`.
6. `pushState` / `replaceState`, update state, scroll to top.
7. On popstate (back/forward): restore scroll from `history.state.scrollY`.

**Error Boundary**: Wraps all page components. Catches render errors → sets `errorDetails` → renders `~500.tsx` or built-in `ServerError`.

**HMR**: `import.meta.hot?.accept(() => { componentCache.clear(); })` — cache cleared on every hot reload.

## `Link` Component

**File**: `packages/manic/src/router/lib/Link.tsx` (63 lines)

```typescript
interface LinkProps {
  href: string; // ⚠️ `href`, NOT `to` (changed from older versions)
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  viewTransitionName?: string;
  prefetch?: boolean; // default: true
  replace?: boolean; // default: false
}
```

- Renders `<a>` with `href`.
- On click: prevents default, calls `navigate(href)`.
- On `mouseenter`/`focus`: calls `preloadRoute(href)` if `prefetch` is true.
- `viewTransitionName` applied as `style.viewTransitionName`.

## `navigate()` Function

```typescript
async function navigate(
  to: string,
  options?: { replace?: boolean }
): Promise<void>;
```

- Works outside React (event handlers, setTimeout, etc.).
- Reads routes from `window.__MANIC_ROUTES__`.
- Calls `window.__MANIC_NAVIGATE__(to, options)` (set by Router component).
- If Router not mounted: `history.pushState` only (no component load).

## `useRouter()` Hook

```typescript
function useRouter(): RouterContextValue;

interface RouterContextValue {
  path: string; // Current pathname
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>; // Dynamic route params
}
```

Throws if used outside `<Router>`.

## `useQueryParams()` Hook

```typescript
function useQueryParams(): [
  URLSearchParams,
  (params: Record<string, string>) => void,
];
```

Returns `[currentParams, setParams]`. Updates URL via `history.pushState` without navigation.

## `preloadRoute()` Function

```typescript
function preloadRoute(path: string): void;
```

Fire-and-forget. Loads component into cache. No-op if already cached.

## `setViewTransitions()` Function

```typescript
function setViewTransitions(enabled: boolean): void;
```

Global toggle. Default: `true`. Affects all subsequent `navigate()` calls.

---

# 6. Configuration System

## `ManicConfig` Interface (Complete)

```typescript
interface ManicConfig {
  /** "fullstack" = Hono API + SPA | "frontend" = SPA only. @default "fullstack" */
  mode?: 'fullstack' | 'frontend';

  app?: {
    /** Shown in logs, OpenAPI spec title. @default "Manic App" */
    name?: string;
  };

  server?: {
    /** Port for dev and prod. Override with $PORT env var. @default 6070 */
    port?: number;
    /** Enable HMR websocket in dev. @default true */
    hmr?: boolean;
  };

  router?: {
    /** Use View Transitions API on navigate(). @default true */
    viewTransitions?: boolean;
    /** @default false — DECLARED BUT NOT IMPLEMENTED */
    preserveScroll?: boolean;
    /** @default "auto" — DECLARED BUT NOT IMPLEMENTED */
    scrollBehavior?: 'auto' | 'smooth';
  };

  build?: {
    /** Minify with oxc-minify. @default true */
    minify?: boolean;
    /** @default "inline" — DECLARED BUT BUILD IGNORES THIS */
    sourcemap?: boolean | 'inline' | 'external';
    /** @default true — DECLARED BUT BUILD IGNORES THIS */
    splitting?: boolean;
    /** Build output directory. @default ".manic" */
    outdir?: string;
  };

  oxc?: {
    /** ES target for OXC transform. @default "esnext" (dev), "es2022" (prod) */
    target?: string;
    /** Rewrite .ts/.tsx import extensions. @default true */
    rewriteImportExtensions?: boolean;
    /** React Fast Refresh in dev. @default true */
    refresh?: boolean;
  };

  /** Sitemap generation config or false to disable. */
  sitemap?: SitemapConfig | false;

  /** Deployment adapters from @manicjs/providers. */
  providers?: ManicProvider[];

  /** Plugin extensions. */
  plugins?: ManicPlugin[];
}
```

## Default Values

```typescript
const DEFAULT_CONFIG = {
  mode: 'fullstack',
  app: { name: 'Manic App' },
  server: { port: 6070, hmr: true },
  router: {
    viewTransitions: true,
    preserveScroll: false,
    scrollBehavior: 'auto',
  },
  build: {
    minify: true,
    sourcemap: 'inline',
    splitting: true,
    outdir: '.manic',
  },
  oxc: { target: 'esnext', rewriteImportExtensions: true, refresh: true },
};
```

## Config Functions

### `defineConfig(config)`

```typescript
function defineConfig(config: ManicConfig): ManicConfig;
```

Identity function — returns input unchanged. Exists for TypeScript autocomplete in `manic.config.ts`.

### `loadConfig(cwd?)`

```typescript
async function loadConfig(cwd?: string): Promise<ManicConfig>;
```

1. Returns cached singleton if already loaded (no `clearConfigCache()` available).
2. Tries `manic.config.ts`, then `manic.config.js` via dynamic `import()`.
3. Accepts `export default` and named exports.
4. Deep merges with `DEFAULT_CONFIG` (one level — spread per section, not recursive).
5. `providers` array is replaced, not merged.

### `getConfig()`

```typescript
function getConfig(): ManicConfig;
```

Synchronous. Returns cached config or defaults. Must call `loadConfig()` first for user config. Used internally by OXC plugin during build.

## `SitemapConfig` Interface

```typescript
interface SitemapConfig {
  hostname: string; // Required: base URL
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number; // 0.0 to 1.0. @default 0.8
  exclude?: string[]; // Route paths to exclude
}
```

---

# 7. Theme System

**File**: `packages/manic/src/theme/index.ts`

## Types

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme; // Stored user preference
  resolvedTheme: 'light' | 'dark'; // Actual applied theme (never 'system')
  setTheme: (theme: Theme) => void;
  toggle: () => void; // Cycles through light/dark
  isDark: boolean;
  isLight: boolean;
}
```

## `ThemeProvider` Component

```tsx
<ThemeProvider>{children}</ThemeProvider>
```

- Reads initial theme from `localStorage('manic-theme')`. Defaults to `'system'`.
- Applies `dark` class on `document.documentElement`.
- Subscribes to `window.matchMedia('(prefers-color-scheme: dark)')` for OS preference changes.

## `useTheme()` Hook

```typescript
const { theme, resolvedTheme, setTheme, toggle, isDark, isLight } = useTheme();
```

Throws if used outside `<ThemeProvider>`.

## `ThemeToggle` Component

```tsx
<ThemeToggle className="..." style={{...}} />
```

Pre-built button. Supports render-prop children for custom icons.

## `initTheme()` Function

Side-effect: runs on module load. Reads `localStorage` and applies `dark` class before React renders (prevents flash).

> **Warning**: `initTheme()` accesses `window` and `localStorage` as a module side effect. This will throw in SSR / Node.js / test environments even though there are `typeof window` guards — some `localStorage` accesses may not be guarded in all code paths. Import with care in non-browser environments.

## Required CSS

```css
:root {
  --theme-background: #fef6f7;
  --theme-foreground: #151212;
}

.dark {
  --theme-background: #151212;
  --theme-foreground: #fef6f7;
}

body {
  background-color: var(--theme-background);
  color: var(--theme-foreground);
}
```

Tailwind v4 theme mapping:

```css
@theme {
  --color-accent: #f15156;
  --color-background: var(--theme-background);
  --color-foreground: var(--theme-foreground);
}
```

---

# 8. View Transitions

**File**: `packages/manic/src/transitions/index.ts`

## `ViewTransitions` Object

Pre-built element wrappers that apply `view-transition-name` via inline style.

**Available tags**: `div`, `span`, `main`, `section`, `article`, `header`, `footer`, `nav`, `aside`, `h1`, `h2`, `h3`, `p`, `img`, `button`, `a`, `ul`, `li`

```tsx
interface ViewTransitionProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'style'
> {
  name: string; // Required — maps to viewTransitionName CSS property
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

## Usage Options

**Option 1: `ViewTransitions` component** (framework-provided wrapper):

```tsx
import { ViewTransitions } from 'manicjs/transitions';

<ViewTransitions.div name="hero">
  <ViewTransitions.h1 name="hero-title">Welcome</ViewTransitions.h1>
</ViewTransitions.div>;
```

**Option 2: Inline style** (preferred for performance — avoids extra component):

```tsx
const LOGO_STYLE = { viewTransitionName: 'logo' } as const;
<img src="/logo.svg" style={LOGO_STYLE} />;
```

**Option 3: CSS class**:

```css
.hero {
  view-transition-name: hero;
}
```

## Navigation Integration

When `navigate()` is called:

1. `viewTransitionsEnabled` is checked (global flag from `setViewTransitions()`).
2. `document.startViewTransition` availability checked (browser support).
3. Not a popstate (back/forward) event.
4. If all pass: `document.startViewTransition(() => flushSync(updateRouterState))`.
5. Otherwise: direct `updateRouterState()`.

## Recommended CSS

```css
@view-transition {
  navigation: auto;
}

/* Root crossfade — subtle */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
  mix-blend-mode: normal;
}

/* Named element transitions */
::view-transition-group(*) {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable root fade to prevent double-animation with named elements */
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
  opacity: 1;
}
```

---

# 9. Environment System

## Server-Side (`manicjs/env`)

```typescript
import { getEnv, getPublicEnv } from 'manicjs/env';

getEnv('MY_KEY'); // → string | undefined (server: any key)
getPublicEnv(); // → Record<string, string> (only MANIC_PUBLIC_* keys)
```

**Bun auto-loads** `.env` and `.env.local` at startup. No framework code needed for basic server-side access — just `process.env.MY_KEY`.

**Env file load order** (lowest to highest precedence):

1. `.env` (shared defaults)
2. `.env.local` (local overrides, gitignored)
3. `process.env` (system environment — highest)

## Client-Side

**Public prefix**: `MANIC_PUBLIC_` — only these vars are safe for client exposure.

```typescript
// Server-side or client-side:
import { getEnv, getPublicEnv } from 'manicjs/env';

getEnv('MANIC_PUBLIC_STRIPE_KEY'); // OK anywhere
getEnv('SECRET_KEY'); // Client: logs warning, returns undefined
```

**⚠️ Known Gap**: The client env system reads from `window.__MANIC_ENV__`, but **nothing in the framework currently injects this value into the HTML**. The system is half-implemented. To use client-side env vars:

- Option 1: Manually inject `<script>window.__MANIC_ENV__ = {...};</script>` in `app/index.html`.
- Option 2: Create a plugin that emits a JS file with env vars and loads it from HTML.

---

# 10. Plugin System

## `ManicPlugin` Interface

```typescript
interface ManicPlugin {
  name: string;
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}
```

## Context Types

### `ManicServerPluginContext`

```typescript
interface ManicServerPluginContext extends ManicPluginContext {
  addRoute(
    path: string,
    handler: (req: Request) => Response | Promise<Response>
  ): void;
  addLinkHeader(value: string): void;
}
```

**`addRoute`**: Registers in `Bun.serve({ routes })`. Handler receives raw `Request`, must return raw `Response`. **NOT a Hono handler**:

```typescript
// ✅ Correct
ctx.addRoute('/my-endpoint', req => new Response('hello'));

// ❌ Wrong — this is Hono syntax, not plugin addRoute syntax
ctx.addRoute('/my-endpoint', c => c.json({ hello: true }));
```

**`addLinkHeader`**: Value is a full RFC 8288 Link header string. Appended to all HTML page responses.

### `ManicBuildPluginContext`

```typescript
interface ManicBuildPluginContext extends ManicPluginContext {
  emitClientFile(
    relativePath: string,
    content: string | Uint8Array
  ): Promise<void>;
}
```

**`emitClientFile`**: Writes to `.manic/client/[relativePath]`. Path is relative — no leading `/`, no `.manic/client/` prefix.

### `ManicPluginContext` (Base)

```typescript
interface ManicPluginContext {
  config: ManicConfig;
  pageRoutes: PageRoute[]; // { path, filePath, dynamic }[]
  apiRoutes: ApiRoute[]; // { mountPath, filePath }[]
  prod: boolean;
  cwd: string;
  dist: string; // ".manic"
}
```

## Plugin Lifecycle

| Phase         | Hook                   | When                                   |
| ------------- | ---------------------- | -------------------------------------- |
| `manic dev`   | `configureServer(ctx)` | Before `Bun.serve()` starts            |
| `manic build` | `build(ctx)`           | After client bundle, before API bundle |

Plugins run in order from `config.plugins` array.

## Golden Rules

1. **Implement both hooks** if you register a route in `configureServer`. Dev-only routes vanish in production. `build` must emit the same content via `emitClientFile`.
2. **No provider-specific code** in plugins — they're provider-agnostic.
3. **Use `addLinkHeader`** for any discovery endpoint so agents can find it.
4. **Name must be unique** — convention: `@manicjs/name` for first-party plugins.

## Plugin Template

```typescript
import type { ManicPlugin } from 'manicjs/config';

export function myPlugin(options: { greeting?: string } = {}): ManicPlugin {
  const { greeting = 'Hello' } = options;
  const content = `export default "${greeting}"`;

  return {
    name: 'my-plugin',

    configureServer(ctx) {
      // Raw Request → Response handler (NOT Hono)
      ctx.addRoute(
        '/my-data.js',
        req =>
          new Response(content, {
            headers: { 'content-type': 'application/javascript' },
          })
      );
      ctx.addLinkHeader('</my-data.js>; rel="preload"; as="script"');
    },

    async build(ctx) {
      // Relative to .manic/client/ — no leading slash
      await ctx.emitClientFile('my-data.js', content);
    },
  };
}
```

## First-Party Plugins

### `@manicjs/sitemap` (v0.6.0)

```typescript
import { sitemap } from '@manicjs/sitemap';

sitemap({
  hostname: 'https://myapp.com', // required
  changefreq: 'weekly', // default
  priority: 0.8, // default
  exclude: ['/admin'], // paths to skip
});
```

- **configureServer**: Generates XML from `ctx.pageRoutes`, registers `/sitemap.xml`.
- **build**: Emits `sitemap.xml` via `emitClientFile`.
- Excludes dynamic routes (containing `:`) and explicitly excluded paths.

### `@manicjs/seo` (v0.5.0)

```typescript
import { seo } from '@manicjs/seo';

seo({
  hostname: 'https://myapp.com', // required
  rules: [
    // Robot rules
    { userAgent: '*', allow: ['/'], disallow: ['/admin'] },
    { userAgent: 'Googlebot', allow: ['/'], crawlDelay: 10 },
  ],
  sitemaps: [], // Additional sitemap URLs
  autoSitemap: true, // Auto-add /sitemap.xml to robots.txt
  linkHeaders: [
    // Extra RFC 8288 Link headers
    { href: 'https://myapp.com/sitemap.xml', rel: 'sitemap' },
  ],
  contentSignals: {
    // Content-Signal directives
    'ai-train': 'no',
    search: 'yes',
    'ai-input': 'yes',
  },
});
```

- **configureServer**: Registers `/robots.txt`, adds Link headers.
- **build**: Emits `robots.txt` via `emitClientFile`.

### `@manicjs/api-docs` (v0.6.0)

```typescript
import { apiDocs } from '@manicjs/api-docs';

apiDocs({
  path: '/docs', // default
  specUrl: '/openapi.json', // default
  theme: 'default', // Scalar theme
});
```

- **configureServer only** — no `build` hook.
- Mounts Scalar UI via `@scalar/hono-api-reference` at `path`.
- Production: providers inline the Scalar CDN script directly.

### `@manicjs/mcp` (v0.5.0)

```typescript
import { mcp, defineTool } from '@manicjs/mcp';
import { z } from 'zod';

const searchTool = defineTool('search_docs', {
  description: 'Search the documentation',
  input: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().optional(),
  }),
  execute: async ({ query, limit = 10 }) => {
    return { results: [], total: 0 };
  },
});

mcp({
  name: 'manic-mcp', // default
  version: '1.0.0', // default
  path: '/mcp', // default endpoint
  tools: [searchTool], // additional custom tools
});
```

**Routes registered by `configureServer`**:

| Route                                  | Description                                 |
| -------------------------------------- | ------------------------------------------- |
| `/mcp`                                 | Main MCP endpoint (GET/POST/DELETE/OPTIONS) |
| `/.well-known/mcp.json`                | MCP discovery                               |
| `/.well-known/mcp/server-card.json`    | MCP server card                             |
| `/.well-known/agent-skills/index.json` | Agent skills index                          |
| `/webmcp.js`                           | Browser WebMCP registration script          |
| `/mcp/console`                         | Console log receiver (dev only)             |
| `/mcp/console.js`                      | Console capture script (dev only)           |

**JSON-RPC methods supported**:

| Method                      | Behavior                                            |
| --------------------------- | --------------------------------------------------- |
| `initialize`                | Returns capabilities, sends `Mcp-Session-Id` header |
| `notifications/initialized` | Marks session initialized (no response)             |
| `tools/list`                | Returns all tools (default + custom)                |
| `tools/call`                | Executes named tool with validated args             |

**Default built-in tools**: `get_routes`, `get_api_routes`, `get_page_meta`, `get_rendered_elements`, `get_console_logs` (dev only).

**`defineTool` function**:

```typescript
function defineTool<S extends ZodObject<ZodRawShape>>(
  name: string,
  def: {
    description: string;
    input: S;
    execute(args: ZodInfer<S>): Promise<unknown> | unknown;
  }
): McpTool;
```

Converts Zod schema to JSON Schema manually (no external `zod-to-json-schema` dep). Handles: `z.string()`, `z.number()`, `z.boolean()`, `z.array()`, and `.describe()` annotations. Validates input with `schema.parse()` before calling `execute`.

---

# 11. Build System

## OXC Plugin

**File**: `packages/manic/src/cli/plugins/oxc.ts` (56 lines)

```typescript
function oxcPlugin(isDev: boolean = false): BunPlugin;
```

A `BunPlugin` that intercepts `.tsx`, `.ts`, `.jsx` files (excluding `node_modules`).

**Transform matrix**:

| Setting                              | Dev                                                    | Prod          |
| ------------------------------------ | ------------------------------------------------------ | ------------- |
| `target`                             | `config.oxc.target` (default: `'esnext'`)              | `'es2022'`    |
| `sourcemap`                          | `true`                                                 | `false`       |
| `jsx.runtime`                        | `'automatic'`                                          | `'automatic'` |
| `jsx.development`                    | `true`                                                 | `false`       |
| `jsx.refresh`                        | `config.oxc.refresh` (default: `true`)                 | `false`       |
| `typescript.rewriteImportExtensions` | `config.oxc.rewriteImportExtensions` (default: `true`) | same          |
| `typescript.onlyRemoveTypeImports`   | `true`                                                 | `true`        |

**HMR injection** (dev only, jsx/tsx files):

```js
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.__react_refresh_library__?.performRefresh?.();
  });
}
```

## Module Resolution

```typescript
import { ResolverFactory } from 'oxc-resolver';

const resolver = new ResolverFactory({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
});

// Resolves ./app/main → ./app/main.tsx
const mainEntry = resolver.sync(process.cwd(), './app/main');
const serverEntry = resolver.sync(process.cwd(), './~manic');
```

## Bun HTML Import Internals

```typescript
// In ~manic.ts (source):
import app from './app/index.html';
```

This is Bun-specific syntax. Returns an `HTMLBundle` object (has `.index` property). Bun automatically:

- Compiles `<script type="module" src="./main.tsx">` → transpiled JS
- Compiles `<link href="tailwindcss">` → Tailwind CSS
- Injects HMR websocket client
- Handles all module resolution for imports within `main.tsx`

**Build transform replaces this import**:

```typescript
// Before (source ~manic.ts):
import app from './app/index.html';
await createManicServer({ html: app });

// After (build transforms ~manic.ts before bundling):
const html = await Bun.file('.manic/client/index.html').text();
await createManicServer({ html });
```

---

# 12. Deployment Providers

## `ManicProvider` Interface

```typescript
interface ManicProvider {
  name: string;
  build(context: BuildContext): Promise<void>;
}

interface BuildContext {
  dist: string; // ".manic"
  config: ManicConfig;
  apiEntries: string[]; // Original API source paths e.g. ["app/api/hello/index.ts"]
  clientDir: string; // ".manic/client"
  serverFile: string; // ".manic/server.js"
}
```

## Vercel Provider (v0.8.0)

```typescript
import { vercel } from '@manicjs/providers/vercel';

vercel({
  runtime?: 'bun' | 'edge' | 'nodejs20.x' | 'nodejs22.x',  // default: 'bun'
  regions?: string[];
  memory?: number;
  maxDuration?: number;
})
```

**Output**: `.vercel/output/` (Vercel Build Output API v3)

```
.vercel/output/
├── config.json
├── static/                # from .manic/client/
└── functions/
    └── api.func/
        ├── .vc-config.json
        ├── index.mjs      # Bundled Hono server (all deps inlined)
        └── package.json   # { "type": "module" }
```

**`config.json`** routing:

```json
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/api/(.*)", "dest": "api" },
    { "src": "/docs(.*)", "dest": "api" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

> Vercel provider bundles the API function with all deps inlined (`external: []`) to avoid Vercel's ReadOnlyFileSystem restriction.

## Cloudflare Provider (v0.8.0)

```typescript
import { cloudflare } from '@manicjs/providers/cloudflare';

cloudflare({
  compatibilityDate?: string,  // default: "2025-06-01"
  projectName?: string,
})
```

**Output**: `dist/` + `wrangler.toml`

```
dist/                      # from .manic/client/
  _worker.js               # Hono worker (API + static via c.env.ASSETS)
  _redirects               # SPA routing fallback (when no API routes)
wrangler.toml
```

## Netlify Provider (v0.8.0)

```typescript
import { netlify } from '@manicjs/providers/netlify';

netlify({
  edge?: boolean,   // default: false (serverless functions)
})
```

**Output**: `dist/` (static) + `netlify/functions/` (serverless)

**`netlify.toml`** (generated):

```toml
[build]
  command = "bun run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> **Known bug**: Netlify provider contains legacy Elysia syntax (`g.use()` pattern) in generated function code. Framework migrated from Elysia → Hono but Netlify template wasn't fully updated. Prefer Vercel or Cloudflare.

## `agentMiddleware` (Internal, v0.8.0)

**File**: `packages/providers/src/middleware.ts` (173 lines)

```typescript
function agentMiddleware(ctx: BuildContext): string;
```

Returns JavaScript code string injected into all provider workers. Contains:

- `htmlToMarkdown()` — lightweight HTML → markdown converter
- `withAgentSupport(req, fetchAsset)` — handles `?mode=agent`, `Accept: text/markdown`, and adds Link headers
- `_handleMcp()` — hardcoded simplified MCP server (default tools only, no custom tools)
- `_mcpTools` — array of hardcoded default tool implementations

> **Important**: The MCP server in provider middleware is a separate, simplified copy of `@manicjs/mcp`. Custom tools added to the plugin do NOT appear in provider deployments. Only default tools work.

## Provider Shared Behavior

All providers:

1. Copy `.manic/client/` to their static output directory.
2. Copy favicon to root.
3. Generate a Hono-based worker/function that imports bundled API routes.
4. Inline OpenAPI spec generation.
5. Inject `agentMiddleware` code.

---

# 13. Scaffolding (create-manic)

## Usage

```bash
bun create manic my-app
# or
bunx create-manic my-app
```

## Interactive Prompts

| Prompt                   | Type   | Default              |
| ------------------------ | ------ | -------------------- |
| Project name             | text   | `my-manic-app`       |
| App name                 | text   | project name         |
| Project mode             | choice | `fullstack`          |
| Port                     | text   | `6070`               |
| Include API docs?        | yes/no | yes (fullstack only) |
| Enable View Transitions? | yes/no | yes                  |

## Generated Project Structure

```
my-app/
├── ~manic.ts               # Server entry
├── manic.config.ts         # Generated from prompts
├── bunfig.toml             # Bun Tailwind plugin
├── tsconfig.json           # ESNext + @/* alias + strict
├── .oxlintrc.json          # OXC lint rules
├── .oxfmt.json             # OXC formatter config
├── .gitignore              # Ignores node_modules, .manic, .env, dist
├── AGENTS.md               # AI agent instructions (important for AI agents)
├── app/
│   ├── index.html          # HTML shell
│   ├── main.tsx            # React entry + ThemeProvider + Router
│   ├── global.css          # Tailwind v4 + theme vars + transitions + utilities
│   ├── manic.d.ts          # Window.__MANIC_ROUTES__ types
│   ├── ~routes.generated.ts
│   ├── routes/
│   │   ├── index.tsx       # Counter demo
│   │   └── build.tsx       # Build info page
│   └── api/
│       └── hello/
│           └── index.ts    # Hello world API (fullstack only)
└── assets/
    ├── favicon.svg
    ├── icon.svg
    ├── not-found.svg
    ├── wordmark.svg
    └── wordmark-dark.svg
```

## Default Template Dependencies

```json
{
  "dependencies": {
    "@manicjs/api-docs": "latest",
    "@manicjs/mcp": "latest",
    "bun-plugin-tailwind": "^0.1.2",
    "hono": "^4.12.14",
    "manicjs": "latest",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "tailwindcss": "^4.2.2"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "oxfmt": "latest",
    "oxlint": "latest"
  }
}
```

## Canonical `app/main.tsx`

```tsx
import { createRoot } from 'react-dom/client';
import { Router } from 'manicjs/router';
import { ThemeProvider } from 'manicjs/theme';
import { routes, notFoundPage, errorPage } from './~routes.generated';
import './global.css';

window.__MANIC_ROUTES__ = routes;
window.__MANIC_ERROR_PAGES__ = {};
if (notFoundPage) window.__MANIC_ERROR_PAGES__.notFound = notFoundPage;
if (errorPage) window.__MANIC_ERROR_PAGES__.error = errorPage;

const root = createRoot(document.getElementById('root')!);
root.render(
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);
```

## Canonical `app/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manic App</title>
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="stylesheet" href="tailwindcss" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
    <script src="/webmcp.js"></script>
  </body>
</html>
```

> `href="tailwindcss"` and `src="./main.tsx"` are magic strings Bun and the build pipeline replace. Do not change them.

---

# 14. File Conventions

## Special Prefixes

| Prefix       | Meaning                                      | Examples                                                    |
| ------------ | -------------------------------------------- | ----------------------------------------------------------- |
| `~`          | Internal / generated / excluded from routing | `~manic.ts`, `~routes.generated.ts`, `~404.tsx`, `~500.tsx` |
| `[param]`    | Dynamic route parameter (bracket syntax)     | `[id].tsx`, `[slug].tsx`                                    |
| `[...param]` | Catch-all route (bracket syntax)             | `[...path].tsx`                                             |
| `(group)`    | Route group — stripped from URL              | `(admin)/dashboard.tsx`                                     |

## Directory Structure

| Path                       | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `~manic.ts`                | Server entry (required)                    |
| `manic.config.ts`          | Framework config                           |
| `app/`                     | Application code root                      |
| `app/main.tsx`             | Client entry point                         |
| `app/index.html`           | HTML shell                                 |
| `app/global.css`           | Global CSS + Tailwind import               |
| `app/manic.d.ts`           | Window global type declarations            |
| `app/~routes.generated.ts` | Auto-generated route manifest (never edit) |
| `app/routes/`              | Page components                            |
| `app/routes/~404.tsx`      | Custom 404 page                            |
| `app/routes/~500.tsx`      | Custom error page                          |
| `app/api/`                 | Hono API routes                            |
| `assets/`                  | Static files served at `/assets/*`         |
| `.manic/`                  | Build output (gitignore this)              |

## Page Route File Mapping

| File Path                          | URL              | Type            |
| ---------------------------------- | ---------------- | --------------- |
| `app/routes/index.tsx`             | `/`              | Static          |
| `app/routes/about.tsx`             | `/about`         | Static          |
| `app/routes/blog/index.tsx`        | `/blog`          | Static          |
| `app/routes/blog/[slug].tsx`       | `/blog/:slug`    | Dynamic         |
| `app/routes/blog/[...path].tsx`    | `/blog/:...path` | Catch-all       |
| `app/routes/(admin)/dashboard.tsx` | `/dashboard`     | Route group     |
| `app/routes/~layout.tsx`           | _excluded_       | Tilde prefix    |
| `app/routes/~404.tsx`              | _custom 404_     | Auto-discovered |
| `app/routes/~500.tsx`              | _custom 500_     | Auto-discovered |

## API Route File Mapping

| File Path                | API Endpoint     |
| ------------------------ | ---------------- |
| `app/api/hello/index.ts` | `/api/hello`     |
| `app/api/users/index.ts` | `/api/users`     |
| `app/api/users/[id].ts`  | `/api/users/:id` |
| `app/api/posts/index.ts` | `/api/posts`     |

## Favicon Discovery Priority

1. `assets/favicon.svg`
2. `assets/favicon.png`
3. `assets/favicon.ico`
4. `assets/icon.svg`
5. `assets/icon.png`
6. `assets/icon.ico`

## Config Files

| File             | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `bunfig.toml`    | Enables `bun-plugin-tailwind` for static serving            |
| `tsconfig.json`  | ESNext + `@/*` alias → `app/*`                              |
| `.oxlintrc.json` | OXC lint config (react, react-hooks, react-perf plugins)    |
| `.oxfmt.json`    | OXC formatter config (singleQuote, trailing commas, 80 col) |
| `AGENTS.md`      | AI agent instructions — important for agentic workflows     |

---

# 15. Complete Type Reference

## Router Types

```typescript
interface RouteDef {
  path: string; // URL pattern: "/", "/blog/:slug"
  component: ComponentType | null;
  loader?: () => Promise<{ default: ComponentType }>; // Lazy loader
}

interface RouteMatch {
  path: string;
  component: RouteDef['component'];
  params: Record<string, string>;
}

interface RouterContextValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
}

type LazyLoader = () => Promise<{ default: ComponentType }>;
```

## Link Props

```typescript
interface LinkProps {
  href: string; // ⚠️ href (not 'to')
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  viewTransitionName?: string;
  prefetch?: boolean; // default: true
  replace?: boolean; // default: false
}
```

## Config Types

```typescript
interface ManicConfig {
  /* see Section 6 */
}

interface ManicPlugin {
  name: string;
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}

interface ManicPluginContext {
  config: ManicConfig;
  pageRoutes: PageRoute[];
  apiRoutes: ApiRoute[];
  prod: boolean;
  cwd: string;
  dist: string;
}

interface ManicServerPluginContext extends ManicPluginContext {
  addRoute(
    path: string,
    handler: (req: Request) => Response | Promise<Response>
  ): void;
  addLinkHeader(value: string): void;
}

interface ManicBuildPluginContext extends ManicPluginContext {
  emitClientFile(
    relativePath: string,
    content: string | Uint8Array
  ): Promise<void>;
}

interface PageRoute {
  path: string; // "/blog/:slug"
  filePath: string; // "app/routes/blog/[slug].tsx"
  dynamic: boolean; // true if path contains ":"
}

interface ApiRoute {
  mountPath: string; // "/api/hello"
  filePath: string; // "app/api/hello/index.ts"
}
```

## Provider Types

```typescript
interface ManicProvider {
  name: string;
  build(context: BuildContext): Promise<void>;
}

interface BuildContext {
  dist: string;
  config: ManicConfig;
  apiEntries: string[];
  clientDir: string;
  serverFile: string;
}

interface VercelOptions {
  runtime?: 'bun' | 'edge' | 'nodejs20.x' | 'nodejs22.x';
  regions?: string[];
  memory?: number;
  maxDuration?: number;
}

interface CloudflareOptions {
  compatibilityDate?: string;
  projectName?: string;
}

interface NetlifyOptions {
  edge?: boolean;
}
```

## Theme Types

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  isDark: boolean;
  isLight: boolean;
}
```

## View Transition Types

```typescript
interface ViewTransitionProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'style'
> {
  name: string; // Required
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

## SEO Plugin Types

```typescript
interface RobotRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

interface LinkHeader {
  href: string;
  rel: string;
  type?: string;
}
```

## MCP Plugin Types

```typescript
interface McpConfig {
  name?: string;
  version?: string;
  path?: string;
  tools?: McpTool[];
}

type ToolDef<S extends ZodObject<ZodRawShape>> = {
  description: string;
  input: S;
  execute(args: ZodInfer<S>): Promise<unknown> | unknown;
};
```

## Server Internals

```typescript
interface RouteInfo {
  path: string;
  filePath: string;
}

interface ErrorPages {
  notFound?: string; // File path to ~404.tsx
  error?: string; // File path to ~500.tsx
}
```

---

# 16. API Reference Tables

## `manicjs` (Root Barrel)

| Symbol            | Type           | Import    | Description                      |
| ----------------- | -------------- | --------- | -------------------------------- |
| `Router`          | Component      | `manicjs` | Client-side router               |
| `Link`            | Component      | `manicjs` | Navigation link (href, not to)   |
| `navigate`        | Function       | `manicjs` | Programmatic navigation          |
| `useRouter`       | Hook           | `manicjs` | Access path, navigate, params    |
| `useQueryParams`  | Hook           | `manicjs` | Read/write URL query params      |
| `NotFound`        | Component      | `manicjs` | Built-in 404 page                |
| `ServerError`     | Component      | `manicjs` | Built-in error overlay           |
| `defineConfig`    | Function       | `manicjs` | Type-safe config helper          |
| `loadConfig`      | Async Function | `manicjs` | Load manic.config.ts             |
| `ThemeProvider`   | Component      | `manicjs` | Theme context provider           |
| `useTheme`        | Hook           | `manicjs` | Access/mutate theme              |
| `ThemeToggle`     | Component      | `manicjs` | Pre-built toggle button          |
| `ViewTransitions` | Object         | `manicjs` | Element wrappers for transitions |
| `createClient`    | Function       | `manicjs` | Hono RPC client factory          |

## `manicjs/router`

| Symbol               | Type                         | Description           |
| -------------------- | ---------------------------- | --------------------- |
| `Router`             | Component                    | Router component      |
| `Link`               | Component                    | Navigation link       |
| `navigate`           | Function                     | Programmatic navigate |
| `useRouter`          | Hook                         | Router context        |
| `useQueryParams`     | Hook                         | Query params r/w      |
| `setViewTransitions` | `(enabled: boolean) => void` | Toggle globally       |
| `preloadRoute`       | `(path: string) => void`     | Pre-cache component   |
| `RouterContext`      | `React.Context`              | Router context object |

## `manicjs/server`

| Symbol              | Signature                                             | Description  |
| ------------------- | ----------------------------------------------------- | ------------ |
| `createManicServer` | `(opts: CreateManicServerOptions) => Promise<Server>` | Start server |

## `manicjs/config`

| Symbol           | Type              | Description                                              |
| ---------------- | ----------------- | -------------------------------------------------------- |
| `defineConfig`   | Identity function | TS autocomplete helper                                   |
| `loadConfig`     | Async function    | Load and cache config                                    |
| `getConfig`      | Sync function     | Return cached config                                     |
| All type exports | Types             | `ManicConfig`, `ManicPlugin`, all context/provider types |

## `manicjs/plugins`

| Symbol               | Signature                                                                            | Description                               |
| -------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| `apiLoaderPlugin`    | `(apiDir?: string) => Promise<{ app: Hono, routes: string[], openApiSpec: object }>` | Load and mount API routes                 |
| `fileImporterPlugin` | `(publicDir?: string) => Hono`                                                       | Static file serving (unused by framework) |

## `manicjs/theme`

| Symbol          | Type         | Description                      |
| --------------- | ------------ | -------------------------------- |
| `ThemeProvider` | Component    | Context provider                 |
| `useTheme`      | Hook         | Theme context                    |
| `ThemeToggle`   | Component    | Toggle button                    |
| `initTheme`     | `() => void` | Init theme (side-effect on load) |

## `manicjs/transitions`

| Symbol            | Type   | Description                                |
| ----------------- | ------ | ------------------------------------------ |
| `ViewTransitions` | Object | `{ div, h1, img, ... }` — element wrappers |

## `manicjs/env`

| Symbol         | Signature                              | Description                  |
| -------------- | -------------------------------------- | ---------------------------- |
| `getEnv`       | `(key: string) => string \| undefined` | Get env var                  |
| `getPublicEnv` | `() => Record<string, string>`         | Get all MANIC*PUBLIC*\* vars |

## `manicjs/client`

| Symbol         | Signature                                           | Description           |
| -------------- | --------------------------------------------------- | --------------------- |
| `createClient` | `<T>(baseUrl?: string) => ReturnType<typeof hc<T>>` | Typed Hono RPC client |

## `@manicjs/providers`

| Symbol       | Import               | Description        |
| ------------ | -------------------- | ------------------ |
| `vercel`     | `@manicjs/providers` | Vercel adapter     |
| `cloudflare` | `@manicjs/providers` | Cloudflare adapter |
| `netlify`    | `@manicjs/providers` | Netlify adapter    |

---

# 17. Internal Implementation Details

## Component Cache

Module-level `Map` — never garbage-collected, cached by route pattern:

```typescript
const componentCache = new Map<string, ComponentType>();
// Key: route path pattern ("/blog/:slug"), not actual URL ("/blog/hello-world")
```

## Route Discovery Algorithm

```typescript
// server/lib/discovery.ts
async function discoverRoutes(routesDir = 'app/routes'): Promise<RouteInfo[]> {
  const glob = new Bun.Glob('**/*.{tsx,ts}');

  for await (const file of glob.scan({ cwd: routesDir })) {
    if (file.startsWith('~')) continue; // Skip ~404.tsx, ~layout.tsx, etc.

    let urlPath = file
      .replace(/\.(tsx|ts)$/, '') // Remove extension
      .replace(/\/index$/, '') // /blog/index → /blog
      .replace(/^index$/, ''); // index → (root)

    urlPath = urlPath
      .replace(/\(.*?\)\//g, '') // Strip route groups: (admin)/
      .replace(/\[\.\.\.([^\]]+)\]/g, ':...$1') // [...slug] → :...slug
      .replace(/\[([^\]]+)\]/g, ':$1'); // [slug] → :slug

    urlPath = urlPath === '' ? '/' : `/${urlPath}`;

    routes.push({ path: urlPath, filePath: `${routesDir}/${file}` });
  }
}
```

## Routes Manifest Format

```typescript
// app/~routes.generated.ts (auto-generated)
export const routes = {
  '/': () => import('./routes/index.tsx'),
  '/about': () => import('./routes/about.tsx'),
  '/blog/:slug': () => import('./routes/blog/[slug].tsx'),
};

export const notFoundPage = () => import('./routes/~404.tsx');
export const errorPage = undefined; // or lazy loader if ~500.tsx exists
```

## Route Watching

```typescript
// Debounced at 50ms, uses fs/promises watch with { recursive: true }
// On .tsx/.ts file renames:
// 1. Regenerates app/~routes.generated.ts
// 2. Touches ~manic.ts (appends timestamp comment)
// 3. Bun's --watch detects the touch and restarts the server
```

## Markdown Converter

**File**: `server/lib/markdown.ts` (~110 lines, zero dependencies)

Handles: h1-h6, p, strong/b, em/i, code, pre/code, blockquote, a, img, ul/li, ol/li, hr.
Strips: script, style, noscript, svg, head entirely.
Decodes HTML entities. Collapses 3+ newlines to 2.

Token estimation: `Math.ceil(text.length / 4)` → `x-markdown-tokens` header.

## Config Caching

Config is a module-level singleton:

```typescript
let cachedConfig: ManicConfig | null = null;

export async function loadConfig(cwd = process.cwd()): Promise<ManicConfig> {
  if (cachedConfig) return cachedConfig;
  // ... load, merge, cache
}
```

**Consequence**: No `clearConfigCache()`. Tests that load multiple configs, or config changes during a dev session, require process restart. This is a known limitation.

---

# 18. Built-in Components

## `NotFound`

```typescript
import { NotFound } from 'manicjs';

<NotFound />  // No props
```

Full-screen page with `BlinkingAsciiDots` animated canvas background:

- Braille unicode characters (`⠁⠂⠄⠈...`) in wave animation
- Mouse-reactive: increases wave amplitude near cursor
- Reads `--theme-background` and `--theme-foreground` CSS variables
- Observes `<html>` class mutations for theme changes

## `ServerError`

```typescript
import { ServerError } from 'manicjs';

<ServerError error={new Error('Something broke')} />
```

Full-featured error overlay (670 lines, zero external dependencies):

- Parses stack traces from multiple formats
- Resolves inline base64 and external `.map` source maps
- Hand-rolled VLQ decoder
- Syntax highlighting with token colorization (keywords, strings, comments, types, components, numbers)
- Shows source code with error line highlighted in red
- Collapsible call stack (app frames vs library frames)
- **"Copy for AI"** button — formats error as markdown for pasting to LLMs
- **"Open in editor"** link via `/_manic/open?file=...&line=...&column=...`
- Click outside or press `Esc` to dismiss
- `z-index: 99999` overlay

## `BlinkingAsciiDots` (Internal)

```typescript
// Only used inside NotFound — not exported
interface BlinkingAsciiDotsProps {
  density?: number; // default: 0.5
  animationSpeed?: number; // default: 0.2
}
```

Canvas-based, `requestAnimationFrame` animation.

---

# 19. Agent & AI Support

## HTTP Response Headers

### HTML Page Responses

```
Content-Type: text/html; charset=utf-8
Link: </openapi.json>; rel="service-desc"; type="application/json",
      </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json",
      </.well-known/mcp/server-card.json>; rel="mcp"; type="application/json"
      [+ plugin Link headers]
```

### Markdown Response (`Accept: text/markdown`)

```
Content-Type: text/markdown; charset=utf-8
Vary: Accept
x-markdown-tokens: <count>
Link: [same as HTML]
```

### Agent Mode (`?mode=agent`)

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

```json
{
  "name": "App Name",
  "mcp": "/.well-known/mcp/server-card.json",
  "openapi": "/openapi.json",
  "docs": "/docs",
  "agentSkills": "/.well-known/agent-skills/index.json",
  "discovery": "/.well-known/api-catalog"
}
```

### MCP CORS Headers

```
access-control-allow-origin: <request origin>
access-control-allow-methods: GET, POST, DELETE, OPTIONS
access-control-allow-headers: content-type, accept, mcp-session-id
access-control-expose-headers: mcp-session-id
```

## Standards Implemented

| Standard             | Implementation                                            |
| -------------------- | --------------------------------------------------------- |
| RFC 8288             | Link headers on all HTML responses                        |
| RFC 9727             | `/.well-known/api-catalog` linkset JSON                   |
| MCP 2025-03-26       | Streamable HTTP, JSON-RPC 2.0, at `/mcp`                  |
| OpenAPI 3.0.0        | Auto-generated spec at `/openapi.json`                    |
| Content-Signal       | `ai-train`, `search`, `ai-input` directives in robots.txt |
| WebMCP               | `navigator.modelContext.registerTool()` via `/webmcp.js`  |
| View Transitions API | `document.startViewTransition` integration                |

## `AGENTS.md` File

The template includes `AGENTS.md` in the project root with AI agent instructions. Key instructions for agents:

- Never edit `~routes.generated.ts`
- Don't replace the Bun HTML import in `~manic.ts`
- API routes export Hono instances (not Elysia)
- `addRoute` handlers use raw `Request → Response`, not Hono context

---

# 20. OXC Toolchain

Manic uses OXC (Oxidation Compiler — Rust-based) for the entire JS/TS toolchain:

| OXC Tool        | Role                    | Replaces                    |
| --------------- | ----------------------- | --------------------------- |
| `oxc-transform` | JSX/TS transform        | Babel, swc                  |
| `oxc-minify`    | Production minification | Terser, esbuild minify      |
| `oxc-resolver`  | Module resolution       | enhanced-resolve            |
| `oxlint`        | Linting                 | ESLint (but 50-100x faster) |
| `oxfmt`         | Formatting              | Prettier                    |

All OXC tools are configured via project-root config files (`.oxlintrc.json`, `.oxfmt.json`).

The OXC Bun plugin (`cli/plugins/oxc.ts`) intercepts file loads and transforms using `oxc-transform`'s `transformSync`. This is what enables Bun to process TSX files in dev without a separate compilation step.

---

# 21. Caveats and Limitations

## Breaking Changes from v0.5.x

| What                            | Old (v0.5.x)        | New (v0.12.0)                                        |
| ------------------------------- | ------------------- | ---------------------------------------------------- |
| HTTP server                     | Elysia              | Hono                                                 |
| API route exports               | `new Elysia()`      | `new Hono()`                                         |
| Plugin `configureServer` routes | Elysia context      | Raw `Request → Response`                             |
| Swagger/OpenAPI                 | `@elysiajs/swagger` | `@scalar/hono-api-reference` via `@manicjs/api-docs` |
| Static serving                  | `@elysiajs/static`  | Bun native routes                                    |
| Compression                     | `elysia-compress`   | Removed                                              |
| `Link` prop                     | `to="..."`          | `href="..."`                                         |

## Unimplemented Config Options

| Config Field            | Status                                 |
| ----------------------- | -------------------------------------- |
| `router.preserveScroll` | Declared, not consumed — always false  |
| `router.scrollBehavior` | Declared, not consumed                 |
| `build.splitting`       | Declared, but build hardcodes `true`   |
| `build.sourcemap`       | Declared, but build hardcodes `linked` |

## Known Bugs / Gaps

| Issue                                             | Impact                                                    |
| ------------------------------------------------- | --------------------------------------------------------- |
| `window.__MANIC_ENV__` never injected             | Client env vars don't work without manual workaround      |
| CLI `--version` hardcoded to `v0.6.0`             | Cosmetic only — actual version is 0.12.0                  |
| Netlify provider has Elysia syntax                | Generated function code is broken — use Vercel/Cloudflare |
| Config is a singleton with no clear method        | Can't reload config without process restart               |
| MCP custom tools missing from provider middleware | Custom tools only work in dev via the plugin              |
| `@manicjs/api-docs` has no `build` hook           | Providers handle production docs separately               |
| No test infrastructure                            | Zero test files in entire codebase                        |
| OpenAPI spec only registers GET                   | Actual HTTP methods not detected                          |
| Route discovery runs twice in build               | Performance quirk, correctness not affected               |

## What Manic Intentionally Excludes

- **SSR / RSC** — CSR-only, always. This is the core design principle.
- **Vite / Webpack / esbuild** — OXC + Bun is the entire toolchain.
- **CSS Modules / styled-components** — Tailwind v4 only.
- **Built-in data fetching** — use SWR, React Query, tRPC, etc.
- **Built-in state management** — out of scope.
- **Built-in auth / ORM / i18n** — out of scope.
- **Image optimization** — requires server-side processing, contrary to CSR philosophy.
- **Nested routes** — flat routing only.
- **Hash routing** — browser history API only.
- **Route guards** — handle auth/redirects in page components.

## `fileImporterPlugin` Is Effectively Unused

`fileImporterPlugin` exports a Hono app using `hono/bun`'s `serveStatic`, but the framework server handles static files directly via Bun routes. This export exists but is never called by any internal code.

---

# Appendix: Quick Reference

## Minimal Project

```
~manic.ts           # import app from './app/index.html'; createManicServer({ html: app })
manic.config.ts     # defineConfig({ app: { name: 'My App' } })
app/index.html      # HTML shell with href="tailwindcss" + src="./main.tsx"
app/main.tsx        # createRoot + Router + ThemeProvider + window.__MANIC_ROUTES__
app/global.css      # @import 'tailwindcss'
app/manic.d.ts      # /// <reference types="manicjs" />
```

## CLI Commands

```bash
manic dev                # Start dev with HMR (default port 6070)
manic dev --port 3000    # Custom port
manic dev --network      # Bind to 0.0.0.0
manic build              # Production build → .manic/
manic start              # Run .manic/server.js with NODE_ENV=production
manic deploy             # Show provider deploy commands
manic deploy --run       # Actually run provider deploy commands
manic lint               # Run oxlint
manic fmt                # Run oxfmt
```

## Minimal API Route

```typescript
// app/api/hello/index.ts → /api/hello
import { Hono } from 'hono';
const route = new Hono();
route.get('/', c => c.json({ message: 'Hello!' }));
export default route;
```

## Minimal Plugin

```typescript
import type { ManicPlugin } from 'manicjs/config';

export function myPlugin(): ManicPlugin {
  return {
    name: 'my-plugin',
    configureServer(ctx) {
      ctx.addRoute('/ping', () => new Response('pong'));
    },
    async build(ctx) {
      await ctx.emitClientFile('ping', 'pong');
    },
  };
}
```
