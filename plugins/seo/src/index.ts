import type {
  ManicPlugin,
  ManicServerPluginContext,
  ManicBuildPluginContext,
} from 'manicjs/config';

export interface RobotRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface LinkHeader {
  /** URL or path to the resource */
  href: string;
  /** Link relation type (e.g. "service-desc", "describedby") */
  rel: string;
  /** Optional MIME type */
  type?: string;
}

export interface SeoConfig {
  /** Base URL for the site (e.g. "https://example.com") */
  hostname: string;
  /** Robot rules — defaults to allow all */
  rules?: RobotRule[];
  /** Additional sitemaps to reference (full URLs) */
  sitemaps?: string[];
  /** Auto-reference /sitemap.xml if @manicjs/sitemap is also used @default true */
  autoSitemap?: boolean;
  /** Additional Link headers to add to HTML responses (RFC 8288) */
  linkHeaders?: LinkHeader[];
}

function generateRobotsTxt(config: SeoConfig): string {
  const hostname = config.hostname.replace(/\/$/, '');
  const autoSitemap = config.autoSitemap ?? true;

  const rules: RobotRule[] = config.rules?.length
    ? config.rules
    : [{ userAgent: '*', allow: ['/'] }];

  const lines: string[] = [];

  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`);

    if (rule.allow) {
      for (const path of rule.allow) {
        lines.push(`Allow: ${path}`);
      }
    }

    if (rule.disallow) {
      for (const path of rule.disallow) {
        lines.push(`Disallow: ${path}`);
      }
    }

    if (rule.crawlDelay != null) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }

    lines.push('');
  }

  const sitemaps = config.sitemaps ? [...config.sitemaps] : [];
  if (autoSitemap) {
    const sitemapUrl = `${hostname}/sitemap.xml`;
    if (!sitemaps.includes(sitemapUrl)) {
      sitemaps.push(sitemapUrl);
    }
  }

  for (const s of sitemaps) {
    lines.push(`Sitemap: ${s}`);
  }

  return lines.join('\n').trim() + '\n';
}

export function seo(config: SeoConfig): ManicPlugin {
  return {
    name: 'seo',

    configureServer(ctx: ManicServerPluginContext) {
      const txt = generateRobotsTxt(config);
      ctx.addRoute(
        '/robots.txt',
        () =>
          new Response(txt, {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
          })
      );

      // Link headers for agent discovery (RFC 8288)
      const hostname = config.hostname.replace(/\/$/, '');
      const autoSitemap = config.autoSitemap ?? true;

      if (autoSitemap) {
        ctx.addLinkHeader(`<${hostname}/sitemap.xml>; rel="describedby"; type="application/xml"`);
      }
      for (const s of config.sitemaps ?? []) {
        ctx.addLinkHeader(`<${s}>; rel="describedby"; type="application/xml"`);
      }

      if (config.linkHeaders) {
        for (const lh of config.linkHeaders) {
          let value = `<${lh.href}>; rel="${lh.rel}"`;
          if (lh.type) value += `; type="${lh.type}"`;
          ctx.addLinkHeader(value);
        }
      }
    },

    async build(ctx: ManicBuildPluginContext) {
      const txt = generateRobotsTxt(config);
      await ctx.emitClientFile('robots.txt', txt);
    },
  };
}
