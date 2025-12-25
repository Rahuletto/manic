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

      if (useEdge) {
        // Edge Functions (Deno runtime) - experimental
        mkdirSync("netlify/edge-functions", { recursive: true });

        const paths = ["/api", "/api/*"];
        if (docsPath) {
          paths.push(docsPath, `${docsPath}/*`);
        }

        const edgeFunctionCode = `import { Elysia } from "elysia";
${
  ctx.config.swagger !== false
    ? 'import { swagger } from "@elysiajs/swagger";'
    : ""
}
${apiImports.join("\n")}

const app = new Elysia();

${apiRoutes.join("\n")}

${
  ctx.config.swagger !== false
    ? `app.use(swagger({ 
  path: "${docsPath}",
  exclude: ["/", "/assets", "/favicon.ico"],
  documentation: {
    info: {
      title: "${
        ctx.config.swagger?.documentation?.info?.title ??
        ctx.config.app?.name ??
        "Manic API"
      }",
      description: "${
        ctx.config.swagger?.documentation?.info?.description ??
        "API documentation powered by Manic"
      }",
      version: "${ctx.config.swagger?.documentation?.info?.version ?? "1.0.0"}"
    }
  }
}));`
    : ""
}

export default async (request, context) => {
  return app.fetch(request);
};

export const config = { path: ${JSON.stringify(paths)} };
`;

        await Bun.write("netlify/edge-functions/api.ts", edgeFunctionCode);
      } else {
        // Serverless Functions (Node.js runtime) - recommended
        mkdirSync("netlify/functions", { recursive: true });

        const functionCode = `import { Elysia } from "elysia";
${
  ctx.config.swagger !== false
    ? 'import { swagger } from "@elysiajs/swagger";'
    : ""
}
${apiImports.join("\n")}

const app = new Elysia();

${apiRoutes.join("\n")}

${
  ctx.config.swagger !== false
    ? `app.use(swagger({ 
  path: "${docsPath}",
  exclude: ["/", "/assets", "/favicon.ico"],
  documentation: {
    info: {
      title: "${
        ctx.config.swagger?.documentation?.info?.title ??
        ctx.config.app?.name ??
        "Manic API"
      }",
      description: "${
        ctx.config.swagger?.documentation?.info?.description ??
        "API documentation powered by Manic"
      }",
      version: "${ctx.config.swagger?.documentation?.info?.version ?? "1.0.0"}"
    }
  }
}));`
    : ""
}

export const handler = async (event, context) => {
  const url = new URL(event.rawUrl);
  const headers = new Headers();
  
  // Convert Netlify headers to Headers object
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
      }

      process.stdout.write(
        `\r${dim(green("● Exporting to Netlify... done"))}\n`
      );
      console.log(yellow(bold("ℹ Deploy with: manic deploy")));
    },
  };
}
