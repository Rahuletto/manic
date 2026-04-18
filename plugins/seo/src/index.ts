import type { ManicPlugin, ManicServerPluginContext, ManicBuildPluginContext } from 'manicjs/config';
import { generateRobotsTxt } from './robots';

export interface RobotRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface LinkHeader {
  href: string;
  /** IANA link relation type (e.g. "service-desc", "describedby") */
  rel: string;
  type?: string;
}

export interface SeoConfig {
  /** Base URL of the site, e.g. "https://example.com" */
  hostname: string;
  /** Crawler rules. Defaults to allow all. */
  rules?: RobotRule[];
  /** Additional sitemap URLs to include in robots.txt */
  sitemaps?: string[];
  /** Auto-add /sitemap.xml when @manicjs/sitemap is used @default true */
  autoSitemap?: boolean;
  /** Extra RFC 8288 Link headers added to all HTML responses */
  linkHeaders?: LinkHeader[];
  /**
   * Content-Signal directives appended to robots.txt.
   * @see https://contentsignals.org/
   */
  contentSignals?: {
    'ai-train'?: 'yes' | 'no';
    search?: 'yes' | 'no';
    'ai-input'?: 'yes' | 'no';
  };
}

export function seo(config: SeoConfig): ManicPlugin {
  return {
    name: 'seo',

    configureServer(ctx: ManicServerPluginContext) {
      const txt = generateRobotsTxt(config);
      ctx.addRoute('/robots.txt', () => new Response(txt, { headers: { 'content-type': 'text/plain; charset=utf-8' } }));

      const hostname = config.hostname.replace(/\/$/, '');
      if (config.autoSitemap ?? true) {
        ctx.addLinkHeader(`<${hostname}/sitemap.xml>; rel="describedby"; type="application/xml"`);
      }
      for (const s of config.sitemaps ?? []) {
        ctx.addLinkHeader(`<${s}>; rel="describedby"; type="application/xml"`);
      }
      for (const lh of config.linkHeaders ?? []) {
        ctx.addLinkHeader(`<${lh.href}>; rel="${lh.rel}"${lh.type ? `; type="${lh.type}"` : ''}`);
      }
    },

    async build(ctx: ManicBuildPluginContext) {
      await ctx.emitClientFile('robots.txt', generateRobotsTxt(config));
    },
  };
}
