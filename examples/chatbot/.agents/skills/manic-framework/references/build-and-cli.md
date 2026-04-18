# Build & CLI

## Commands

| Command        | Description             |
| -------------- | ----------------------- |
| `bun dev`      | Start dev server        |
| `bun build`    | Build for production    |
| `bun start`    | Start production server |
| `manic lint`   | Run oxlint              |
| `manic fmt`    | Format with oxfmt       |
| `manic deploy` | Deploy to provider      |

## Dev Server

```bash
bun dev
# or with custom port
bun dev --port 3000
```

## Build

```bash
bun build
# Output: .manic/ directory
```

## Deploy

```bash
# To Vercel
bun run deploy vercel

# To Netlify
bun run deploy netlify

# To Cloudflare
bun run deploy cloudflare
```
