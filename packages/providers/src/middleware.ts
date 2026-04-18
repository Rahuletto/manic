import type { BuildContext } from './types';

/**
 * Generates the agent middleware code to inject into provider workers.
 * Handles: Link headers, Accept: text/markdown negotiation, ?mode=agent, MCP endpoint.
 */
export function agentMiddleware(ctx: BuildContext): string {
  const plugins = ctx.config.plugins ?? [];
  const hasMcp = plugins.some(p => p.name === '@manicjs/mcp');
  const hasApiDocs = plugins.some(p => p.name === '@manicjs/api-docs');
  const mcpPlugin = plugins.find((p: any) => p.name === '@manicjs/mcp') as any;
  const mcpPath = mcpPlugin?.mcpPath ?? '/mcp';
  const mcpName = JSON.stringify(ctx.config.app?.name ?? 'manic-mcp');
  const appName = JSON.stringify(ctx.config.app?.name ?? 'Manic App');

  const linkHeaders: string[] = [
    '</openapi.json>; rel="service-desc"; type="application/json"',
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  ];
  if (hasMcp) {
    linkHeaders.push('</.well-known/mcp/server-card.json>; rel="mcp"; type="application/json"');
    linkHeaders.push('</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"');
  }
  if (hasApiDocs) {
    linkHeaders.push('</docs>; rel="service-doc"; type="text/html"');
  }

  const linkHeaderValue = linkHeaders.join(', ');

  const mcpBlock = !hasMcp ? '' : `
// ── MCP Streamable HTTP server ────────────────────────────────────────────────
const _mcpSessions = new Map();
const _mcpTools = [
  { name: 'get_page_meta', description: 'Fetches a page and extracts title, meta tags, and canonical link.', inputSchema: { type: 'object', properties: { url: { type: 'string', description: 'Absolute or relative URL' } }, required: ['url'] } },
  { name: 'get_rendered_elements', description: 'Fetches a page and returns a simplified element list for AI inspection.', inputSchema: { type: 'object', properties: { url: { type: 'string', description: 'Absolute or relative URL' }, selector: { type: 'string', description: 'CSS selector scope (default: body)' } }, required: ['url'] } },
];

async function _mcpCallTool(name, args, origin) {
  const base = origin || 'http://localhost';
  const target = (args.url || '').startsWith('http') ? args.url : base + (args.url || '/');
  const res = await fetch(target);
  const html = await res.text();
  if (name === 'get_page_meta') {
    const title = html.match(/<title[^>]*>([^<]*)<\\/title>/i)?.[1] ?? null;
    const metas = {};
    for (const m of html.matchAll(/<meta\\s+([^>]+)>/gi)) {
      const n = m[1].match(/(?:name|property)=["']([^"']+)["']/i)?.[1];
      const c = m[1].match(/content=["']([^"']+)["']/i)?.[1];
      if (n && c) metas[n] = c;
    }
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? null;
    return { title, meta: metas, canonical };
  }
  const elements = [];
  for (const m of html.matchAll(/<([a-z][a-z0-9-]*)([^>]*)>([\\s\\S]*?)<\\/\\1>/gi)) {
    const [, tag, attrs, inner] = m;
    if (['script','style','head'].includes(tag.toLowerCase())) continue;
    const id = attrs.match(/id=["']([^"']+)["']/i)?.[1];
    const cls = attrs.match(/class=["']([^"']+)["']/i)?.[1];
    const text = inner.replace(/<[^>]+>/g, '').trim().slice(0, 80) || undefined;
    elements.push({ tag, ...(id?{id}:{}), ...(cls?{class:cls}:{}), ...(text?{text}:{}) });
    if (elements.length >= 100) break;
  }
  return { selector: args.selector || 'body', elements };
}

async function _handleMcp(req) {
  const origin = req.headers.get('origin');
  const cors = origin ? { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS', 'access-control-allow-headers': 'content-type, accept, mcp-session-id', 'access-control-expose-headers': 'mcp-session-id' } : {};
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const sessionId = req.headers.get('mcp-session-id');
  if (req.method === 'DELETE') {
    _mcpSessions.delete(sessionId);
    return new Response(null, { status: 200, headers: cors });
  }
  if (req.method === 'GET') {
    if (!(req.headers.get('accept') || '').includes('text/event-stream')) return new Response(null, { status: 405, headers: cors });
    const stream = new ReadableStream({ start(c) { const t = setInterval(() => c.enqueue(new TextEncoder().encode(': ping\\n\\n')), 15000); req.signal.addEventListener('abort', () => { clearInterval(t); c.close(); }); } });
    return new Response(stream, { headers: { ...cors, 'content-type': 'text/event-stream', 'cache-control': 'no-cache' } });
  }
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: cors });
  let body; try { body = await req.json(); } catch { return new Response(JSON.stringify({ jsonrpc:'2.0', id:null, error:{code:-32700,message:'Parse error'} }), { status:400, headers:{...cors,'content-type':'application/json'} }); }
  const msgs = Array.isArray(body) ? body : [body];
  const resHeaders = { ...cors };
  const results = await Promise.all(msgs.map(async msg => {
    const { id, method, params } = msg;
    if (method === 'initialize') {
      const sid = crypto.randomUUID();
      _mcpSessions.set(sid, true);
      resHeaders['mcp-session-id'] = sid;
      return { jsonrpc:'2.0', id, result:{ protocolVersion:'2025-03-26', capabilities:{tools:{}}, serverInfo:{name:${mcpName},version:'1.0.0'} } };
    }
    if (method === 'notifications/initialized') return null;
    if (method === 'tools/list') return { jsonrpc:'2.0', id, result:{ tools:_mcpTools } };
    if (method === 'tools/call') {
      try {
        const result = await _mcpCallTool(params?.name, params?.arguments || {}, new URL(req.url).origin);
        return { jsonrpc:'2.0', id, result:{ content:[{type:'text',text:JSON.stringify(result)}] } };
      } catch(e) { return { jsonrpc:'2.0', id, error:{code:-32000,message:e.message} }; }
    }
    return { jsonrpc:'2.0', id:id??null, error:{code:-32601,message:'Method not found'} };
  }));
  const responses = results.filter(Boolean);
  const wantsSSE = (req.headers.get('accept') || '').includes('text/event-stream');
  if (wantsSSE) {
    const enc = new TextEncoder();
    const stream = new ReadableStream({ start(c) { for (const r of responses) c.enqueue(enc.encode('data: '+JSON.stringify(r)+'\\n\\n')); c.close(); } });
    return new Response(stream, { headers:{...resHeaders,'content-type':'text/event-stream','cache-control':'no-cache'} });
  }
  return new Response(JSON.stringify(responses.length===1?responses[0]:responses), { headers:{...resHeaders,'content-type':'application/json'} });
}
`;

  return `
${mcpBlock}
// ── Agent middleware ──────────────────────────────────────────────────────────

function htmlToMarkdown(html) {
  let md = html
    .replace(/<(script|style|noscript|svg|head)\\b[^>]*>[\\s\\S]*?<\\/\\1>/gi, '')
    .replace(/<h([1-6])\\b[^>]*>([\\s\\S]*?)<\\/h\\1>/gi, (_, l, c) => '\\n' + '#'.repeat(+l) + ' ' + c.replace(/<[^>]+>/g, '').trim() + '\\n')
    .replace(/<p\\b[^>]*>([\\s\\S]*?)<\\/p>/gi, (_, c) => { const t = c.replace(/<[^>]+>/g, '').trim(); return t ? '\\n' + t + '\\n' : ''; })
    .replace(/<(strong|b)\\b[^>]*>([\\s\\S]*?)<\\/\\1>/gi, (_, __, c) => '**' + c.replace(/<[^>]+>/g, '').trim() + '**')
    .replace(/<(em|i)\\b[^>]*>([\\s\\S]*?)<\\/\\1>/gi, (_, __, c) => '*' + c.replace(/<[^>]+>/g, '').trim() + '*')
    .replace(/<a\\b[^>]*href=["']([^"']*)["'][^>]*>([\\s\\S]*?)<\\/a>/gi, (_, h, t) => { const l = t.replace(/<[^>]+>/g, '').trim(); return l ? '[' + l + '](' + h + ')' : ''; })
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\\n{3,}/g, '\\n\\n').trim();
  return md + '\\n';
}

async function withAgentSupport(req, fetchAsset) {
  const url = new URL(req.url);
  const accept = req.headers.get('accept') || '';
  const wantsMarkdown = accept.includes('text/markdown');
  const agentMode = url.searchParams.get('mode') === 'agent';

  ${hasMcp ? `if (url.pathname === ${JSON.stringify(mcpPath)} || url.pathname.startsWith(${JSON.stringify(mcpPath + '/')})) return _handleMcp(req);` : ''}

  if (agentMode) {
    const info = {
      name: ${appName},
      mcp: ${hasMcp ? `"/.well-known/mcp/server-card.json"` : 'null'},
      openapi: '/openapi.json',
      docs: ${hasApiDocs ? '"/docs"' : 'null'},
      agentSkills: ${hasMcp ? '"/.well-known/agent-skills/index.json"' : 'null'},
      discovery: '/.well-known/api-catalog',
    };
    return new Response(JSON.stringify(info, null, 2), {
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    });
  }

  const res = await fetchAsset(req);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return res;

  const headers = new Headers(res.headers);
  headers.set('Link', ${JSON.stringify(linkHeaderValue)});

  if (wantsMarkdown) {
    const html = await res.text();
    const md = htmlToMarkdown(html);
    headers.set('content-type', 'text/markdown; charset=utf-8');
    headers.set('vary', 'Accept');
    headers.set('x-markdown-tokens', String(Math.ceil(md.length / 4)));
    return new Response(md, { status: res.status, headers });
  }

  return new Response(res.body, { status: res.status, headers });
}
`;
}
