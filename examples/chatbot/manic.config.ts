import { defineConfig } from 'manicjs/config';
import { apiDocs } from '@manicjs/api-docs';
import { mcp } from '@manicjs/mcp';
import { seo } from '@manicjs/seo';
import { agents } from './app/contexts/agents';

export default defineConfig({
  app: {
    name: 'chatbot',
    description: 'AI-powered chatbot for Manic framework',
  },

  server: {
    port: 6070,
  },

  plugins: [
    apiDocs(),
    mcp(),
    agents(),
    seo({
      hostname: 'https://manicjs.org',
      title: 'Manic Chatbot',
      description: 'AI-powered chatbot for Manic framework',
      author: 'Manic Team',
      twitter: {
        card: 'summary_large_image',
        site: '@manicjs',
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
      },
    }),
  ],
});
