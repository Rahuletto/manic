export const routes = {
  "/": {
    import: () => import("./routes/index"),
    client: false
  },
  "/post/:slug": {
    import: () => import("./routes/post/[slug]"),
    client: false
  },
};

export const notFoundPage = undefined;
export const errorPage = undefined;
