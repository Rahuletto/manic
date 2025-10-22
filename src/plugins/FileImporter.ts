import { staticPlugin } from "@elysiajs/static";
import Elysia, { file } from "elysia";

export async function createFileImporter(instances: Elysia[]) {
  return new Elysia({ name: "framework.importer " })

    .group("/api", (groupApp) => {
      for (const instance of instances) groupApp.use(instance);

      return groupApp;
    })

    .get("/api/docs", ({ redirect }) => redirect("/docs"))
    .get("/assets/:file", ({ params, set }) => {
      const path = `public/assets/${params.file}`;
      const ext = path.split(".").pop()?.toLowerCase();
      const types: Record<string, string> = {
        txt: "text/plain",
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        json: "application/json",
        xml: "application/xml",
        svg: "image/svg+xml",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        webp: "image/webp",
        ico: "image/x-icon",
        bmp: "image/bmp",
        tif: "image/tiff",
        tiff: "image/tiff",
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
        mp4: "video/mp4",
        webm: "video/webm",
        avi: "video/x-msvideo",
        pdf: "application/pdf",
        zip: "application/zip",
        gz: "application/gzip",
        tar: "application/x-tar",
        wasm: "application/wasm",
        woff: "font/woff",
        woff2: "font/woff2",
        ttf: "font/ttf",
        otf: "font/otf",
      };
      set.headers["Content-Type"] =
        types[ext || ""] || "application/octet-stream";
      return file(path);
    })

    .use(
      await staticPlugin({
        assets: "public",
        prefix: "/*",
        indexHTML: true,
      }),
    );
}
