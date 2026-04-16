# @manicjs/sitemap

Sitemap generation plugin for Manic framework.

## Installation

```bash
bun add @manicjs/sitemap
```

## Usage

```ts
import { defineConfig } from 'manicjs/config';
import { sitemap } from '@manicjs/sitemap';

export default defineConfig({
  plugins: [
    sitemap({
      hostname: 'https://example.com',
      changefreq: 'weekly',
      priority: 0.8,
      exclude: ['/admin'],
    }),
  ],
});
```
