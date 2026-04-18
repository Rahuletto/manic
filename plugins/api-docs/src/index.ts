import type { ManicPlugin, ManicServerPluginContext } from 'manicjs/config';

export interface ApiDocsOptions {
  /** Path to mount the docs UI @default "/docs" */
  path?: string;
  /** OpenAPI spec URL @default "/openapi.json" */
  specUrl?: string;
  /** Scalar theme @default "default" */
  theme?: string;
}

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
