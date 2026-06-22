# @manicjs/bundler

Standalone Bun + OXC build spine extracted from Manic.

Use this package if you want to build your own framework/runtime while reusing the Manic build pipeline primitives.

## What it provides

- `buildApplication()` pipeline orchestration
- bundler utilities: `resolver`, `countRoutes`, `getDirSize`, `minifyDir`, `formatSize`, `formatTime`
- plugin/provider hook contracts
- CLI entrypoint: `manic-bundler build`

## Installation

```bash
bun add @manicjs/bundler
```

## Quick start

```ts
import { buildApplication, type PageRoute } from '@manicjs/bundler';

const config = {
  mode: 'fullstack',
  app: { name: 'My Framework App' },
};

await buildApplication({
  config,
  dist: '.dist',
  runLint: true,
  writeRoutesManifest: async () => {
    // your manifest writer
  },
  discoverPageRoutes: async (): Promise<PageRoute[]> => {
    // your route discovery
    return [];
  },
  clientPlugins: [],
  serverPlugins: [],
  plugins: [],
  providers: [],
  onPending: msg => console.log(`[bundler] ${msg}`),
  onSuccess: msg => console.log(`[bundler] ${msg}`),
  onError: msg => console.error(`[bundler] ${msg}`),
});
```

## CLI usage

```bash
manic-bundler build bundler.config.ts
```

Example `bundler.config.ts`:

```ts
export default {
  config: {
    mode: 'fullstack',
    app: { name: 'Standalone App' },
  },
  dist: '.dist',
  clientPlugins: [],
  serverPlugins: [],
};
```

## Build contract assumptions

By default, the pipeline expects:

- app entry resolved from `./app/main`
- server entry at `./~manic`
- API entries at `app/api/**/index.ts` (when mode is not `frontend`)

If your framework layout differs, wrap/adapt route discovery and entry generation around `buildApplication()`.

## Plugin/provider hooks

### BundlerPlugin

- `name: string`
- `preload?: string`
- `build?(ctx): void | Promise<void>`

### BundlerProvider

- `name: string`
- `build(context): void | Promise<void>`

## Safety notes

For third-party compatibility:

- keep optimization conservative by default
- avoid blanket side-effect stripping of external packages
- validate with smoke tests (`build -> start -> endpoint checks`)

## Repository

- https://github.com/manic-js/bundler
