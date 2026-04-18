import { defineConfig } from 'manicjs/config';
import { cloudflare, vercel } from '@manicjs/providers';
import { apiDocs } from '@manicjs/api-docs';
import { seo } from '@manicjs/seo';
import { sitemap } from '@manicjs/sitemap';
import { mcp } from '@manicjs/mcp';

export default defineConfig({
  app: {
    name: 'Manic',
  },

  server: {
    port: 6070,
  },

  plugins: [
    apiDocs(),
    seo({ hostname: 'https://manic.js.org' }),
    sitemap({ hostname: 'https://manic.js.org' }),
    mcp({ name: 'manic-demo' }),
  ],

  providers: [vercel(), cloudflare()],
});
