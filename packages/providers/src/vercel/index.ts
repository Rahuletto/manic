import { rmSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { green, dim, yellow, bold } from "colorette";
import type { ManicProvider, BuildContext } from "../types";

export interface VercelOptions {
  runtime?: "bun" | "nodejs20.x" | "nodejs22.x";
  regions?: string[];
  memory?: number;
  maxDuration?: number;
}

export function vercel(options: VercelOptions = {}): ManicProvider {
  const runtime = options.runtime ?? "bun";

  return {
    name: "vercel",
    async build(ctx: BuildContext) {
      process.stdout.write(dim("● Exporting to Vercel..."));

      const vDist = ".vercel/output";
      rmSync(vDist, { recursive: true, force: true });
      mkdirSync(`${vDist}/static`, { recursive: true });
      mkdirSync(`${vDist}/functions/api.func`, { recursive: true });

      cpSync(`${ctx.dist}/client`, `${vDist}/static`, { recursive: true });

      const faviconFiles = ["favicon.ico", "favicon.svg", "favicon.png"];
      for (const favicon of faviconFiles) {
        if (existsSync(`${vDist}/static/assets/${favicon}`)) {
          cpSync(`${vDist}/static/assets/${favicon}`, `${vDist}/static/${favicon}`);
          break;
        }
      }

      const docsPath =
        ctx.config.swagger !== false
          ? ctx.config.swagger?.path ?? "/docs"
          : null;

      const vConfig = {
        version: 3,
        routes: [
          { handle: "filesystem" },
          { src: "/api/(.*)", dest: "api" },
          ...(docsPath ? [{ src: `${docsPath}(.*)`, dest: "api" }] : []),
          { src: "/(.*)", dest: "/index.html" },
        ],
      };
      await Bun.write(`${vDist}/config.json`, JSON.stringify(vConfig, null, 2));

      const vcConfig: Record<string, unknown> = {
        runtime: runtime === "bun" ? "bun1.x" : runtime,
        handler: "index.mjs",
        shouldAddHelpers: false,
        supportsResponseStreaming: true,
      };

      if (runtime !== "bun") {
        vcConfig.launcherType = "Nodejs";
      }

      if (options.regions) vcConfig.regions = options.regions;
      if (options.memory) vcConfig.memory = options.memory;
      if (options.maxDuration) vcConfig.maxDuration = options.maxDuration;

      await Bun.write(
        `${vDist}/functions/api.func/.vc-config.json`,
        JSON.stringify(vcConfig, null, 2)
      );

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

      const serverCode = `import { Elysia } from "elysia";
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

export default app;
`;

      const tempEntry = `${vDist}/functions/api.func/_entry.ts`;
      await Bun.write(tempEntry, serverCode);

      const buildResult = await Bun.build({
        entrypoints: [tempEntry],
        outdir: `${vDist}/functions/api.func`,
        target: runtime === "bun" ? "bun" : "node",
        format: "esm",
        minify: true,
        naming: "index.mjs",
      });

      if (!buildResult.success) {
        console.error("\nVercel build failed:");
        buildResult.logs.forEach((log) => console.error(log));
        return;
      }

      rmSync(tempEntry, { force: true });

      await Bun.write(
        `${vDist}/functions/api.func/package.json`,
        JSON.stringify({ type: "module" }, null, 2)
      );

      process.stdout.write(
        `\r${dim(green("● Exporting to Vercel... done"))}\n`
      );
      console.log(yellow(bold("ℹ Deploy with: manic deploy")));
    },
  };
}
