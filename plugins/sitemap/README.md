# @manicjs/sitemap

Sitemap plugin for [Manic](https://github.com/Rahuletto/manic). Auto-generates `sitemap.xml` from your file-based routes.

## Install

```bash
bun add @manicjs/sitemap
```

## Usage

```ts
// manic.config.ts
import { defineConfig } from 'manicjs';
import { sitemap } from '@manicjs/sitemap';

export default defineConfig({
  plugins: [
    sitemap({ hostname: 'https://example.com' }),
  ],
});
```

Serves `/sitemap.xml` in dev and emits it as a static file in production builds. Dynamic routes (e.g. `/blog/:slug`) are excluded automatically.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hostname` | `string` | required | Base URL, e.g. `https://example.com` |
| `changefreq` | `string` | `"weekly"` | Change frequency for all URLs |
| `priority` | `number` | `0.8` | Priority for all URLs |
| `exclude` | `string[]` | `[]` | Route paths to exclude |

## File structure

```
src/
  index.ts     — plugin entry, ManicPlugin implementation
  generate.ts  — generateSitemapXml() pure function
```
