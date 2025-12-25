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

## Provider Comparison

| Feature | Vercel | Netlify | Cloudflare |
|---------|--------|---------|------------|
| Static site | ✅ | ✅ | ✅ |
| API routes | ✅ | ✅ | ❌ |
| Edge runtime | ✅ | ✅ (edge option) | - |
| Bun runtime | ✅ | ❌ | - |

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

Full support for static sites and API routes with native Bun runtime.

**Deploy with CLI (recommended):**
```bash
manic build && manic deploy --run
```

**Deploy via Vercel Dashboard/GitHub:**
1. Set Build Command: `bun run build`
2. Set Output Directory: `.vercel/output`
3. Set Install Command: `bun install`

### Netlify

```typescript
import { netlify } from "@manicjs/providers";

netlify({
  edge: false, // Use edge functions (experimental)
});
```

Full support for static sites and API routes via Netlify Functions.

### Cloudflare Pages

```typescript
import { cloudflare } from "@manicjs/providers";

cloudflare({
  projectName: "my-app", // Cloudflare Pages project name
});
```

Deploys as a static site with SPA routing.

**Limitations:**
- ❌ API routes not supported (Elysia incompatible with Cloudflare Workers runtime)
- Use Vercel or Netlify if you need API routes

Deploy manually:

```bash
bunx wrangler pages deploy dist --project-name my-app
```

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
