import type { SitemapConfig } from './index';

/** Generates sitemap XML from a list of page routes. */
export function generateSitemapXml(
  routes: { path: string; dynamic: boolean }[],
  config: SitemapConfig
): string {
  const hostname = config.hostname.replace(/\/$/, '');
  const changefreq = config.changefreq ?? 'weekly';
  const priority = config.priority ?? 0.8;
  const exclude = config.exclude ?? [];

  const urls = routes
    .filter(r => !r.dynamic && !exclude.includes(r.path))
    .map(r => {
      const loc = r.path === '/' ? hostname + '/' : hostname + r.path;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
