# Manic Framework — Complete Knowledge Dump

## 1. What Manic Actually Is

Manic is a React SPA framework that runs exclusively on Bun. No SSR. No hydration. No RSC. The server's job is to serve the HTML shell, serve static assets, handle API routes via Hono, and get out of the way. All rendering happens client-side via `createRoot`.

The entire toolchain is custom: OXC for transforms, OXC for minification, OXC for linting, OXC for formatting. No Vite, no Webpack, no Turbopack, no Rollup, no esbuild in the pipeline. `Bun.build` is the bundler. `Bun.serve` is the server. Tailwind v4 is integrated via `bun-plugin-tailwind`.

Package name on npm: `manicjs`. Current version: `0.12.0`. Licensed GPL-3.0.

---

## 2. Core Architecture

### Package Map

```
packages/manic/          → manicjs (the framework core)
packages/create-manic/   → create-manic (scaffolding CLI)
packages/providers/      → @manicjs/providers (Vercel, Cloudflare, Netlify adapters)
plugins/api-docs/        → @manicjs/api-docs (Scalar API docs UI)
plugins/seo/             → @manicjs/seo (robots.txt, Content-Signal, Link headers)
plugins/sitemap/         → @manicjs/sitemap (sitemap.xml generation)
plugins/mcp/             → @manicjs/mcp (MCP server endpoint for AI agents)
```

### Core Exports (manicjs)

| Export Path           | What             | Key Symbols                                                                                                                                                                                         |
| --------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manicjs`             | Root barrel      | `Router`, `Link`, `NotFound`, `ServerError`, `navigate`, `useRouter`, `useQueryParams`, `defineConfig`, `loadConfig`, `ThemeProvider`, `useTheme`, `ThemeToggle`, `ViewTransitions`, `createClient` |
| `manicjs/router`      | Full router      | `Router`, `Link`, `RouterContext`, `useRouter`, `useQueryParams`, `navigate`, `setViewTransitions`, `preloadRoute`, types                                                                           |
| `manicjs/server`      | Server bootstrap | `createManicServer`                                                                                                                                                                                 |
| `manicjs/config`      | Config + types   | `defineConfig`, `loadConfig`, `ManicConfig`, `ManicPlugin`, `ManicPluginContext`, `ManicServerPluginContext`, `ManicBuildPluginContext`, `ManicProvider`, `BuildContext`, `PageRoute`, `ApiRoute`   |
| `manicjs/plugins`     | Internal plugins | `apiLoaderPlugin`, `fileImporterPlugin`                                                                                                                                                             |
| `manicjs/theme`       | Dark/light mode  | `ThemeProvider`, `useTheme`, `ThemeToggle`, `initTheme`                                                                                                                                             |
| `manicjs/transitions` | View Transitions | `ViewTransitions` object with HTML element wrappers                                                                                                                                                 |
| `manicjs/env`         | Env access       | `getEnv`, `getPublicEnv`                                                                                                                                                                            |
| `manicjs/client`      | Hono RPC client  | `createClient`                                                                                                                                                                                      |

---

## 3. How a Manic App is Structured (from demo/)

Required files:

- `~manic.ts` — Server entry. Imports HTML, calls `createManicServer({ html })`.
- `manic.config.ts` — Config. Uses `defineConfig()`.
- `app/index.html` — HTML shell. Contains `<div id="root">`, script pointing to `main.tsx`, stylesheet `href="tailwindcss"`.
- `app/main.tsx` — React entry. Imports `~routes.generated`, sets `window.__MANIC_ROUTES__`, calls `createRoot`.
- `app/global.css` — Tailwind entry with `@import "tailwindcss"`.

Auto-generated:

- `app/~routes.generated.ts` — Route manifest with dynamic imports. Never edit manually.

Conventions:

- `app/routes/*.tsx` — Each file = one URL route. Default export = React component.
- `app/routes/~*.tsx` — Excluded from routing. Use for layouts, helpers.
- `app/routes/~404.tsx` — Custom 404 page (optional, auto-discovered).
- `app/routes/~500.tsx` — Custom error page (optional, auto-discovered).
- `app/api/*/index.ts` — Each folder = one API route. Default export = Hono instance.
- `assets/` — Static files served at `/assets/*`.
- `app/manic.d.ts` — Type augmentation for `__MANIC_ROUTES__`.

The `~manic.ts` entry in the demo:

```ts
import { createManicServer } from 'manicjs/server';
import app from './app/index.html';
const _server = await createManicServer({ html: app });
```

The `import app from './app/index.html'` is Bun's HTML import syntax. Bun processes this as an `HTMLBundle` — it handles Tailwind compilation, HMR injection, and module resolution for `.tsx` imports inside the HTML.

---

## 4. Build Pipeline (What Actually Happens)

The `manic build` command in `cli/commands/build.ts`:

1. **Lint**: Runs `oxlint` on the entire project. Build fails if lint fails. Non-negotiable.
2. **Route Discovery**: Scans `app/routes/` with `Bun.Glob('**/*.{tsx,ts}')`, skips `~` prefixed files, converts filenames to URL paths, writes `app/~routes.generated.ts`.
3. **Client Bundle**: `Bun.build` with `target: 'browser'`, `oxcPlugin()`, `bun-plugin-tailwind`. Output goes to `.manic/client/`. Hash-based naming for cache busting: `[name]-[hash].[ext]`. Chunks go to `chunks/`.
4. **HTML Transform**: Reads `app/index.html`, replaces `href="tailwindcss"` with actual CSS filename, replaces `src="./main.tsx"` with hashed JS filename. Writes to `.manic/client/index.html`.
5. **Plugin Build Phase**: Runs `plugin.build(ctx)` for each plugin. Plugins use `ctx.emitClientFile(path, content)` to write static files into `.manic/client/`.
6. **API Bundle**: Scans `app/api/**/index.ts`. Each file bundled separately with `Bun.build` target `bun`, externals `['*']`. Output: `.manic/api/[name].js`.
7. **API Catalog**: Writes RFC 9727 `.well-known/api-catalog` JSON.
8. **Server Bundle**: Reads `~manic.ts`, replaces the HTML import with `Bun.file()` read, bundles with `Bun.build` target `bun`. Output: `.manic/server.js`.
9. **Minification**: `oxc-minify` runs in parallel on client, API, and server directories. ES2022 target, mangling enabled.
10. **Provider Export**: Each provider in `config.providers` runs its `build(ctx)` — generates platform-specific output (`.vercel/output/`, `dist/` for CF, etc.).

Build output:

```
.manic/
  client/
    index.html
    main-[hash].js
    [hash].css
    chunks/
    assets/
    .well-known/
  api/
    hello.js
    ...
  server.js
```

### OXC Plugin (cli/plugins/oxc.ts)

A `BunPlugin` that intercepts `.tsx`, `.ts`, `.jsx` files (excluding `node_modules`). Uses `oxc-transform`'s `transformSync`:

- Dev: `target: esnext`, sourcemaps on, React Fast Refresh enabled, appends HMR `import.meta.hot.accept()` for jsx/tsx files.
- Prod: `target: es2022`, no sourcemaps, no refresh.
- Always: `jsx.runtime: 'automatic'`, `typescript.onlyRemoveTypeImports: true`, `typescript.rewriteImportExtensions: true`.

---

## 5. Server Architecture (server/index.ts)

`createManicServer` does:

1. Loads config and discovers routes in parallel.
2. Detects if `html` is a Bun `HTMLBundle` (has `.index` property) vs raw string.
3. Sets up `serveHtml` function that:
   - Adds Link headers (RFC 8288) from plugins
   - Handles `Accept: text/markdown` content negotiation (converts HTML to markdown for AI agents)
   - Handles `?mode=agent` query param (returns JSON about the app: MCP endpoint, OpenAPI URL, docs URL, etc.)
4. If `HTMLBundle` in dev: creates a secret nonce route so the catch-all can fetch the processed HTML without losing Link headers/markdown support.
5. Registers static routes for all discovered page paths.
6. If fullstack mode: loads API routes via `apiLoaderPlugin`, registers `/api/*`, `/openapi.json`, `/.well-known/api-catalog`.
7. Adds built-in Link headers for API catalog, OpenAPI spec, MCP discovery.
8. Runs `plugin.configureServer(ctx)` for each plugin.
9. Starts `Bun.serve` with `development: { hmr: true }` in dev mode.
10. Watches `app/routes/` for file changes to regenerate the route manifest.

Two modes of operation:

- **frontend**: No Hono API, just SPA serving. Still runs plugins.
- **fullstack** (default): Full Hono API + SPA serving.

The server handles:

- `/_manic/open` — Opens file in editor (dev only). Uses `$EDITOR` or defaults to `code`.
- `/assets/*` — Static file serving with appropriate cache headers.
- SPA catch-all — Returns the HTML shell for any unmatched route (client router handles it).

---

## 6. Router Internals

### Route Registry (router/lib/matcher.ts)

Routes are compiled to regex once, scored by specificity:

- Static segment: 100 points
- Dynamic `:param` or `[param]`: 10 points
- Catch-all `:...param` or `[...param]`: 1 point

Routes sorted by score descending, ties broken by path length. Matching is O(n) scan through sorted list.

Supports: static routes, dynamic segments (`:id`, `[id]`), catch-all segments (`:...slug`, `[...slug]`), route groups (`(group)/`).

### Router Component (router/lib/Router.tsx)

State machine that manages:

- Current path, loaded component, route params, error state
- `AbortController` for cancelling in-flight navigations
- Component cache (`Map<string, ComponentType>`) — once loaded, never re-fetched
- Error boundary wrapping all route components
- Custom error page discovery (`~404.tsx`, `~500.tsx`)

Navigation flow:

1. `loadAndTransition(path, isPopState, replace)`
2. Match route via `RouteRegistry`
3. Lazy load component (or use cache)
4. If View Transitions enabled and not popstate: wrap state update in `document.startViewTransition` + `flushSync`
5. Push/replace history, update state, scroll to top (or restore for popstate)

HMR: `import.meta.hot.accept` clears the component cache on hot reload.

### Link Component (router/lib/Link.tsx)

Renders `<a>` with `onClick` that calls `navigate()`. Prefetches on `onMouseEnter` and `onFocus` via `preloadRoute()`. Supports `viewTransitionName` prop, `replace` prop, and disabling prefetch.

---

## 7. Plugin System

### Interface

```ts
interface ManicPlugin {
  name: string;
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}
```

### Server Context (ManicServerPluginContext)

```ts
interface ManicServerPluginContext extends ManicPluginContext {
  addRoute(
    path: string,
    handler: (req: Request) => Response | Promise<Response>
  ): void;
  addLinkHeader(value: string): void;
}
```

- `addRoute` registers a Bun route. Dev-only unless you also emit the file in `build`.
- `addLinkHeader` adds RFC 8288 Link headers to all HTML responses.
- `config`, `pageRoutes`, `apiRoutes`, `prod`, `cwd`, `dist` available on context.

### Build Context (ManicBuildPluginContext)

```ts
interface ManicBuildPluginContext extends ManicPluginContext {
  emitClientFile(
    relativePath: string,
    content: string | Uint8Array
  ): Promise<void>;
}
```

- `emitClientFile` writes to `.manic/client/[relativePath]`. All providers copy this directory.

### How to Create a Plugin

Minimal plugin:

```ts
import type { ManicPlugin } from 'manicjs/config';

export function myPlugin(options: MyOptions = {}): ManicPlugin {
  return {
    name: 'my-plugin',

    configureServer(ctx) {
      // Register dev routes
      ctx.addRoute('/my-endpoint', req => new Response('hello'));
      ctx.addLinkHeader('</my-endpoint>; rel="my-relation"');
    },

    async build(ctx) {
      // Emit static files for production
      await ctx.emitClientFile('my-endpoint', 'hello');
    },
  };
}
```

Plugin rules:

1. **Always implement both hooks** if you register a route in `configureServer`. The route only exists in dev otherwise. `build` must emit the same content via `emitClientFile`.
2. **No provider-specific code** inside plugins. Plugins are provider-agnostic. Providers consume what plugins emit.
3. **Use `addLinkHeader`** for any discovery endpoint so AI agents can find it.
4. Plugin name must be unique. Convention: `@manicjs/[name]` for first-party, anything for third-party.

### Plugin Lifecycle

1. During `manic dev`: `configureServer` runs before `Bun.serve` starts.
2. During `manic build`: `build` runs after client bundling, before API bundling.
3. Plugins are executed in array order from `manic.config.ts`.

### How Users Add Plugins

In `manic.config.ts`:

```ts
import { defineConfig } from 'manicjs/config';
import { myPlugin } from 'my-manic-plugin';

export default defineConfig({
  plugins: [myPlugin({ option: 'value' })],
});
```

Plugin packages should:

- Export a factory function that returns `ManicPlugin`
- Declare `manicjs` as a `peerDependency`
- Import types from `manicjs/config`
- Publish with `src/**/*` in `files` (Bun runs TypeScript directly)

---

## 8. Existing Plugins Deep Dive

### @manicjs/sitemap

- **configureServer**: Generates XML from `ctx.pageRoutes`, registers `/sitemap.xml`.
- **build**: Emits `sitemap.xml` via `emitClientFile`.
- Filters out dynamic routes and excluded paths.
- Takes: `hostname`, `changefreq`, `priority`, `exclude`.

### @manicjs/seo

- **configureServer**: Generates robots.txt, registers `/robots.txt`. Adds Link headers for sitemap auto-discovery. Supports custom Link headers.
- **build**: Emits `robots.txt`.
- Supports Content-Signal directives (`ai-train`, `search`, `ai-input`).
- Supports custom robot rules per user-agent.
- No `addRoute` for the Link headers — they use `addLinkHeader` which affects all HTML responses.

### @manicjs/api-docs

- **configureServer only** (no build hook). Mounts Scalar API reference UI at `/docs` using `@scalar/hono-api-reference`.
- In production, providers generate the `/docs` route inline (hardcoded Scalar CDN script). This is a provider responsibility, not plugin.
- Weakness: The build hook is missing. Production `/docs` depends on providers embedding it.

### @manicjs/mcp

Most complex plugin. Implements a full MCP (Model Context Protocol) server.

- **configureServer**:
  - Registers `/mcp` endpoint handling `GET` (SSE keepalive), `POST` (JSON-RPC), `DELETE` (session cleanup), `OPTIONS` (CORS).
  - Registers discovery docs: `/.well-known/mcp.json`, `/.well-known/mcp/server-card.json`, `/.well-known/agent-skills/index.json`, SKILL.md.
  - Registers `/webmcp.js` — browser script that registers tools via `navigator.modelContext` (WebMCP API).
  - In dev: registers `/mcp/console` and `/mcp/console.js` for browser console log capture.
  - JSON-RPC methods: `initialize`, `notifications/initialized`, `tools/list`, `tools/call`.
  - Session management via `Map<string, { initialized: boolean }>`.

- **build**:
  - Emits all discovery docs as static files.
  - Emits `webmcp.js`.

- **Default tools**: `get_routes`, `get_api_routes`, `get_page_meta`, `get_rendered_elements`, `get_console_logs` (dev only).

- **Custom tools**: Use `defineTool()` with Zod schema:

  ```ts
  import { defineTool } from '@manicjs/mcp';
  import { z } from 'zod';

  const myTool = defineTool('my_tool', {
    description: 'Does something',
    input: z.object({ query: z.string() }),
    execute: async ({ query }) => ({ result: query }),
  });

  mcp({ tools: [myTool] });
  ```

- `defineTool` converts Zod schema to JSON Schema manually (no zod-to-json-schema dependency). Handles string, number, boolean, array types. Validates input with `schema.parse()`.

---

## 9. Provider System

### Interface

```ts
interface ManicProvider {
  name: string;
  build(context: BuildContext): Promise<void>;
}

interface BuildContext {
  dist: string; // ".manic"
  config: ManicConfig;
  apiEntries: string[]; // Original source paths like "app/api/hello/index.ts"
  clientDir: string; // ".manic/client"
  serverFile: string; // ".manic/server.js"
}
```

### How Providers Work

Providers run after the main build. They take the `.manic/` output and transform it into platform-specific deployment format.

All providers:

1. Copy `.manic/client/` to their static directory
2. Copy favicon to root level
3. Generate a Hono-based worker/function that imports API routes
4. Inline OpenAPI spec generation
5. Inline API docs (Scalar CDN)
6. Inject agent middleware (Link headers, markdown negotiation, `?mode=agent`, MCP)

### Agent Middleware (providers/src/middleware.ts)

`agentMiddleware(ctx)` generates JavaScript code string injected into provider workers. It:

- Adds RFC 8288 Link headers to all HTML responses
- Handles `Accept: text/markdown` — converts HTML to markdown inline (lightweight converter)
- Handles `?mode=agent` — returns JSON describing the app
- If MCP plugin present: embeds a complete MCP server (streamable HTTP) with tools inlined
- The MCP code in providers is a simplified copy of the full plugin (hardcoded default tools only)

### Vercel Provider

- Output: `.vercel/output/` (Vercel Build Output API v3)
- Runtime options: `bun`, `edge`, `nodejs20.x`, `nodejs22.x`
- Bundles API function with `Bun.build` to inline all dependencies (avoids ReadOnlyFileSystem on Vercel)
- Generates `config.json` with filesystem-first routing, then API, then SPA fallback
- Creates `vercel.json` if missing

### Cloudflare Provider

- Output: `dist/` (Cloudflare Pages)
- Generates `_worker.js` (Hono app handling API + static fallback via `c.env.ASSETS`)
- Falls back to `_redirects` if no API routes
- Generates `wrangler.toml`

### Netlify Provider

- Output: `dist/` (static) + `netlify/functions/` (serverless)
- Bundles function to Node.js target
- Generates `netlify.toml` with redirects for API and SPA fallback
- Still references Elysia types in some of the function generation code (legacy — the framework migrated from Elysia to Hono but Netlify template may have stale references)

### Creating a New Provider

```ts
import type { ManicProvider, BuildContext } from '@manicjs/providers';

export function myCloud(options = {}): ManicProvider {
  return {
    name: 'my-cloud',
    async build(ctx: BuildContext) {
      // 1. Copy ctx.clientDir to your static output
      // 2. Generate worker/function code that imports from ctx.dist/api/
      // 3. Include agent middleware if needed
      // 4. Generate platform config files
    },
  };
}
```

---

## 10. Dev Server

`manic dev` spawns `bun --watch ~manic.ts` as a child process. That's it. No custom dev server. Bun's built-in watcher handles reloads. HMR is handled by `Bun.serve({ development: { hmr: true } })`.

The `HTMLBundle` import (`import app from './app/index.html'`) gives Bun control over:

- Tailwind compilation
- JSX/TS transformation
- Module resolution
- HMR websocket injection

The framework adds a nonce route (`/__manic_html_[uuid]`) so the catch-all handler can proxy to the HTMLBundle processing while adding custom headers.

Route watching: `watchRoutes()` uses `fs/promises watch()` with recursive flag. On `.tsx`/`.ts` file rename events:

1. Regenerates `app/~routes.generated.ts`
2. Touches `~manic.ts` (appends timestamp comment) to trigger Bun's `--watch` restart
3. Debounced at 50ms

---

## 11. create-manic Scaffolding

`bun create manic [name]` runs an interactive CLI:

- Asks: project name, app name, mode (fullstack/frontend), port, API docs, view transitions
- Copies `packages/create-manic/template/` to target directory
- Removes `app/api/` in frontend mode
- Removes `hono` and `@manicjs/api-docs` deps in frontend mode
- Generates customized `manic.config.ts`

Template structure mirrors the demo app structure.

---

## 12. Environment Variables

- Server: direct `process.env` access
- Client: only `MANIC_PUBLIC_*` prefixed vars accessible
- `getEnv(key)` — server-side returns any key, client-side only returns `MANIC_PUBLIC_*` (warns otherwise)
- `getPublicEnv()` — returns all public env vars as object
- Client receives env via `window.__MANIC_ENV__` (must be injected into HTML — currently this injection mechanism is not implemented in the server, making the client env system incomplete)

---

## 13. Theme System

`ThemeProvider` wraps the app. Stores theme in `localStorage('manic-theme')`. Applies `dark` class on `<html>`. Three modes: `light`, `dark`, `system`.

`useTheme()` returns: `theme`, `resolvedTheme`, `setTheme`, `toggle`, `isDark`, `isLight`.

`ThemeToggle` is a button component, supports render-prop children for custom icons.

`initTheme()` runs on module load (via side-effect at bottom of file) to prevent flash of wrong theme. This is good — it runs before React hydration.

Works with Tailwind's `dark:` variant since it toggles the `dark` class on `<html>`.

---

## 14. View Transitions

`ViewTransitions` object provides element wrappers that set `viewTransitionName` CSS property:

```tsx
<ViewTransitions.div name="hero">content</ViewTransitions.div>
```

Available tags: div, span, main, section, article, header, footer, nav, aside, h1-h3, p, img, button, a, ul, li.

Navigation triggers `document.startViewTransition` when:

- `viewTransitionsEnabled` is true (default)
- Browser supports the API
- Not a popstate (back/forward)
- Not a replace navigation

Can be toggled globally: `setViewTransitions(false)`.

---

## 15. Error Handling

### ServerError Component (components/ServerError/)

Full-featured error overlay (dev-oriented):

- Parses stack traces from multiple formats
- Resolves source maps (inline base64 + external `.map` files)
- VLQ decoder for source map mapping
- Syntax highlighting with token colorization (keywords, strings, comments, types, components, etc.)
- Shows source code with error line highlighted
- Expandable call stack (app frames vs all frames)
- Click outside or Esc to dismiss
- "Open in editor" link via `/_manic/open`
- Copy stack trace button

This is a production component shipped with the framework. Has zero external dependencies — everything (VLQ decoder, tokenizer, source map resolver) is hand-rolled.

### NotFound Component

Animated ASCII dot background (`BlinkingAsciiDots`), centered 404 message with SVG illustration.

### Error Boundary

The Router wraps loaded components in an `ErrorBoundary` class component. Catches render errors, displays `ServerError` (or custom `~500.tsx`).

---

## 16. Content Negotiation / Agent Support

The server handles three types of agent/AI interactions:

1. **Markdown negotiation**: If `Accept: text/markdown`, converts HTML to markdown using a hand-rolled converter. Returns `Content-Type: text/markdown`, `Vary: Accept`, `x-markdown-tokens` header.

2. **Agent mode**: `?mode=agent` query param returns JSON:

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

3. **Link headers**: Every HTML response includes RFC 8288 Link headers pointing to OpenAPI spec, API catalog, MCP server card, agent skills.

The markdown converter (`server/lib/markdown.ts`) handles: headings, paragraphs, bold, italic, code, code blocks, blockquotes, links, images, lists, horizontal rules. Strips scripts, styles, SVG, head. Collapses whitespace. ~130 lines, no dependencies.

---

## 17. API System

API routes use Hono. Each `app/api/[name]/index.ts` exports a default Hono instance:

```ts
import { Hono } from 'hono';
const app = new Hono();
app.get('/', c => c.json({ message: 'hello' }));
export default app;
```

`apiLoaderPlugin` scans the API directory, imports each module, mounts it on the Hono app with basePath `/api`. Supports:

- Hono instances (detected by `.fetch` method)
- Plain functions (wrapped with `app.all`)
- Dynamic route params via `[param]` in filenames

OpenAPI spec is auto-generated (minimal — just paths and 200 responses). Available at `/openapi.json`. API catalog at `/.well-known/api-catalog` (RFC 9727).

In production builds, each API route is bundled separately to `.manic/api/`. Providers import and mount them.

---

## 18. Configuration System

`ManicConfig` interface with these sections:

| Section     | Key Fields                                            | Defaults                               |
| ----------- | ----------------------------------------------------- | -------------------------------------- |
| `mode`      | `'fullstack' \| 'frontend'`                           | `'fullstack'`                          |
| `app`       | `name`                                                | `'Manic App'`                          |
| `server`    | `port`, `hmr`                                         | `6070`, `true`                         |
| `router`    | `viewTransitions`, `preserveScroll`, `scrollBehavior` | `true`, `false`, `'auto'`              |
| `build`     | `minify`, `sourcemap`, `splitting`, `outdir`          | `true`, `'inline'`, `true`, `'.manic'` |
| `oxc`       | `target`, `rewriteImportExtensions`, `refresh`        | `'esnext'`, `true`, `true`             |
| `sitemap`   | `SitemapConfig \| false`                              | undefined                              |
| `providers` | `ManicProvider[]`                                     | undefined                              |
| `plugins`   | `ManicPlugin[]`                                       | undefined                              |

`loadConfig()` tries `manic.config.ts` then `manic.config.js`. Merges with defaults via spread. Cached after first load.

`getConfig()` returns cached config synchronously (must call `loadConfig()` first).

---

## 19. Strengths

1. **Build speed**: Bun.build + OXC transform + OXC minify. No JavaScript bundler overhead. Parallel minification across client/api/server.
2. **Zero external bundler dependencies**: No Vite, no esbuild, no Rollup. Just Bun and OXC.
3. **Tiny dependency tree**: `hono`, `colorette`, `bun-plugin-tailwind`, `oxc-*` packages, `oxlint`. That's it.
4. **Plugin system is clean**: Two hooks, clear separation between dev and build. `emitClientFile` ensures providers pick up plugin output automatically.
5. **Agent-first**: MCP, markdown negotiation, `?mode=agent`, Link headers, WebMCP browser registration. Very forward-thinking for AI agent integration.
6. **Error overlay**: Production-quality error overlay with source map resolution, zero dependencies. Rivals Next.js error overlay.
7. **Route scoring**: Static > Dynamic > Catch-all with regex compilation. Routes compiled once.
8. **View Transitions**: First-class integration with `document.startViewTransition`, flushSync for synchronous state updates.
9. **Multi-provider deploy**: Single `manic build` produces output consumed by any provider. `manic deploy` handles all configured providers.

---

## 20. Weaknesses / Inefficiencies

### Critical

1. **Config cache is module-level singleton** (`cachedConfig` in config/index.ts). If running tests or multiple config loads are needed, there's no way to invalidate. No `clearConfigCache()` exposed.

2. **Netlify provider still has Elysia references** in generated function code. The framework migrated to Hono but the Netlify template uses `g.use()` pattern that doesn't match Hono's API. The generated code mounts routes with `app.group("/api...", (g) => g.use(api_handler))` — this is Elysia syntax, not Hono.

3. **Client env injection (`window.__MANIC_ENV__`) is never actually implemented**. The `getEnv`/`getPublicEnv` client code reads from `window.__MANIC_ENV__` but nothing in the server or build pipeline injects this into the HTML. The env system is half-built.

4. **`build.splitting` and `build.sourcemap` config options are declared but never read**. The build command hardcodes its Bun.build options. Changing `splitting: false` in config does nothing.

5. **`preserveScroll` and `scrollBehavior` router config options are declared but never consumed** by the Router component. The Router always scrolls to top on new navigation and restores on popstate.

6. **API bundling uses `external: ['*']`** which means all imports are external. In production, these externals must be available at runtime. For providers that bundle the function (Vercel, Cloudflare), this works because they re-bundle. For bare `manic start`, the API code in `.manic/api/` has unresolved imports.

7. **OpenAPI spec is minimal** — only registers GET for each route, regardless of actual HTTP methods. No request/response schemas. The `buildSpec` function in `api.ts` ignores the actual Hono route methods.

8. **Provider code duplication**: All three providers duplicate the same pattern — import APIs, mount on Hono, generate OpenAPI spec, inline Scalar docs. Should be a shared utility.

9. **MCP is duplicated between plugin and provider middleware**. The full MCP server in `plugins/mcp/src/` vs the inlined version in `providers/src/middleware.ts`. Any tool additions or protocol changes need updating in two places.

### Non-Critical

10. **No test infrastructure**. Zero test files in the entire codebase. No test runner configured.

11. **Version mismatch**: `cli/index.ts` hardcodes `v0.6.0` while `package.json` says `0.12.0`.

12. **`matchRoute` function in matcher.ts is kept "for backwards compatibility" but creates a new RouteRegistry on every call**. Should be deprecated or removed.

13. **Route discovery runs twice during build** — once for `writeRoutesManifest()` and again for plugin context `pageRoutes`. Should cache.

14. **No CSS extraction config**. Tailwind CSS is always bundled. No option for external CSS files or critical CSS extraction.

15. **`fileImporterPlugin` uses `hono/bun` `serveStatic` but is essentially unused** — the server handles static files directly. It's exported but never imported by anything in the framework.

16. **Theme `initTheme()` runs as a module side-effect** — this means importing the theme module in any context (SSR, testing, Node.js) will throw on `window` access, even though there are typeof window checks. The issue is `localStorage` access in `getStoredTheme` isn't guarded properly in some code paths.

---

## 21. Where AI Agents Will Struggle

1. **The `~` prefix convention is non-standard**. Agents will try to route `~manic.ts` or edit `~routes.generated.ts`. Need explicit AGENTS.md instructions.

2. **Bun HTML import** (`import app from './app/index.html'`) is Bun-specific syntax that most LLMs don't know about. Agents may try to replace it with `fs.readFileSync` or similar.

3. **The build pipeline is imperative code, not config**. There's no `manic.config.ts` option for "add a build step". Agents need to understand the build.ts file directly to extend it.

4. **Plugin `emitClientFile` path resolution** — it's relative to `.manic/client/`. Agents might pass absolute paths or paths with leading `/`.

5. **The server has two modes** (HTMLBundle vs string). Agents may not understand when each is active and how the nonce route works.

6. **Provider middleware generates JavaScript as template strings**. Agents editing this will fight string escaping and template literal nesting.

7. **`addRoute` handlers must return `Response` objects**, not Hono Context methods. This is raw `Request` → `Response` function signature, not Hono middleware.

---

## 22. Extending the Core

### Adding a New CLI Command

1. Create `packages/manic/src/cli/commands/mycommand.ts`
2. Export an async function
3. Register in `packages/manic/src/cli/index.ts` commands object
4. Add to help text

### Adding a New Router Feature

The router is in `packages/manic/src/router/lib/`. Key integration points:

- `Router.tsx`: Main component, navigation logic
- `matcher.ts`: Route matching
- `context.ts`: React context
- `types.ts`: Shared types
- `Link.tsx`: Navigation link

To add something like route transitions metadata, you'd extend `RouteDef` type and modify `loadAndTransition` in Router.tsx.

### Adding a New Server Feature

`packages/manic/src/server/index.ts` — the `createManicServer` function. Add routes to `bunRoutes` object before `Bun.serve` call. For built-in middleware, add it to `handleDynamicRequest`.

### Adding a New Built-in Component

Create in `packages/manic/src/components/MyComponent/index.tsx`. Export from `packages/manic/index.ts`.

### Adding a New Config Section

1. Add to `ManicConfig` interface in `packages/manic/src/config/index.ts`
2. Add default value in `DEFAULT_CONFIG`
3. Add merge logic in `loadConfig()`
4. Consume in relevant code

---

## 23. What's Needed

1. **Tests**: The framework has zero tests. At minimum: router matching, route discovery, config loading, plugin hooks, markdown converter, build output verification.

2. **Config option implementation**: `build.splitting`, `build.sourcemap`, `router.preserveScroll`, `router.scrollBehavior` are all declared but unused. Either implement or remove.

3. **Client env injection**: Complete the `window.__MANIC_ENV__` system. The server needs to inject a `<script>` tag with public env vars into the HTML shell.

4. **Provider shared utilities**: Extract the duplicated Hono app generation, OpenAPI spec, Scalar docs into a shared function all providers use.

5. **MCP unification**: The provider middleware inlines a simplified MCP server. Should import/reuse from the plugin or share a common core.

6. **Netlify provider fix**: Still generates Elysia-style code. Needs to be updated to Hono patterns.

7. **OpenAPI accuracy**: Parse actual Hono route methods and generate proper spec with request/response schemas.

8. **Version sync**: CLI version string and package.json version should come from the same source.

9. **Layout/Wrapper system**: No built-in layout mechanism. Users must manually wrap each page or use a pattern in `main.tsx`. A `~layout.tsx` convention would be valuable.

10. **Head management**: No way to set `<title>`, `<meta>` per page. Need a `useHead()` hook or `<Head>` component.

11. **Loading states**: No Suspense integration or loading UI during route transitions. The router returns `null` while loading the initial route.

12. **SSG support**: Static site generation for pages without dynamic data. The build could pre-render known routes.

---

## 24. What's NOT Needed

1. **SSR/RSC**: This is intentionally a CSR framework. Don't add server rendering. That's the entire point.
2. **Webpack/Vite compatibility**: The custom toolchain is the differentiator. Don't abstract it.
3. **Multiple styling solutions**: Tailwind v4 is integrated. Don't add CSS Modules, styled-components support, etc.
4. **Data fetching primitives**: Users bring their own (fetch, SWR, React Query, tRPC). The framework provides the API layer, not the client-side fetching strategy.
5. **State management**: Not the framework's job. Users use whatever they want.
6. **Authentication**: Not built-in. Handled at the API layer.
7. **Database ORM**: Out of scope. The framework is the server + client shell.
8. **i18n**: Can be added as a plugin if needed.
9. **Image optimization**: Would require server-side processing, contrary to the CSR philosophy.
10. **Middleware chain**: Hono handles API middleware. Page middleware doesn't make sense in a pure CSR app.

---

## 25. Plugin Development Guide for External Developers

### Package Setup

```json
{
  "name": "manic-plugin-analytics",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": ["src/**/*"],
  "peerDependencies": {
    "manicjs": ">=0.10.0"
  }
}
```

Bun runs TypeScript directly. No build step needed for the plugin package.

### Full Plugin Template

```ts
import type {
  ManicPlugin,
  ManicServerPluginContext,
  ManicBuildPluginContext,
} from 'manicjs/config';

export interface AnalyticsConfig {
  trackingId: string;
  debug?: boolean;
}

export function analytics(config: AnalyticsConfig): ManicPlugin {
  const script = `<script>/* analytics for ${config.trackingId} */</script>`;

  return {
    name: 'manic-plugin-analytics',

    configureServer(ctx: ManicServerPluginContext) {
      // Serve the analytics script
      ctx.addRoute(
        '/analytics.js',
        () =>
          new Response(`console.log("tracking: ${config.trackingId}")`, {
            headers: { 'content-type': 'application/javascript' },
          })
      );

      // Add discovery header
      ctx.addLinkHeader('</analytics.js>; rel="preload"; as="script"');

      // Access route info
      console.log(`Analytics tracking ${ctx.pageRoutes.length} pages`);
    },

    async build(ctx: ManicBuildPluginContext) {
      // Emit static file for production
      await ctx.emitClientFile(
        'analytics.js',
        `console.log("tracking: ${config.trackingId}")`
      );

      // Can access build info
      const routes = ctx.pageRoutes.filter(r => !r.dynamic);
      console.log(`Analytics: ${routes.length} static routes`);
    },
  };
}
```

### Testing Your Plugin

1. Add as workspace dependency: `"manic-plugin-analytics": "workspace:*"` in demo's package.json
2. Import in demo's `manic.config.ts`
3. Run `bun dev` — verify `configureServer` works
4. Run `bun build` — verify `emitClientFile` output in `.manic/client/`
5. Run `bun start` — verify production serving

### What You Can Access

In `configureServer`:

- `ctx.config` — full ManicConfig
- `ctx.pageRoutes` — `{ path, filePath, dynamic }[]`
- `ctx.apiRoutes` — `{ mountPath, filePath }[]`
- `ctx.prod` — boolean
- `ctx.cwd` — process.cwd()
- `ctx.dist` — output directory name
- `ctx.addRoute(path, handler)` — register route
- `ctx.addLinkHeader(value)` — add Link header

In `build`:

- Same as above minus `addRoute`/`addLinkHeader`
- Plus `ctx.emitClientFile(relativePath, content)`

### Plugin with MCP Tools

```ts
import type { ManicPlugin } from 'manicjs/config';
import { defineTool } from '@manicjs/mcp';
import { z } from 'zod';

const searchTool = defineTool('search_docs', {
  description: 'Search documentation',
  input: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().optional().describe('Max results'),
  }),
  execute: async ({ query, limit }) => {
    return { results: [`Result for: ${query}`], total: 1 };
  },
});

export function docsSearch(): ManicPlugin {
  return {
    name: 'docs-search',
    configureServer(ctx) {
      // Plugin just provides the tool; MCP plugin must be configured separately
      // Users add: mcp({ tools: [searchTool] }) alongside this plugin
    },
  };
}

export { searchTool };
```

---

## 26. Provider Development Guide

### Minimum Viable Provider

```ts
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import type { ManicProvider, BuildContext } from '@manicjs/providers';

export function myCloud(): ManicProvider {
  return {
    name: 'my-cloud',
    async build(ctx: BuildContext) {
      const out = 'my-cloud-output';
      rmSync(out, { recursive: true, force: true });
      mkdirSync(out, { recursive: true });

      // 1. Static assets — always copy client dir
      cpSync(ctx.clientDir, `${out}/static`, { recursive: true });

      // 2. Server function (if APIs exist)
      if (ctx.apiEntries.length > 0) {
        // Generate worker code that imports from ctx.dist/api/
        // Mount on Hono, add OpenAPI, add Scalar if configured
      }

      // 3. Platform config
      await Bun.write(
        `${out}/config.json`,
        JSON.stringify({
          /* ... */
        })
      );
    },
  };
}
```

Key: `ctx.clientDir` already contains everything plugins emitted. Just copy it.

---

## 27. Monorepo Workspace Structure

Root `package.json` defines workspaces: `packages/*`, `plugins/*`, `demo`, `examples/*`.

All packages use `bun install` at root. No per-package installs.

Scripts: `bun dev` and `bun build` both `cd demo && bun run [cmd]`.

Packages reference each other via `workspace:*` in dependencies.

All packages ship raw TypeScript (`src/**/*` in files). Bun runs it directly. No compile step for packages.

Publishing: `publish.ts` at root handles version bumps and npm publish (not analyzed in detail).

---

## 28. Standards Compliance

| Standard             | Implementation                                      |
| -------------------- | --------------------------------------------------- |
| RFC 8288             | Link headers on all HTML responses                  |
| RFC 9727             | `/.well-known/api-catalog` with linkset format      |
| MCP 2025-03-26       | Streamable HTTP transport, JSON-RPC 2.0             |
| OpenAPI 3.0.0        | Auto-generated (minimal) at `/openapi.json`         |
| Content-Signal       | `ai-train`, `search`, `ai-input` in robots.txt      |
| WebMCP               | `navigator.modelContext.registerTool()` browser API |
| View Transitions API | `document.startViewTransition` integration          |

---

## 29. File-by-File Reference

### packages/manic/src/

| File                               | Lines | Purpose                                            |
| ---------------------------------- | ----- | -------------------------------------------------- |
| `cli/index.ts`                     | 101   | CLI entry, command routing, help text              |
| `cli/commands/build.ts`            | 404   | Production build pipeline                          |
| `cli/commands/dev.ts`              | 35    | Dev server (spawns bun --watch)                    |
| `cli/commands/start.ts`            | 35    | Production server launcher                         |
| `cli/commands/deploy.ts`           | 122   | Multi-provider deploy orchestrator                 |
| `cli/commands/lint.ts`             | 14    | oxlint wrapper                                     |
| `cli/commands/fmt.ts`              | 10    | oxfmt wrapper                                      |
| `cli/plugins/oxc.ts`               | 56    | OXC transform Bun plugin                           |
| `server/index.ts`                  | 354   | Server bootstrap, routing, agent support           |
| `server/lib/discovery.ts`          | 212   | Route scanning, manifest generation, file watching |
| `server/lib/markdown.ts`           | 110   | HTML to Markdown converter                         |
| `router/lib/Router.tsx`            | 370   | Main router component                              |
| `router/lib/matcher.ts`            | 147   | Route regex compilation and matching               |
| `router/lib/Link.tsx`              | 63    | Navigation link component                          |
| `router/lib/context.ts`            | 12    | Router React context                               |
| `router/lib/types.ts`              | 20    | Router type definitions                            |
| `plugins/lib/api.ts`               | 64    | Hono API route loader                              |
| `plugins/lib/static.ts`            | 8     | Static file serving (unused)                       |
| `config/index.ts`                  | 212   | Config types, defaults, loading                    |
| `config/client.ts`                 | 12    | Hono RPC client helper                             |
| `env/client.ts`                    | 36    | Client-safe env access                             |
| `theme/index.ts`                   | 135   | Theme provider, hook, toggle                       |
| `transitions/index.ts`             | 60    | View Transition element wrappers                   |
| `components/NotFound/index.tsx`    | 17    | 404 page                                           |
| `components/ServerError/index.tsx` | 670   | Error overlay with source maps                     |

### plugins/

| File                       | Lines | Purpose                     |
| -------------------------- | ----- | --------------------------- |
| `sitemap/src/index.ts`     | 28    | Sitemap plugin entry        |
| `sitemap/src/generate.ts`  | 22    | XML generation              |
| `seo/src/index.ts`         | 64    | SEO plugin entry            |
| `seo/src/robots.ts`        | 31    | robots.txt generation       |
| `api-docs/src/index.ts`    | 33    | Scalar API docs mount       |
| `mcp/src/index.ts`         | 178   | MCP server plugin           |
| `mcp/src/handler.ts`       | 70    | JSON-RPC message handler    |
| `mcp/src/tool.ts`          | 60    | Tool definition with Zod    |
| `mcp/src/default-tools.ts` | 79    | Built-in MCP tools          |
| `mcp/src/discovery.ts`     | 98    | Well-known discovery docs   |
| `mcp/src/console.ts`       | 38    | Browser console log capture |

### packages/providers/src/

| File                  | Lines | Purpose                                |
| --------------------- | ----- | -------------------------------------- |
| `vercel/index.ts`     | 180   | Vercel Build Output API                |
| `cloudflare/index.ts` | 140   | Cloudflare Pages + Worker              |
| `netlify/index.ts`    | 167   | Netlify Functions                      |
| `middleware.ts`       | 173   | Shared agent middleware code generator |
| `types.ts`            | 12    | Provider type definitions              |

---

## 30. Complete API Reference — `manicjs` (Root Barrel)

### Re-exports

The root `manicjs` export (`packages/manic/index.ts`) re-exports everything a typical app needs:

```ts
// Components
export { Router } from './src/router';
export { Link } from './src/router';
export { NotFound } from './src/components/NotFound/index';
export { ServerError } from './src/components/ServerError/index';

// Hooks
export { useRouter } from './src/router';
export { useQueryParams } from './src/router';

// Functions
export { navigate } from './src/router';

// Config
export { defineConfig, loadConfig } from './src/config';
export type {
  ManicConfig,
  ManicPlugin,
  ManicPluginContext,
  ManicServerPluginContext,
  ManicBuildPluginContext,
  PageRoute,
  ApiRoute,
} from './src/config';

// Theme
export { ThemeProvider, useTheme, ThemeToggle } from './src/theme';

// Transitions
export { ViewTransitions } from './src/transitions';

// Client
export { createClient } from './src/config/client';
```

---

## 31. Complete API Reference — `manicjs/router`

Source: `packages/manic/src/router/`

### `Router` Component

```tsx
import { Router } from 'manicjs/router';

<Router routes={optionalRouteMap} />;
```

**Props:**

| Prop     | Type                                                        | Default                   | Description                                                          |
| -------- | ----------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------- |
| `routes` | `Record<string, () => Promise<{ default: ComponentType }>>` | `window.__MANIC_ROUTES__` | Route map. Keys are path patterns, values are lazy import functions. |

**Behavior:**

- Reads `window.__MANIC_ROUTES__` if no `routes` prop provided.
- Reads `window.__MANIC_ERROR_PAGES__` for custom 404/500 pages.
- Compiles all routes into a `RouteRegistry` (memoized via `useMemo`).
- On mount: loads the component for the current `window.location.pathname`.
- On navigation: matches path, lazy loads component, optionally wraps in `document.startViewTransition`.
- On popstate (back/forward): loads component, restores scroll position from `history.state.scrollY`.
- Wraps rendered component in `ErrorBoundary`.
- Returns `null` while loading the initial route (no loading spinner).
- Returns `<NotFoundPage>` if no route matches and component is null.
- Returns `<ErrorPage>` if an error was caught.

**Internal State:**

| State             | Type                     | Purpose                           |
| ----------------- | ------------------------ | --------------------------------- |
| `currentPath`     | `string`                 | Current URL pathname              |
| `LoadedComponent` | `ComponentType \| null`  | Currently rendered page component |
| `routeParams`     | `Record<string, string>` | Extracted dynamic params          |
| `errorDetails`    | `Error \| null`          | Caught error for error boundary   |

**Globals Set:**

- `window.__MANIC_NAVIGATE__` — set on mount, deleted on unmount. Used by `navigate()` and `<Link>`.

**Scroll Behavior:**

- `window.history.scrollRestoration = 'manual'` — set on mount.
- New navigation: `window.scrollTo(0, 0)`.
- Popstate: restores from `history.state.scrollY`.
- Before push: saves current `window.scrollY` to `history.state`.

### `Link` Component

```tsx
import { Link } from 'manicjs/router';

<Link
  to="/about"
  prefetch={true}
  replace={false}
  viewTransitionName="hero"
  className="nav-link"
  style={{ color: 'red' }}
>
  About
</Link>;
```

**Props:**

| Prop                 | Type            | Default     | Description                                          |
| -------------------- | --------------- | ----------- | ---------------------------------------------------- |
| `to`                 | `string`        | _required_  | Target path                                          |
| `children`           | `ReactNode`     | _required_  | Link content                                         |
| `className`          | `string`        | `undefined` | CSS class                                            |
| `style`              | `CSSProperties` | `undefined` | Inline styles                                        |
| `viewTransitionName` | `string`        | `undefined` | Sets `viewTransitionName` on the `<a>` element style |
| `prefetch`           | `boolean`       | `true`      | Preload target route chunk on hover/focus            |
| `replace`            | `boolean`       | `false`     | Replace current history entry instead of pushing     |

**Renders:** `<a href={to}>` with `onClick` preventing default and calling `navigate(to, { replace })`.

**Prefetching:** On `onMouseEnter` and `onFocus`, calls `preloadRoute(to)` if `prefetch` is true.

**Requirement:** Must be used inside a `<Router>` — calls `useRouter()` internally (throws if outside).

### `useRouter()` Hook

```ts
import { useRouter } from 'manicjs/router';

const { path, navigate, params } = useRouter();
```

**Returns: `RouterContextValue`**

| Property   | Type                                                    | Description                                         |
| ---------- | ------------------------------------------------------- | --------------------------------------------------- |
| `path`     | `string`                                                | Current URL pathname (e.g. `"/blog/hello"`)         |
| `navigate` | `(to: string, options?: { replace?: boolean }) => void` | Navigate to a new path                              |
| `params`   | `Record<string, string>`                                | Dynamic route parameters (e.g. `{ slug: "hello" }`) |

**Throws:** `Error('useRouter must be used within a <Router>')` if called outside Router context.

### `useQueryParams()` Hook

```ts
import { useQueryParams } from 'manicjs/router';

const params = useQueryParams();
const q = params.get('q');
const page = params.get('page');
```

**Returns:** `URLSearchParams` — the current `window.location.search` parsed.

**Reactivity:** Listens to `popstate` events and re-renders with new params. Does NOT re-render on `pushState`/`replaceState` — only on back/forward navigation.

### `navigate()` Function

```ts
import { navigate } from 'manicjs/router';

navigate('/dashboard');
navigate('/settings', { replace: true });
```

**Signature:** `navigate(to: string, options?: { replace?: boolean }): void`

**Behavior:**

- Delegates to `window.__MANIC_NAVIGATE__` which is set by the `<Router>` component.
- If Router is not mounted, this is a no-op.
- Loads the target component before updating the URL.
- If View Transitions enabled: wraps state update in `document.startViewTransition`.
- If `replace: true`: uses `history.replaceState` instead of `pushState`.

**Works outside React:** Can be called from event handlers, timers, or any JavaScript context.

### `preloadRoute()` Function

```ts
import { preloadRoute } from 'manicjs/router';

preloadRoute('/about');
```

**Signature:** `preloadRoute(path: string): void`

**Behavior:**

- Creates a temporary `RouteRegistry` from `window.__MANIC_ROUTES__`.
- Matches the path to find the loader function.
- Calls the loader (`import()`) and stores the result in the component cache.
- If the component is already cached, does nothing.
- Fire-and-forget — no return value, no error handling.

### `setViewTransitions()` Function

```ts
import { setViewTransitions } from 'manicjs/router';

setViewTransitions(false); // Disable globally
setViewTransitions(true); // Re-enable
```

**Signature:** `setViewTransitions(enabled: boolean): void`

**Scope:** Global. Affects all `navigate()` calls.

**Default:** `true` (enabled).

### `RouterContext`

```ts
import { RouterContext } from 'manicjs/router';

// For testing:
<RouterContext.Provider value={{ path: '/test', navigate: jest.fn(), params: {} }}>
  <MyComponent />
</RouterContext.Provider>
```

**Type:** `React.Context<RouterContextValue | null>`

### Types

```ts
import type { RouteDef, RouterContextValue } from 'manicjs/router';

interface RouteDef {
  path: string; // URL pattern like "/blog/:slug"
  component: ComponentType | null; // Resolved component or null if lazy
  loader?: () => Promise<{ default: ComponentType }>; // Lazy loader function
}

interface RouterContextValue {
  path: string; // Current pathname
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>; // Dynamic route params
}
```

### `RouteRegistry` Class (Internal)

```ts
import { RouteRegistry } from 'manicjs/router/lib/matcher'; // Internal, not exported from barrel
```

**Constructor:** `new RouteRegistry(routes?: RouteDef[])`

**Methods:**

| Method     | Signature                                   | Description                                          |
| ---------- | ------------------------------------------- | ---------------------------------------------------- |
| `register` | `(def: RouteDef): void`                     | Add a route. Deduplicates by path.                   |
| `match`    | `(currentPath: string): RouteMatch \| null` | Match a URL path. Sorts routes on first call (lazy). |

**`RouteMatch` type:**

```ts
interface RouteMatch {
  path: string; // The matched route pattern
  component: ComponentType | null; // Component (or null if lazy)
  params: Record<string, string>; // Extracted parameters
}
```

**Scoring system:**

| Segment Type | Points | Example                   |
| ------------ | ------ | ------------------------- |
| Static       | 100    | `/about`                  |
| Dynamic      | 10     | `/:id`, `/[id]`           |
| Catch-all    | 1      | `/:...slug`, `/[...slug]` |

Higher score wins. Ties broken by path length (longer wins).

**Supported patterns:**

```
/                          → exact match
/about                     → static segment
/blog/:slug                → dynamic parameter (colon syntax)
/blog/[slug]               → dynamic parameter (bracket syntax)
/docs/:...path             → catch-all (colon syntax, captures rest of URL)
/docs/[...path]            → catch-all (bracket syntax)
/blog/:category/:slug      → multiple dynamic segments
```

### `matchRoute()` Function (Internal, Legacy)

```ts
import { matchRoute } from 'manicjs/router/lib/matcher';

const result = matchRoute('/blog/hello', routeDefs);
```

**Signature:** `matchRoute(currentPath: string, routes: RouteDef[]): RouteMatch | null`

Creates a new `RouteRegistry` per call. Exists for backwards compatibility. Not exported from any public barrel.

---

## 32. Complete API Reference — `manicjs/server`

Source: `packages/manic/src/server/index.ts`

### `createManicServer(options)`

```ts
import { createManicServer } from 'manicjs/server';

const server = await createManicServer({
  html: app,
  config: myConfig,
  routes: myRoutes,
  envKeys: ['MY_KEY'],
  startTime: performance.now(),
});
```

**Signature:** `createManicServer(options: CreateManicServerOptions): Promise<Server>`

**Options:**

| Option      | Type          | Default             | Description                                                                                                                  |
| ----------- | ------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `html`      | `any`         | _required_          | HTML shell. Can be a string, a Bun HTMLBundle (from `import app from './app/index.html'`), or a function returning a string. |
| `config`    | `ManicConfig` | auto-loaded         | If not provided, calls `loadConfig()` automatically.                                                                         |
| `routes`    | `RouteInfo[]` | auto-discovered     | If not provided, calls `discoverRoutes()`.                                                                                   |
| `envKeys`   | `string[]`    | `[]`                | List of loaded env var keys (for console display).                                                                           |
| `startTime` | `number`      | `performance.now()` | Start time for "Ready in Xms" display.                                                                                       |

**Returns:** The `Bun.serve()` server instance.

**Internal Flow:**

1. Loads config and discovers routes (in parallel if not provided).
2. Detects HTMLBundle vs string HTML.
3. Sets up `serveHtml()` function with:
   - Link header injection
   - Markdown content negotiation (`Accept: text/markdown`)
   - Agent mode (`?mode=agent`)
4. If HTMLBundle in dev: creates nonce route for catch-all proxy.
5. Registers page routes in `bunRoutes` object.
6. If fullstack mode: loads API routes, registers `/api/*`, `/openapi.json`, `/.well-known/api-catalog`.
7. Adds RFC 8288 Link headers.
8. Runs plugin `configureServer` hooks.
9. Starts `Bun.serve()`.
10. In dev: starts route file watcher.
11. Logs server info.

**Built-in Routes:**

| Route                      | Method | Description                                                       |
| -------------------------- | ------ | ----------------------------------------------------------------- |
| `/_manic/open`             | GET    | Opens file in editor. Params: `file`, `line`, `column`. Dev only. |
| `/assets/*`                | GET    | Static file serving from `assets/` directory.                     |
| `/api/*`                   | ALL    | Hono API routes (fullstack mode only).                            |
| `/openapi.json`            | GET    | Auto-generated OpenAPI 3.0.0 spec (fullstack only).               |
| `/.well-known/api-catalog` | GET    | RFC 9727 API catalog (fullstack only).                            |
| `/*`                       | GET    | SPA catch-all. Returns HTML shell for client-side routing.        |

**Cache Headers:**

| Context                  | Header Value                            |
| ------------------------ | --------------------------------------- |
| Production static assets | `public, max-age=31536000, immutable`   |
| Production `/assets/*`   | `public, max-age=3600, must-revalidate` |
| Dev static files         | `no-cache, no-store, must-revalidate`   |

### `serveHtml()` Internal Function

Handles three response modes:

**1. Standard HTML:**
Returns the HTML shell with `Content-Type: text/html; charset=utf-8` and Link headers.

**2. Markdown (when `Accept: text/markdown`):**
Converts HTML to markdown via `htmlToMarkdown()`. Returns:

- `Content-Type: text/markdown; charset=utf-8`
- `Vary: Accept`
- `x-markdown-tokens: <count>` (estimated at ~4 chars/token)

**3. Agent mode (when `?mode=agent`):**
Returns JSON:

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

With `Access-Control-Allow-Origin: *`.

---

## 33. Complete API Reference — `manicjs/config`

Source: `packages/manic/src/config/index.ts`

### `defineConfig(config)`

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  /* ... */
});
```

**Signature:** `defineConfig(config: ManicConfig): ManicConfig`

Identity function. Returns the config unchanged. Exists solely for TypeScript autocomplete in `manic.config.ts`.

### `loadConfig(cwd?)`

```ts
import { loadConfig } from 'manicjs/config';

const config = await loadConfig();
const config2 = await loadConfig('/other/path');
```

**Signature:** `loadConfig(cwd?: string): Promise<ManicConfig>`

**Behavior:**

1. Returns cached config if already loaded (singleton pattern).
2. Tries `manic.config.ts` first, then `manic.config.js`.
3. Uses `import()` to load the config file.
4. Accepts both `export default` and named exports.
5. Deep merges user config with `DEFAULT_CONFIG` (one level deep — spread per section).
6. Caches the result.

**Default values when no config file exists:**

```ts
{
  mode: 'fullstack',
  app: { name: 'Manic App' },
  server: { port: 6070, hmr: true },
  router: { viewTransitions: true, preserveScroll: false, scrollBehavior: 'auto' },
  build: { minify: true, sourcemap: 'inline', splitting: true, outdir: '.manic' },
  oxc: { target: 'esnext', rewriteImportExtensions: true, refresh: true },
}
```

### `getConfig()`

```ts
import { getConfig } from 'manicjs/config'; // Not exported from barrel — internal use
```

**Signature:** `getConfig(): ManicConfig`

Synchronous. Returns cached config or defaults. Must call `loadConfig()` first for user config to be available. Used internally by the OXC plugin during build.

### Complete `ManicConfig` Interface

```ts
interface ManicConfig {
  /** "fullstack" = Hono API + SPA, "frontend" = SPA only */
  mode?: 'fullstack' | 'frontend';

  app?: {
    /** Shown in logs, browser title, OpenAPI spec title */
    name?: string;
  };

  server?: {
    /** Dev and prod server port. Override with $PORT env var. @default 6070 */
    port?: number;
    /** Enable HMR websocket in dev. @default true */
    hmr?: boolean;
  };

  router?: {
    /** Use View Transitions API for navigate(). @default true */
    viewTransitions?: boolean;
    /** Preserve scroll on navigation. @default false — DECLARED BUT NOT IMPLEMENTED */
    preserveScroll?: boolean;
    /** Scroll behavior. @default "auto" — DECLARED BUT NOT IMPLEMENTED */
    scrollBehavior?: 'auto' | 'smooth';
  };

  build?: {
    /** Minify with oxc-minify. @default true */
    minify?: boolean;
    /** Sourcemaps. @default "inline" — DECLARED BUT NOT READ BY BUILD */
    sourcemap?: boolean | 'inline' | 'external';
    /** Code splitting via route chunks. @default true — DECLARED BUT NOT READ BY BUILD */
    splitting?: boolean;
    /** Build output directory. @default ".manic" */
    outdir?: string;
  };

  /** Sitemap generation. Set false to disable. */
  sitemap?: SitemapConfig | false;

  oxc?: {
    /** ES target for OXC transform. @default "esnext" in dev, "es2022" in prod */
    target?: string;
    /** Rewrite .ts/.tsx import extensions. @default true */
    rewriteImportExtensions?: boolean;
    /** React Fast Refresh in dev. @default true */
    refresh?: boolean;
  };

  /** Deployment adapters. @see @manicjs/providers */
  providers?: ManicProvider[];

  /** Framework extension plugins. */
  plugins?: ManicPlugin[];
}
```

### `ManicPlugin` Interface

```ts
interface ManicPlugin {
  /** Unique plugin identifier */
  name: string;

  /** Called during dev server startup, before Bun.serve() */
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;

  /** Called during production build, after client bundling */
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}
```

### `ManicPluginContext` Interface (Base)

```ts
interface ManicPluginContext {
  /** Resolved framework config */
  config: ManicConfig;

  /** Discovered page routes */
  pageRoutes: PageRoute[];

  /** Discovered API routes */
  apiRoutes: ApiRoute[];

  /** true if NODE_ENV=production */
  prod: boolean;

  /** process.cwd() */
  cwd: string;

  /** Build output directory name (e.g. ".manic") */
  dist: string;
}
```

### `ManicServerPluginContext` Interface

```ts
interface ManicServerPluginContext extends ManicPluginContext {
  /** Register a route handler. Dev only unless also emitted in build(). */
  addRoute(
    path: string,
    handler: (req: Request) => Response | Promise<Response>
  ): void;

  /** Add an RFC 8288 Link header to all HTML page responses. */
  addLinkHeader(value: string): void;
}
```

**`addRoute` details:**

- `path`: URL path pattern (e.g. `"/my-endpoint"`, `"/.well-known/something"`).
- `handler`: Receives raw `Request`, must return `Response`. NOT a Hono handler — no `c` context object.
- Routes registered here are added to the `Bun.serve({ routes })` object.

**`addLinkHeader` details:**

- `value`: Full Link header value (e.g. `'</sitemap.xml>; rel="describedby"; type="application/xml"'`).
- Appended to array. All values joined with `', '` in the response header.

### `ManicBuildPluginContext` Interface

```ts
interface ManicBuildPluginContext extends ManicPluginContext {
  /** Write a static file to the client output directory. */
  emitClientFile(
    relativePath: string,
    content: string | Uint8Array
  ): Promise<void>;
}
```

**`emitClientFile` details:**

- `relativePath`: Relative to `.manic/client/`. E.g. `"sitemap.xml"`, `".well-known/mcp.json"`.
- Creates parent directories automatically.
- All providers copy `.manic/client/` to their static output — so emitted files are automatically deployed.

### `PageRoute` Interface

```ts
interface PageRoute {
  /** URL path pattern (e.g. "/", "/blog/:slug") */
  path: string;
  /** Source file path relative to cwd (e.g. "app/routes/blog/[slug].tsx") */
  filePath: string;
  /** true if path contains ":" (dynamic segment) */
  dynamic: boolean;
}
```

### `ApiRoute` Interface

```ts
interface ApiRoute {
  /** Mount path under /api (e.g. "/api/hello") */
  mountPath: string;
  /** Source file path */
  filePath: string;
}
```

### `ManicProvider` Interface

```ts
interface ManicProvider {
  /** Provider identifier (e.g. "vercel", "cloudflare") */
  name: string;
  /** Transform build output for this platform */
  build(context: BuildContext): Promise<void>;
}
```

### `BuildContext` Interface (Provider)

```ts
interface BuildContext {
  /** Build output directory (e.g. ".manic") */
  dist: string;
  /** Resolved framework config */
  config: ManicConfig;
  /** Original API entry source paths (e.g. ["app/api/hello/index.ts"]) */
  apiEntries: string[];
  /** Client build directory (e.g. ".manic/client") */
  clientDir: string;
  /** Server entry file (e.g. ".manic/server.js") */
  serverFile: string;
}
```

### `SitemapConfig` Interface

```ts
interface SitemapConfig {
  /** Base URL (e.g. "https://example.com") */
  hostname: string;
  /** @default "weekly" */
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  /** @default 0.8 */
  priority?: number;
  /** Routes to exclude (e.g. ["/admin"]) */
  exclude?: string[];
}
```

---

## 34. Complete API Reference — `manicjs/theme`

Source: `packages/manic/src/theme/index.ts`

### `ThemeProvider` Component

```tsx
import { ThemeProvider } from 'manicjs/theme';

<ThemeProvider>{children}</ThemeProvider>;
```

**Props:**

| Prop       | Type        | Description |
| ---------- | ----------- | ----------- |
| `children` | `ReactNode` | App content |

**Behavior:**

- Reads initial theme from `localStorage('manic-theme')`. Defaults to `'system'`.
- Applies `dark` class on `document.documentElement` if resolved theme is dark.
- Subscribes to `window.matchMedia('(prefers-color-scheme: dark)')` change events.
- When theme is `'system'`, automatically follows OS preference.
- Provides `ThemeContextValue` via React context.

### `useTheme()` Hook

```ts
import { useTheme } from 'manicjs/theme';

const { theme, resolvedTheme, setTheme, toggle, isDark, isLight } = useTheme();
```

**Returns: `ThemeContextValue`**

| Property        | Type                                             | Description                                     |
| --------------- | ------------------------------------------------ | ----------------------------------------------- |
| `theme`         | `'light' \| 'dark' \| 'system'`                  | Stored user preference                          |
| `resolvedTheme` | `'light' \| 'dark'`                              | Actual applied theme (never `'system'`)         |
| `setTheme`      | `(theme: 'light' \| 'dark' \| 'system') => void` | Set theme preference. Persists to localStorage. |
| `toggle`        | `() => void`                                     | Toggle between light and dark (ignores system)  |
| `isDark`        | `boolean`                                        | `resolvedTheme === 'dark'`                      |
| `isLight`       | `boolean`                                        | `resolvedTheme === 'light'`                     |

**Throws:** `Error('useTheme must be used within a ThemeProvider')` if called outside.

**Storage key:** `"manic-theme"` in `localStorage`.

### `ThemeToggle` Component

```tsx
import { ThemeToggle } from 'manicjs/theme';

// Default (emoji):
<ThemeToggle />  // Shows ☀️ in dark mode, 🌙 in light mode

// Custom render:
<ThemeToggle className="btn" style={{ padding: 8 }}>
  {(resolvedTheme) => resolvedTheme === 'dark' ? '☀️' : '🌙'}
</ThemeToggle>
```

**Props:**

| Prop        | Type                                                     | Default        | Description                |
| ----------- | -------------------------------------------------------- | -------------- | -------------------------- |
| `className` | `string`                                                 | `undefined`    | CSS class for the button   |
| `style`     | `CSSProperties`                                          | `undefined`    | Inline styles              |
| `children`  | `ReactNode \| ((theme: 'light' \| 'dark') => ReactNode)` | emoji fallback | Content or render function |

**Renders:** `<button>` with `onClick={toggle}` and `aria-label` toggling between "Switch to light mode" / "Switch to dark mode".

### `initTheme()` Function

```ts
import { initTheme } from 'manicjs/theme';
```

**Signature:** `initTheme(): void`

Applies the stored theme immediately. Runs automatically as a module side-effect when the theme module is imported. Prevents flash of wrong theme before React mounts.

**Auto-invocation:** The module has `if (typeof window !== 'undefined') { initTheme(); }` at the bottom.

---

## 35. Complete API Reference — `manicjs/transitions`

Source: `packages/manic/src/transitions/index.ts`

### `ViewTransitions` Object

```tsx
import { ViewTransitions } from 'manicjs/transitions';

<ViewTransitions.div name="hero" className="card">content</ViewTransitions.div>
<ViewTransitions.img name="avatar" src="/pic.jpg" alt="Avatar" />
```

**Available elements:**

`div`, `span`, `main`, `section`, `article`, `header`, `footer`, `nav`, `aside`, `h1`, `h2`, `h3`, `p`, `img`, `button`, `a`, `ul`, `li`

**Props (all elements):**

| Prop        | Type                          | Description                                         |
| ----------- | ----------------------------- | --------------------------------------------------- |
| `name`      | `string`                      | _required_ — Sets `viewTransitionName` CSS property |
| `children`  | `ReactNode`                   | Element content                                     |
| `className` | `string`                      | CSS class                                           |
| `style`     | `CSSProperties`               | Merged with `{ viewTransitionName: name }`          |
| `...rest`   | `HTMLAttributes<HTMLElement>` | Any standard HTML attribute                         |

**Re-exports:**

```ts
export { navigate, setViewTransitions } from '../router/lib/Router';
```

**Alternative (no component needed):**

```tsx
<div style={{ viewTransitionName: 'my-element' }}>content</div>
```

---

## 36. Complete API Reference — `manicjs/env`

Source: `packages/manic/src/env/client.ts`

### `getEnv(key)`

```ts
import { getEnv } from 'manicjs/env';

const apiUrl = getEnv('MANIC_PUBLIC_API_URL');
const dbUrl = getEnv('DATABASE_URL'); // Server only — warns on client
```

**Signature:** `getEnv(key: string): string | undefined`

**Client behavior:**

- If key doesn't start with `MANIC_PUBLIC_`, logs `console.warn` and returns `undefined`.
- Reads from `window.__MANIC_ENV__` (currently not injected by the framework — see known issues).

**Server behavior:**

- Reads from `process.env[key]` directly. Any key works.

### `getPublicEnv()`

```ts
import { getPublicEnv } from 'manicjs/env';

const env = getPublicEnv();
// { MANIC_PUBLIC_API_URL: "...", MANIC_PUBLIC_GA_ID: "..." }
```

**Signature:** `getPublicEnv(): Record<string, string>`

**Client:** Returns `window.__MANIC_ENV__` or empty object.

**Server:** Filters `process.env` for keys starting with `MANIC_PUBLIC_`.

### Globals

```ts
declare global {
  interface Window {
    __MANIC_ENV__?: Record<string, string>;
  }
}
```

---

## 37. Complete API Reference — `manicjs/client`

Source: `packages/manic/src/config/client.ts`

### `createClient<T>(baseUrl?)`

```ts
import { createClient } from 'manicjs/client';
import type { AppType } from './app/api/hello/index'; // Your Hono route type

const client = createClient<AppType>();
const res = await client.api.hello.$get();
```

**Signature:** `createClient<T>(baseUrl?: string): ReturnType<typeof hc<T>>`

**Default `baseUrl`:**

- Browser: `window.location.origin`
- Server: `'http://localhost:6070'`

**Uses:** `hc` from `hono/client` — Hono's type-safe RPC client.

---

## 38. Complete API Reference — `manicjs/plugins`

Source: `packages/manic/src/plugins/`

### `apiLoaderPlugin(apiDir?)`

```ts
import { apiLoaderPlugin } from 'manicjs/plugins';

const { app, routes, openApiSpec } = await apiLoaderPlugin('app/api');
```

**Signature:** `apiLoaderPlugin(apiDir?: string): Promise<{ app: Hono, routes: string[], openApiSpec: object }>`

**Parameters:**

| Param    | Type     | Default     | Description                           |
| -------- | -------- | ----------- | ------------------------------------- |
| `apiDir` | `string` | `'app/api'` | Directory to scan for API route files |

**Returns:**

| Property      | Type       | Description                                                       |
| ------------- | ---------- | ----------------------------------------------------------------- |
| `app`         | `Hono`     | Hono instance with basePath `/api` and all routes mounted         |
| `routes`      | `string[]` | List of mounted route paths (e.g. `["/api/hello", "/api/users"]`) |
| `openApiSpec` | `object`   | Minimal OpenAPI 3.0.0 spec object                                 |

**Route scanning:**

- Uses `Bun.Glob('**/*.{ts,tsx,js}')` to find all files.
- Converts file paths to route paths: `hello/index.ts` → `/hello`, `users/[id].ts` → `/users/:id`.
- Supports both Hono instances (detected by `.fetch` method) and plain functions.
- Mounts Hono instances via `app.route()`. Wraps plain functions with `app.all()`.

**OpenAPI spec generation:**

- Creates one GET entry per route path.
- Converts `:param` to `{param}` in paths.
- Only registers GET — does not detect actual HTTP methods.

### `fileImporterPlugin(publicDir?)`

```ts
import { fileImporterPlugin } from 'manicjs/plugins';

const staticApp = fileImporterPlugin('public');
```

**Signature:** `fileImporterPlugin(publicDir?: string): Hono`

**Parameters:**

| Param       | Type     | Default    | Description                          |
| ----------- | -------- | ---------- | ------------------------------------ |
| `publicDir` | `string` | `'public'` | Directory to serve static files from |

**Returns:** A Hono instance with `serveStatic` middleware from `hono/bun`.

**Note:** Currently unused by the framework. The server handles static files directly.

---

## 39. Complete API Reference — Server Internals

### `discoverRoutes(routesDir?)`

```ts
import { discoverRoutes } from 'manicjs/server'; // Internal — not in public exports
```

**Source:** `packages/manic/src/server/lib/discovery.ts`

**Signature:** `discoverRoutes(routesDir?: string): Promise<RouteInfo[]>`

**Default:** `routesDir = 'app/routes'`

**Behavior:**

- Scans with `Bun.Glob('**/*.{tsx,ts}')`.
- Skips files starting with `~`.
- Converts file paths to URL paths:
  - `index.tsx` → `/`
  - `about.tsx` → `/about`
  - `blog/index.tsx` → `/blog`
  - `blog/[slug].tsx` → `/blog/:slug`
  - `docs/[...path].tsx` → `/docs/:...path`
  - `(admin)/dashboard.tsx` → `/dashboard` (route groups stripped)

**Returns:** `RouteInfo[]`

```ts
interface RouteInfo {
  path: string; // URL path (e.g. "/blog/:slug")
  filePath: string; // Source file (e.g. "app/routes/blog/[slug].tsx")
}
```

### `discoverFavicon(assetsDir?)`

**Signature:** `discoverFavicon(assetsDir?: string): Promise<string | null>`

**Default:** `assetsDir = 'assets'`

**Priority order:** `favicon.svg` → `favicon.png` → `favicon.ico` → `icon.svg` → `icon.png` → `icon.ico`

**Returns:** Path like `/assets/favicon.svg` or `null`.

### `discoverErrorPages(routesDir?)`

**Signature:** `discoverErrorPages(routesDir?: string): Promise<ErrorPages>`

**Default:** `routesDir = 'app/routes'`

**Checks for:**

- `app/routes/~404.tsx` → custom 404 page
- `app/routes/~500.tsx` → custom error page

**Returns:**

```ts
interface ErrorPages {
  notFound?: string; // File path to custom 404 page
  error?: string; // File path to custom error page
}
```

### `generateRoutesManifest(routesDir?)`

**Signature:** `generateRoutesManifest(routesDir?: string): Promise<string>`

**Returns:** TypeScript source code string like:

```ts
export const routes = {
  '/': () => import('./routes/index.tsx'),
  '/about': () => import('./routes/about.tsx'),
};

export const notFoundPage = () => import('./routes/~404.tsx');
export const errorPage = undefined;
```

### `writeRoutesManifest(outPath?, touch?)`

**Signature:** `writeRoutesManifest(outPath?: string, touch?: boolean): Promise<string>`

**Default:** `outPath = 'app/~routes.generated.ts'`

**Behavior:**

1. Calls `generateRoutesManifest()`.
2. Writes to `outPath`.
3. If `touch` is true: appends timestamp comment to `~manic.ts` to trigger Bun's `--watch` restart.

### `watchRoutes(routesDir, onChange)`

**Signature:** `watchRoutes(routesDir: string, onChange: (filename?: string, duration?: number) => void): Promise<void>`

**Behavior:**

- Uses `fs/promises watch()` with `{ recursive: true }`.
- Filters for `.tsx`/`.ts` files not starting with `~`.
- On `rename` events (file add/delete): regenerates manifest with touch.
- Debounced at 50ms.
- Runs until process exit.

### `generateSitemap(routes, config)`

**Signature:** `generateSitemap(routes: RouteInfo[], config: { hostname, changefreq?, priority?, exclude? }): string`

**Returns:** XML string. Filters out dynamic routes (containing `:`).

### `htmlToMarkdown(html)`

**Source:** `packages/manic/src/server/lib/markdown.ts`

**Signature:** `htmlToMarkdown(html: string): string`

**Converts:**

- `<h1>` → `# `, `<h2>` → `## `, etc.
- `<p>` → double newline wrapped text
- `<strong>`, `<b>` → `**bold**`
- `<em>`, `<i>` → `*italic*`
- `<code>` → `` `code` ``
- `<pre><code>` → fenced code blocks
- `<blockquote>` → `> ` prefixed lines
- `<a href="...">text</a>` → `[text](...)`
- `<img src="..." alt="...">` → `![alt](src)`
- `<ul><li>` → `- ` list items
- `<ol><li>` → `1. ` numbered items
- `<hr>` → `---`
- Strips: `<script>`, `<style>`, `<noscript>`, `<svg>`, `<head>` entirely
- Decodes: `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`
- Collapses 3+ consecutive newlines to 2.

### `estimateTokens(text)`

**Signature:** `estimateTokens(text: string): number`

**Returns:** `Math.ceil(text.length / 4)` — rough estimate of LLM tokens.

### `prefersMarkdown(req)`

**Signature:** `prefersMarkdown(req: Request): boolean`

**Returns:** `true` if the `Accept` header contains `text/markdown`.

---

## 40. Complete API Reference — CLI

Source: `packages/manic/src/cli/`

### All Commands

| Command        | Function                     | File                 | Args                       |
| -------------- | ---------------------------- | -------------------- | -------------------------- |
| `manic dev`    | `dev({ port?, network? })`   | `commands/dev.ts`    | `--port PORT`, `--network` |
| `manic build`  | `build()`                    | `commands/build.ts`  | none                       |
| `manic start`  | `start({ port?, network? })` | `commands/start.ts`  | `--port PORT`, `--network` |
| `manic deploy` | `deploy()`                   | `commands/deploy.ts` | `--run` / `-r`             |
| `manic lint`   | `lint()`                     | `commands/lint.ts`   | none                       |
| `manic fmt`    | `fmt()`                      | `commands/fmt.ts`    | none                       |

### Global Options

| Flag                     | Description                                 |
| ------------------------ | ------------------------------------------- |
| `-h`, `--help`           | Show help text                              |
| `-v`, `--version`        | Show version (currently hardcoded `v0.6.0`) |
| `-p PORT`, `--port PORT` | Override server port (dev, start)           |
| `--network`              | Bind to `0.0.0.0` (dev only)                |

### `manic dev`

```bash
manic dev
manic dev --port 3000
manic dev --network
```

**Implementation:** Spawns `bun --watch ~manic.ts` with env vars `PORT`, `HOST`, `NETWORK`.

**Port resolution order:** CLI `--port` → `config.server.port` → `6070`.

**Host:** `'localhost'` by default, `'0.0.0.0'` with `--network`.

**Cleanup:** Kills child process on `SIGINT`/`SIGTERM`.

### `manic build`

```bash
manic build
```

**Steps (in order):**

1. Load config
2. Run `oxlint` — fail build if lint errors
3. Delete and recreate output directory
4. Write route manifest
5. Resolve `app/main.tsx` entry via `oxc-resolver`
6. Client bundle (`Bun.build`, browser target)
7. Transform `app/index.html` (replace asset references with hashed filenames)
8. Copy `assets/` to output
9. Run plugin `build()` hooks
10. Bundle API routes (each separately, `bun` target)
11. Write `.well-known/api-catalog` JSON
12. Transform and bundle server entry (`~manic.ts`)
13. Minify all JS files with `oxc-minify` (parallel)
14. Print build stats (sizes, routes, time)
15. Run provider `build()` hooks

**Exit codes:** `1` on lint failure, missing entry, or build failure.

### `manic start`

```bash
manic start
manic start --port 8080
```

**Implementation:** Spawns `bun .manic/server.js` with `NODE_ENV=production`.

**Checks:** Exits with error if `.manic/server.js` doesn't exist.

### `manic deploy`

```bash
manic deploy        # Shows commands but doesn't run them
manic deploy --run  # Actually runs the deploy commands
```

**Behavior:**

1. Checks providers in config. Exits if none configured.
2. Builds if output directory doesn't exist.
3. For each provider, shows the deploy command:
   - **vercel**: `bunx vercel deploy`
   - **cloudflare**: `bunx wrangler pages deploy dist --project-name <name>`
   - **netlify**: `bunx netlify deploy --prod`
4. If `--run`/`-r` flag: executes the commands.
5. Generates platform config files if missing (`vercel.json`, `netlify.toml`).

### `manic lint`

```bash
manic lint
```

**Implementation:** Spawns `bun x oxlint --config .oxlintrc.json .`

### `manic fmt`

```bash
manic fmt
```

**Implementation:** Spawns `bun x oxfmt -c .oxfmt.json .`

---

## 41. Complete API Reference — Plugin Packages

### `@manicjs/api-docs` (v0.6.0)

```ts
import { apiDocs } from '@manicjs/api-docs';
```

**`apiDocs(options?)`**

| Option    | Type     | Default           | Description                |
| --------- | -------- | ----------------- | -------------------------- |
| `path`    | `string` | `"/docs"`         | Mount path for the docs UI |
| `specUrl` | `string` | `"/openapi.json"` | OpenAPI spec URL           |
| `theme`   | `string` | `"default"`       | Scalar theme name          |

**configureServer:** Creates a Hono sub-app, registers Scalar API reference via `@scalar/hono-api-reference`. Registers `path` and `path/*` routes.

**build:** None (no build hook). Production docs are inlined by providers.

**Dependencies:** `@scalar/hono-api-reference`, `hono`.

**Peer deps:** `manicjs >= 0.7.4`.

---

### `@manicjs/seo` (v0.5.0)

```ts
import { seo } from '@manicjs/seo';
```

**`seo(config)`**

| Option           | Type           | Default                              | Description                             |
| ---------------- | -------------- | ------------------------------------ | --------------------------------------- |
| `hostname`       | `string`       | _required_                           | Base URL (e.g. `"https://example.com"`) |
| `rules`          | `RobotRule[]`  | `[{ userAgent: '*', allow: ['/'] }]` | Robot crawl rules                       |
| `sitemaps`       | `string[]`     | `[]`                                 | Additional sitemap URLs for robots.txt  |
| `autoSitemap`    | `boolean`      | `true`                               | Auto-add `/sitemap.xml` to robots.txt   |
| `linkHeaders`    | `LinkHeader[]` | `[]`                                 | Extra RFC 8288 Link headers             |
| `contentSignals` | `object`       | `undefined`                          | Content-Signal directives               |

**`RobotRule` interface:**

```ts
interface RobotRule {
  userAgent: string; // e.g. "*", "Googlebot"
  allow?: string[]; // Paths to allow
  disallow?: string[]; // Paths to disallow
  crawlDelay?: number; // Seconds between crawls
}
```

**`LinkHeader` interface:**

```ts
interface LinkHeader {
  href: string; // URL
  rel: string; // Link relation type
  type?: string; // MIME type
}
```

**`contentSignals` options:**

```ts
contentSignals?: {
  'ai-train'?: 'yes' | 'no';  // Allow AI training on content
  search?: 'yes' | 'no';      // Allow search indexing
  'ai-input'?: 'yes' | 'no';  // Allow AI to use content as input
}
```

**configureServer:** Registers `/robots.txt` route. Adds Link headers for sitemap discovery and custom Link headers.

**build:** Emits `robots.txt` via `emitClientFile`.

**Generated robots.txt example:**

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml

Content-Signal: ai-train=no, search=yes, ai-input=yes
```

**Peer deps:** `manicjs >= 0.7.4`.

---

### `@manicjs/sitemap` (v0.6.0)

```ts
import { sitemap } from '@manicjs/sitemap';
```

**`sitemap(config)`**

| Option       | Type       | Default    | Description               |
| ------------ | ---------- | ---------- | ------------------------- |
| `hostname`   | `string`   | _required_ | Base URL                  |
| `changefreq` | `string`   | `'weekly'` | How often pages change    |
| `priority`   | `number`   | `0.8`      | URL priority (0.0 to 1.0) |
| `exclude`    | `string[]` | `[]`       | Route paths to exclude    |

**configureServer:** Generates XML from `ctx.pageRoutes`, registers `/sitemap.xml`.

**build:** Emits `sitemap.xml` via `emitClientFile`.

**Filters:** Excludes dynamic routes (containing `:`) and explicitly excluded paths.

**Generated XML example:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Peer deps:** `manicjs >= 0.7.4`.

---

### `@manicjs/mcp` (v0.5.0)

```ts
import { mcp, defineTool } from '@manicjs/mcp';
import type { McpTool, McpConfig } from '@manicjs/mcp';
```

**`mcp(config?)`**

| Option    | Type        | Default       | Description                  |
| --------- | ----------- | ------------- | ---------------------------- |
| `name`    | `string`    | `'manic-mcp'` | Server name in MCP responses |
| `version` | `string`    | `'1.0.0'`     | Server version               |
| `path`    | `string`    | `'/mcp'`      | Endpoint path                |
| `tools`   | `McpTool[]` | `[]`          | Additional custom tools      |

**Protocol:** MCP 2025-03-26, Streamable HTTP transport, JSON-RPC 2.0.

**Registered Routes (configureServer):**

| Route                                        | Description                                   |
| -------------------------------------------- | --------------------------------------------- |
| `{path}`                                     | Main MCP endpoint (GET/POST/DELETE/OPTIONS)   |
| `/.well-known/mcp.json`                      | MCP discovery document                        |
| `/.well-known/mcp/server-card.json`          | MCP server card                               |
| `/.well-known/agent-skills/index.json`       | Agent skills discovery                        |
| `/.well-known/agent-skills/use-mcp/SKILL.md` | Skill documentation                           |
| `/webmcp.js`                                 | Browser WebMCP registration script            |
| `/mcp/console`                               | Browser console log receiver (dev only)       |
| `/mcp/console.js`                            | Browser console log capture script (dev only) |

**Link Headers Added:**

```
</.well-known/mcp/server-card.json>; rel="mcp"; type="application/json"
</.well-known/mcp.json>; rel="mcp-discovery"; type="application/json"
</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"
```

**MCP Endpoint Methods:**

| HTTP Method | Accept Header       | Behavior                                         |
| ----------- | ------------------- | ------------------------------------------------ |
| `OPTIONS`   | any                 | CORS preflight response                          |
| `DELETE`    | any                 | Close session. Requires `Mcp-Session-Id` header. |
| `GET`       | `text/event-stream` | SSE keepalive stream (ping every 15s)            |
| `POST`      | `application/json`  | Process JSON-RPC request(s), return JSON         |
| `POST`      | `text/event-stream` | Process JSON-RPC, return SSE events              |

**JSON-RPC Methods:**

| Method                      | Params                | Response                                                                                         |
| --------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `initialize`                | none                  | `{ protocolVersion, capabilities: { tools: {} }, serverInfo }`. Returns `Mcp-Session-Id` header. |
| `notifications/initialized` | none                  | No response (202). Marks session as initialized.                                                 |
| `tools/list`                | none                  | `{ tools: [{ name, description, inputSchema }] }`                                                |
| `tools/call`                | `{ name, arguments }` | `{ content: [{ type: 'text', text: JSON.stringify(result) }] }`                                  |

**Default Tools:**

| Tool                    | Description                                 | Input                                |
| ----------------------- | ------------------------------------------- | ------------------------------------ |
| `get_routes`            | Returns all page routes                     | none                                 |
| `get_api_routes`        | Returns all API routes                      | none                                 |
| `get_page_meta`         | Fetches page, extracts title/meta/canonical | `{ url: string }`                    |
| `get_rendered_elements` | Fetches page, returns element list          | `{ url: string, selector?: string }` |
| `get_console_logs`      | Browser console logs (dev only)             | `{ level?: string, limit?: number }` |

**`defineTool()` Function:**

```ts
import { defineTool } from '@manicjs/mcp';
import { z } from 'zod';

const myTool = defineTool('search', {
  description: 'Search the documentation',
  input: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().optional().describe('Max results'),
  }),
  execute: async ({ query, limit }) => {
    return { results: [], total: 0 };
  },
});
```

**Signature:** `defineTool<S extends ZodObject>(name: string, def: ToolDef<S>): McpTool`

**`ToolDef` type:**

```ts
type ToolDef<S extends ZodObject<ZodRawShape>> = {
  description: string;
  input: S; // Zod object schema
  execute(args: ZodInfer<S>): Promise<unknown> | unknown; // Handler
};
```

**Zod to JSON Schema conversion:**

- `ZodString` → `{ type: 'string' }`
- `ZodNumber` → `{ type: 'number' }`
- `ZodBoolean` → `{ type: 'boolean' }`
- `ZodArray` → `{ type: 'array' }`
- `ZodOptional` → field not in `required` array
- `.describe()` → `description` field

**Input validation:** Calls `schema.parse(args)` before executing. Throws Zod errors on invalid input.

**`McpTool` interface:**

```ts
interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  execute(args: Record<string, unknown>): Promise<unknown> | unknown;
}
```

**Console Log Capture (dev only):**

The `/mcp/console.js` script overrides `console.log/warn/error/info/debug` in the browser. Each call POSTs the log entry to `/mcp/console`. The `get_console_logs` tool returns captured entries.

Log entry format:

```ts
{ level: string; args: unknown[]; ts: number }
```

Max 200 entries stored in memory (FIFO).

**WebMCP Script (`/webmcp.js`):**

Generated JavaScript that uses `navigator.modelContext.registerTool()` to register all MCP tools in the browser. Each tool delegates to the MCP server via `fetch(endpoint, { method: 'POST', body: JSON-RPC })`.

**Peer deps:** `manicjs >= 0.7.4`, `zod >= 3.0.0 || >= 4.0.0`.

---

## 42. Complete API Reference — `@manicjs/providers`

Source: `packages/providers/`

### `vercel(options?)`

```ts
import { vercel } from '@manicjs/providers';
// or: import { vercel } from '@manicjs/providers/vercel';
```

| Option        | Type                                              | Default     | Description                      |
| ------------- | ------------------------------------------------- | ----------- | -------------------------------- |
| `runtime`     | `'bun' \| 'edge' \| 'nodejs20.x' \| 'nodejs22.x'` | `'bun'`     | Vercel function runtime          |
| `regions`     | `string[]`                                        | `undefined` | Deployment regions               |
| `memory`      | `number`                                          | `undefined` | Function memory (MB)             |
| `maxDuration` | `number`                                          | `undefined` | Max execution duration (seconds) |

**Output structure:**

```
.vercel/output/
  config.json                 # Vercel Build Output v3 config
  static/                     # Client files (copied from .manic/client/)
    index.html
    main-[hash].js
    assets/
  functions/
    api.func/
      .vc-config.json         # Function runtime config
      index.mjs               # Bundled API + middleware
      package.json            # { "type": "module" }
```

**Route config (`config.json`):**

```json
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/api/(.*)", "dest": "/api" },
    { "src": "/openapi.json", "dest": "/api" },
    { "src": "/docs(.*)", "dest": "/api" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Function bundling:** Raw source is written, then bundled with `Bun.build({ target: 'bun', minify: true })` to inline all dependencies (Hono, etc.).

### `cloudflare(options?)`

```ts
import { cloudflare } from '@manicjs/providers';
// or: import { cloudflare } from '@manicjs/providers/cloudflare';
```

| Option              | Type     | Default                 | Description                   |
| ------------------- | -------- | ----------------------- | ----------------------------- |
| `compatibilityDate` | `string` | `'2025-06-01'`          | Worker compatibility date     |
| `projectName`       | `string` | derived from `app.name` | Cloudflare Pages project name |

**Output structure:**

```
dist/
  index.html
  main-[hash].js
  assets/
  api/                       # Copied API bundles
  _worker.js                 # Hono worker (API + static fallback)
wrangler.toml
```

**Worker behavior:**

- API routes mounted on Hono with `/api` prefix.
- Static assets served via `c.env.ASSETS.fetch(req)`.
- 404 fallback: `c.env.ASSETS.fetch(new URL("/index.html", req.url))` (SPA catch-all).
- If no API routes and no API docs: uses `_redirects` file instead of worker.

**Falls back to `_redirects` when no API:**

```
/*    /index.html   200
```

### `netlify(options?)`

```ts
import { netlify } from '@manicjs/providers';
// or: import { netlify } from '@manicjs/providers/netlify';
```

| Option | Type      | Default | Description                                       |
| ------ | --------- | ------- | ------------------------------------------------- |
| `edge` | `boolean` | `false` | Use edge functions (Deno) vs serverless (Node.js) |

**Output structure:**

```
dist/                        # Static files
  index.html
  assets/
netlify/
  functions/
    api.mjs                  # Bundled serverless function
    package.json             # { "type": "module" }
```

**Function bundling:** `Bun.build({ target: 'node', format: 'esm', minify: true })`.

**netlify.toml generation:**

```toml
[build]
  command = "bun run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "none"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `agentMiddleware(ctx)` (Internal)

**Source:** `packages/providers/src/middleware.ts`

**Signature:** `agentMiddleware(ctx: BuildContext): string`

**Returns:** JavaScript code string to inject into provider workers. Contains:

- `htmlToMarkdown()` — lightweight HTML-to-markdown function
- `withAgentSupport(req, fetchAsset)` — middleware wrapper that:
  - Routes MCP requests to `_handleMcp()`
  - Handles `?mode=agent` JSON response
  - Handles `Accept: text/markdown` conversion
  - Adds Link headers to HTML responses
- `_handleMcp()` — complete MCP server (if MCP plugin configured)
- `_mcpTools` — hardcoded array of default tools
- `_mcpCallTool()` — tool execution (page scraping tools)

---

## 43. OXC Plugin (Build-Time Transform)

Source: `packages/manic/src/cli/plugins/oxc.ts`

### `oxcPlugin(isDev?)`

**Signature:** `oxcPlugin(isDev?: boolean): BunPlugin`

**Default:** `isDev = false`

**Intercepts:** Files matching `/\.(tsx?|jsx)$/` excluding `node_modules`.

**Transform options (via `oxc-transform` `transformSync`):**

| Option                               | Dev                                     | Prod          |
| ------------------------------------ | --------------------------------------- | ------------- |
| `target`                             | Config's `oxc.target` or `'esnext'`     | `'es2022'`    |
| `sourcemap`                          | `true`                                  | `false`       |
| `jsx.runtime`                        | `'automatic'`                           | `'automatic'` |
| `jsx.development`                    | `true`                                  | `false`       |
| `jsx.refresh`                        | Config's `oxc.refresh` (default `true`) | `false`       |
| `typescript.rewriteImportExtensions` | Config's value (default `true`)         | same          |
| `typescript.onlyRemoveTypeImports`   | `true`                                  | `true`        |

**HMR injection (dev only, tsx/jsx):**

```js
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.__react_refresh_library__?.performRefresh?.();
  });
}
```

---

## 44. Built-in Components

### `NotFound`

**Source:** `packages/manic/src/components/NotFound/index.tsx`

```tsx
import { NotFound } from 'manicjs';
```

**Props:** None.

**Renders:** Full-screen page with:

- `BlinkingAsciiDots` animated canvas background (Braille unicode characters with wave animation, mouse-reactive)
- Centered 404 message with illustration
- Reads `--theme-background` and `--theme-foreground` CSS variables
- Observes `<html>` class mutations for theme changes

### `BlinkingAsciiDots` (Internal)

**Source:** `packages/manic/src/components/NotFound/DotBackground.tsx`

**Props:**

| Prop             | Type     | Default | Description                       |
| ---------------- | -------- | ------- | --------------------------------- |
| `density`        | `number` | `0.5`   | Grid density (lower = fewer dots) |
| `animationSpeed` | `number` | `0.2`   | Wave animation speed              |

**Implementation:** Canvas-based animation using `requestAnimationFrame`. Uses Braille unicode characters (`⠁⠂⠄...`) with wave functions for organic movement. Mouse interaction increases wave amplitude near cursor.

### `ServerError`

**Source:** `packages/manic/src/components/ServerError/index.tsx`

```tsx
import { ServerError } from 'manicjs';

<ServerError error={new Error('Something broke')} />;
```

**Props:**

| Prop    | Type                 | Description             |
| ------- | -------------------- | ----------------------- |
| `error` | `Error \| undefined` | The caught error object |

**Features:**

- Full-screen dark overlay (`z-index: 99999`)
- Error name + message display
- Source code preview with syntax highlighting
- Source map resolution (inline + external `.map` files)
- VLQ decoder for source map segments
- Error line highlighted with red marker
- Syntax tokenizer (keywords, strings, comments, types, components, punctuation, numbers)
- Call stack with app vs library frame filtering
- "Copy for AI" button — formats error as markdown for LLM debugging
- "Open in editor" link via `/_manic/open?file=...&line=...&column=...`
- Click outside or press Esc to dismiss
- Manic logo SVG in footer

**Internal helpers:**

- `parseAllFrames(stack)` — parses various stack trace formats (`at fn (file:line:col)`, `fn — file:line:col`, etc.)
- `firstAppFrame(frames)` — finds first non-node_modules frame
- `resolveFrame(loc)` — fetches source file, resolves source map, returns source context
- `tokenize(code)` — simple regex-based syntax highlighter

**"Copy for AI" format:**

````markdown
# Error: TypeError

## Message

Cannot read property 'foo' of undefined

## Location

app/routes/index.tsx:15:3

## Source

```tsx
  14 | const data = response.data;
> 15 | console.log(data.foo);
  16 | return <div>{data}</div>;
```
````

## Stack

<full stack trace>
```

---

## 45. Window Globals

These globals are set/read by the framework at runtime:

| Global                         | Type                                                        | Set By             | Read By                      | Description                  |
| ------------------------------ | ----------------------------------------------------------- | ------------------ | ---------------------------- | ---------------------------- |
| `window.__MANIC_ROUTES__`      | `Record<string, () => Promise<{ default: ComponentType }>>` | `app/main.tsx`     | `Router` component           | Route manifest               |
| `window.__MANIC_ERROR_PAGES__` | `{ notFound?: LazyLoader, error?: LazyLoader }`             | `app/main.tsx`     | `Router` component           | Custom error page loaders    |
| `window.__MANIC_NAVIGATE__`    | `(to: string, options?) => void`                            | `Router` component | `navigate()`, `Link`         | Navigation function          |
| `window.__MANIC_ENV__`         | `Record<string, string>`                                    | NOT SET (gap)      | `getEnv()`, `getPublicEnv()` | Public environment variables |

**Type augmentation file (`app/manic.d.ts`):**

```ts
declare global {
  interface Window {
    __MANIC_ROUTES__?: Record<
      string,
      () => Promise<{ default: React.ComponentType }>
    >;
  }
}
export {};
```

Note: `__MANIC_ERROR_PAGES__` and `__MANIC_NAVIGATE__` are declared in `Router.tsx` but not in the user-facing `manic.d.ts` template.

---

## 46. Project Configuration Files

### Required in every Manic project:

**`~manic.ts`** — Server entry point:

```ts
import { createManicServer } from 'manicjs/server';
import app from './app/index.html';

const _server = await createManicServer({ html: app });
```

**`manic.config.ts`** — Framework config:

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  app: { name: 'My App' },
  server: { port: 6070 },
});
```

**`app/index.html`** — HTML shell:

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

Key points:

- `href="tailwindcss"` — magic string replaced by Bun's Tailwind plugin in dev, replaced with actual CSS filename in build.
- `src="./main.tsx"` — Bun processes this as a module, replaced with hashed filename in build.
- `<div id="root">` — React mount point.

**`app/main.tsx`** — React entry:

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

**`app/global.css`** — Tailwind entry:

```css
@import 'tailwindcss';
@source '../../node_modules/manicjs/src/**/*.tsx';
@source '../../node_modules/manicjs/src/**/*.ts';

@theme {
  --color-accent: #f15156;
  --color-background: var(--theme-background);
  --color-foreground: var(--theme-foreground);
}

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
  transition:
    background-color 0.3s,
    color 0.3s;
}

@view-transition {
  navigation: auto;
}
```

The `@source` directives tell Tailwind v4 to scan framework component source files for class names (needed for built-in components like NotFound, ServerError).

### Supporting config files:

**`bunfig.toml`**:

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

Enables Tailwind processing for Bun's static file serving in dev.

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react-jsx",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": { "@/*": ["app/*"] },
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true
  },
  "include": ["app/**/*", "~manic.ts", "manic.config.ts"],
  "exclude": ["node_modules", ".manic"]
}
```

Key: `"paths": { "@/*": ["app/*"] }` enables the `@/` import alias.

**`.oxlintrc.json`**:

```json
{
  "ignorePatterns": [
    "**/node_modules/**",
    "**/.manic/**",
    "**/dist/**",
    "**/build/**"
  ],
  "plugins": ["react", "react-hooks", "react-perf"],
  "categories": {
    "correctness": "error",
    "perf": "error",
    "suspicious": "error",
    "pedantic": "warn"
  },
  "rules": {
    "react/jsx-no-undef": "error",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-unused-vars": "warn",
    "max-lines-per-function": "off"
  }
}
```

**`.oxfmt.json`**:

```json
{
  "arrowParens": "avoid",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "endOfLine": "lf",
  "printWidth": 80,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false
}
```

**`.gitignore`**:

```
node_modules
.manic
.env
.env.local
.env.*.local
*.log
.DS_Store
.vercel
.env*.local
netlify
dist
wrangler
```

---

## 47. Routing Reference

### File-to-URL Mapping

| File Path                          | URL                 | Type                         |
| ---------------------------------- | ------------------- | ---------------------------- |
| `app/routes/index.tsx`             | `/`                 | Static                       |
| `app/routes/about.tsx`             | `/about`            | Static                       |
| `app/routes/blog/index.tsx`        | `/blog`             | Static                       |
| `app/routes/blog/[slug].tsx`       | `/blog/:slug`       | Dynamic                      |
| `app/routes/blog/[...path].tsx`    | `/blog/:...path`    | Catch-all                    |
| `app/routes/(admin)/dashboard.tsx` | `/dashboard`        | Route group (group stripped) |
| `app/routes/(admin)/settings.tsx`  | `/settings`         | Route group                  |
| `app/routes/~layout.tsx`           | _excluded_          | Tilde prefix → not a route   |
| `app/routes/~404.tsx`              | _custom 404 page_   | Auto-discovered              |
| `app/routes/~500.tsx`              | _custom error page_ | Auto-discovered              |

### Route Pattern Syntax

| Pattern           | Regex             | Example Match                       |
| ----------------- | ----------------- | ----------------------------------- |
| `/`               | `^/$`             | `/`                                 |
| `/about`          | `^/about$`        | `/about`                            |
| `/blog/:slug`     | `^/blog/([^/]+)$` | `/blog/hello` → `{ slug: "hello" }` |
| `/blog/[slug]`    | `^/blog/([^/]+)$` | `/blog/hello` → `{ slug: "hello" }` |
| `/docs/:...path`  | `^/docs/(.+)$`    | `/docs/a/b/c` → `{ path: "a/b/c" }` |
| `/docs/[...path]` | `^/docs/(.+)$`    | `/docs/a/b/c` → `{ path: "a/b/c" }` |

Both `:param` and `[param]` syntaxes work. The file system uses `[param]` (bracket) syntax, the internal router uses `:param` (colon) syntax.

### Route Priority

When multiple routes could match a URL, the highest-scoring route wins:

```
/blog/featured    → score 200 (two static segments)
/blog/:slug       → score 110 (one static + one dynamic)
/blog/:...path    → score 101 (one static + one catch-all)
/:...anything     → score 1   (catch-all only)
```

### Custom Error Pages

Create in `app/routes/`:

- `~404.tsx` — Custom 404 page. Must export default React component.
- `~500.tsx` — Custom error page. Receives `{ error: Error }` prop.

```tsx
// app/routes/~404.tsx
export default function Custom404() {
  return <div>Page not found</div>;
}

// app/routes/~500.tsx
export default function Custom500({ error }: { error?: Error }) {
  return <div>Error: {error?.message}</div>;
}
```

These are auto-discovered by `discoverErrorPages()` and lazy-loaded via the route manifest.

---

## 48. API Route Reference

### Structure

```
app/api/
  hello/
    index.ts          → /api/hello
  users/
    index.ts          → /api/users
    [id].ts           → /api/users/:id
  posts/
    index.ts          → /api/posts
```

### Creating an API Route

Each file exports a default Hono instance:

```ts
// app/api/hello/index.ts → /api/hello
import { Hono } from 'hono';

const route = new Hono();

route.get('/', c => c.json({ message: 'Hello!' }));

route.post('/', async c => {
  const body = await c.req.json();
  return c.json({ echo: body });
});

export default route;
```

### Dynamic API Routes

```ts
// app/api/users/[id].ts → /api/users/:id
import { Hono } from 'hono';

const route = new Hono();

route.get('/', c => {
  const id = c.req.param('id');
  return c.json({ userId: id });
});

export default route;
```

### Plain Function Export (Alternative)

```ts
// app/api/webhook/index.ts
export default function handler(c) {
  return c.json({ ok: true });
}
```

Detected by absence of `.fetch` method. Wrapped with `app.all()`.

### Using Hono Middleware

```ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bearerAuth } from 'hono/bearer-auth';

const route = new Hono();

route.use('/*', cors());
route.use('/*', bearerAuth({ token: process.env.API_TOKEN! }));

route.get('/', c => c.json({ protected: true }));

export default route;
```

### Auto-Generated Endpoints

| Endpoint                   | Content-Type               | Description          |
| -------------------------- | -------------------------- | -------------------- |
| `/openapi.json`            | `application/json`         | OpenAPI 3.0.0 spec   |
| `/.well-known/api-catalog` | `application/linkset+json` | RFC 9727 API catalog |

---

## 49. `create-manic` Scaffolding Tool

### Usage

```bash
bun create manic my-app
# or
bunx create-manic my-app
```

### Interactive Prompts

| Prompt                   | Type   | Default        | Description                               |
| ------------------------ | ------ | -------------- | ----------------------------------------- |
| Project name             | text   | `my-manic-app` | Directory name                            |
| App name                 | text   | project name   | Display name                              |
| Project mode             | choice | `fullstack`    | `fullstack` or `frontend`                 |
| Port                     | text   | `6070`         | Dev server port                           |
| Include API docs?        | yes/no | yes            | Adds `@manicjs/api-docs` (fullstack only) |
| Enable View Transitions? | yes/no | yes            | Sets `router.viewTransitions`             |

### Template Contents

```
template/
  ~manic.ts                    # Server entry
  manic.config.ts              # Framework config (customized by prompts)
  bunfig.toml                  # Bun Tailwind plugin config
  tsconfig.json                # TypeScript config with @/* alias
  .oxlintrc.json               # OXC lint rules
  .oxfmt.json                  # OXC formatter config
  .gitignore                   # Ignores: node_modules, .manic, .env, dist
  eslint.config.mjs            # ESLint with TypeScript strict
  AGENTS.md                    # AI agent instructions
  app/
    index.html                 # HTML shell with Tailwind + main.tsx
    main.tsx                   # React entry with Router + ThemeProvider
    global.css                 # Tailwind v4 + theme + view transitions + utility classes
    manic.d.ts                 # Window.__MANIC_ROUTES__ type declaration
    ~routes.generated.ts       # Initial route manifest
    routes/
      index.tsx                # Home page with counter demo
      build.tsx                # Build info page
    api/
      hello/
        index.ts               # Hello world API route
  assets/
    favicon.svg                # Default favicon
    icon.svg                   # App icon
    not-found.svg              # 404 page illustration
    wordmark.svg               # Logo (light theme)
    wordmark-dark.svg          # Logo (dark theme)
```

### Template Customization

The `create-manic` script:

1. Copies entire `template/` directory to target.
2. If `frontend` mode: deletes `app/api/` directory.
3. Removes `hono` dependency if `frontend` mode.
4. Removes `@manicjs/api-docs` dependency if not selected.
5. Regenerates `manic.config.ts` from prompts.
6. Updates `package.json` name.

### Default Template Dependencies

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

---

## 50. Publishing System

Source: `publish.ts` (monorepo root)

### Package Registry

| npm Package          | Source Path             | Group   |
| -------------------- | ----------------------- | ------- |
| `manicjs`            | `packages/manic`        | Core    |
| `@manicjs/providers` | `packages/providers`    | Core    |
| `create-manic`       | `packages/create-manic` | Core    |
| `@manicjs/mcp`       | `plugins/mcp`           | Plugins |
| `@manicjs/seo`       | `plugins/seo`           | Plugins |
| `@manicjs/sitemap`   | `plugins/sitemap`       | Plugins |
| `@manicjs/api-docs`  | `plugins/api-docs`      | Plugins |

### Current Versions

| Package              | Version |
| -------------------- | ------- |
| `manicjs`            | 0.12.0  |
| `@manicjs/providers` | 0.8.0   |
| `create-manic`       | 0.9.0   |
| `@manicjs/mcp`       | 0.5.0   |
| `@manicjs/seo`       | 0.5.0   |
| `@manicjs/sitemap`   | 0.6.0   |
| `@manicjs/api-docs`  | 0.6.0   |

### Publish Process

Interactive TUI (`bun run publish.ts`):

1. Arrow-key multi-select packages to publish.
2. Choose bump type: `patch`, `minor`, `major`, or `none`.
3. Preview version changes.
4. Confirm.
5. Updates `package.json` versions.
6. Runs `bun publish --access public` for each package.
7. Reverts version on publish failure.

---

## 51. Dependency Graph

### `manicjs` depends on:

- `hono` (server, API routing)
- `colorette` (CLI output coloring)
- `bun-plugin-tailwind` (CSS compilation)
- `oxc-transform` (JSX/TS transform)
- `oxc-minify` (production minification)
- `oxc-resolver` (module resolution)
- `oxlint` (linting binary)

### `manicjs` peer deps:

- `react >= 18.0.0`
- `react-dom >= 18.0.0`

### `@manicjs/providers` depends on:

- `colorette`
- Peer: `manicjs >= 0.7.2`

### `@manicjs/mcp` depends on:

- Peer: `manicjs >= 0.7.4`
- Peer: `zod >= 3.0.0 || >= 4.0.0`

### `@manicjs/api-docs` depends on:

- `@scalar/hono-api-reference`
- `hono`
- Peer: `manicjs >= 0.7.4`

### `@manicjs/seo` depends on:

- Peer: `manicjs >= 0.7.4`

### `@manicjs/sitemap` depends on:

- Peer: `manicjs >= 0.7.4`

---

## 52. View Transitions CSS Reference

The template includes recommended CSS for View Transitions:

```css
/* Enable CSS-based view transitions (Chrome 126+) */
@view-transition {
  navigation: auto;
}

/* Root crossfade — keep subtle so named elements stand out */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
  mix-blend-mode: normal;
}

/* Named element transitions — smoother, slightly longer */
::view-transition-group(*) {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable root fade to prevent double-animation with named elements */
::view-transition-new(root) {
  animation: none;
  opacity: 1;
}
::view-transition-old(root) {
  animation: none;
  opacity: 1;
}
```

### Using View Transitions in Pages

**Option 1: Style prop (recommended):**

```tsx
const LOGO_STYLE = { viewTransitionName: 'logo' };

<img src="/logo.svg" style={LOGO_STYLE} />;
```

**Option 2: ViewTransitions component:**

```tsx
import { ViewTransitions } from 'manicjs/transitions';

<ViewTransitions.img name="logo" src="/logo.svg" />;
```

**Option 3: CSS class:**

```css
.hero-image {
  view-transition-name: hero;
}
```

Elements with the same `view-transition-name` on different pages will animate between positions during navigation.

---

## 53. Theme CSS Variable Reference

The default theme uses CSS custom properties:

```css
:root {
  --theme-background: #fef6f7; /* Light mode background */
  --theme-foreground: #151212; /* Light mode text */
}

.dark {
  --theme-background: #151212; /* Dark mode background */
  --theme-foreground: #fef6f7; /* Dark mode text */
}
```

Tailwind theme mapping (in `@theme` block):

```css
@theme {
  --color-accent: #f15156; /* Brand color */
  --color-background: var(
    --theme-background
  ); /* Maps to Tailwind's bg-background */
  --color-foreground: var(
    --theme-foreground
  ); /* Maps to Tailwind's text-foreground */
}
```

Usage in components:

```tsx
<div className="bg-background text-foreground">    {/* Tailwind classes */}
<div style={{ color: 'var(--theme-foreground)' }}>  {/* Raw CSS */}
```

---

## 54. Default Utility Classes (Template)

The template's `global.css` includes pre-built button classes:

```css
.btn-primary {
  @apply bg-accent text-background border-2 border-background font-semibold
         rounded-full px-6 py-3 transition-all duration-150;
}
.btn-primary:hover {
  @apply scale-105 opacity-90;
}
.btn-primary:active {
  @apply scale-95 opacity-50;
}

.btn-secondary {
  @apply bg-foreground text-background border-2 border-foreground font-semibold
         rounded-full px-6 py-3 transition-all duration-150;
}
.btn-secondary:hover {
  @apply scale-105 opacity-90;
}
.btn-secondary:active {
  @apply scale-95 opacity-50;
}

.btn-outline {
  @apply border-2 border-foreground font-semibold rounded-full px-6 py-3
         transition-all duration-150;
}
.btn-outline:hover {
  @apply bg-foreground text-background;
}
```

---

## 55. Error Boundary Behavior

The Router wraps all rendered page components in an `ErrorBoundary` class component.

**Error flow:**

1. Page component throws during render.
2. `ErrorBoundary.getDerivedStateFromError()` sets `hasError: true`.
3. `ErrorBoundary.componentDidCatch()` logs error and calls `onError` callback.
4. Router sets `errorDetails` state to the caught error.
5. Router renders `ErrorPage` (custom `~500.tsx` or built-in `ServerError`).

**Recovery:** Fix the source code → HMR reloads → component cache is cleared (`import.meta.hot.accept` handler) → Router re-renders with fresh component.

---

## 56. HMR (Hot Module Replacement) Details

**Dev server HMR is handled by Bun's built-in system:**

1. `Bun.serve({ development: { hmr: true } })` enables the HMR websocket.
2. The HTMLBundle import (`import app from './app/index.html'`) lets Bun process and inject HMR client code.
3. The OXC plugin appends `import.meta.hot.accept()` to every JSX/TSX file.
4. On hot reload, the `componentCache` in `Router.tsx` is cleared via `import.meta.hot.accept(() => { componentCache.clear(); })`.
5. This forces the Router to re-import page components on next render.

**What triggers HMR:**

- Any `.tsx`/`.ts`/`.jsx` file change in `app/`.
- CSS changes via Tailwind (processed by `bun-plugin-tailwind`).

**What triggers full restart (via `bun --watch`):**

- Changes to `~manic.ts` (the server entry).
- Route file additions/deletions (the file watcher touches `~manic.ts`).

---

## 57. Production Server Behavior

When running `manic start` (or `bun .manic/server.js`):

1. `NODE_ENV=production` is set.
2. `createManicServer` runs with `prod = true`.
3. HTML is read from `.manic/client/index.html` via `Bun.file()`.
4. All page routes return the same HTML shell (SPA catch-all).
5. Static files served from `.manic/client/` with immutable cache headers.
6. API routes loaded from `.manic/api/` (pre-bundled JS files).
7. No file watcher. No HMR. No HTMLBundle processing.
8. No `/_manic/open` editor integration route.

---

## 58. Module Resolution

The framework uses `oxc-resolver` (`ResolverFactory`) during build to resolve entry points:

```ts
const resolver = new ResolverFactory({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
});

const mainEntry = resolver.sync(process.cwd(), './app/main');
const serverEntry = resolver.sync(process.cwd(), './~manic');
```

This handles extension-less imports, ensuring `./app/main` resolves to `./app/main.tsx`.

---

## 59. Bun HTML Import

The `import app from './app/index.html'` syntax is a Bun-specific feature:

```ts
// ~manic.ts
import app from './app/index.html';
```

This import returns a `HTMLBundle` object (has `.index` property). When used with `Bun.serve`, Bun automatically:

- Processes `<script>` tags (compiles TSX/TS).
- Processes `<link href="tailwindcss">` (runs Tailwind).
- Injects HMR client code in dev.
- Handles module resolution for all imports.

In the build pipeline, this import is replaced:

```ts
// Before (source):
import app from './app/index.html';

// After (build transform):
const html = await Bun.file('.manic/client/index.html').text();
```

---

## 60. Environment Variable Loading

**Server-side (.env files):**
Bun automatically loads `.env` and `.env.local` files. No framework code needed.

**Order of precedence:**

1. `process.env` (system environment)
2. `.env.local` (local overrides, gitignored)
3. `.env` (shared defaults)

**Client-side access:**
Only `MANIC_PUBLIC_*` variables are intended to be accessible. The framework's `getEnv()` and `getPublicEnv()` functions check for this prefix.

**Current limitation:** The `window.__MANIC_ENV__` injection is not implemented. To use client env vars, users must manually inject them (e.g., in `index.html` or via a plugin).

---

## 61. Monorepo Development Workflow

```bash
# Install all workspace dependencies
bun install

# Run the demo app in dev mode
bun dev                      # alias for: cd demo && bun run dev

# Build the demo app
bun build                    # alias for: cd demo && bun run build

# Type-check the core package
bun run typecheck             # cd packages/manic && bun run tsc --noEmit

# Test a CLI command directly
bun run packages/manic/src/cli/index.ts dev

# Publish packages to npm
bun run publish.ts

# Run from demo directory
cd demo
manic dev                     # Uses workspace-linked manicjs
manic build
manic start
manic deploy
manic lint
manic fmt
```

### Adding a Workspace Package

1. Create directory under `packages/` or `plugins/`.
2. Add `package.json` with `"type": "module"`, `"main": "./src/index.ts"`.
3. Root `package.json` workspaces glob (`packages/*`, `plugins/*`) auto-includes it.
4. Run `bun install` at root.
5. Reference in demo: `"my-package": "workspace:*"`.
6. Add to `PACKAGES` array in `publish.ts` for npm publishing.

---

## 62. Complete HTTP Response Headers

### HTML Page Responses

```
Content-Type: text/html; charset=utf-8
Link: </openapi.json>; rel="service-desc"; type="application/json",
      </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json",
      </.well-known/mcp/server-card.json>; rel="mcp"; type="application/json"
      [+ any plugin-added Link headers]
```

### Markdown Responses (Accept: text/markdown)

```
Content-Type: text/markdown; charset=utf-8
Vary: Accept
x-markdown-tokens: <number>
Link: [same as HTML]
```

### Agent Mode (?mode=agent)

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### MCP Endpoint CORS

```
access-control-allow-origin: <request origin>
access-control-allow-methods: GET, POST, DELETE, OPTIONS
access-control-allow-headers: content-type, accept, mcp-session-id
access-control-expose-headers: mcp-session-id
```

### Static Assets (Production)

```
Content-Type: <file type>
Cache-Control: public, max-age=31536000, immutable
```

### Static Assets (Dev)

```
Content-Type: <file type>
Cache-Control: no-cache, no-store, must-revalidate
```
