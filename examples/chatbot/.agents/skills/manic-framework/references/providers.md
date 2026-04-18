# Providers

Providers deploy Manic apps to various platforms.

## Supported Providers

| Provider   | Command                   | Notes          |
| ---------- | ------------------------- | -------------- |
| Vercel     | `manic deploy vercel`     | Native support |
| Netlify    | `manic deploy netlify`    | Native support |
| Cloudflare | `manic deploy cloudflare` | Edge runtime   |

## Vercel

```bash
bun run deploy vercel
```

Creates `.vercel/output` with serverless functions.

## Netlify

```bash
bun run deploy netlify
```

Creates `netlify/` directory with edge functions.

## Cloudflare

```bash
bun run deploy cloudflare
```

Creates `_worker.js` for edge deployment.

## Custom Provider

```ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  plugins: [
    {
      build({ emitClientFile }) {
        // Emit provider-specific files
        emitClientFile('provider-config.json', '{}');
      },
    },
  ],
});
```
