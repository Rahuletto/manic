# Manic Framework - Complete Technical Analysis

> **Purpose**: Comprehensive technical reference for documentation writers and AI agents.
> **Scope**: All packages in `/packages/` - excludes demo, docs, testbench folders.
> **Generated**: December 2025

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
18. [Caveats and Limitations](#18-caveats-and-limitations)

---

# 1. Framework Identity

## Core Information

| Property         | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| **Package Name** | `manicjs`                                                              |
| **Version**      | 0.5.2                                                                  |
| **Description**  | "Stupidly fast, Crazy light React framework powered by Bun and Elysia" |
| **License**      | GPL-3.0                                                                |
| **Author**       | Rahuletto                                                              |
| **Repository**   | https://github.com/Rahuletto/manic                                     |

## Runtime Requirements

| Requirement | Minimum Version |
| ----------- | --------------- |
| Bun         | >= 1.0.0        |
| React       | >= 18.0.0       |
| React DOM   | >= 18.0.0       |

## Core Dependencies

```
@elysiajs/static: ^1.4.7     # Static file serving
@elysiajs/swagger: ^1.3.1    # API documentation
bun-plugin-tailwind: ^0.1.2  # Tailwind CSS compilation
colorette: ^2.0.20           # Terminal colors
elysia: ^1.3.0               # HTTP server framework
elysia-compress: ^1.2.1      # Response compression
```

## What Makes Manic Fast

1. **Bun.build()** - Native bundler, no esbuild/Rollup/Webpack
2. **Bun.serve()** - Native HTTP server with built-in HMR
3. **Bun --watch** - Native file watching for dev server
4. **Bun.Glob** - Native glob pattern matching
5. **Bun.file()** - Native file I/O
6. **No transpilation** - Bun runs TypeScript directly
7. **Minimal dependencies** - 39 packages vs 286 (Next.js)

---

# 2. Package Architecture

## Monorepo Structure

```
packages/
├── manic/                    # Core framework (npm: manicjs)
│   ├── index.ts              # Main exports
│   ├── package.json
│   └── src/
│       ├── cli/              # CLI commands (manic dev/build/start/deploy)
│       │   ├── index.ts      # CLI entry point
│       │   └── commands/
│       │       ├── dev.ts
│       │       ├── build.ts
│       │       ├── start.ts
│       │       └── deploy.ts
│       ├── components/       # Built-in React components
│       │   └── NotFound/
│       │       ├── index.tsx
│       │       └── DotBackground.tsx
│       ├── config/           # Configuration system
│       │   └── index.ts
│       ├── env/              # Environment variable handling
│       │   ├── index.ts      # Server-side env
│       │   └── client.ts     # Client-side env
│       ├── plugins/          # Elysia plugins
│       │   ├── index.ts
│       │   └── lib/
│       │       ├── api.ts    # API route loader
│       │       └── static.ts # Static file server
│       ├── router/           # Client-side router
│       │   ├── index.ts
│       │   └── lib/
│       │       ├── Router.tsx
│       │       ├── Link.tsx
│       │       ├── context.ts
│       │       ├── matcher.ts
│       │       └── types.ts
│       ├── server/           # Server creation
│       │   ├── index.ts
│       │   └── lib/
│       │       └── discovery.ts
│       ├── theme/            # Theme system
│       │   └── index.ts
│       └── transitions/      # View transitions
│           └── index.ts
│
├── create-manic/             # Scaffolding CLI (npm: create-manic)
│   ├── index.ts              # Interactive CLI
│   ├── template/             # Project template files
│   └── assets/               # Template assets
│
└── providers/                # Deployment adapters (npm: @manicjs/providers)
    └── src/
        ├── index.ts
        ├── types.ts
        ├── vercel/
        ├── cloudflare/
        └── netlify/
```

## Package Export Maps

### manicjs

| Import Path           | Exports                                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manicjs`             | `Link`, `navigate`, `Router`, `useRouter`, `useQueryParams`, `NotFound`, `defineConfig`, `loadConfig`, `ManicConfig`, `SwaggerConfig`, `ThemeProvider`, `useTheme`, `ThemeToggle`, `ViewTransitions` |
| `manicjs/router`      | `Router`, `Link`, `navigate`, `useRouter`, `useQueryParams`, `setViewTransitions`, `preloadRoute`, `RouterContext`, `RouteDef`, `RouterContextValue`                                                 |
| `manicjs/server`      | `createManicServer`, `ManicServerOptions`                                                                                                                                                            |
| `manicjs/plugins`     | `apiLoaderPlugin`, `fileImporterPlugin`                                                                                                                                                              |
| `manicjs/config`      | `defineConfig`, `loadConfig`, `getConfig`, `ManicConfig`, `SwaggerConfig`, `ManicProvider`, `BuildContext`                                                                                           |
| `manicjs/theme`       | `ThemeProvider`, `useTheme`, `ThemeToggle`, `initTheme`                                                                                                                                              |
| `manicjs/env`         | `getEnv`, `getPublicEnv`                                                                                                                                                                             |
| `manicjs/transitions` | `ViewTransitions`, `navigate`, `setViewTransitions`                                                                                                                                                  |

### @manicjs/providers

| Import Path                     | Exports                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `@manicjs/providers`            | `vercel`, `cloudflare`, `netlify`, `ManicProvider`, `BuildContext` |
| `@manicjs/providers/vercel`     | `vercel`, `VercelOptions`                                          |
| `@manicjs/providers/cloudflare` | `cloudflare`, `CloudflareOptions`                                  |
| `@manicjs/providers/netlify`    | `netlify`, `NetlifyOptions`                                        |

---

# 3. CLI System

## Binary Entry Point

**Location**: `packages/manic/src/cli/index.ts`
**Binary**: `manic` (via package.json `bin` field)
**Shebang**: `#!/usr/bin/env bun`

## Commands

### manic dev

**File**: `packages/manic/src/cli/commands/dev.ts`

```typescript
interface DevOptions {
  port?: number;
  network?: boolean;
}

async function dev({ port, network }: DevOptions): Promise<void>;
```

**Behavior**:

1. Loads config via `loadConfig()`
2. Determines port: CLI arg → config → env → 6070
3. Sets hostname: `--network` → "0.0.0.0" : "localhost"
4. Spawns: `bun --watch ~manic.ts`
5. Passes environment: `PORT`, `HOST`, `NETWORK`
6. Handles SIGINT/SIGTERM for cleanup

**Environment Variables Set**:

- `PORT` - Server port
- `HOST` - Hostname
- `NETWORK` - "true" or "false"

### manic build

**File**: `packages/manic/src/cli/commands/build.ts`

```typescript
async function build(): Promise<void>;
```

**Build Steps**:

1. **Cleanup** - `rmSync(dist, { recursive: true, force: true })`
2. **Client Bundle**:
   ```typescript
   await Bun.build({
     entrypoints: ["./app/main.tsx"],
     outdir: `${dist}/client`,
     target: "browser",
     minify: true,
     splitting: true,
     sourcemap: "linked",
     naming: {
       entry: "[name]-[hash].[ext]",
       chunk: "chunks/[name]-[hash].[ext]",
       asset: "assets/[name]-[hash].[ext]",
     },
     plugins: [bunPluginTailwind],
   });
   ```
3. **Copy Assets** - `cpSync("assets", "${dist}/client/assets")`
4. **Transform HTML**:
   - Replace `href="tailwindcss"` → `href="/${cssFile}"`
   - Replace `src="./main.tsx"` → `src="/${jsFile}"`
5. **API Routes Bundle** (for each `app/api/**/index.ts`):
   ```typescript
   await Bun.build({
     entrypoints: [entry],
     outdir: `${dist}/api`,
     target: "bun",
     minify: true,
     external: ["*"], // Important: externalize all deps
     naming: `${outName}.js`,
   });
   ```
6. **Server Bundle**:
   - Read `~manic.ts`
   - Transform HTML import to file read
   - Bundle:
   ```typescript
   await Bun.build({
     entrypoints: [prodEntry],
     outdir: dist,
     target: "bun",
     minify: true,
     define: {
       "process.env.NODE_ENV": JSON.stringify("production"),
     },
     naming: { entry: "server.js" },
   });
   ```
7. **Provider Builds** - Call each provider's `build()` method

**Output Structure**:

```
.manic/
├── client/
│   ├── index.html
│   ├── main-[hash].js
│   ├── main-[hash].css
│   ├── chunks/
│   │   └── [name]-[hash].js
│   └── assets/
│       └── [copied from assets/]
├── api/
│   └── [route].js
└── server.js
```

### manic start

**File**: `packages/manic/src/cli/commands/start.ts`

```typescript
interface StartOptions {
  port?: number;
  network?: boolean;
}

async function start({ port, network }: StartOptions): Promise<void>;
```

**Behavior**:

1. Loads config
2. Checks for `.manic/server.js` existence
3. Spawns: `bun .manic/server.js`
4. Sets `NODE_ENV=production`

### manic deploy

**File**: `packages/manic/src/cli/commands/deploy.ts`

```typescript
async function deploy(): Promise<void>;
```

**Behavior**:

1. Check for providers in config
2. Build if `.manic/` doesn't exist
3. For each provider:
   - Generate config files if needed (vercel.json, netlify.toml)
   - Show deploy command
   - Execute if `--run` flag present

**Deploy Commands**:

- Vercel: `bunx vercel deploy`
- Cloudflare: `bunx wrangler pages deploy dist --project-name ${projectName}`
- Netlify: `bunx netlify deploy --prod`

## CLI Argument Parsing

```typescript
const portIndex =
  args.indexOf("--port") > -1 ? args.indexOf("--port") : args.indexOf("-p");
const portArg = portIndex > -1 ? args[portIndex + 1] : undefined;
const port = portArg ? parseInt(portArg, 10) : undefined;
const network = args.includes("--network");
```

---

# 4. Server System

## createManicServer

**File**: `packages/manic/src/server/index.ts`

```typescript
import { HTMLBundle } from "bun";

interface ManicServerOptions {
  html: HTMLBundle; // Bun's HTML bundle type (from import)
  port?: number;
}

async function createManicServer(options: ManicServerOptions): Promise<Elysia>;
```

## Server Initialization Sequence

```
1. Record start time (performance.now())
2. Load env files (.env, .env.local)
3. Write routes manifest (app/~routes.generated.ts)
4. Load config (manic.config.ts)
5. Initialize API loader plugin
6. Discover routes (app/routes/**/*.tsx)
7. Discover favicon (assets/favicon.*)
8. Determine port (options → env → config → 6070)
9. Determine hostname (env HOST or NETWORK → localhost)
10. Configure view transitions (from config)
11. Set up Swagger (if enabled)
12. Set up static plugin for /assets
13. Set up production static plugin (if prod)
14. Set up favicon route
15. Build Bun.serve routes map
16. Start Bun.serve with HMR (if dev)
17. Start route watcher (if dev)
18. Log startup info
19. Return Elysia app instance
```

## Route Resolution Priority

In `Bun.serve()` routes object:

```typescript
const bunRoutes = {
  "/": htmlHandler, // Root
  [discoveredRoutes]: htmlHandler, // Each discovered route
  "/api/*": apiApp.handle, // API routes
  "/_manic/*": apiApp.handle, // Internal routes
  "/assets/*": apiApp.handle, // Static assets
  "/favicon.ico": apiApp.handle, // Favicon
  "/docs": apiApp.handle, // Swagger (if enabled)
  "/docs/*": apiApp.handle, // Swagger assets
  "/*": catchAllHandler, // SPA fallback
};
```

## Catch-All Handler Logic

```typescript
bunRoutes["/*"] = (req: Request) => {
  const url = new URL(req.url);
  const hasExtension = url.pathname
    .slice(url.pathname.lastIndexOf("/"))
    .includes(".");

  // In production, serve static files with extensions
  if (prod && hasExtension) {
    return apiApp.handle(req);
  }

  // Otherwise, serve HTML (SPA fallback)
  return htmlHandler();
};
```

## HTML Handler

```typescript
const htmlHandler =
  typeof options.html === "string"
    ? () =>
        new Response(options.html, {
          headers: {
            "content-type": "text/html",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        })
    : options.html; // Bun's HTMLBundle handler
```

## Production Static File Caching

```typescript
if (prod) {
  apiApp.use(
    staticPlugin({
      assets: `${dist}/client`,
      prefix: "/",
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  );
}
```

---

# 5. Router System

## Architecture Overview

The router is a **client-side SPA router** with:

- Lazy loading via dynamic imports
- Component caching
- View Transitions API support
- Route preloading on hover
- Dynamic route parameters

## Global State

```typescript
// Component cache (module-level)
const componentCache = new Map<string, ComponentType>();

// View transitions toggle (module-level)
let viewTransitionsEnabled = true;
```

## Window Globals

```typescript
declare global {
  interface Window {
    // Route definitions (set in main.tsx)
    __MANIC_ROUTES__?: Record<
      string,
      () => Promise<{ default: ComponentType }>
    >;

    // Router update function (set by Router component)
    __MANIC_ROUTER_UPDATE__?: (
      path: string,
      component: ComponentType,
      params: Record<string, string>
    ) => void;
  }

  interface Document {
    // View Transitions API
    startViewTransition?: (callback: () => void | Promise<void>) => {
      finished: Promise<void>;
      updateCallbackDone: Promise<void>;
      ready: Promise<void>;
    };
  }
}
```

## Router Component

**File**: `packages/manic/src/router/lib/Router.tsx`

```typescript
function Router({
  routes: manualRoutes,
}: {
  routes?: Record<string, LazyLoader>;
}): React.ReactElement;
```

**State**:

```typescript
const [currentPath, setCurrentPath] = useState(window.location.pathname);
const [LoadedComponent, setLoadedComponent] = useState<ComponentType | null>(
  null
);
const [routeParams, setRouteParams] = useState<Record<string, string>>({});
const isInitialMount = useRef(true);
```

**Route Sorting Algorithm**:

```typescript
routeDefs.sort((a, b) => {
  const aIsDynamic = a.path.includes(":") || a.path.includes("[");
  const bIsDynamic = b.path.includes(":") || b.path.includes("[");
  if (aIsDynamic && !bIsDynamic) return 1; // Static first
  if (!aIsDynamic && bIsDynamic) return -1;
  return b.path.length - a.path.length; // Longer paths first
});
```

**Effects**:

1. Register `window.__MANIC_ROUTER_UPDATE__` for navigate() to use
2. Listen for `popstate` events (browser back/forward)
3. Initial route load on mount

## Link Component

**File**: `packages/manic/src/router/lib/Link.tsx`

```typescript
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  viewTransitionName?: string;
  prefetch?: boolean; // default: true
}

function Link(props: LinkProps): React.ReactElement;
```

**Behavior**:

- Renders `<a>` element with `href={to}`
- Prevents default click, calls `navigate(to)`
- Preloads route on `mouseenter` and `focus` (if prefetch=true)
- Applies `viewTransitionName` to style if provided

## navigate Function

**File**: `packages/manic/src/router/lib/Router.tsx`

```typescript
async function navigate(to: string): Promise<void>;
```

**Flow**:

```
1. Check if in browser (return if SSR)
2. Get routes from window.__MANIC_ROUTES__
3. Match route with matchRoute()
4. If no match: pushState + dispatch popstate + return
5. Load component with loadComponent() (caches result)
6. Define performUpdate():
   - pushState to new URL
   - Call window.__MANIC_ROUTER_UPDATE__ with component + params
7. If viewTransitions enabled and API available:
   - document.startViewTransition(() => flushSync(performUpdate))
8. Else:
   - performUpdate()
```

## Route Matching

**File**: `packages/manic/src/router/lib/matcher.ts`

```typescript
interface RouteMatch {
  path: string;
  component: RouteDef["component"];
  params: Record<string, string>;
}

function matchRoute(currentPath: string, routes: RouteDef[]): RouteMatch | null;
```

**Algorithm**:

```typescript
for (const route of routes) {
  const paramNames: string[] = [];

  // Convert :param and [param] to regex capture groups
  const regexPath = route.path
    .replace(/:([^/]+)/g, (_, key) => {
      paramNames.push(key);
      return "([^/]+)";
    })
    .replace(/\[([^\]]+)\]/g, (_, key) => {
      paramNames.push(key);
      return "([^/]+)";
    });

  const match = currentPath.match(new RegExp(`^${regexPath}$`));

  if (match) {
    const params = match.slice(1).reduce((acc, val, i) => {
      acc[paramNames[i]!] = val;
      return acc;
    }, {});

    return { path: route.path, component: route.component, params };
  }
}
return null;
```

## Hooks

### useRouter

```typescript
function useRouter(): RouterContextValue;

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}
```

**Throws**: Error if used outside `<Router>`

### useQueryParams

```typescript
function useQueryParams(): URLSearchParams;
```

**Behavior**:

- Returns current `window.location.search` as URLSearchParams
- Updates on `popstate` events

## Helper Functions

### preloadRoute

```typescript
function preloadRoute(path: string): void;
```

Loads a route's component into cache without navigating.

### setViewTransitions

```typescript
function setViewTransitions(enabled: boolean): void;
```

Globally enable/disable view transitions.

### loadComponent (internal)

```typescript
async function loadComponent(
  path: string,
  loader: LazyLoader
): Promise<ComponentType>;
```

Loads and caches a component. Returns cached version if already loaded.

---

# 6. Configuration System

## File Location

**File**: `packages/manic/src/config/index.ts`

Searches for (in order):

1. `manic.config.ts`
2. `manic.config.js`

## ManicConfig Interface

```typescript
interface ManicConfig {
  app?: {
    name?: string;
  };

  server?: {
    port?: number;
    hmr?: boolean;
  };

  router?: {
    viewTransitions?: boolean;
    preserveScroll?: boolean;
    scrollBehavior?: "auto" | "smooth";
  };

  build?: {
    minify?: boolean;
    sourcemap?: boolean | "inline" | "external";
    splitting?: boolean;
    outdir?: string;
  };

  swagger?: SwaggerConfig | false;

  providers?: ManicProvider[];
}

interface SwaggerConfig {
  path?: string;
  documentation?: {
    info?: {
      title?: string;
      description?: string;
      version?: string;
    };
  };
}
```

## Default Values

```typescript
const DEFAULT_CONFIG: Required<ManicConfig> = {
  app: { name: "Manic App" },
  server: { port: 6070, hmr: true },
  router: {
    viewTransitions: true,
    preserveScroll: false,
    scrollBehavior: "auto",
  },
  build: {
    minify: true,
    sourcemap: "inline",
    splitting: true,
    outdir: ".manic",
  },
  providers: [],
  swagger: {
    path: "/docs",
    documentation: {
      info: {
        title: "API",
        description: "API documentation",
        version: "1.0.0",
      },
    },
  },
};
```

## Config Functions

### defineConfig

```typescript
function defineConfig(config: ManicConfig): ManicConfig;
```

Type-safe helper. Simply returns the config (enables TypeScript inference).

### loadConfig

```typescript
async function loadConfig(cwd: string = process.cwd()): Promise<ManicConfig>;
```

**Behavior**:

1. Return cached config if exists
2. Try to import manic.config.ts or .js
3. Deep merge user config with defaults
4. Handle `swagger: false` specially
5. Cache and return result

**Merging Strategy**:

```typescript
cachedConfig = {
  app: { ...DEFAULT_CONFIG.app, ...userConfig.app },
  server: { ...DEFAULT_CONFIG.server, ...userConfig.server },
  router: { ...DEFAULT_CONFIG.router, ...userConfig.router },
  build: { ...DEFAULT_CONFIG.build, ...userConfig.build },
  swagger:
    userConfig.swagger === false
      ? false
      : { ...DEFAULT_CONFIG.swagger, ...userConfig.swagger },
  providers: userConfig.providers, // Not merged, replaced
};
```

### getConfig

```typescript
function getConfig(): ManicConfig;
```

Synchronous. Returns cached config or defaults.

---

# 7. Theme System

## File Location

**File**: `packages/manic/src/theme/index.ts`

## Types

```typescript
type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  isDark: boolean;
  isLight: boolean;
}
```

## Storage

- **Key**: `manic-theme`
- **Location**: `localStorage`

## DOM Manipulation

Adds/removes `dark` class on `document.documentElement`:

```typescript
function applyTheme(theme: Theme) {
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolvedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
```

## System Theme Detection

```typescript
function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
```

## ThemeProvider

```typescript
function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement;
```

**Features**:

- Initializes from localStorage
- Listens for system theme changes
- Provides context to children

## useTheme Hook

```typescript
function useTheme(): ThemeContextValue;
```

**Throws**: Error if used outside `<ThemeProvider>`

## ThemeToggle Component

```typescript
function ThemeToggle({
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement
```

Renders a button with `☀️` (dark mode) or `🌙` (light mode).

## Auto-initialization

```typescript
// Runs immediately when module is loaded
if (typeof window !== "undefined") {
  initTheme();
}
```

## Required CSS Variables

```css
:root {
  --theme-background: #f0eee6;
  --theme-foreground: #0e0e0e;
}

.dark {
  --theme-background: #0e0e0e;
  --theme-foreground: #f0eee6;
}
```

---

# 8. View Transitions

## File Location

**File**: `packages/manic/src/transitions/index.ts`

## ViewTransitions Object

Pre-configured components that apply `viewTransitionName` style:

```typescript
const ViewTransitions = {
  div,
  span,
  main,
  section,
  article,
  header,
  footer,
  nav,
  aside,
  h1,
  h2,
  h3,
  p,
  img,
  button,
  a,
  ul,
  li,
} as const;
```

## ViewTransitionProps

```typescript
interface ViewTransitionProps
  extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  name: string; // Required - the view transition name
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

## Implementation

```typescript
function createViewTransitionElement(tag: string) {
  return function ViewTransitionElement({
    name,
    children,
    className,
    style,
    ...props
  }: ViewTransitionProps): ReactElement {
    return createElement(
      tag,
      {
        ...props,
        className,
        style: { ...style, viewTransitionName: name },
      },
      children
    );
  };
}
```

## Usage Example

```tsx
import { ViewTransitions } from "manicjs/transitions";

<ViewTransitions.div name="hero">
  <ViewTransitions.h1 name="hero-title">Welcome</ViewTransitions.h1>
</ViewTransitions.div>;
```

## CSS Configuration

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
}

::view-transition-group(*) {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

# 9. Environment System

## Server-Side

**File**: `packages/manic/src/env/index.ts`

### Public Prefix

```typescript
const PUBLIC_PREFIX = "MANIC_PUBLIC_";
```

### loadEnvFiles

```typescript
async function loadEnvFiles(): Promise<void>;
```

**Files loaded** (in order):

1. `.env`
2. `.env.local`

**Parsing Rules**:

- Skips empty lines
- Skips lines starting with `#`
- Strips quotes from values (`"value"` or `'value'`)
- Sets on `process.env`
- Tracks loaded keys in `loadedEnvVars` Set

### getLoadedEnvKeys

```typescript
function getLoadedEnvKeys(): string[];
```

Returns all keys that were loaded from env files.

### getPublicEnv

```typescript
function getPublicEnv(): Record<string, string>;
```

Returns only keys starting with `MANIC_PUBLIC_`.

### getEnvSummary

```typescript
interface EnvSummary {
  total: number;
  publicCount: number;
  privateCount: number;
  loaded: boolean;
}

function getEnvSummary(): EnvSummary;
```

### generateEnvScript

```typescript
function generateEnvScript(): string;
// Returns: 'window.__MANIC_ENV__ = {"MANIC_PUBLIC_...": "..."};'
```

## Client-Side

**File**: `packages/manic/src/env/client.ts`

### getEnv

```typescript
function getEnv(key: string): string | undefined;
```

**Behavior**:

- Server: Returns `process.env[key]`
- Client:
  - If key doesn't start with `MANIC_PUBLIC_`, logs warning and returns undefined
  - Returns `window.__MANIC_ENV__?.[key]`

### getPublicEnv

```typescript
function getPublicEnv(): Record<string, string>;
```

Returns all public env vars (from process.env on server, window.**MANIC_ENV** on client).

---

# 10. Plugin System

## API Loader Plugin

**File**: `packages/manic/src/plugins/lib/api.ts`

```typescript
async function apiLoaderPlugin(
  apiDir: string = "app/api"
): Promise<{ app: Elysia; routes: string[] }>;
```

**Discovery Pattern**: `**/*.{ts,tsx}` using `Bun.Glob`

**Route Mounting**:

```typescript
// File: app/api/hello/index.ts
// Mounted at: /api/hello

// File: app/api/users/posts/index.ts
// Mounted at: /api/users/posts
```

**Important**: Root index.ts (`app/api/index.ts`) is **skipped** with a warning:

```
[Manic API] Skipping index.ts - use folder structure like api/hello/index.ts
```

**API Route Example**:

```typescript
// app/api/hello/index.ts
import { Elysia } from "elysia";

export default new Elysia()
  .get("/", () => ({ message: "Hello!" }))
  .post("/", ({ body }) => body);
```

## Static File Plugin

**File**: `packages/manic/src/plugins/lib/static.ts`

```typescript
function fileImporterPlugin(publicDir: string = "public"): Elysia;
```

Wraps `@elysiajs/static` plugin.

---

# 11. Build System

## Build Output

**Default directory**: `.manic/` (configurable via `build.outdir`)

**Structure**:

```
.manic/
├── client/
│   ├── index.html              # Transformed HTML
│   ├── main-[hash].js          # Client bundle
│   ├── main-[hash].css         # Tailwind output
│   ├── main-[hash].js.map      # Source map
│   ├── chunks/
│   │   └── [name]-[hash].js    # Code-split chunks
│   └── assets/
│       └── [copied files]       # From assets/
├── api/
│   └── [route].js              # API route bundles
└── server.js                   # Server bundle
```

## HTML Transformation

**Source patterns replaced**:

```html
<!-- Pattern 1: Tailwind placeholder -->
<link rel="stylesheet" href="tailwindcss" />
→ <link rel="stylesheet" href="/main-abc123.css" />

<!-- Pattern 2: Dev entry point -->
<script type="module" src="./main.tsx"></script>
→
<script type="module" src="/main-abc123.js"></script>

<!-- Pattern 3: Alternate dev entry -->
<script type="module" src="/main.tsx"></script>
→
<script type="module" src="/main-abc123.js"></script>
```

## Server Code Transformation

**Original** (`~manic.ts`):

```typescript
import app from "./app/index.html";
await createManicServer({ html: app });
```

**Transformed**:

```typescript
const html = await Bun.file(".manic/client/index.html").text();
await createManicServer({ html });
```

## Build Configuration

```typescript
// Client build
await Bun.build({
  entrypoints: ["./app/main.tsx"],
  outdir: `${dist}/client`,
  target: "browser",
  minify: true,
  splitting: true,
  sourcemap: "linked",
  naming: {
    entry: "[name]-[hash].[ext]",
    chunk: "chunks/[name]-[hash].[ext]",
    asset: "assets/[name]-[hash].[ext]",
  },
  plugins: [bunPluginTailwind],
});

// API build (for each entry)
await Bun.build({
  entrypoints: [entry],
  outdir: `${dist}/api`,
  target: "bun",
  minify: true,
  external: ["*"], // Externalize all dependencies
  naming: `${outName}.js`,
});

// Server build
await Bun.build({
  entrypoints: [prodEntry],
  outdir: dist,
  target: "bun",
  minify: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  naming: { entry: "server.js" },
});
```

---

# 12. Deployment Providers

## Provider Interface

**File**: `packages/providers/src/types.ts`

```typescript
interface ManicProvider {
  name: string;
  build(context: BuildContext): Promise<void>;
}

interface BuildContext {
  dist: string; // Build output dir (.manic)
  config: ManicConfig; // User config
  apiEntries: string[]; // API entry file paths
  clientDir: string; // Path to client build
  serverFile: string; // Path to server.js
}
```

## Vercel Provider

**File**: `packages/providers/src/vercel/index.ts`

```typescript
interface VercelOptions {
  runtime?: "bun" | "nodejs20.x" | "nodejs22.x"; // Default: "bun"
  regions?: string[];
  memory?: number;
  maxDuration?: number;
}

function vercel(options?: VercelOptions): ManicProvider;
```

**Output Structure**:

```
.vercel/output/
├── config.json                     # Vercel Build Output API config
├── static/                         # Client files
│   └── [from .manic/client]
└── functions/
    └── api.func/
        ├── .vc-config.json         # Function config
        ├── index.mjs               # Bundled Elysia server
        └── package.json            # { "type": "module" }
```

**Generated config.json**:

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

**Generated .vc-config.json**:

```json
{
  "runtime": "bun1.x",
  "handler": "index.mjs",
  "shouldAddHelpers": false,
  "supportsResponseStreaming": true
}
```

## Cloudflare Provider

**File**: `packages/providers/src/cloudflare/index.ts`

```typescript
interface CloudflareOptions {
  compatibilityDate?: string; // Default: "2025-06-01"
  projectName?: string;
}

function cloudflare(options?: CloudflareOptions): ManicProvider;
```

**Output Structure**:

```
dist/
├── [client files]
├── _redirects                # SPA routing
└── favicon.*                 # Copied to root
wrangler.toml                 # Wrangler config
```

**Limitations**:

- ❌ **No API routes** - Elysia incompatible with Workers runtime
- Static site only

## Netlify Provider

**File**: `packages/providers/src/netlify/index.ts`

```typescript
interface NetlifyOptions {
  edge?: boolean; // Default: false (uses serverless functions)
}

function netlify(options?: NetlifyOptions): ManicProvider;
```

**Serverless Output** (default):

```
dist/                         # Client files
netlify/
└── functions/
    ├── api.mjs              # Bundled function
    └── package.json         # { "type": "module" }
netlify.toml                 # Generated config
```

**Edge Output** (`edge: true`):

```
dist/                         # Client files
netlify/
└── edge-functions/
    └── api.ts               # Edge function (Deno)
```

**Serverless Handler**:

```typescript
export const handler = async (event, context) => {
  const url = new URL(event.rawUrl);
  const headers = new Headers();

  for (const [key, value] of Object.entries(event.headers || {})) {
    if (value) headers.set(key, value);
  }

  const hasBody =
    event.body && ["POST", "PUT", "PATCH", "DELETE"].includes(event.httpMethod);

  const request = new Request(url.toString(), {
    method: event.httpMethod,
    headers,
    body: hasBody
      ? event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString()
        : event.body
      : undefined,
  });

  const response = await app.fetch(request);
  const body = await response.text();

  const responseHeaders = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body,
  };
};
```

---

# 13. Scaffolding (create-manic)

## Usage

```bash
bunx create-manic [project-name]
bun create manic [project-name]
```

## Interactive Prompts

1. **Project name** - Default: "my-manic-app"
2. **App name** - Default: project name
3. **Port** - Default: 6070
4. **Include Swagger API docs?** - Default: Yes
5. **Enable View Transitions?** - Default: Yes

## Generated Files

### ~manic.ts (Server Entry)

```typescript
import { createManicServer } from "manicjs/server";
import app from "./app/index.html";

await createManicServer({ html: app });
```

### app/main.tsx (Client Entry)

```typescript
import { createRoot } from "react-dom/client";
import { Router } from "manicjs";
import { ThemeProvider } from "manicjs/theme";
import { routes } from "./~routes.generated";
import "./global.css";

window.__MANIC_ROUTES__ = routes;

const root = createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);
```

### app/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manic App</title>
    <link rel="stylesheet" href="tailwindcss" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

### manic.config.ts (Generated based on prompts)

```typescript
import { defineConfig } from "manicjs/config";

export default defineConfig({
  app: {
    name: "${appName}",
  },
  server: {
    port: ${port},
  },
  router: {
    viewTransitions: ${viewTransitions},
  },
  swagger: ${swagger ? '{ path: "/docs" }' : 'false'},
});
```

### bunfig.toml

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "manic dev",
    "build": "manic build",
    "start": "manic start",
    "deploy": "manic deploy"
  }
}
```

---

# 14. File Conventions

## Special Prefixes

| Prefix    | Meaning                                      | Examples                            |
| --------- | -------------------------------------------- | ----------------------------------- |
| `~`       | Internal/generated file (ignored by routing) | `~manic.ts`, `~routes.generated.ts` |
| `[param]` | Dynamic route parameter                      | `[id].tsx`, `[slug].tsx`            |

## Directory Structure

| Path              | Purpose                            |
| ----------------- | ---------------------------------- |
| `~manic.ts`       | Server entry point (required)      |
| `manic.config.ts` | Configuration file                 |
| `app/`            | Application code                   |
| `app/main.tsx`    | Client entry point                 |
| `app/index.html`  | HTML template                      |
| `app/global.css`  | Global styles + Tailwind           |
| `app/routes/`     | Page components                    |
| `app/api/`        | API routes                         |
| `assets/`         | Static assets (served at /assets/) |
| `.manic/`         | Build output (gitignored)          |

## Route File Mapping

| File Path                         | URL Path           |
| --------------------------------- | ------------------ |
| `app/routes/index.tsx`            | `/`                |
| `app/routes/about.tsx`            | `/about`           |
| `app/routes/blog/index.tsx`       | `/blog`            |
| `app/routes/blog/[slug].tsx`      | `/blog/:slug`      |
| `app/routes/users/[id]/posts.tsx` | `/users/:id/posts` |

## API Route File Mapping

| File Path                      | API Path           |
| ------------------------------ | ------------------ |
| `app/api/hello/index.ts`       | `/api/hello`       |
| `app/api/users/index.ts`       | `/api/users`       |
| `app/api/users/posts/index.ts` | `/api/users/posts` |

## Favicon Discovery Priority

1. `assets/favicon.svg`
2. `assets/favicon.png`
3. `assets/favicon.ico`
4. `assets/icon.svg`
5. `assets/icon.png`
6. `assets/icon.ico`

---

# 15. Complete Type Reference

## Router Types

```typescript
// Route definition
interface RouteDef {
  path: string;
  component: ComponentType | null;
  loader?: () => Promise<{ default: ComponentType }>;
}

// Route match result
interface RouteMatch {
  path: string;
  component: RouteDef["component"];
  params: Record<string, string>;
}

// Router context
interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

// Link props
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  viewTransitionName?: string;
  prefetch?: boolean;
}

// Lazy loader type
type LazyLoader = () => Promise<{ default: ComponentType }>;
```

## Config Types

```typescript
interface ManicConfig {
  app?: { name?: string };
  server?: { port?: number; hmr?: boolean };
  router?: {
    viewTransitions?: boolean;
    preserveScroll?: boolean;
    scrollBehavior?: "auto" | "smooth";
  };
  build?: {
    minify?: boolean;
    sourcemap?: boolean | "inline" | "external";
    splitting?: boolean;
    outdir?: string;
  };
  swagger?: SwaggerConfig | false;
  providers?: ManicProvider[];
}

interface SwaggerConfig {
  path?: string;
  documentation?: {
    info?: {
      title?: string;
      description?: string;
      version?: string;
    };
  };
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
  runtime?: "bun" | "nodejs20.x" | "nodejs22.x";
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
type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  isDark: boolean;
  isLight: boolean;
}
```

## Environment Types

```typescript
interface EnvSummary {
  total: number;
  publicCount: number;
  privateCount: number;
  loaded: boolean;
}
```

## Server Types

```typescript
interface ManicServerOptions {
  html: HTMLBundle; // Bun's HTML import type
  port?: number;
}

interface RouteInfo {
  path: string;
  filePath: string;
}
```

## View Transition Types

```typescript
interface ViewTransitionProps
  extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  name: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

---

# 16. API Reference Tables

## Main Package (manicjs)

| Function/Component | Import    | Type                                     | Description                      |
| ------------------ | --------- | ---------------------------------------- | -------------------------------- |
| `Link`             | `manicjs` | Component                                | Navigation link with prefetching |
| `Router`           | `manicjs` | Component                                | Client-side router               |
| `navigate`         | `manicjs` | `(to: string) => Promise<void>`          | Programmatic navigation          |
| `useRouter`        | `manicjs` | Hook → `RouterContextValue`              | Access router context            |
| `useQueryParams`   | `manicjs` | Hook → `URLSearchParams`                 | Access query params              |
| `NotFound`         | `manicjs` | Component                                | Built-in 404 page                |
| `defineConfig`     | `manicjs` | `(config: ManicConfig) => ManicConfig`   | Type-safe config                 |
| `loadConfig`       | `manicjs` | `(cwd?: string) => Promise<ManicConfig>` | Load config file                 |
| `ThemeProvider`    | `manicjs` | Component                                | Theme context provider           |
| `useTheme`         | `manicjs` | Hook → `ThemeContextValue`               | Access theme                     |
| `ThemeToggle`      | `manicjs` | Component                                | Theme toggle button              |
| `ViewTransitions`  | `manicjs` | Object                                   | View transition wrappers         |

## Router Subpath

| Export               | Type                         | Description               |
| -------------------- | ---------------------------- | ------------------------- |
| `Router`             | Component                    | Router component          |
| `Link`               | Component                    | Link component            |
| `navigate`           | Function                     | Navigate programmatically |
| `useRouter`          | Hook                         | Router context            |
| `useQueryParams`     | Hook                         | Query params              |
| `setViewTransitions` | `(enabled: boolean) => void` | Toggle view transitions   |
| `preloadRoute`       | `(path: string) => void`     | Preload route             |
| `RouterContext`      | React.Context                | Router context object     |

## Server Subpath

| Export              | Type                                               | Description   |
| ------------------- | -------------------------------------------------- | ------------- |
| `createManicServer` | `(options: ManicServerOptions) => Promise<Elysia>` | Create server |

## Plugins Subpath

| Export               | Type                                          | Description  |
| -------------------- | --------------------------------------------- | ------------ |
| `apiLoaderPlugin`    | `(apiDir?: string) => Promise<{app, routes}>` | API loader   |
| `fileImporterPlugin` | `(publicDir?: string) => Elysia`              | Static files |

## Config Subpath

| Export         | Type           | Description       |
| -------------- | -------------- | ----------------- |
| `defineConfig` | Function       | Config helper     |
| `loadConfig`   | Async Function | Load config       |
| `getConfig`    | Function       | Get cached config |

## Theme Subpath

| Export          | Type         | Description      |
| --------------- | ------------ | ---------------- |
| `ThemeProvider` | Component    | Provider         |
| `useTheme`      | Hook         | Theme context    |
| `ThemeToggle`   | Component    | Toggle button    |
| `initTheme`     | `() => void` | Initialize theme |

## Env Subpath

| Export         | Type                                   | Description     |
| -------------- | -------------------------------------- | --------------- |
| `getEnv`       | `(key: string) => string \| undefined` | Get env var     |
| `getPublicEnv` | `() => Record<string, string>`         | Get public vars |

## Transitions Subpath

| Export               | Type     | Description   |
| -------------------- | -------- | ------------- |
| `ViewTransitions`    | Object   | VT components |
| `navigate`           | Function | Re-exported   |
| `setViewTransitions` | Function | Re-exported   |

## Providers Package

| Export       | Import Path          | Type                          | Description     |
| ------------ | -------------------- | ----------------------------- | --------------- |
| `vercel`     | `@manicjs/providers` | `(options?) => ManicProvider` | Vercel adapter  |
| `cloudflare` | `@manicjs/providers` | `(options?) => ManicProvider` | CF adapter      |
| `netlify`    | `@manicjs/providers` | `(options?) => ManicProvider` | Netlify adapter |

---

# 17. Internal Implementation Details

## Component Cache

The router maintains a module-level Map for loaded components:

```typescript
const componentCache = new Map<string, ComponentType>();
```

Components are cached by their route path (e.g., `/blog/:slug`), not the actual URL.

## Route Discovery Algorithm

```typescript
async function discoverRoutes(routesDir = "app/routes") {
  const routes = [];
  const glob = new Bun.Glob("**/*.tsx");

  for await (const file of glob.scan({ cwd: routesDir })) {
    if (file.startsWith("~")) continue; // Skip internal files

    let urlPath = file
      .replace(/\.tsx$/, "") // Remove extension
      .replace(/\/index$/, "") // Remove /index suffix
      .replace(/^index$/, ""); // Remove root index

    urlPath = urlPath.replace(/\[([^\]]+)\]/g, ":$1"); // [param] → :param
    urlPath = urlPath === "" ? "/" : `/${urlPath}`;

    routes.push({ path: urlPath, filePath: `${routesDir}/${file}` });
  }

  return routes;
}
```

## Routes Manifest Generation

```typescript
const routeEntries = routes
  .map((r) => {
    const importPath = `./${r.filePath.replace("app/", "")}`;
    return `  "${r.path}": () => import("${importPath}"),`;
  })
  .join("\n");

return `export const routes = {\n${routeEntries}\n};\n`;
```

## Env File Parsing

```typescript
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;

  const key = trimmed.slice(0, eqIndex).trim();
  let value = trimmed.slice(eqIndex + 1).trim();

  // Strip quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  process.env[key] = value;
  loadedEnvVars.add(key);
}
```

## View Transition Integration

```typescript
if (viewTransitionsEnabled && document.startViewTransition) {
  document.startViewTransition(() => {
    flushSync(performUpdate); // Synchronous React update
  });
} else {
  performUpdate();
}
```

---

# 18. Caveats and Limitations

## General

1. **Bun-only** - Does not work with Node.js
2. **No SSR** - Client-side rendering only (SPA)
3. **No streaming** - Full HTML sent on each request

## Router

1. **No nested routes** - Flat routing only
2. **No route guards** - Handle in components
3. **No loading states** - Component renders `null` while loading
4. **Browser history only** - No hash routing

## API Routes

1. **Root index.ts skipped** - Must use folder structure
2. **No middleware** - Use Elysia plugins instead
3. **TypeScript/TSX only** - No .js/.jsx support for discovery

## Build

1. **Fixed entry point** - Must be `app/main.tsx`
2. **Fixed HTML location** - Must be `app/index.html`
3. **Fixed assets location** - Must be `assets/`
4. **Tailwind required** - Uses `bun-plugin-tailwind`

## Providers

1. **Cloudflare: No API routes** - Static only
2. **Netlify serverless: Node.js only** - No Bun runtime
3. **Vercel: Function bundling** - All API routes in one function

## Theme

1. **Requires CSS variables** - Must define `--theme-background`, `--theme-foreground`
2. **Uses .dark class** - Must style `.dark` selector

## Environment

1. **Public prefix required** - Client vars must start with `MANIC_PUBLIC_`
2. **No .env.production** - Only loads `.env` and `.env.local`
3. **No variable expansion** - `${VAR}` syntax not supported

---

# Appendix: Quick Reference

## Minimal Setup

```bash
bunx create-manic my-app
cd my-app
bun install
bun dev
```

## Essential Files

```
~manic.ts           # Server entry
manic.config.ts     # Config
app/main.tsx        # Client entry
app/index.html      # HTML template
app/routes/*.tsx    # Pages
app/api/*/index.ts  # API routes
```

## Common Commands

```bash
manic dev                    # Development
manic build                  # Production build
manic start                  # Run production
manic deploy --run           # Deploy
```

## Config Template

```typescript
import { defineConfig } from "manicjs/config";
import { vercel } from "@manicjs/providers";

export default defineConfig({
  app: { name: "My App" },
  server: { port: 3000 },
  swagger: { path: "/docs" },
  providers: [vercel()],
});
```

---

_This analysis contains complete implementation details extracted directly from the source code. Last updated: December 2025_
