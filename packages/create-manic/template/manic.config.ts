import { defineConfig } from 'manicjs/config';
import { apiDocs } from '@manicjs/api-docs';
import { mcp } from '@manicjs/mcp';
import { seo } from '@manicjs/seo';
import { tailwind } from '@manicjs/tailwind';
import { lightningcss } from '@manicjs/lightningcss';

export default defineConfig({
  app: {
    name: 'Manic',
  },
  server: {
    port: 6070,
  },
  plugins: [tailwind(), lightningcss(), apiDocs(), mcp(), seo()],
});
