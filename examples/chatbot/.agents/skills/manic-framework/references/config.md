# Config

<Callout type="note">
Configuration is done via `manic.config.ts` in your project root.
</Callout>

## Basic Config

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  app: {
    name: 'my-app',
    description: 'My awesome app',
  },

  server: {
    port: 3000,
  },
});
```

<Callout type="tip">
Use `defineConfig()` for full type safety and IDE autocomplete.
</Callout>

## Plugins

```ts
import { defineConfig } from 'manicjs/config';
import { apiDocs } from '@manicjs/api-docs';
import { sitemap } from '@manicjs/sitemap';
import { seo } from '@manicjs/seo';

export default defineConfig({
  app: {
    name: 'my-app',
  },

  plugins: [
    apiDocs(),
    sitemap(),
    seo({
      title: 'My App',
      description: 'An awesome app',
    }),
  ],
});
```

<Callout type="important">
Plugins must be configured in both `configureServer` and `build` for dev/prod parity.
</Callout>

## Custom Routes

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  app: {
    name: 'my-app',
  },

  server: {
    port: 3000,
  },

  plugins: [
    {
      configureServer({ addRoute }) {
        addRoute('/custom', c => c.text('Custom route'));
      },
      build({ emitClientFile }) {
        emitClientFile('custom.txt', 'Custom file');
      },
    },
  ],
});
```

<Callout type="warning">
Custom routes registered in `configureServer` are dev-only unless also emitted via `emitClientFile` in `build`.
</Callout>
