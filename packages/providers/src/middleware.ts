import type { BuildContext } from './types';

/**
 * Generates the agent middleware code to inject into provider workers.
 * Handles: Link headers, Accept: text/markdown negotiation, ?mode=agent.
 */
export function agentMiddleware(ctx: BuildContext): string {
  const plugins = ctx.config.plugins ?? [];
  const hasMcp = plugins.some(p => p.name === '@manicjs/mcp');
  const hasSeo = plugins.some(p => p.name === 'seo');
  const hasApiDocs = plugins.some(p => p.name === '@manicjs/api-docs');

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

  return `
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

  if (agentMode) {
    const info = {
      name: ${JSON.stringify(ctx.config.app?.name ?? 'Manic App')},
      mcp: ${hasMcp ? '"/.well-known/mcp/server-card.json"' : 'null'},
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
