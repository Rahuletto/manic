import type { SeoConfig } from './index';

/** Generates the full robots.txt content from the SEO config. */
export function generateRobotsTxt(config: SeoConfig): string {
  const hostname = config.hostname.replace(/\/$/, '');
  const autoSitemap = config.autoSitemap ?? true;
  const rules = config.rules?.length ? config.rules : [{ userAgent: '*', allow: ['/'] }];
  const lines: string[] = [];

  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`);
    for (const p of rule.allow ?? []) lines.push(`Allow: ${p}`);
    for (const p of rule.disallow ?? []) lines.push(`Disallow: ${p}`);
    if (rule.crawlDelay != null) lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    lines.push('');
  }

  const sitemaps = config.sitemaps ? [...config.sitemaps] : [];
  if (autoSitemap) {
    const url = `${hostname}/sitemap.xml`;
    if (!sitemaps.includes(url)) sitemaps.push(url);
  }
  for (const s of sitemaps) lines.push(`Sitemap: ${s}`);

  if (config.contentSignals) {
    const parts = Object.entries(config.contentSignals).map(([k, v]) => `${k}=${v}`);
    if (parts.length) lines.push('', `Content-Signal: ${parts.join(', ')}`);
  }

  return lines.join('\n').trim() + '\n';
}
