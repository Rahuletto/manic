import { defineConfig } from 'manicjs/config';
import { apiDocs } from '@manicjs/api-docs';
import { mcp } from '@manicjs/mcp';

export default defineConfig({
  app: {
    name: 'Manic',
  },
  server: {
    port: 6070,
  },
  plugins: [apiDocs(), mcp()],
});
