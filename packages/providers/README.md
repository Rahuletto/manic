# @manicjs/providers

Deployment providers for Manic framework. Deploy your Manic app anywhere with drop-in adapters.

## Installation

```bash
bun add @manicjs/providers
```

## Usage

Add a provider to your `manic.config.ts`:

```typescript
import { defineConfig } from "manicjs/config";
import { vercel } from "@manicjs/providers";

export default defineConfig({
  app: { name: "My App" },
  providers: [vercel()],
});
```

## Providers

### Vercel

```typescript
import { vercel } from "@manicjs/providers";

vercel({
  runtime: "bun1.x", // "bun1.x" | "nodejs20.x" | "nodejs22.x"
  regions: ["iad1"], // Optional: specific regions
  memory: 1024,
  maxDuration: 10,
});
```

Uses Vercel Build Output API with native Bun runtime support.

### Cloudflare Pages

```typescript
import { cloudflare } from "@manicjs/providers";

cloudflare({
  compatibilityDate: "2024-01-01",
  compatibilityFlags: [],
});
```

Generates Cloudflare Pages Functions and `wrangler.toml`.

### Netlify

```typescript
import { netlify } from "@manicjs/providers";

netlify({
  edge: false,
});
```

Generates Netlify Functions and `netlify.toml`.

## Creating Custom Providers

Implement the `ManicProvider` interface:

```typescript
import type { ManicProvider, BuildContext } from "@manicjs/providers";

export function myProvider(): ManicProvider {
  return {
    name: "my-provider",
    async build(ctx: BuildContext) {
      // ctx.dist - Build output directory (.manic)
      // ctx.config - User's manic config
      // ctx.apiEntries - List of API entry files
      // ctx.clientDir - Path to client build
      // ctx.serverFile - Path to server.js
    },
  };
}
```
