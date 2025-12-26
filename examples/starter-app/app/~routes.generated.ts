export const routes = {
  "/": () => import("./routes/index.tsx"),
  "/build": () => import("./routes/build.tsx"),
};
