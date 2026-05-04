import path from 'node:path';
import ts from 'typescript';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { transformerTwoslash } from 'fumadocs-twoslash';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { remarkNpm, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      remarkMdxMermaid,
      [remarkNpm, { persist: { id: 'package-manager' } }],
    ],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
        transformerNotationWordHighlight(),
        transformerTwoslash({
          twoslashOptions: {
            compilerOptions: {
              baseUrl: path.resolve(import.meta.dirname, '.'),
              module: ts.ModuleKind.ESNext,
              moduleResolution: ts.ModuleResolutionKind.Bundler,
              target: ts.ScriptTarget.ESNext,
              lib: ['esnext', 'dom', 'dom.iterable'],
              jsx: ts.JsxEmit.ReactJSX,
              jsxImportSource: 'react',
              allowSyntheticDefaultImports: true,
              esModuleInterop: true,
              types: ['node', 'react', 'react-dom', 'bun'],
              paths: {
                '@manicjs/*': [path.resolve(import.meta.dirname, '../plugins/*/src/index.ts')],
                'manicjs': [path.resolve(import.meta.dirname, '../packages/manic/index.ts')],
                'manicjs/router': [path.resolve(import.meta.dirname, '../packages/manic/src/router/index.ts')],
                'manicjs/plugins': [path.resolve(import.meta.dirname, '../packages/manic/src/plugins/index.ts')],
                'manicjs/server': [path.resolve(import.meta.dirname, '../packages/manic/src/server/index.ts')],
                'manicjs/config': [path.resolve(import.meta.dirname, '../packages/manic/src/config/index.ts')],
                'manicjs/env': [path.resolve(import.meta.dirname, '../packages/manic/src/env/index.ts')],
                'manicjs/client': [path.resolve(import.meta.dirname, '../packages/manic/src/config/client.ts')],
                'manicjs/transitions': [path.resolve(import.meta.dirname, '../packages/manic/src/transitions/index.ts')],
                '@manicjs/api-docs': [path.resolve(import.meta.dirname, '../plugins/api-docs/src/index.ts')],
                '@manicjs/mcp': [path.resolve(import.meta.dirname, '../plugins/mcp/src/index.ts')],
                '@manicjs/mdx': [path.resolve(import.meta.dirname, '../plugins/mdx/src/index.ts')],
                '@manicjs/seo': [path.resolve(import.meta.dirname, '../plugins/seo/src/index.ts')],
                '@manicjs/sitemap': [path.resolve(import.meta.dirname, '../plugins/sitemap/src/index.ts')],
                '@manicjs/tailwind': [path.resolve(import.meta.dirname, '../plugins/tailwind/src/index.ts')],
                '@manicjs/unocss': [path.resolve(import.meta.dirname, '../plugins/unocss/src/index.ts')]
              }
            }
          }
        }),
      ],
    },
  },
});
