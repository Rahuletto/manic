# AGENTS.md — Manic Plugin Author Guide

This guide is for anyone building or modifying plugin packages under `plugins/`.

## Core Expectations

1. Use `createPlugin` from `manicjs/config`.
2. Keep dev/prod parity:
   - prefer `staticFiles` for files that must exist in both dev and production.
   - use `build(ctx)` for production-only emits/injections.
   - use `configureServer(ctx)` for dev behavior, but mirror required output in build.
3. Keep plugins provider-agnostic. Do not include Vercel/Cloudflare/Netlify specific logic in plugin packages.
4. Never hardcode plugin script tags in `app/index.html`; use `injectHtml()` from plugin hooks.

## Plugin Contract

```ts
import { createPlugin } from 'manicjs/config';

export function examplePlugin() {
  return createPlugin({
    name: 'example-plugin',
    staticFiles: [
      {
        path: '/example.txt',
        content: 'ok',
        contentType: 'text/plain; charset=utf-8',
      },
    ],
    configureServer(ctx) {
      ctx.addLinkHeader('</example.txt>; rel="preload"; as="fetch"');
    },
    build(ctx) {
      ctx.injectHtml('<meta name="example-plugin" content="enabled">');
    },
  });
}
```

## Local Verification

From repo root:

```bash
bun install
bun run dev
```

In `demo/` (or another app), verify plugin wiring:

```bash
bunx manic plugin add @manicjs/<plugin-name>
bunx manic plugin list
bunx manic build
bunx manic plugin remove @manicjs/<plugin-name>
```

## Checklist Before Shipping

- Plugin loads in `manic dev` without errors.
- Plugin output exists in `.manic/client` after `manic build`.
- No provider-specific branching inside the plugin package.
- All new options are typed and documented in plugin README.
