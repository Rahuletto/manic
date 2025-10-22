import { readdirSync } from "node:fs";
import path from "node:path";
import Elysia from "elysia";

const isProduction = process.env.NODE_ENV === "production";

export async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of readdirSync(dir, {
    withFileTypes: true,
  })) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* walk(fullPath);
    else if (entry.name.endsWith(".ts")) yield fullPath;
  }
}

export function loadAPIFromRegistry() {
  const instances: Elysia[] = [];
  const relative = path.join(process.cwd(), "app", "api");

  const { apiRegistry } = require(relative + "/__registry");

  for (const [path, handler] of Object.entries(apiRegistry)) {
    if (typeof handler === "function") {
      if (path === "/") {
        const app = new Elysia();
        handler(app as any);
        instances.push(app);
      } else {
        const app = new Elysia().group(path, (group) => {
          handler(group as any);
          return group;
        });
        instances.push(app);
      }
    }
  }

  return instances;
}

export async function loadAPIDynamic(root: string) {
  const instances: Elysia[] = [];
  for await (const file of walk(root)) {
    const route = file.split("/api/")[1]!.split("/");

    if (route.length === 1) {
      if (route[0] === "index.ts" || route[0] === "__registry.ts") {
        if (route[0] === "__registry.ts") continue;
        const module = await import(file);
        const apiInstance: Elysia = module.default;
        if (!apiInstance) continue;

        instances.push(apiInstance);
      } else {
        const module = await import(file);
        const apiInstance: Elysia = module.default;
        if (!apiInstance) continue;
        const groupRoute = `/${route[0]!.replace(".ts", "")}`;
        const base = new Elysia().group(groupRoute, (group) => {
          group.use(apiInstance);
          return group;
        });

        instances.push(base);
      }
    } else {
      const module = await import(file);
      const apiInstance: Elysia = module.default;
      if (!apiInstance) continue;
      const groupRoute = `/${route
        .slice(0, -1)
        .map((r) => r.replace(".ts", ""))
        .join("/")}`;
      const base = new Elysia().group(groupRoute, (group) => {
        group.use(apiInstance);
        return group;
      });

      instances.push(base);
    }
  }

  return instances;
}

export async function loadAPI(root: string) {
  if (isProduction) {
    return loadAPIFromRegistry();
  } else {
    return await loadAPIDynamic(root);
  }
}
