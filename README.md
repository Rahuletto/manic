<img src="demo/assets/wordmark.svg" alt="Manic" width="300" />

[![npm version](https://img.shields.io/npm/v/manicjs?color=3B82F6&labelColor=1F2937&logo=npm&logoColor=white)](https://www.npmjs.com/package/manicjs)
[![Bun](https://img.shields.io/badge/Bun-3B82F6?logo=bun&logoColor=white)](https://bun.sh)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-1F2937.svg)](https://opensource.org/licenses/GPL-3.0)

Stupidly fast, Crazy light React framework.

Built exclusively for [Bun](https://bun.sh).

---

## Why Manic?

Manic is the first React framework built from the ground up for Bun. It replaces Vite, Webpack, and Turbopack with a custom, ultra-fast toolchain using OXC for transformation and minification. The result? Near-instant builds, lightning-fast HMR, and zero-config developer experience.

---

## AI Native

Manic is built for AI with first-class support for AI plugins:

- **MCP (Model Context Protocol)** - Streamable HTTP endpoint for AI tools
- **Scalar API Docs** - Interactive OpenAPI documentation UI
- **MDX** - Write AI prompts and documentation with JSX
- **SEO & Sitemap** - Auto-generate metadata and search indexes

---

## Live Demo

| Platform   | URL                                                                |
| ---------- | ------------------------------------------------------------------ |
| Vercel     | [manic-framework.vercel.app](https://manic-framework.vercel.app)   |
| Netlify    | [manic-framework.netlify.app](https://manic-framework.netlify.app) |
| Cloudflare | [manic-framework.pages.dev](https://manic-framework.pages.dev)     |

---

## Getting Started

```bash
bunx create-manic my-app
cd my-app
bun install
bun dev
```

## Quick Start

```ts
// app/main.tsx
import { Router } from 'manicjs/router';
import { ThemeProvider } from 'manicjs/theme';

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
```

## Documentation

Full guides and API reference: [manic-docs.vercel.app](https://manic-docs.vercel.app/)

## Packages

| Package                                                                | Description                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------- |
| [manicjs](https://www.npmjs.com/package/manicjs)                       | The framework                                     |
| [create-manic](https://www.npmjs.com/package/create-manic)             | CLI to scaffold new apps                          |
| [@manicjs/providers](https://www.npmjs.com/package/@manicjs/providers) | Deployment adapters (Vercel, Netlify, Cloudflare) |
| [@manicjs/tailwind](https://www.npmjs.com/package/@manicjs/tailwind)   | Tailwind CSS v4 plugin                            |
| [@manicjs/unocss](https://www.npmjs.com/package/@manicjs/unocss)       | UnoCSS plugin                                     |
| [@manicjs/mdx](https://www.npmjs.com/package/@manicjs/mdx)             | Markdown + JSX plugin                             |
| [@manicjs/seo](https://www.npmjs.com/package/@manicjs/seo)             | Meta tags & robots.txt                            |
| [@manicjs/sitemap](https://www.npmjs.com/package/@manicjs/sitemap)     | Auto-generate sitemap.xml                         |
| [@manicjs/mcp](https://www.npmjs.com/package/@manicjs/mcp)             | Model Context Protocol endpoint                   |
| [@manicjs/api-docs](https://www.npmjs.com/package/@manicjs/api-docs)   | Scalar API reference UI                           |

## Documentation

[manic-docs.vercel.app](https://manic-docs.vercel.app/)

## Requirements

- [Bun](https://bun.sh) v1.3.0 or higher

## Provider Comparison

| Feature      | Vercel | Netlify          | Cloudflare |
| ------------ | ------ | ---------------- | ---------- |
| Static site  | ✅     | ✅               | ✅         |
| API routes   | ✅     | ✅               | ✅         |
| Edge runtime | ✅     | ✅ (edge option) | -          |
| Bun runtime  | ✅     | ❌               | -          |

## License

Manic is licensed under GPL-3.0
