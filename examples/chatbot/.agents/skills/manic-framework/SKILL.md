---
name: manic-framework
description: >
  Expert knowledge for working with the Manic framework — a React SPA framework
  that runs exclusively on Bun, uses OXC transforms, Hono for API routes, and
  Tailwind v4. Use this skill whenever the user mentions Manic, manicjs, manic dev,
  manic build, manic.config.ts, ~manic.ts, manic routes, Manic plugins, Manic providers,
  or is building/debugging any app with the Manic framework. Also trigger when
  the user mentions ~routes.generated.ts, createManicServer, defineTool with @manicjs/mcp,
  or any manic CLI command. Do NOT use this skill for general React, Bun, or Hono
  questions unrelated to Manic.
---

# Manic Framework Skill

Manic is a **React SPA framework** (client-side rendering only — no SSR, no hydration, no RSC) that runs exclusively on Bun. The server serves the HTML shell and API routes via Hono. All rendering is client-side via `createRoot`.

**npm package:** `manicjs` · **version:** `0.12.0` · **license:** GPL-3.0

---

## Quick Reference

| What you need                                 | Where to look                     |
| --------------------------------------------- | --------------------------------- |
| Project structure, files, conventions         | [references/project-structure.md] |
| Routing (file-based, URL patterns, hooks)     | [references/routing.md]           |
| API routes (Hono, OpenAPI, client RPC)        | [references/api-routes.md]        |
| Config (`manic.config.ts`, `defineConfig`)    | [references/config.md]            |
| Plugin system (creating and using plugins)    | [references/plugins.md]           |
| Provider system (Vercel, Cloudflare, Netlify) | [references/providers.md]         |
| Build pipeline & CLI commands                 | [references/build-and-cli.md]     |
| Theme, transitions, env, head management      | [references/features.md]          |
| Known issues, gotchas, AI agent pitfalls      | [references/gotchas.md]           |

**Read the relevant reference file(s) before answering.** For debugging questions, always check [references/gotchas.md] first.

---

## Core Mental Model

```
Bun.serve
  ├── Static assets (/assets/*)
  ├── API routes via Hono (/api/*)  ← app/api/*/index.ts
  ├── OpenAPI + API catalog         ← auto-generated
  ├── Plugin routes                 ← addRoute() in plugin.configureServer()
  └── SPA catch-all (/*) → index.html → React client router
```

**Toolchain:** OXC (transforms + lint + format + minify) · Bun.build (bundler) · bun-plugin-tailwind · Hono (API layer)

**Key conventions:**

- `~` prefix = excluded from routing (`~manic.ts`, `~routes.generated.ts`, `~404.tsx`)
- `app/routes/*.tsx` = page routes (filename → URL)
- `app/api/*/index.ts` = API routes (folder name → `/api/folder`)
- `app/~routes.generated.ts` = auto-generated, **never edit manually**

---

## Package Map

```
packages/manic/          → manicjs (framework core)
packages/create-manic/   → create-manic (scaffolding CLI)
packages/providers/      → @manicjs/providers (deployment adapters)
plugins/api-docs/        → @manicjs/api-docs (Scalar API UI)
plugins/seo/             → @manicjs/seo (robots.txt, Link headers)
plugins/sitemap/         → @manicjs/sitemap (sitemap.xml)
plugins/mcp/             → @manicjs/mcp (MCP server endpoint)
```

---

## Most Common Tasks — Decision Tree

**Starting a new project?** → Read [references/project-structure.md]

**Adding a page/route?** → Read [references/routing.md]

**Adding an API endpoint?** → Read [references/api-routes.md]

**Adding a plugin (sitemap, SEO, MCP, analytics)?** → Read [references/plugins.md]

**Deploying to Vercel / Cloudflare / Netlify?** → Read [references/providers.md]

**Build errors, lint failures, or unexpected behavior?** → Read [references/gotchas.md]

**CLI commands (`manic dev`, `manic build`, etc.)?** → Read [references/build-and-cli.md]
