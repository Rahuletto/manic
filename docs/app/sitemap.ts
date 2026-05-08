import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const site = 'https://manicjs.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => ({
    url: `${site}${page.url}`,
    changeFrequency: 'weekly' as const,
    priority: page.url === '/docs' ? 1 : 0.7,
  }));

  return [
    {
      url: `${site}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...pages,
  ];
}
