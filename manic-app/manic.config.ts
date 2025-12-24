import { defineConfig } from "manicjs/config";

export default defineConfig({
  app: {
    name: "Manic",
  },

  server: {
    port: 6070,
    // hmr: true,
  },

  // router: {
  //   viewTransitions: true,
  //   preserveScroll: false,
  //   scrollBehavior: "auto",
  // },

  // build: {
  //   minify: true,
  //   sourcemap: "inline",
  //   splitting: true,
  //   outdir: ".manic",
  // },

  // swagger: {
  //   path: "/docs",
  //   documentation: {
  //     info: {
  //       title: "API",
  //       description: "API documentation",
  //       version: "1.0.0",
  //     },
  //   },
  // },
});
