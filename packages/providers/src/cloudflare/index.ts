import { rmSync, cpSync, existsSync } from "node:fs";
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

      // Warn about API routes
      if (ctx.apiEntries.length > 0) {
        console.log(
          yellow(
            `  ⚠ API routes detected but not supported on Cloudflare Pages yet.`
          )
        );
        console.log(
          dim(`    Use Vercel or Netlify for API route support.`)
        );
      }

      console.log(yellow(bold("ℹ Deploy with: manic deploy")));
    },
  };
}
