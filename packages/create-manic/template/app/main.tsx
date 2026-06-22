import { createRoot, hydrateRoot } from 'react-dom/client';
import { Router } from 'manicjs/router';
import { ThemeProvider } from 'manicjs/theme';
import { routes, notFoundPage, errorPage } from './~routes.generated';
import './global.css';

window.__MANIC_ROUTES__ = routes;
window.__MANIC_ERROR_PAGES__ = {};
if (notFoundPage) window.__MANIC_ERROR_PAGES__.notFound = notFoundPage;
if (errorPage) window.__MANIC_ERROR_PAGES__.error = errorPage;

const rootEl = document.getElementById('root')!;
const hasServerContent = rootEl.hasChildNodes();

if (hasServerContent) {
  const initialRouteEntry = routes[window.location.pathname] ?? routes['/'];
  if (initialRouteEntry) {
    const importFn = typeof initialRouteEntry === 'function' ? initialRouteEntry : initialRouteEntry.import;
    window.__MANIC_SSR_COMPONENT__ = (await importFn()).default;
  }
}

if (hasServerContent) {
  hydrateRoot(
    rootEl,
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
} else {
  createRoot(rootEl).render(
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
