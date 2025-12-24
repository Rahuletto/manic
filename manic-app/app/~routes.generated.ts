import Route0 from "./routes/index.tsx";
import Route1 from "./routes/build.tsx";

export const routes = {
  "/": { default: Route0 },
  "/build": { default: Route1 },
};
