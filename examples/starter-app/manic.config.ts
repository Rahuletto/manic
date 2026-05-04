import { defineConfig } from 'manicjs/config';
import { apiDocs } from '@manicjs/api-docs';
import { tailwind } from '@manicjs/tailwind';

export default defineConfig({
  app: {
    name: 'Manic',
  },

  server: {
    port: 6070,
  },

  plugins: [tailwind(), apiDocs()],
});
