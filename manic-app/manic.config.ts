import { defineConfig } from "manicjs/config";
// import { vercel } from "@manicjs/providers";

export default defineConfig({
  app: {
    name: "Manic",
  },

  server: {
    port: 6070,
  },

  // providers: [vercel()],
});
