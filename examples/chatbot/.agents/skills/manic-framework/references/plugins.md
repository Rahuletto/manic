# Plugins

Plugins extend Manic's functionality.

## Plugin Types

### Build Plugin

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  plugins: [
    {
      build({ pageRoutes, apiRoutes, emitClientFile }) {
        // Access routes
        console.log(pageRoutes);
        console.log(apiRoutes);

        // Emit static files
        emitClientFile('data.json', JSON.stringify({ hello: 'world' }));
      },
    },
  ],
});
```

### Server Plugin

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  plugins: [
    {
      configureServer({ addRoute, addLinkHeader }) {
        // Add custom routes
        addRoute('/health', c => c.json({ status: 'ok' }));

        // Add Link headers
        addLinkHeader('<https://example.com>; rel="preconnect"');
      },
    },
  ],
});
```

## Full Plugin Example

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      configureServer({ addRoute }) {
        addRoute('/api/my-endpoint', c => c.json({ data: 'value' }));
      },
      build({ emitClientFile }) {
        emitClientFile('my-file.txt', 'Hello');
      },
    },
  ],
});
```
