import { defineConfig } from 'manicjs/config';
import { apiDocs } from '@manicjs/api-docs';

export default defineConfig({
  app: {
    name: 'chatbot',
  },

  server: {
    port: 6070,
  },

  plugins: [apiDocs()],
});
