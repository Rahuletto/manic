import type {
  ManicPlugin,
  ManicServerPluginContext,
  ManicBuildPluginContext,
} from 'manicjs/config';
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

export function sitemap(config: SitemapConfig): ManicPlugin {
  return {
    name: 'sitemap',

    configureServer(ctx: ManicServerPluginContext) {
      const xml = generateSitemapXml(ctx.pageRoutes, config);
      ctx.addRoute(
        '/sitemap.xml',
        () =>
          new Response(xml, { headers: { 'content-type': 'application/xml' } })
      );
    },

    async build(ctx: ManicBuildPluginContext) {
      await ctx.emitClientFile(
        'sitemap.xml',
        generateSitemapXml(ctx.pageRoutes, config)
      );
    },
  };
}
