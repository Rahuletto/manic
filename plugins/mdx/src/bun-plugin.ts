import type { BunPlugin } from 'bun';
import { compile, type CompileOptions } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

export interface MdxPluginOptions {
  /** File extensions to treat as MDX (default: /\.mdx?$/) */
  filter?: RegExp;
  /** Name of the exported frontmatter variable (default: 'frontmatter') */
  frontmatterName?: string;
  /** Disable built-in GFM support (default: false) */
  disableGfm?: boolean;
  /** Disable built-in frontmatter extraction (default: false) */
  disableFrontmatter?: boolean;
  /** Enable fumadocs-core rehypeToc — exports `toc` from each MDX file (default: false) */
  toc?: boolean;
  /**
   * Enable syntax highlighting via rehype-pretty-code (default: false).
   * Pass `true` for github-light/github-dark, or a theme object.
   */
  highlight?: boolean | { light: string; dark: string };
  /** Extra remark plugins appended after built-ins */
  remarkPlugins?: CompileOptions['remarkPlugins'];
  /** Rehype plugins */
  rehypePlugins?: CompileOptions['rehypePlugins'];
  /** Pass-through any @mdx-js/mdx CompileOptions (overrides built-in defaults) */
  mdxOptions?: Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins'>;
}

export function mdxBunPlugin(options: MdxPluginOptions = {}): BunPlugin {
  const {
    filter = /\.mdx?$/,
    frontmatterName = 'frontmatter',
    disableGfm = false,
    disableFrontmatter = false,
    toc = false,
    highlight = false,
    remarkPlugins = [],
    rehypePlugins = [],
    mdxOptions = {},
  } = options;

  return {
    name: 'manicjs-mdx',
    setup(build) {
      build.onLoad({ filter }, async (args) => {
        const source = await Bun.file(args.path).text();

        const builtinRemark: NonNullable<CompileOptions['remarkPlugins']> = [];
        if (!disableGfm) builtinRemark.push(remarkGfm);
        if (!disableFrontmatter) {
          builtinRemark.push(remarkFrontmatter);
          builtinRemark.push([remarkMdxFrontmatter, { name: frontmatterName }]);
        }

        const builtinRehype: NonNullable<CompileOptions['rehypePlugins']> = [];
        if (highlight) {
          const { default: rehypePrettyCode } = await import('rehype-pretty-code');
          const theme = highlight === true
            ? { light: 'github-light', dark: 'github-dark' }
            : highlight;
          builtinRehype.push([rehypePrettyCode, { theme }]);
        }
        if (toc) {
          const { rehypeToc, remarkHeading } = await import('fumadocs-core/mdx-plugins');
          builtinRemark.push(remarkHeading);
          builtinRehype.push(rehypeToc);
        }

        const compiled = await compile(source, {
          jsx: true,
          jsxImportSource: 'react',
          outputFormat: 'program',
          ...mdxOptions,
          remarkPlugins: [...builtinRemark, ...remarkPlugins],
          rehypePlugins: [...builtinRehype, ...rehypePlugins],
        });

        return { contents: String(compiled), loader: 'jsx' };
      });
    },
  };
}

// When preloaded via --preload, read serializable options from env var
function resolveOptionsFromEnv(): MdxPluginOptions {
  const raw = process.env.__MANIC_MDX_OPTIONS__;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed.filter) {
      parsed.filter = new RegExp(parsed.filter.source, parsed.filter.flags);
    }
    return parsed;
  } catch {
    return {};
  }
}

// Auto-register when preloaded via --preload
const _plugin = mdxBunPlugin(resolveOptionsFromEnv());
Bun.plugin(_plugin);

// Default export required by bunfig.toml [serve.static] plugins
export default _plugin;
