import type { ManicPlugin, ManicServerPluginContext } from 'manicjs/config';
import { defaultTools } from './default-tools';
import { buildDiscoveryDocs } from './discovery';
import { handleMessage, sseEvent } from './handler';
import { consoleIngestHandler, CONSOLE_SCRIPT } from './console';

export type { McpTool } from './tool';
export { defineTool } from './tool';

export interface McpConfig {
  /** @default "manic-mcp" */
  name?: string;
  /** @default "1.0.0" */
  version?: string;
  /** Endpoint path @default "/mcp" */
  path?: string;
  /** Additional tools alongside the built-in framework tools */
  tools?: import('./tool').McpTool[];
}

/**
 * Generates a browser script that registers MCP tools via the WebMCP API
 * (navigator.modelContext). Each tool delegates execution to the MCP server
 * via fetch, so tools are defined once and work in both contexts.
 */
function buildWebMcpScript(endpoint: string, tools: import('./tool').McpTool[]): string {
  const toolDefs = tools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  }));

  return `(function () {
  if (!navigator.modelContext) return;
  var ac = new AbortController();
  var tools = ${JSON.stringify(toolDefs, null, 2)};
  tools.forEach(function (tool) {
    navigator.modelContext.registerTool({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      signal: ac.signal,
      execute: function (args) {
        return fetch(${JSON.stringify(endpoint)}, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'accept': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool.name, arguments: args } }),
        })
          .then(function (r) { return r.json(); })
          .then(function (d) { return d.result?.content?.[0]?.text ? JSON.parse(d.result.content[0].text) : d.result; });
      },
    });
  });
  window.addEventListener('unload', function () { ac.abort(); });
})();`;
}

export function mcp(config: McpConfig = {}): ManicPlugin {
  const endpoint = config.path ?? '/mcp';
  const serverName = config.name ?? 'manic-mcp';
  const serverVersion = config.version ?? '1.0.0';
  const userTools = config.tools ?? [];
  const sessions = new Map<string, { initialized: boolean }>();

  return {
    name: '@manicjs/mcp',
    mcpPath: endpoint,

    async configureServer(ctx: ManicServerPluginContext) {
      const tools = [...defaultTools(ctx), ...userTools];

      if (!ctx.prod) {
        ctx.addRoute('/mcp/console', consoleIngestHandler);
        ctx.addRoute('/mcp/console.js', () =>
          new Response(CONSOLE_SCRIPT, { headers: { 'content-type': 'application/javascript; charset=utf-8' } })
        );
      }

      const { skillContent, skillUrl, wellKnown, serverCard, agentSkillsIndex } =
        await buildDiscoveryDocs(serverName, serverVersion, endpoint, tools);

      ctx.addRoute('/.well-known/mcp.json', () => new Response(wellKnown, { headers: { 'content-type': 'application/json' } }));
      ctx.addRoute('/.well-known/mcp/server-card.json', () => new Response(serverCard, { headers: { 'content-type': 'application/json' } }));
      ctx.addRoute(skillUrl, () => new Response(skillContent, { headers: { 'content-type': 'text/markdown; charset=utf-8' } }));
      ctx.addRoute('/.well-known/agent-skills/index.json', () => new Response(agentSkillsIndex, { headers: { 'content-type': 'application/json' } }));

      ctx.addLinkHeader('</.well-known/mcp/server-card.json>; rel="mcp"; type="application/json"');
      ctx.addLinkHeader('</.well-known/mcp.json>; rel="mcp-discovery"; type="application/json"');
      ctx.addLinkHeader('</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"');

      ctx.addRoute('/webmcp.js', () =>
        new Response(buildWebMcpScript(endpoint, tools), {
          headers: { 'content-type': 'application/javascript; charset=utf-8' },
        })
      );

      ctx.addRoute(endpoint, async (req: Request) => {
        const origin = req.headers.get('origin');
        const cors: Record<string, string> = origin ? {
          'access-control-allow-origin': origin,
          'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
          'access-control-allow-headers': 'content-type, accept, mcp-session-id',
          'access-control-expose-headers': 'mcp-session-id',
        } : {};

        if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

        const sessionId = req.headers.get('mcp-session-id');

        if (req.method === 'DELETE') {
          if (sessionId && sessions.has(sessionId)) { sessions.delete(sessionId); return new Response(null, { status: 200, headers: cors }); }
          return new Response(null, { status: 404, headers: cors });
        }

        if (req.method === 'GET') {
          if (!(req.headers.get('accept') ?? '').includes('text/event-stream'))
            return new Response(null, { status: 405, headers: cors });
          const stream = new ReadableStream({
            start(c) {
              const t = setInterval(() => c.enqueue(new TextEncoder().encode(': ping\n\n')), 15_000);
              req.signal.addEventListener('abort', () => { clearInterval(t); c.close(); });
            },
          });
          return new Response(stream, { headers: { ...cors, 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' } });
        }

        if (req.method === 'POST') {
          const wantsSSE = (req.headers.get('accept') ?? '').includes('text/event-stream');
          let body: unknown;
          try { body = await req.json(); }
          catch { return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }), { status: 400, headers: { ...cors, 'content-type': 'application/json' } }); }

          const messages = Array.isArray(body) ? body : [body];
          const hasRequests = messages.some((m: any) => m.method && m.id !== undefined);

          if (!hasRequests) {
            for (const msg of messages) handleMessage(msg as any, sessionId, sessions, tools, serverName, serverVersion);
            return new Response(null, { status: 202, headers: cors });
          }

          const results = await Promise.all(messages.map(async (msg: any) => {
            const out = handleMessage(msg, sessionId, sessions, tools, serverName, serverVersion);
            if (!out) return { result: null, newSessionId: undefined };
            return { result: await out.response, newSessionId: out.newSessionId };
          }));

          const responses = results.map(r => r.result).filter(Boolean);
          const newSessionId = results.find(r => r.newSessionId)?.newSessionId;
          const resHeaders: Record<string, string> = { ...cors };
          if (newSessionId) resHeaders['mcp-session-id'] = newSessionId;

          if (wantsSSE) {
            const enc = new TextEncoder();
            const stream = new ReadableStream({ start(c) { for (const r of responses) c.enqueue(enc.encode(sseEvent(r))); c.close(); } });
            return new Response(stream, { headers: { ...resHeaders, 'content-type': 'text/event-stream', 'cache-control': 'no-cache' } });
          }

          return new Response(JSON.stringify(responses.length === 1 ? responses[0] : responses), { headers: { ...resHeaders, 'content-type': 'application/json' } });
        }

        return new Response(null, { status: 405, headers: cors });
      });
    },

    async build(ctx) {
      const tools = [...defaultTools(ctx as any), ...userTools];
      const { skillContent, skillUrl, wellKnown, serverCard, agentSkillsIndex } =
        await buildDiscoveryDocs(serverName, serverVersion, endpoint, tools);
      await Promise.all([
        ctx.emitClientFile('.well-known/mcp.json', wellKnown),
        ctx.emitClientFile('.well-known/mcp/server-card.json', serverCard),
        ctx.emitClientFile('.well-known/agent-skills/index.json', agentSkillsIndex),
        ctx.emitClientFile(skillUrl.slice(1), skillContent),
        ctx.emitClientFile('webmcp.js', buildWebMcpScript(endpoint, tools)),
      ]);
    },
  };
}
