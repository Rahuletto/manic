import { defineConfig } from 'manicjs/config';
import { cloudflare, vercel } from '@manicjs/providers';
import { apiDocs } from '@manicjs/api-docs';
import { seo } from '@manicjs/seo';
import { sitemap } from '@manicjs/sitemap';
import { mcp } from '@manicjs/mcp';
import { tailwind } from '@manicjs/tailwind';
import { pwa } from '@manicjs/pwa';

export default defineConfig({
  app: {
    name: 'Manic',
  },

  server: {
    port: 6070,
  },

  plugins: [
    apiDocs(),
    seo({
      hostname: 'https://manic.js.org',
      contentSignals: { 'ai-train': 'no', search: 'yes', 'ai-input': 'yes' },
    }),
    sitemap({ hostname: 'https://manic.js.org' }),
    mcp({ name: 'manic-demo' }),
    tailwind(),
    pwa({
      name: 'Manic Demo App',
      shortName: 'ManicDemo',
      themeColor: '#101010',
      backgroundColor: '#ffffff',
      registerOnLocalhost: true,
      icons: [
        {
          src: '/assets/icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
        {
          src: '/assets/icon.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    }),
  ],

  providers: [vercel(), cloudflare()],
});
