import type {
  ManicPlugin,
  ManicServerPluginContext,
  ManicBuildPluginContext,
} from 'manicjs/config';
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
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Author name */
  author?: string;
  /** Twitter card config */
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  /** Open Graph config */
  openGraph?: {
    type?: string;
    locale?: string;
    image?: string;
    siteName?: string;
  };
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

function generateMetaTags(config: SeoConfig): string {
  const tags: string[] = [];
  const hostname = config.hostname.replace(/\/$/, '');

  if (config.title)
    tags.push(`  <meta name="title" content="${config.title}">`);
  if (config.description)
    tags.push(`  <meta name="description" content="${config.description}">`);
  if (config.author)
    tags.push(`  <meta name="author" content="${config.author}">`);

  // Open Graph
  if (config.title)
    tags.push(`  <meta property="og:title" content="${config.title}">`);
  if (config.description)
    tags.push(
      `  <meta property="og:description" content="${config.description}">`
    );
  tags.push(`  <meta property="og:url" content="${hostname}">`);
  if (config.openGraph?.type)
    tags.push(`  <meta property="og:type" content="${config.openGraph.type}">`);
  if (config.openGraph?.locale)
    tags.push(
      `  <meta property="og:locale" content="${config.openGraph.locale}">`
    );
  if (config.openGraph?.image)
    tags.push(
      `  <meta property="og:image" content="${config.openGraph.image}">`
    );
  if (config.openGraph?.siteName)
    tags.push(
      `  <meta property="og:site_name" content="${config.openGraph.siteName}">`
    );

  // Twitter
  if (config.twitter?.card)
    tags.push(`  <meta name="twitter:card" content="${config.twitter.card}">`);
  if (config.twitter?.site)
    tags.push(`  <meta name="twitter:site" content="${config.twitter.site}">`);
  if (config.twitter?.creator)
    tags.push(
      `  <meta name="twitter:creator" content="${config.twitter.creator}">`
    );
  if (config.title)
    tags.push(`  <meta name="twitter:title" content="${config.title}">`);
  if (config.description)
    tags.push(
      `  <meta name="twitter:description" content="${config.description}">`
    );

  return tags.join('\n');
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

      const hostname = config.hostname.replace(/\/$/, '');
      if (config.autoSitemap ?? true) {
        ctx.addLinkHeader(
          `<${hostname}/sitemap.xml>; rel="describedby"; type="application/xml"`
        );
      }
      for (const s of config.sitemaps ?? []) {
        ctx.addLinkHeader(`<${s}>; rel="describedby"; type="application/xml"`);
      }
      for (const lh of config.linkHeaders ?? []) {
        ctx.addLinkHeader(
          `<${lh.href}>; rel="${lh.rel}"${lh.type ? `; type="${lh.type}"` : ''}`
        );
      }

      const metaTags = generateMetaTags(config);
      if (metaTags) ctx.injectHtml(metaTags);
    },

    async build(ctx: ManicBuildPluginContext) {
      await ctx.emitClientFile('robots.txt', generateRobotsTxt(config));

      const metaTags = generateMetaTags(config);
      if (metaTags) ctx.injectHtml(metaTags);
    },
  };
}
