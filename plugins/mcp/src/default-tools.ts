import type { ManicServerPluginContext } from 'manicjs/config';
import type { McpTool } from './tool';
import { consoleLogTool } from './console';

/** Returns the built-in framework tools derived from the plugin context. */
export function defaultTools(ctx: ManicServerPluginContext): McpTool[] {
  const port = ctx.config.server?.port ?? 6070;

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
        'Fetches a page and extracts its <title>, meta tags (og:*, description, etc.), and canonical link.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Absolute or relative URL' },
        },
        required: ['url'],
      },
      async execute({ url }) {
        const target = String(url);
        const res = await fetch(
          target.startsWith('http')
            ? target
            : `http://localhost:${port}${target}`
        );
        const html = await res.text();
        const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? null;
        const metas: Record<string, string> = {};
        for (const m of html.matchAll(/<meta\s+([^>]+)>/gi)) {
          const name =
            m[1].match(/(?:name|property)=["']([^"']+)["']/i)?.[1] ?? null;
          const content = m[1].match(/content=["']([^"']+)["']/i)?.[1] ?? null;
          if (name && content) metas[name] = content;
        }
        const canonical =
          html.match(
            /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
          )?.[1] ?? null;
        return { title, meta: metas, canonical };
      },
    },
    {
      name: 'get_rendered_elements',
      description:
        'Fetches a page and returns a simplified element list (tag, id, class, text) for AI inspection.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Absolute or relative URL' },
          selector: {
            type: 'string',
            description: 'CSS selector scope (default: body)',
          },
        },
        required: ['url'],
      },
      async execute({ url, selector }) {
        const target = String(url);
        const res = await fetch(
          target.startsWith('http')
            ? target
            : `http://localhost:${port}${target}`
        );
        const html = await res.text();
        const scope = selector ? String(selector) : 'body';
        const elements: Array<{
          tag: string;
          id?: string;
          class?: string;
          text?: string;
        }> = [];
        for (const m of html.matchAll(
          /<([a-z][a-z0-9-]*)([^>]*)>([\s\S]*?)<\/\1>/gi
        )) {
          const [, tag, attrs, inner] = m;
          if (['script', 'style', 'head'].includes(tag.toLowerCase())) continue;
          const id = attrs.match(/id=["']([^"']+)["']/i)?.[1];
          const cls = attrs.match(/class=["']([^"']+)["']/i)?.[1];
          const text =
            inner
              .replace(/<[^>]+>/g, '')
              .trim()
              .slice(0, 80) || undefined;
          elements.push({
            tag,
            ...(id ? { id } : {}),
            ...(cls ? { class: cls } : {}),
            ...(text ? { text } : {}),
          });
          if (elements.length >= 100) break;
        }
        return { selector: scope, elements };
      },
    },
  ];

  if (!ctx.prod) tools.push(consoleLogTool());

  return tools;
}
