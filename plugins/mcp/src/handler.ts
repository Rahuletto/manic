import type { McpTool } from './tool';
import { PROTOCOL_VERSION } from './discovery';

export type HandleResult = { response: unknown; newSessionId?: string } | null;

/** Handles a single JSON-RPC message and returns the response (or null for notifications). */
export function handleMessage(
  msg: Record<string, unknown>,
  sessionId: string | null,
  sessions: Map<string, { initialized: boolean }>,
  tools: McpTool[],
  serverName: string,
  serverVersion: string
): HandleResult {
  const { id, method, params } = msg as {
    id?: unknown;
    method?: string;
    params?: any;
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
    const s = sessionId ? sessions.get(sessionId) : null;
    if (s) s.initialized = true;
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
    const tool = tools.find(t => t.name === params?.name);
    if (!tool) {
      return {
        response: {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool not found: ${params?.name}` },
        },
      };
    }
    return {
      response: (async () => {
        try {
          const result = await tool.execute(params?.arguments ?? {});
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            },
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

export function sseEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}
