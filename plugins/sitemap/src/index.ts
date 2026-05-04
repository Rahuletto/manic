import { createPlugin } from 'manicjs/config';
import { generateSitemapXml } from './generate';

/**
 * Sitemap generation configuration
 * @interface SitemapConfig
 */
export interface SitemapConfig {
  /** Base URL of the site, e.g. "https://example.com" */
  hostname: string;
  /** @default "weekly" */
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  /** @default 0.8 */
  priority?: number;
  /** Route paths to exclude from the sitemap */
  exclude?: string[];
}

/**
 * Creates a sitemap plugin that auto-generates sitemap.xml from routes.
 *
 * Scans page routes and generates an XML sitemap compatible with
 * search engines. Excludes dynamic routes automatically.
 *
 * @param config - Sitemap configuration
 * @returns ManicPlugin that generates sitemap.xml
 *
 * @example
 * import { sitemap } from '@manicjs/sitemap';
 *
 * sitemap({
 *   hostname: 'https://example.com',
 *   changefreq: 'daily',
 *   priority: 0.8,
 *   exclude: ['/admin'],
 * })
 */
export function sitemap(config: SitemapConfig) {
  return createPlugin({
    name: 'sitemap',
    staticFiles: [
      {
        path: '/sitemap.xml',
        content: ctx => generateSitemapXml(ctx.pageRoutes, config),
        contentType: 'application/xml',
      },
    ],
  });
}
