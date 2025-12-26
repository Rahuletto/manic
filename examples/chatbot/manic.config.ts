import { defineConfig } from "manicjs/config";

export default defineConfig({
  app: {
    name: "chatbot",
  },

  server: {
    port: 6070,
  },

  router: {
    viewTransitions: true,
  },

  swagger: {
    path: "/docs",
  },
});
