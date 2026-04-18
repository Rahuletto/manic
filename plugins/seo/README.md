# @manicjs/seo

SEO plugin for Manic framework — serves a valid `/robots.txt` per [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309).

## Installation

```bash
bun add @manicjs/seo
```

## Usage

```ts
import { defineConfig } from 'manicjs/config';
import { sitemap } from '@manicjs/sitemap';
import { seo } from '@manicjs/seo';

export default defineConfig({
  plugins: [
    sitemap({
      hostname: 'https://example.com',
      changefreq: 'weekly',
      priority: 0.8,
    }),
    seo({
      hostname: 'https://example.com',
    }),
  ],
});
```

This generates a `/robots.txt` that allows all crawlers and references your sitemap:

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

## Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `hostname` | `string` | **required** | Base URL of the site |
| `rules` | `RobotRule[]` | `[{ userAgent: '*', allow: ['/'] }]` | User-agent directives |
| `sitemaps` | `string[]` | `[]` | Additional sitemap URLs to reference |
| `autoSitemap` | `boolean` | `true` | Auto-reference `<hostname>/sitemap.xml` |

### Custom rules

```ts
seo({
  hostname: 'https://example.com',
  rules: [
    { userAgent: '*', allow: ['/'], disallow: ['/admin', '/api'] },
    { userAgent: 'GPTBot', disallow: ['/'] },
  ],
})
```

### Link headers (RFC 8288)

The plugin automatically adds `Link` response headers to all HTML pages for agent discovery. By default it advertises the sitemap. You can add custom Link headers:

```ts
seo({
  hostname: 'https://example.com',
  linkHeaders: [
    { href: '/docs/api', rel: 'service-doc', type: 'text/html' },
  ],
})
```

In fullstack mode, the framework also adds a built-in `Link` header for `/openapi.json` (`rel="service-desc"`).
