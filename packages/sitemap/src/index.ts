export interface RouteInfo {
  path: string;
  filePath: string;
}

export interface SitemapConfig {
  hostname: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  exclude?: string[];
}

export async function discoverRoutes(
  routesDir: string = "app/routes"
): Promise<RouteInfo[]> {
  const routes: RouteInfo[] = [];
  const glob = new Bun.Glob("**/*.{tsx,ts}");

  for await (const file of glob.scan({ cwd: routesDir })) {
    if (file.startsWith("~")) continue;

    const filePath = `${routesDir}/${file}`;

    let urlPath = file
      .replace(/\.tsx?$/, "")
      .replace(/\/index$/, "")
      .replace(/^index$/, "");

    // Strip route groups: (groupName)/ → nothing
    urlPath = urlPath.replace(/\(([^)]+)\)\//g, "");
    // Handle route group as the only segment
    urlPath = urlPath.replace(/\(([^)]+)\)$/, "");

    // Convert catch-all [...slug] to :...slug
    urlPath = urlPath.replace(/\[\.\.\.([^\]]+)\]/g, ":...$1");
    // Convert dynamic [param] to :param
    urlPath = urlPath.replace(/\[([^\]]+)\]/g, ":$1");

    urlPath = urlPath === "" ? "/" : `/${urlPath}`;

    routes.push({ path: urlPath, filePath });
  }

  return routes;
}

export function generateSitemap(
  routes: RouteInfo[],
  config: SitemapConfig
): string {
  const hostname = config.hostname.replace(/\/$/, "");
  const changefreq = config.changefreq ?? "weekly";
  const priority = config.priority ?? 0.8;
  const exclude = config.exclude ?? [];

  const urls = routes
    .filter((r) => {
      if (r.path.includes(":")) return false;
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
