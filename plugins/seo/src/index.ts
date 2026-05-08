import { createPlugin } from 'manicjs/config';
import { generateRobotsTxt } from './robots';

/**
 * Robot rule for robots.txt
 * @interface RobotRule
 */
export interface RobotRule {
  /** User agent pattern (e.g. "*", "GoogleBot") */
  userAgent: string;
  /** Allowed paths */
  allow?: string[];
  /** Disallowed paths */
  disallow?: string[];
  /** Crawl delay in seconds */
  crawlDelay?: number;
}

/**
 * RFC 8288 Link header configuration
 * @interface LinkHeader
 */
export interface LinkHeader {
  /** Target URL for the link */
  href: string;
  /** IANA link relation type (e.g. "service-desc", "describedby") */
  rel: string;
  /** Media type (e.g. "application/json") */
  type?: string;
}

/**
 * SEO configuration for meta tags, Open Graph, Twitter Cards, and robots.txt
 * @interface SeoConfig
 */
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

/**
 * Creates an SEO plugin for meta tags, Open Graph, Twitter Cards, and robots.txt.
 *
 * Generates:
 * - robots.txt with crawl rules
 * - Meta tags (title, description, author)
 * - Open Graph tags for social sharing
 * - Twitter Card tags
 * - RFC 8288 Link headers for sitemap discovery
 *
 * @param config - SEO configuration options
 * @returns ManicPlugin for SEO
 * @see https://www.manicjs.tech/docs/framework/plugins/seo#global-options
 *
 * @example
 * import { seo } from '@manicjs/seo';
 *
 * seo({
 *   hostname: 'https://example.com',
 *   title: 'My App',
 *   description: 'A great app',
 *   twitter: { card: 'summary_large_image' },
 * })
 */
export function seo(config: SeoConfig) {
  return createPlugin({
    name: 'seo',

    staticFiles: [
      {
        path: '/robots.txt',
        content: generateRobotsTxt(config),
        contentType: 'text/plain; charset=utf-8',
      },
    ],

    configureServer(ctx) {
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

    build(ctx) {
      const metaTags = generateMetaTags(config);
      if (metaTags) ctx.injectHtml(metaTags);
    },
  });
}
