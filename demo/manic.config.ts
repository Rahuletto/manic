import { defineConfig } from 'manicjs/config';
import { cloudflare, vercel, netlify } from '@manicjs/providers';

export default defineConfig({
  app: {
    name: 'Manic',
  },
  // mode: "frontend",

  server: {
    port: 6070,
  },

  providers: [vercel(), cloudflare(), netlify()],
});
