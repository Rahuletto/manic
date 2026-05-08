import type { ManicPlugin, ManicServerPluginContext } from 'manicjs/config';

/**
 * Configuration options for API documentation
 * @interface ApiDocsOptions
 */
export interface ApiDocsOptions {
  /** Path to mount the docs UI (default: "/docs") */
  path?: string;
  /** OpenAPI spec URL (default: "/openapi.json") */
  specUrl?: string;
  /** Scalar theme (default: "default") */
  theme?: string;
}

/**
 * Creates an API documentation plugin using Scalar.
 *
 * Mounts an interactive API reference UI at /docs (or custom path).
 * Loads the OpenAPI spec from the specified URL.
 *
 * @param options - API documentation options
 * @returns ManicPlugin for API docs
 * @see https://www.manicjs.tech/docs/framework/plugins/api-docs#options
 *
 * @example
 * import { apiDocs } from '@manicjs/api-docs';
 *
 * apiDocs({
 *   path: '/docs',
 *   specUrl: '/openapi.json',
 *   theme: 'modern',
 * })
 */
export function apiDocs(options: ApiDocsOptions = {}): ManicPlugin {
  const docsPath = options.path ?? '/docs';
  const specUrl = options.specUrl ?? '/openapi.json';

  return {
    name: '@manicjs/api-docs',

    async configureServer(ctx: ManicServerPluginContext) {
      const { Hono } = await import('hono');
      const { apiReference } = await import('@scalar/hono-api-reference');

      const app = new Hono();
      app.get(
        docsPath,
        apiReference({ spec: { url: specUrl }, theme: options.theme as any })
      );

      ctx.addRoute(docsPath, req => app.fetch(req));
      ctx.addRoute(`${docsPath}/*`, req => app.fetch(req));
    },
  };
}
