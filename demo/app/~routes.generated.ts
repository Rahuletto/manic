export const routes = {
  "/": () => import("./routes/index"),
  "/build": () => import("./routes/build"),
};

export const notFoundPage = undefined;
export const errorPage = undefined;
