import { rmSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { green, dim, yellow, bold, red } from "colorette";
import type { ManicProvider, BuildContext } from "../types";

export interface CloudflareOptions {
  /**
   * Compatibility date for the worker
   * @default "2025-06-01"
   */
  compatibilityDate?: string;
  /**
   * Project name for Cloudflare Pages
   */
  projectName?: string;
}

export function cloudflare(options: CloudflareOptions = {}): ManicProvider {
  const compatDate = options.compatibilityDate ?? "2025-06-01";

  return {
    name: "cloudflare",
    async build(ctx: BuildContext) {
      process.stdout.write(dim("● Exporting to Cloudflare Pages..."));

      const cfDist = "dist";
      rmSync(cfDist, { recursive: true, force: true });

      // Copy client build to dist
      cpSync(`${ctx.dist}/client`, cfDist, { recursive: true });

      // Copy favicon to root for /favicon.ico requests
      const faviconFiles = ["favicon.ico", "favicon.svg", "favicon.png"];
      for (const favicon of faviconFiles) {
        if (existsSync(`${cfDist}/assets/${favicon}`)) {
          cpSync(`${cfDist}/assets/${favicon}`, `${cfDist}/${favicon}`);
          break;
        }
      }

      // Detect if apiDocs plugin is configured
      const hasApiDocs = ctx.config.plugins?.some(
        (p) => p.name === "@manicjs/api-docs"
      );
      const docsPath = "/docs";
      const hasApi = ctx.apiEntries.length > 0;

      if (hasApi || hasApiDocs) {
        mkdirSync(`${cfDist}/api`, { recursive: true });
        if (existsSync(`${ctx.dist}/api`)) {
          cpSync(`${ctx.dist}/api`, `${cfDist}/api`, {
            recursive: true,
          });
        }

        const apiImports: string[] = [];
        const apiMounts: string[] = [];
        const apiRoutes: string[] = [];

        for (const entry of ctx.apiEntries) {
          const name = entry
            .replace("app/api/", "")
            .replace("/index.ts", "")
            .replace("index.ts", "root");

          const safeName = name.replace(/-/g, "_");
          apiImports.push(`import api_${safeName} from "./api/${name}.js";`);
          const routePath = name === "root" ? "/" : `/${name}`;
          apiMounts.push(`apiApp.route("${routePath}", api_${safeName});`);
          apiRoutes.push(routePath);
        }

        const serverCode = `import { Hono } from "hono";
${apiImports.join("\n")}

const app = new Hono();
const apiApp = new Hono();

${apiMounts.join("\n")}

app.route("/api", apiApp);

// OpenAPI spec
const paths = {};
${apiRoutes.map(route => `paths["/api${route === "/" ? "" : route}"] = { get: { responses: { 200: { description: "OK" } } } };`).join("\n")}
const spec = { openapi: "3.0.0", info: { title: "${ctx.config.app?.name ?? "Manic"} API", version: "1.0.0" }, paths };
app.get("/openapi.json", (c) => c.json(spec));

${
  hasApiDocs
    ? `app.get("${docsPath}", (c) => c.html(\`<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>API Reference</title></head><body><script id="api-reference" data-url="/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script></body></html>\`));
app.get("${docsPath}/*", (c) => c.html(\`<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>API Reference</title></head><body><script id="api-reference" data-url="/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script></body></html>\`));`
    : ""
}

// Serve static assets from Cloudflare Pages
app.get("/*", async (c) => {
  const res = await c.env.ASSETS.fetch(c.req.raw);
  if (res.status === 404) {
    return await c.env.ASSETS.fetch(new URL("/index.html", c.req.url));
  }
  return res;
});

export default app;
`;
        await Bun.write(`${cfDist}/_worker.js`, serverCode);
      } else {
        const redirects = `/*    /index.html   200`;
        await Bun.write(`${cfDist}/_redirects`, redirects);
      }

      // Generate wrangler.toml
      const projectName =
        options.projectName ??
        ctx.config.app?.name?.toLowerCase().replace(/\s+/g, "-") ??
        "manic-app";

      const wranglerToml = `name = "${projectName}"
compatibility_date = "${compatDate}"

# Cloudflare Pages configuration  
pages_build_output_dir = "./dist"
`;
      await Bun.write("wrangler.toml", wranglerToml);

      process.stdout.write(
        `\r${dim(green("● Exporting to Cloudflare Pages... done"))}\n`
      );

      console.log(yellow(bold("ℹ Deploy with: manic deploy")));
    },
  };
}
