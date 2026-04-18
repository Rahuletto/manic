import type { ManicPlugin, ManicServerPluginContext } from 'manicjs/config';
import type { ZodObject, ZodRawShape, infer as ZodInfer } from 'zod';

// ── Tool builder ──────────────────────────────────────────────────────────────

type ToolDef<S extends ZodObject<ZodRawShape>> = {
  description: string;
  input: S;
  execute(args: ZodInfer<S>): Promise<unknown> | unknown;
};

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  execute(args: Record<string, unknown>): Promise<unknown> | unknown;
}

/** Define a typed MCP tool with a Zod schema for inputs. */
export function defineTool<S extends ZodObject<ZodRawShape>>(
  name: string,
  def: ToolDef<S>
): McpTool {
  const shape = def.input.shape;
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const [key, field] of Object.entries(shape)) {
    const f = field as any;
    const isOptional =
      f._def?.typeName === 'ZodOptional' || f.isOptional?.() === true;
    const inner = isOptional ? (f._def?.innerType ?? f) : f;
    const typeName: string = inner._def?.typeName ?? '';

    const prop: Record<string, unknown> = {
      type:
        typeName === 'ZodNumber'
          ? 'number'
          : typeName === 'ZodBoolean'
            ? 'boolean'
            : typeName === 'ZodArray'
              ? 'array'
              : 'string',
    };
    const desc = f._def?.description ?? inner._def?.description;
    if (desc) prop.description = desc;

    properties[key] = prop;
    if (!isOptional) required.push(key);
  }

  return {
    name,
    description: def.description,
    inputSchema: {
      type: 'object',
      properties,
      ...(required.length ? { required } : {}),
    },
    execute(args) {
      const parsed = def.input.parse(args);
      return def.execute(parsed);
    },
  };
}

// ── Config ────────────────────────────────────────────────────────────────────

export interface McpConfig {
  /** Server name shown to MCP clients @default "manic-mcp" */
  name?: string;
  /** Server version @default "1.0.0" */
  version?: string;
  /** Endpoint path @default "/mcp" */
  path?: string;
  /** Additional tools to expose alongside the built-in framework tools */
  tools?: McpTool[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PROTOCOL_VERSION = '2025-03-26';

function sseEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// ── Console log buffer (filled by POST /mcp/console from the client script) ──

const MAX_LOGS = 200;
const consoleLogs: Array<{ level: string; args: unknown[]; ts: number }> = [];

// ── Client-side console capture script ───────────────────────────────────────

const CONSOLE_SCRIPT = /* js */ `
(function () {
  var _endpoint = '/mcp/console';
  var _levels = ['log', 'warn', 'error', 'info', 'debug'];
  _levels.forEach(function (level) {
    var orig = console[level].bind(console);
    console[level] = function () {
      orig.apply(console, arguments);
      try {
        var args = Array.from(arguments).map(function (a) {
          try { return JSON.parse(JSON.stringify(a)); } catch { return String(a); }
        });
        fetch(_endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ level: level, args: args, ts: Date.now() }),
          keepalive: true,
        }).catch(function () {});
      } catch {}
    };
  });
})();
`.trim();

// ── Default framework tools ───────────────────────────────────────────────────

function buildDefaultTools(ctx: ManicServerPluginContext): McpTool[] {
  const tools: McpTool[] = [
    {
      name: 'get_routes',
      description:
        'Returns all page routes registered in the Manic app (path + file path).',
      inputSchema: { type: 'object' },
      execute: () => ctx.pageRoutes,
    },
    {
      name: 'get_api_routes',
      description:
        'Returns all API routes registered under /api in the Manic app.',
      inputSchema: { type: 'object' },
      execute: () => ctx.apiRoutes,
    },
    {
      name: 'get_page_meta',
      description:
        'Fetches a page by URL and extracts its <title>, meta tags (og:*, description, etc.), and canonical link.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Absolute or relative URL of the page' },
        },
        required: ['url'],
      },
      async execute({ url }) {
        const target = String(url);
        const res = await fetch(
          target.startsWith('http') ? target : `http://localhost:${ctx.config.server?.port ?? 6070}${target}`
        );
        const html = await res.text();

        const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? null;
        const metas: Record<string, string> = {};
        for (const m of html.matchAll(/<meta\s+([^>]+)>/gi)) {
          const attrs = m[1];
          const name =
            attrs.match(/(?:name|property)=["']([^"']+)["']/i)?.[1] ?? null;
          const content = attrs.match(/content=["']([^"']+)["']/i)?.[1] ?? null;
          if (name && content) metas[name] = content;
        }
        const canonical =
          html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
          null;

        return { title, meta: metas, canonical };
      },
    },
    {
      name: 'get_rendered_elements',
      description:
        'Fetches a page and returns a simplified DOM tree of rendered elements (tag, id, class, text snippet) for AI inspection.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Absolute or relative URL of the page' },
          selector: {
            type: 'string',
            description: 'CSS selector to scope results (default: body)',
          },
        },
        required: ['url'],
      },
      async execute({ url, selector }) {
        const target = String(url);
        const res = await fetch(
          target.startsWith('http') ? target : `http://localhost:${ctx.config.server?.port ?? 6070}${target}`
        );
        const html = await res.text();

        // Lightweight element extraction — no DOM parser needed
        const scope = selector ? String(selector) : 'body';
        const elements: Array<{ tag: string; id?: string; class?: string; text?: string }> = [];

        for (const m of html.matchAll(/<([a-z][a-z0-9-]*)([^>]*)>([\s\S]*?)<\/\1>/gi)) {
          const [, tag, attrs, inner] = m;
          if (['script', 'style', 'head'].includes(tag.toLowerCase())) continue;
          const id = attrs.match(/id=["']([^"']+)["']/i)?.[1];
          const cls = attrs.match(/class=["']([^"']+)["']/i)?.[1];
          const text = inner.replace(/<[^>]+>/g, '').trim().slice(0, 80) || undefined;
          elements.push({ tag, ...(id ? { id } : {}), ...(cls ? { class: cls } : {}), ...(text ? { text } : {}) });
          if (elements.length >= 100) break;
        }

        return { selector: scope, elements };
      },
    },
  ];

  if (!ctx.prod) {
    tools.push({
      name: 'get_console_logs',
      description:
        'Returns browser console logs captured from the running page (requires /mcp/console.js to be loaded).',
      inputSchema: {
        type: 'object',
        properties: {
          level: { type: 'string', description: 'Filter by level: log | warn | error | info | debug' },
          limit: { type: 'number', description: 'Max entries to return (default 50)' },
        },
      },
      execute({ level, limit }) {
        const lvl = level ? String(level) : null;
        const lim = typeof limit === 'number' ? limit : 50;
        const filtered = lvl ? consoleLogs.filter(e => e.level === lvl) : consoleLogs;
        return filtered.slice(-lim);
      },
    });
  }

  return tools;
}

// ── Plugin ────────────────────────────────────────────────────────────────────

export function mcp(config: McpConfig = {}): ManicPlugin {
  const endpoint = config.path ?? '/mcp';
  const serverName = config.name ?? 'manic-mcp';
  const serverVersion = config.version ?? '1.0.0';
  const userTools = config.tools ?? [];

  const sessions = new Map<string, { initialized: boolean }>();

  return {
    name: '@manicjs/mcp',

    configureServer(ctx: ManicServerPluginContext) {
      const tools = [...buildDefaultTools(ctx), ...userTools];

      // ── /mcp/console — dev only ──
      if (!ctx.prod) {
        ctx.addRoute('/mcp/console', async (req: Request) => {
          if (req.method !== 'POST') return new Response(null, { status: 405 });
          try {
            const entry = await req.json() as { level: string; args: unknown[]; ts: number };
            consoleLogs.push(entry);
            if (consoleLogs.length > MAX_LOGS) consoleLogs.shift();
          } catch {}
          return new Response(null, { status: 202 });
        });

        ctx.addRoute('/mcp/console.js', () =>
          new Response(CONSOLE_SCRIPT, {
            headers: { 'content-type': 'application/javascript; charset=utf-8' },
          })
        );
      }

      // ── /.well-known/mcp + server-card.json — auto-discovery ──
      const wellKnownBase = {
        mcpVersion: PROTOCOL_VERSION,
        endpoint,
        name: serverName,
        version: serverVersion,
        tools: tools.map(t => ({ name: t.name, description: t.description })),
      };
      const serverCard = JSON.stringify({
        serverInfo: { name: serverName, version: serverVersion },
        transport: { type: 'streamable-http', endpoint },
        capabilities: { tools: true, resources: false, prompts: false },
      });
      const wellKnown = JSON.stringify(wellKnownBase);

      ctx.addRoute('/.well-known/mcp', () =>
        new Response(wellKnown, { headers: { 'content-type': 'application/json' } })
      );
      ctx.addRoute('/.well-known/mcp/server-card.json', () =>
        new Response(serverCard, { headers: { 'content-type': 'application/json' } })
      );

      // ── Link header for auto-discovery ──
      ctx.addLinkHeader('</.well-known/mcp/server-card.json>; rel="mcp"; type="application/json"');

      // ── JSON-RPC message handler ──
      function handleMessage(
        msg: Record<string, unknown>,
        sessionId: string | null
      ): { response: unknown; newSessionId?: string } | null {
        const { id, method, params } = msg as {
          id?: unknown;
          method?: string;
          params?: Record<string, unknown>;
        };

        if (method === 'initialize') {
          const newSessionId = crypto.randomUUID();
          sessions.set(newSessionId, { initialized: false });
          return {
            newSessionId,
            response: {
              jsonrpc: '2.0',
              id,
              result: {
                protocolVersion: PROTOCOL_VERSION,
                capabilities: { tools: {} },
                serverInfo: { name: serverName, version: serverVersion },
              },
            },
          };
        }

        if (method === 'notifications/initialized') {
          if (sessionId) {
            const s = sessions.get(sessionId);
            if (s) s.initialized = true;
          }
          return null;
        }

        if (method === 'tools/list') {
          return {
            response: {
              jsonrpc: '2.0',
              id,
              result: {
                tools: tools.map(({ name, description, inputSchema }) => ({
                  name,
                  description,
                  inputSchema,
                })),
              },
            },
          };
        }

        if (method === 'tools/call') {
          const toolName = (params as any)?.name as string;
          const args = ((params as any)?.arguments ?? {}) as Record<string, unknown>;
          const tool = tools.find(t => t.name === toolName);

          if (!tool) {
            return {
              response: {
                jsonrpc: '2.0',
                id,
                error: { code: -32601, message: `Tool not found: ${toolName}` },
              },
            };
          }

          return {
            response: (async () => {
              try {
                const result = await tool.execute(args);
                return {
                  jsonrpc: '2.0',
                  id,
                  result: { content: [{ type: 'text', text: JSON.stringify(result) }] },
                };
              } catch (err: unknown) {
                return {
                  jsonrpc: '2.0',
                  id,
                  error: {
                    code: -32000,
                    message: err instanceof Error ? err.message : String(err),
                  },
                };
              }
            })(),
          };
        }

        return {
          response: {
            jsonrpc: '2.0',
            id: id ?? null,
            error: { code: -32601, message: 'Method not found' },
          },
        };
      }

      // ── MCP endpoint ──
      ctx.addRoute(endpoint, async (req: Request) => {
        const origin = req.headers.get('origin');
        const corsHeaders: Record<string, string> = origin
          ? {
              'access-control-allow-origin': origin,
              'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
              'access-control-allow-headers': 'content-type, accept, mcp-session-id',
              'access-control-expose-headers': 'mcp-session-id',
            }
          : {};

        if (req.method === 'OPTIONS')
          return new Response(null, { status: 204, headers: corsHeaders });

        const sessionId = req.headers.get('mcp-session-id');

        if (req.method === 'DELETE') {
          if (sessionId && sessions.has(sessionId)) {
            sessions.delete(sessionId);
            return new Response(null, { status: 200, headers: corsHeaders });
          }
          return new Response(null, { status: 404, headers: corsHeaders });
        }

        if (req.method === 'GET') {
          if (!(req.headers.get('accept') ?? '').includes('text/event-stream'))
            return new Response(null, { status: 405, headers: corsHeaders });

          const stream = new ReadableStream({
            start(controller) {
              const timer = setInterval(
                () => controller.enqueue(new TextEncoder().encode(': ping\n\n')),
                15_000
              );
              req.signal.addEventListener('abort', () => {
                clearInterval(timer);
                controller.close();
              });
            },
          });
          return new Response(stream, {
            headers: {
              ...corsHeaders,
              'content-type': 'text/event-stream',
              'cache-control': 'no-cache',
              connection: 'keep-alive',
            },
          });
        }

        if (req.method === 'POST') {
          const wantsSSE = (req.headers.get('accept') ?? '').includes('text/event-stream');

          let body: unknown;
          try {
            body = await req.json();
          } catch {
            return new Response(
              JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }),
              { status: 400, headers: { ...corsHeaders, 'content-type': 'application/json' } }
            );
          }

          const messages = Array.isArray(body) ? body : [body];
          const hasRequests = messages.some((m: any) => m.method && m.id !== undefined);

          if (!hasRequests) {
            for (const msg of messages)
              handleMessage(msg as Record<string, unknown>, sessionId);
            return new Response(null, { status: 202, headers: corsHeaders });
          }

          const results = await Promise.all(
            messages.map(async (msg: any) => {
              const out = handleMessage(msg as Record<string, unknown>, sessionId);
              if (!out) return { result: null, newSessionId: undefined };
              return { result: await out.response, newSessionId: out.newSessionId };
            })
          );

          const responses = results.map(r => r.result).filter(Boolean);
          const newSessionId = results.find(r => r.newSessionId)?.newSessionId;
          const responseHeaders: Record<string, string> = { ...corsHeaders };
          if (newSessionId) responseHeaders['mcp-session-id'] = newSessionId;

          if (wantsSSE) {
            const enc = new TextEncoder();
            const stream = new ReadableStream({
              start(controller) {
                for (const resp of responses)
                  controller.enqueue(enc.encode(sseEvent(resp)));
                controller.close();
              },
            });
            return new Response(stream, {
              headers: { ...responseHeaders, 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
            });
          }

          return new Response(JSON.stringify(responses.length === 1 ? responses[0] : responses), {
            headers: { ...responseHeaders, 'content-type': 'application/json' },
          });
        }

        return new Response(null, { status: 405, headers: corsHeaders });
      });
    },
  };
}
