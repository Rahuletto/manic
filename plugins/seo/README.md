# @manicjs/seo

SEO plugin for Manic. Generates `robots.txt`, injects metadata, and supports RFC 8288 link headers plus Content Signals.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Plugin docs: [manicjs.tech/docs/framework/plugins/seo](https://www.manicjs.tech/docs/framework/plugins/seo)

## Install

```bash
bun add @manicjs/seo
```

## Usage

```ts
// manic.config.ts
import { defineConfig } from 'manicjs';
import { seo } from '@manicjs/seo';

export default defineConfig({
  plugins: [
    seo({
      hostname: 'https://example.com',
      contentSignals: { 'ai-train': 'no', search: 'yes', 'ai-input': 'yes' },
    }),
  ],
});
```

## What it does

- Serves `/robots.txt` in dev and emits it as a static file in production builds
- Adds `Link: <hostname/sitemap.xml>; rel="describedby"` to all HTML responses when `@manicjs/sitemap` is also used
- Appends `Content-Signal` directives to `robots.txt` for AI crawler policy

## Options

| Option           | Type           | Default   | Description                                          |
| ---------------- | -------------- | --------- | ---------------------------------------------------- |
| `hostname`       | `string`       | required  | Base URL, e.g. `https://example.com`                 |
| `rules`          | `RobotRule[]`  | allow all | Crawler rules for robots.txt                         |
| `sitemaps`       | `string[]`     | `[]`      | Additional sitemap URLs                              |
| `autoSitemap`    | `boolean`      | `true`    | Auto-reference `/sitemap.xml`                        |
| `linkHeaders`    | `LinkHeader[]` | `[]`      | Extra RFC 8288 Link headers                          |
| `contentSignals` | `object`       | —         | AI crawler policy (`ai-train`, `search`, `ai-input`) |

## License

GPL-3.0
