# @manicjs/mcp

[Model Context Protocol](https://modelcontextprotocol.io) plugin for [Manic](https://github.com/Rahuletto/manic). Exposes a Streamable HTTP MCP server so AI coding agents can inspect and interact with your running app.

## Install

```bash
bun add @manicjs/mcp
```

## Usage

```ts
// manic.config.ts
import { defineConfig } from 'manicjs';
import { mcp, defineTool } from '@manicjs/mcp';
import { z } from 'zod';

export default defineConfig({
  plugins: [
    mcp({
      name: 'my-app',
      tools: [
        defineTool('search', {
          description: 'Full-text search across the site',
          input: z.object({ query: z.string().describe('Search query') }),
          async execute({ query }) {
            return fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json());
          },
        }),
      ],
    }),
  ],
});
```

## Built-in tools

Always available — no configuration needed:

| Tool | Description |
|------|-------------|
| `get_routes` | All page routes (path + file path) |
| `get_api_routes` | All API routes under `/api` |
| `get_page_meta` | `<title>`, meta tags, canonical for any URL |
| `get_rendered_elements` | Simplified DOM element list from a rendered page |
| `get_console_logs` | Browser console logs (dev only) |

## Agent discovery

Every response includes:
- `Link: </.well-known/mcp/server-card.json>; rel="mcp"` — MCP Server Card (SEP-1649)
- `Link: </.well-known/agent-skills/index.json>; rel="agent-skills"` — Agent Skills RFC v0.2.0

The SKILL.md at `/.well-known/agent-skills/use-mcp/SKILL.md` is auto-generated from the live tool list.

All discovery files are emitted as static files during `manic build`, so they work on Vercel, Cloudflare Pages, and any static host.

## Console log capture (dev only)

Add to `app/index.html`:

```html
<script src="/mcp/console.js"></script>
```

Patches `console.*` and forwards entries to `/mcp/console`. Accessible via `get_console_logs`. Stripped in production.

## `defineTool`

```ts
defineTool('tool_name', {
  description: 'What this tool does',
  input: z.object({
    param: z.string().describe('Required param'),
    count: z.number().optional(),
  }),
  async execute({ param, count }) {
    // fully typed from Zod schema
  },
});
```

Converts the Zod schema to JSON Schema `inputSchema` and validates args at call time.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | `"manic-mcp"` | Server name shown to MCP clients |
| `version` | `string` | `"1.0.0"` | Server version |
| `path` | `string` | `"/mcp"` | Endpoint path |
| `tools` | `McpTool[]` | `[]` | Additional tools |

## File structure

```
src/
  index.ts        — plugin entry, McpConfig, mcp()
  tool.ts         — McpTool interface, defineTool()
  default-tools.ts — built-in framework tools
  handler.ts      — JSON-RPC message dispatch
  discovery.ts    — well-known doc generation (SKILL.md, server-card, agent-skills)
  console.ts      — browser console capture (dev only)
```

## Protocol

Implements [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) spec `2025-03-26`:

- `POST /mcp` — JSON-RPC; responds with `application/json` or SSE
- `GET /mcp` — persistent SSE stream
- `DELETE /mcp` — terminate session
- Session management via `Mcp-Session-Id` header
