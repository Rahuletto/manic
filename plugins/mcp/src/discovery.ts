import type { McpTool } from './tool';

const PROTOCOL_VERSION = '2025-03-26';

export { PROTOCOL_VERSION };

/** Builds all well-known discovery documents from the active tool list. */
export async function buildDiscoveryDocs(
  serverName: string,
  serverVersion: string,
  endpoint: string,
  tools: McpTool[]
) {
  const toolDocs = tools
    .map(t => {
      const props = t.inputSchema.properties ?? {};
      const req = new Set(t.inputSchema.required ?? []);
      const params = Object.entries(props)
        .map(
          ([k, v]: [string, any]) =>
            `  - \`${k}${req.has(k) ? '' : '?'}\` (${v.type ?? 'string'})${v.description ? ': ' + v.description : ''}`
        )
        .join('\n');
      return [
        `### \`${t.name}\``,
        t.description,
        ...(params
          ? ['', '**Parameters:**', params]
          : ['', '_No parameters._']),
      ].join('\n');
    })
    .join('\n\n');

  const skillContent = `# ${serverName} — MCP Server Skill

## Overview

This server implements the [Model Context Protocol](https://modelcontextprotocol.io) (MCP ${PROTOCOL_VERSION}) using the **Streamable HTTP** transport.

## Connection

**Endpoint:** \`${endpoint}\`
**Transport:** Streamable HTTP (POST + optional SSE)
**Discovery:** \`/.well-known/mcp/server-card.json\`

### Initialization sequence

1. \`POST ${endpoint}\` with \`initialize\` (no \`Mcp-Session-Id\` header)
2. Server responds with \`InitializeResult\` + \`Mcp-Session-Id\` response header
3. \`POST ${endpoint}\` with \`notifications/initialized\` (include \`Mcp-Session-Id\`)
4. All subsequent requests must include \`Mcp-Session-Id\`

### Request format

\`\`\`http
POST ${endpoint}
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: <session-id>

{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"<tool>","arguments":{...}}}
\`\`\`

## Available tools

${toolDocs}

## Ending a session

\`\`\`http
DELETE ${endpoint}
Mcp-Session-Id: <session-id>
\`\`\`
`;

  const skillBytes = new TextEncoder().encode(skillContent);
  const hashBuf = await crypto.subtle.digest('SHA-256', skillBytes);
  const digest =
    'sha256:' +
    Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  const skillUrl = '/.well-known/agent-skills/use-mcp/SKILL.md';

  return {
    skillContent,
    skillUrl,
    wellKnown: JSON.stringify({
      mcpVersion: PROTOCOL_VERSION,
      endpoint,
      name: serverName,
      version: serverVersion,
      tools: tools.map(t => ({ name: t.name, description: t.description })),
    }),
    serverCard: JSON.stringify({
      serverInfo: { name: serverName, version: serverVersion },
      transport: { type: 'streamable-http', endpoint },
      capabilities: { tools: true, resources: false, prompts: false },
    }),
    agentSkillsIndex: JSON.stringify({
      $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
      skills: [
        {
          name: 'use-mcp',
          type: 'skill-md',
          description: `How to connect to and use the ${serverName} MCP server`,
          url: skillUrl,
          digest,
        },
      ],
    }),
  };
}
