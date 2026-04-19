import type { ManicPlugin } from 'manicjs/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type { MdxPluginOptions } from './bun-plugin.ts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Creates an MDX plugin for Manic.
 *
 * Enables MDX (Markdown + JSX) support in the project.
 * Uses bun-plugin-mdx for fast compilation with support for:
 * - GFM (GitHub Flavored Markdown)
 * - Frontmatter
 * - Table of contents extraction
 * - Syntax highlighting
 *
 * @param options - MDX plugin configuration options
 * @returns ManicPlugin for MDX
 *
 * @example
 * import { mdx } from '@manicjs/mdx';
 *
 * mdx({
 *   frontmatterName: 'metadata',
 *   toc: true,
 *   highlight: 'github-dark',
 * })
 *
 * @example
 * // With custom remark/rehype plugins (via Bun.plugin directly)
 * import { mdxBunPlugin } from '@manicjs/mdx';
 * Bun.plugin(mdxBunPlugin({ myOption: true }));
 */
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
  if (options.highlight) serializable.highlight = options.highlight;
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
