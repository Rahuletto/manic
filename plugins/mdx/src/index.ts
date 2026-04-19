import type { ManicPlugin } from 'manicjs/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type { MdxPluginOptions } from './bun-plugin.ts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function mdx(options: import('./bun-plugin.ts').MdxPluginOptions = {}): ManicPlugin {
  // Serialize non-function options so the preload script can read them.
  // remark/rehype plugin arrays (functions) can't be serialized — users needing
  // those should call mdxBunPlugin() directly and register via Bun.plugin().
  const serializable: Record<string, unknown> = {};
  if (options.filter) {
    serializable.filter = { source: options.filter.source, flags: options.filter.flags };
  }
  if (options.frontmatterName) serializable.frontmatterName = options.frontmatterName;
  if (options.disableGfm) serializable.disableGfm = options.disableGfm;
  if (options.disableFrontmatter) serializable.disableFrontmatter = options.disableFrontmatter;
  if (options.toc) serializable.toc = options.toc;
  if (options.mdxOptions) serializable.mdxOptions = options.mdxOptions;

  if (Object.keys(serializable).length) {
    process.env.__MANIC_MDX_OPTIONS__ = JSON.stringify(serializable);
  }

  return {
    name: '@manicjs/mdx',
    preload: resolve(__dirname, 'bun-plugin.ts'),
    bunfig: `[serve.static]\nplugins = ["@manicjs/mdx/bun-plugin"]`,
  };
}
