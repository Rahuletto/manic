# Config

Configuration is done via `manic.config.ts`.

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
