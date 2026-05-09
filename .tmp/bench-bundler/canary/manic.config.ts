import { defineConfig } from "manicjs/config";
import { apiDocs } from "@manicjs/api-docs";
import { mcp } from "@manicjs/mcp";
import { seo } from "@manicjs/seo";

export default defineConfig({
  app: {
    name: "canary",
  },

  server: {
    port: 6070,
  },

  router: {
    viewTransitions: true,
  },
  plugins: [apiDocs(), mcp(), seo()],
});
