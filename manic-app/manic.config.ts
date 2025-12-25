import { defineConfig } from "manicjs/config";
import { netlify } from "@manicjs/providers";

export default defineConfig({
  app: {
    name: "Manic",
  },

  server: {
    port: 6070,
  },

  providers: [netlify()],
});
