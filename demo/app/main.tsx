import { createRoot } from "react-dom/client";
import { Router } from "manicjs";
import { ThemeProvider } from "manicjs/theme";
import { routes } from "./~routes.generated";
import "./global.css";

window.__MANIC_ROUTES__ = routes;

const root = createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);
