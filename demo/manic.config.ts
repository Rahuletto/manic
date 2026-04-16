import { defineConfig } from 'manicjs/config';
import { cloudflare, vercel, netlify } from '@manicjs/providers';
import { apiDocs } from '@manicjs/api-docs';

export default defineConfig({
  app: {
    name: 'Manic',
  },
  // mode: "frontend",

  server: {
    port: 6070,
  },

  plugins: [apiDocs()],

  providers: [vercel(), cloudflare(), netlify()],
});
