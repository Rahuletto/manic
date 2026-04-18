# @manicjs/mcp

MCP ([Model Context Protocol](https://modelcontextprotocol.io)) plugin for [Manic](https://github.com/Rahuletto/manic). Exposes a **Streamable HTTP** MCP server endpoint so AI coding agents can inspect and interact with your running app.

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
      name: 'my-site',
      // Optional: add your own tools on top of the built-in ones
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

## Auto-discovery

Every Manic app advertises the MCP endpoint via an HTTP `Link` header on all HTML responses:

```
Link: </.well-known/mcp>; rel="mcp"; type="application/json"
```

AI coding agents (Kiro, Cursor, Copilot, etc.) that follow this header will automatically find and connect to the MCP server — no manual configuration needed.

The `/.well-known/mcp` document lists the endpoint URL, server info, and all available tools.

## Built-in framework tools

These are always available — no configuration required:

| Tool | Description |
|------|-------------|
| `get_routes` | All page routes (path + file path) |
| `get_api_routes` | All API routes under `/api` |
| `get_page_meta` | `<title>`, meta tags (og:*, description), canonical link for any URL |
| `get_rendered_elements` | Simplified DOM element list from a rendered page |
| `get_console_logs` | Browser console logs captured from the running page |

### Console log capture

To enable `get_console_logs`, add the capture script to your `app/index.html`:

```html
<script src="/mcp/console.js"></script>
```

The script patches `console.log/warn/error/info/debug` and forwards entries to `/mcp/console` (POST). The MCP server buffers the last 200 entries.

## `defineTool`

```ts
import { defineTool } from '@manicjs/mcp';
import { z } from 'zod';

defineTool('tool_name', {
  description: 'What this tool does',
  input: z.object({
    param: z.string().describe('A required string param'),
    count: z.number().optional().describe('An optional number'),
  }),
  async execute({ param, count }) {
    // args are fully typed from the Zod schema
  },
});
```

`defineTool` converts the Zod schema to a JSON Schema `inputSchema` automatically and validates args at call time. Raw `McpTool` objects are also accepted.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | `"manic-mcp"` | Server name shown to MCP clients |
| `version` | `string` | `"1.0.0"` | Server version |
| `path` | `string` | `"/mcp"` | Endpoint path |
| `tools` | `McpTool[]` | `[]` | Additional tools alongside the built-ins |

## Protocol

Implements [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) (spec `2025-03-26`):

- `POST /mcp` — JSON-RPC; responds with `application/json` or SSE
- `GET /mcp` — persistent SSE stream for server-initiated messages
- `DELETE /mcp` — terminate a session
- Session management via `Mcp-Session-Id` header
