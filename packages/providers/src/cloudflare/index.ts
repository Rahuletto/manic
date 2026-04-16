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

      // Generate _redirects for SPA routing
      const redirects = `/*    /index.html   200`;
      await Bun.write(`${cfDist}/_redirects`, redirects);

      const apiImports: string[] = [];
      const apiMounts: string[] = [];

      if (existsSync(`${ctx.dist}/api`)) {
        mkdirSync(`${cfDist}/functions/api`, { recursive: true });
        cpSync(`${ctx.dist}/api`, `${cfDist}/functions/api`, {
          recursive: true,
        });

        for (const entry of ctx.apiEntries) {
          const name = entry
            .replace("app/api/", "")
            .replace("/index.ts", "")
            .replace("index.ts", "root");

          const safeName = name.replace(/-/g, "_");
          apiImports.push(`import api_${safeName} from "./api/${name}.js";`);
          const routePath = name === "root" ? "/" : `/${name}`;
          apiMounts.push(`apiApp.route("${routePath}", api_${safeName});`);
        }
      }

      // Detect if apiDocs plugin is configured
      const hasApiDocs = ctx.config.plugins?.some(
        (p) => p.name === "@manicjs/api-docs"
      );
      const docsPath = "/docs";

      const serverCode = `import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
${hasApiDocs ? 'import { apiReference } from "@scalar/hono-api-reference";' : ""}
${apiImports.join("\n")}

const app = new Hono();
const apiApp = new Hono();

${apiMounts.join("\n")}

app.route("/api", apiApp);

// OpenAPI spec
const paths = {};
for (const { path, method } of apiApp.routes) {
  if (method === "ALL") continue;
  const oaPath = path.replace(/:([^\\/]+)/g, "{$1}");
  if (!paths[oaPath]) paths[oaPath] = {};
  paths[oaPath][method.toLowerCase()] = { responses: { 200: { description: "OK" } } };
}
const spec = { openapi: "3.0.0", info: { title: "${ctx.config.app?.name ?? "Manic"} API", version: "1.0.0" }, paths };
app.get("/openapi.json", (c) => c.json(spec));

${
  hasApiDocs
    ? `app.get("${docsPath}", apiReference({ spec: { url: "/openapi.json" } }));
app.get("${docsPath}/*", apiReference({ spec: { url: "/openapi.json" } }));`
    : ""
}

export const onRequest = handle(app);
`;

      if (ctx.apiEntries.length > 0) {
        mkdirSync(`${cfDist}/functions`, { recursive: true });
        await Bun.write(`${cfDist}/functions/[[path]].js`, serverCode);
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
