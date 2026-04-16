# @manicjs/sitemap

Sitemap generation for Manic framework.

## Installation

```bash
bun add @manicjs/sitemap
```

## Usage

```ts
import { generateSitemap, discoverRoutes } from "@manicjs/sitemap";

const routes = await discoverRoutes();
const sitemap = generateSitemap(routes, {
  hostname: "https://example.com",
  changefreq: "weekly",
  priority: 0.8,
  exclude: ["/admin"],
});
```
