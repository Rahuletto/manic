import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { Elysia, t } from "elysia";
import sharp from "sharp";

export const optimizeImagePlugin = new Elysia().get(
  "/img/transform",
  async ({ query, set, request }) => {
    const { src, w, format } = query;
    const width = Number(w) || 640;
    const path = `public/${src}`;

    if (!existsSync(path)) {
      set.status = 404;
      return "Not Found";
    }

    const accept = request.headers.get("accept") || "";
    let targetFormat = format?.toLowerCase();
    if (!targetFormat) {
      if (accept.includes("image/avif")) targetFormat = "avif";
      else if (accept.includes("image/webp")) targetFormat = "webp";
      else if (accept.includes("image/png")) targetFormat = "png";
      else targetFormat = "jpeg";
    }

    const file = await readFile(path);

    let transformer = sharp(file);
    transformer = transformer.resize({ width });

    const quality = 90;
    let buffer: Buffer;

    switch (targetFormat) {
      case "avif":
        buffer = await transformer.avif({ quality });
        break;
      case "webp":
        buffer = await transformer.webp({ quality });
        break;
      case "png":
        buffer = await transformer.png();
        break;
      default:
        targetFormat = "jpeg";
        buffer = await transformer.jpeg({ quality });
        break;
    }

    set.headers["Content-Type"] = `image/${targetFormat}`;
    set.headers["Cache-Control"] = "public, max-age=31536000, immutable";
    return buffer;
  },
  {
    query: t.Object({
      src: t.String(),
      w: t.Optional(t.Number()),
      format: t.Optional(
        t.Union([t.Literal("png"), t.Literal("webp"), t.Literal("avif")]),
      ),
    }),
  },
);
