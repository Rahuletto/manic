import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { green, dim, yellow, bold } from 'colorette';
import type { ManicProvider, BuildContext } from '../types';
import { agentMiddleware } from '../middleware';

export interface VercelOptions {
  runtime?: 'bun' | 'edge' | 'nodejs20.x' | 'nodejs22.x';
  regions?: string[];
  memory?: number;
  maxDuration?: number;
}

export function vercel(options: VercelOptions = {}): ManicProvider {
  const runtime = options.runtime ?? 'bun';

  return {
    name: 'vercel',
    async build(ctx: BuildContext) {
      process.stdout.write(dim('● Exporting to Vercel...'));

      const vDist = '.vercel/output';
      rmSync(vDist, { recursive: true, force: true });
      mkdirSync(`${vDist}/static`, { recursive: true });
      mkdirSync(`${vDist}/functions/api.func`, { recursive: true });

      cpSync(`${ctx.dist}/client`, `${vDist}/static`, { recursive: true });

      const faviconFiles = ['favicon.ico', 'favicon.svg', 'favicon.png'];
      for (const favicon of faviconFiles) {
        if (existsSync(`${vDist}/static/assets/${favicon}`)) {
          cpSync(
            `${vDist}/static/assets/${favicon}`,
            `${vDist}/static/${favicon}`
          );
          break;
        }
      }

      const docsPath = '/docs';

      const vConfig = {
        version: 3,
        routes: [
          { handle: 'filesystem' },
          { src: '/api/(.*)', dest: '/api' },
          { src: '/openapi.json', dest: '/api' },
          { src: '/docs(.*)', dest: '/api' },
          { src: '/(.*)', dest: '/index.html' },
        ],
      };
      await Bun.write(`${vDist}/config.json`, JSON.stringify(vConfig, null, 2));

      const vcConfig: Record<string, unknown> =
        runtime === 'edge'
          ? { runtime: 'edge', entrypoint: 'index.mjs' }
          : {
              runtime: runtime === 'bun' ? 'bun1.x' : runtime,
              handler: 'index.mjs',
              shouldAddHelpers: false,
              supportsResponseStreaming: true,
            };

      if (runtime !== 'bun' && runtime !== 'edge') {
        vcConfig.launcherType = 'Nodejs';
      }

      if (options.regions) vcConfig.regions = options.regions;
      if (options.memory) vcConfig.memory = options.memory;
      if (options.maxDuration) vcConfig.maxDuration = options.maxDuration;

      await Bun.write(
        `${vDist}/functions/api.func/.vc-config.json`,
        JSON.stringify(vcConfig, null, 2)
      );

      const apiImports: string[] = [];
      const apiMounts: string[] = [];
      const apiRoutes: string[] = [];

      if (existsSync(`${ctx.dist}/api`)) {
        mkdirSync(`${vDist}/functions/api.func/api`, { recursive: true });
        cpSync(`${ctx.dist}/api`, `${vDist}/functions/api.func/api`, {
          recursive: true,
        });

        for (const entry of ctx.apiEntries) {
          const name = entry
            .replace('app/api/', '')
            .replace('/index.ts', '')
            .replace('index.ts', 'root');

          const safeName = name.replace(/-/g, '_');
          apiImports.push(`import api_${safeName} from "./api/${name}.js";`);
          const routePath = name === 'root' ? '/' : `/${name}`;
          apiMounts.push(`apiApp.route("${routePath}", api_${safeName});`);
          apiRoutes.push(routePath);
        }
      }

      // Detect if apiDocs plugin is configured
      const hasApiDocs = ctx.config.plugins?.some(
        p => p.name === '@manicjs/api-docs'
      );

      const serverCode = `import { Hono } from "hono";
${apiImports.join('\n')}

const app = new Hono();
const apiApp = new Hono();

${apiMounts.join('\n')}

app.route("/api", apiApp);

// OpenAPI spec
const paths = {};
${apiRoutes.map(route => `paths["/api${route === '/' ? '' : route}"] = { get: { responses: { 200: { description: "OK" } } } };`).join('\n')}
const spec = { openapi: "3.0.0", info: { title: "${ctx.config.app?.name ?? 'Manic'} API", version: "1.0.0" }, paths };
app.get("/openapi.json", (c) => c.json(spec));

app.get("/docs", (c) => c.html(\`<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>API Reference</title></head><body><script id="api-reference" data-url="/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script></body></html>\`));
app.get("/docs/*", (c) => c.html(\`<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>API Reference</title></head><body><script id="api-reference" data-url="/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script></body></html>\`));

${agentMiddleware(ctx)}

app.all("/*", async (c) => withAgentSupport(c.req.raw, () => Promise.resolve(new Response("Not found", { status: 404 }))));

${runtime === 'edge' ? 'export default (req, ctx) => app.fetch(req, { vercel: ctx });' : 'export default { fetch: app.fetch };'}
`;

      // Write raw source, then bundle so all deps (hono, etc.) are inlined.
      // Without this, Bun on Vercel tries to auto-install missing packages
      // and hits ReadOnlyFileSystem.
      const rawEntry = `${vDist}/functions/api.func/_entry.mjs`;
      await Bun.write(rawEntry, serverCode);

      const bundle = await Bun.build({
        entrypoints: [rawEntry],
        outdir: `${vDist}/functions/api.func`,
        target: 'bun',
        minify: true,
        naming: { entry: 'index.mjs' },
      });

      if (!bundle.success) {
        console.error('\n  Failed to bundle Vercel function:');
        bundle.logs.forEach(l => console.error(' ', l));
      }

      // Clean up raw entry
      const { unlinkSync } = await import('node:fs');
      try {
        unlinkSync(rawEntry);
      } catch {}

      await Bun.write(
        `${vDist}/functions/api.func/package.json`,
        JSON.stringify({ type: 'module' }, null, 2)
      );

      // Create vercel.json if it doesn't exist (for GitHub integration)
      if (!existsSync('vercel.json')) {
        const vercelJson = {
          buildCommand: 'bun run build',
          installCommand: 'bun install',
          framework: null,
        };
        await Bun.write('vercel.json', JSON.stringify(vercelJson, null, 2));
        console.log(
          dim(
            '\n  Created vercel.json - commit this to your repo for GitHub integration'
          )
        );
      }

      process.stdout.write(
        `\r${dim(green('● Exporting to Vercel... done'))}\n`
      );
      console.log(yellow(bold('ℹ Deploy: manic deploy --run')));
      console.log(dim('  For GitHub CI/CD: commit vercel.json and push'));
    },
  };
}
