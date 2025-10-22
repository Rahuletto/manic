import { staticPlugin } from "@elysiajs/static";
import Elysia, { file } from "elysia";

export async function createFileImporter(instances: Elysia[]) {
  return new Elysia({ name: "framework.importer " })

    .group("/api", (groupApp) => {
      for (const instance of instances) groupApp.use(instance);

      return groupApp;
    })

    .get("/api/docs", ({ redirect }) => redirect("/docs"))
    .get("/assets/:file", ({ params }) => {
      return file(`public/assets/${params.file}`);
    })

    .use(
      await staticPlugin({
        assets: "public",
        prefix: "/*",
        indexHTML: true,
      }),
    );
}
