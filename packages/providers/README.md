# @manicjs/providers

Deployment adapters for Manic.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Deployment overview: [manicjs.tech/docs/framework/deployment](https://www.manicjs.tech/docs/framework/deployment)
- Vercel: [manicjs.tech/docs/framework/deployment/vercel](https://www.manicjs.tech/docs/framework/deployment/vercel)
- Cloudflare: [manicjs.tech/docs/framework/deployment/cloudflare](https://www.manicjs.tech/docs/framework/deployment/cloudflare)
- Self hosting: [manicjs.tech/docs/framework/deployment/self-hosting](https://www.manicjs.tech/docs/framework/deployment/self-hosting)

## Installation

```bash
bun add @manicjs/providers
```

## Usage

Add a provider to your `manic.config.ts`:

```typescript
import { defineConfig } from 'manicjs/config';
import { vercel } from '@manicjs/providers';

export default defineConfig({
  app: { name: 'My App' },
  providers: [vercel()],
});
```

## Provider Support

| Feature      | Vercel | Netlify          | Cloudflare |
| ------------ | ------ | ---------------- | ---------- |
| Static site  | ✅     | ✅               | ✅         |
| API routes   | ✅     | ✅               | ❌         |
| Edge runtime | ✅     | ✅ (edge option) | -          |
| Bun runtime  | ✅     | ❌               | -          |

## Providers

### Vercel

```typescript
import { vercel } from '@manicjs/providers';

vercel({
  runtime: 'bun1.x', // "bun1.x" | "nodejs20.x" | "nodejs22.x"
  regions: ['iad1'], // Optional: specific regions
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
import { netlify } from '@manicjs/providers';

netlify({
  edge: false, // Use edge functions (experimental)
});
```

Full support for static sites and API routes via Netlify Functions.

### Cloudflare Pages

```typescript
import { cloudflare } from '@manicjs/providers';

cloudflare({
  projectName: 'my-app', // Cloudflare Pages project name
});
```

Deploys static output with SPA routing.

Limitations:

- API routes are not supported on Cloudflare Pages in this adapter
- Use Vercel/Netlify for full API route support

Deploy manually:

```bash
bunx wrangler pages deploy dist --project-name my-app
```

## Custom Providers

Implement the `ManicProvider` interface:

```typescript
import type { ManicProvider, BuildContext } from '@manicjs/providers';

export function myProvider(): ManicProvider {
  return {
    name: 'my-provider',
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

## License

GPL-3.0
