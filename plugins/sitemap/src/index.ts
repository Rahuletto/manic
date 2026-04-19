import { createPlugin } from 'manicjs/config';
import { generateSitemapXml } from './generate';

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
