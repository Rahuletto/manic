# @manicjs/sitemap

Sitemap plugin for Manic. Auto-generates `sitemap.xml` from your file-based routes.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Plugin docs: [manicjs.tech/docs/framework/plugins/sitemap](https://www.manicjs.tech/docs/framework/plugins/sitemap)

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
  plugins: [sitemap({ hostname: 'https://example.com' })],
});
```

Serves `/sitemap.xml` in dev and emits it as a static file in production builds. Dynamic routes (e.g. `/blog/:slug`) are excluded automatically.

## Options

| Option       | Type       | Default    | Description                          |
| ------------ | ---------- | ---------- | ------------------------------------ |
| `hostname`   | `string`   | required   | Base URL, e.g. `https://example.com` |
| `changefreq` | `string`   | `"weekly"` | Change frequency for all URLs        |
| `priority`   | `number`   | `0.8`      | Priority for all URLs                |
| `exclude`    | `string[]` | `[]`       | Route paths to exclude               |

## License

GPL-3.0
