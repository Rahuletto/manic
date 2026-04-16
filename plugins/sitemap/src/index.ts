import type { ManicPlugin, ManicServerPluginContext, ManicBuildPluginContext } from "manicjs/config";

export interface SitemapConfig {
  hostname: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  exclude?: string[];
}

function generateSitemapXml(
  routes: { path: string; dynamic: boolean }[],
  config: SitemapConfig
): string {
  const hostname = config.hostname.replace(/\/$/, "");
  const changefreq = config.changefreq ?? "weekly";
  const priority = config.priority ?? 0.8;
  const exclude = config.exclude ?? [];

  const urls = routes
    .filter((r) => {
      if (r.dynamic) return false;
      if (exclude.includes(r.path)) return false;
      return true;
    })
    .map((r) => {
      const loc = r.path === "/" ? hostname + "/" : hostname + r.path;
      return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function sitemap(config: SitemapConfig): ManicPlugin {
  return {
    name: "sitemap",

    configureServer(ctx: ManicServerPluginContext) {
      const xml = generateSitemapXml(ctx.pageRoutes, config);
      ctx.addRoute("/sitemap.xml", () => new Response(xml, {
        headers: { "content-type": "application/xml" },
      }));
    },

    async build(ctx: ManicBuildPluginContext) {
      const xml = generateSitemapXml(ctx.pageRoutes, config);
      await ctx.emitClientFile("sitemap.xml", xml);
    },
  };
}
