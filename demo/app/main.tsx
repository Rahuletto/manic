import { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Router, RouterContext } from 'manicjs/router';
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
    const importFn =
      typeof initialRouteEntry === 'function'
        ? initialRouteEntry
        : initialRouteEntry.import;
    window.__MANIC_SSR_COMPONENT__ = (await importFn()).default;
  }
}

function matchParams(pathname: string): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [pattern] of Object.entries(routes)) {
    const patternSegs = pattern === '/' ? [''] : pattern.split('/');
    const pathSegs = pathname === '/' ? [''] : pathname.split('/');
    if (patternSegs.length !== pathSegs.length) continue;
    let ok = true;
    for (let i = 0; i < patternSegs.length; i++) {
      const ps = patternSegs[i]!;
      const pp = pathSegs[i]!;
      if (ps.startsWith(':...')) {
        params[ps.slice(4)] = pathSegs.slice(i).join('/');
        break;
      } else if (ps.startsWith(':')) {
        params[ps.slice(1)] = pp;
      } else if (ps !== pp) {
        ok = false;
        break;
      }
    }
    if (ok) break;
  }
  return params;
}

function SsrHydrator() {
  const Component = window.__MANIC_SSR_COMPONENT__ ?? null;
  const loaderData = window.__MANIC_LOADER_DATA__ ?? null;
  const pathname = window.location.pathname;
  const params = useMemo(() => matchParams(pathname), [pathname]);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        window.history.replaceState({}, '', to);
      } else {
        window.history.pushState({}, '', to);
      }
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    []
  );

  const contextValue = useMemo(
    () => ({ path: pathname, navigate, params, loaderData }),
    [pathname, navigate, params, loaderData]
  );

  return (
    <ThemeProvider>
      <RouterContext.Provider value={contextValue}>
        {Component ? <Component loaderData={loaderData} /> : null}
      </RouterContext.Provider>
    </ThemeProvider>
  );
}

function App() {
  const [hydrated, setHydrated] = useState(!hasServerContent);

  useEffect(() => {
    if (!hydrated) setHydrated(true);
  }, [hydrated]);

  if (hydrated) {
    return (
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    );
  }

  return <SsrHydrator />;
}

if (hasServerContent) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
