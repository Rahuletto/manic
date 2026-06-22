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
  const pathname = window.location.pathname;
  const segments = pathname === '/' ? [''] : pathname.split('/');
  let matchedEntry: any = null;
  for (const [pattern, entry] of Object.entries(routes)) {
    const patternSegs = pattern === '/' ? [''] : pattern.split('/');
    if (patternSegs.length !== segments.length) continue;
    let ok = true;
    for (let i = 0; i < patternSegs.length; i++) {
      const ps = patternSegs[i]!;
      const pp = segments[i]!;
      if (ps.startsWith(':')) {
        continue;
      } else if (ps !== pp) {
        ok = false;
        break;
      }
    }
    if (ok) {
      matchedEntry = entry;
      break;
    }
  }
  if (!matchedEntry) matchedEntry = routes['/'];
  if (matchedEntry) {
    const importFn =
      typeof matchedEntry === 'function'
        ? matchedEntry
        : matchedEntry.import;
    window.__MANIC_SSR_COMPONENT__ = (await importFn()).default;
  }
}

const app = (
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);

if (hasServerContent) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
