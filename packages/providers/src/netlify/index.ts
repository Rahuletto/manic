import { rmSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { green, dim, yellow, bold } from "colorette";
import type { ManicProvider, BuildContext } from "../types";

export interface NetlifyOptions {
  /**
   * Use edge functions (Deno runtime) or serverless functions (Node.js runtime)
   * @default false - uses serverless functions for better compatibility
   */
  edge?: boolean;
}

export function netlify(options: NetlifyOptions = {}): ManicProvider {
  // Default to serverless functions for better compatibility
  const useEdge = options.edge ?? false;

  return {
    name: "netlify",
    async build(ctx: BuildContext) {
      process.stdout.write(dim("● Exporting to Netlify..."));

      rmSync("dist", { recursive: true, force: true });
      rmSync("netlify", { recursive: true, force: true });

      cpSync(`${ctx.dist}/client`, "dist", { recursive: true });

      const faviconFiles = ["favicon.ico", "favicon.svg", "favicon.png"];
      for (const favicon of faviconFiles) {
        if (existsSync(`dist/assets/${favicon}`)) {
          cpSync(`dist/assets/${favicon}`, `dist/${favicon}`);
          break;
        }
      }

      const docsPath =
        ctx.config.swagger !== false
          ? ctx.config.swagger?.path ?? "/docs"
          : null;

      const apiImports: string[] = [];
      const apiRoutes: string[] = [];
      const cwd = process.cwd();

      if (existsSync(`${ctx.dist}/api`)) {
        for (const entry of ctx.apiEntries) {
          const name = entry
            .replace("app/api/", "")
            .replace("/index.ts", "")
            .replace("index.ts", "root");

          apiImports.push(
            `import api_${name.replace(/-/g, "_")} from "${cwd}/${entry}";`
          );
          const routePath = name === "root" ? "" : `/${name}`;
          apiRoutes.push(
            `app.group("/api${routePath}", (g) => g.use(api_${name.replace(
              /-/g,
              "_"
            )}));`
          );
        }
      }

      // Serverless Functions (Node.js runtime) - recommended
      mkdirSync("netlify/functions", { recursive: true });

      const functionCode = `import { Hono } from "hono";
${apiImports.join("\n")}

const app = new Hono();
const apiApp = new Hono();

${apiRoutes.join("\n")}

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
  docsPath
    ? `app.get("${docsPath}", (c) => c.html(\`<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>API Reference</title></head><body><script id="api-reference" data-url="/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script></body></html>\`));
app.get("${docsPath}/*", (c) => c.html(\`<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>API Reference</title></head><body><script id="api-reference" data-url="/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script></body></html>\`));`
    : ""
}

export const handler = async (event, context) => {
  const url = new URL(event.rawUrl);
  const headers = new Headers();
  
  for (const [key, value] of Object.entries(event.headers || {})) {
    if (value) headers.set(key, value);
  }
  
  const hasBody = event.body && ["POST", "PUT", "PATCH", "DELETE"].includes(event.httpMethod);
  
  const request = new Request(url.toString(), {
    method: event.httpMethod,
    headers,
    body: hasBody ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body) : undefined,
  });
  
  try {
    const response = await app.fetch(request);
    const body = await response.text();
    
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    return {
      statusCode: response.status,
      headers: responseHeaders,
      body,
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
`;

      const tempEntry = "netlify/functions/_entry.ts";
      await Bun.write(tempEntry, functionCode);

      const buildResult = await Bun.build({
        entrypoints: [tempEntry],
        outdir: "netlify/functions",
        target: "node",
        format: "esm",
        minify: true,
        naming: "api.mjs",
      });

      if (!buildResult.success) {
        console.error("\nNetlify build failed:");
        buildResult.logs.forEach((log) => console.error(log));
        return;
      }

      rmSync(tempEntry, { force: true });

      // Create package.json for ESM support
      await Bun.write(
        "netlify/functions/package.json",
        JSON.stringify({ type: "module" }, null, 2)
      );

      process.stdout.write(
        `\r${dim(green("● Exporting to Netlify... done"))}\n`
      );
      console.log(yellow(bold("ℹ Deploy with: manic deploy")));
    },
  };
}
