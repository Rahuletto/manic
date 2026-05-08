import type { MetadataRoute } from 'next';

const site = 'https://manicjs.tech';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${site}/docs/sitemap.xml`,
    host: site,
  };
}
