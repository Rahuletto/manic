<img src="demo/assets/wordmark.svg" alt="Manic" width="300" />

Stupidly fast, Crazy light React framework.

Built exclusively for [Bun](https://bun.sh).

---

## Live Demo

| Platform   | URL                                                                 |
| ---------- | ------------------------------------------------------------------- |
| Vercel     | [manic-framework.vercel.app](https://manic-framework.vercel.app)    |
| Netlify    | [manic-framework.netlify.app](https://manic-framework.netlify.app)  |
| Cloudflare | [manic-framework.pages.dev](https://manic-framework.pages.dev)      |

---

## Getting Started

```bash
bunx create-manic my-app
cd my-app
bun install
bun dev
```

## Packages

| Package                                                                | Description                          |
| ---------------------------------------------------------------------- | ------------------------------------ |
| [manicjs](https://www.npmjs.com/package/manicjs)                       | The framework                        |
| [create-manic](https://www.npmjs.com/package/create-manic)             | CLI to scaffold new apps             |
| [@manicjs/providers](https://www.npmjs.com/package/@manicjs/providers) | Deployment adapters (Vercel, Netlify, Cloudflare) |

## Requirements

- [Bun](https://bun.sh) v1.3.0 or higher

## Provider Comparison

| Feature | Vercel | Netlify | Cloudflare |
|---------|--------|---------|------------|
| Static site | ✅ | ✅ | ✅ |
| API routes | ✅ | ✅ | ❌ |
| Edge runtime | ✅ | ✅ (edge option) | - |
| Bun runtime | ✅ | ❌ | - |


## License

Manic is licensed under GPL-3.0
