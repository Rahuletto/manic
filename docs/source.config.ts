import path from 'node:path';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { transformerTwoslash } from 'fumadocs-twoslash';

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
    rehypeCodeOptions: {
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          twoslashOptions: {
            compilerOptions: {
              baseUrl: '.',
              types: ['node'],
              paths: {
                'manicjs': [path.resolve(import.meta.dirname, '../packages/manic/index.ts')],
                'manicjs/router': [path.resolve(import.meta.dirname, '../packages/manic/src/router/index.ts')],
                'manicjs/plugins': [path.resolve(import.meta.dirname, '../packages/manic/src/plugins/index.ts')],
                'manicjs/server': [path.resolve(import.meta.dirname, '../packages/manic/src/server/index.ts')],
                'manicjs/config': [path.resolve(import.meta.dirname, '../packages/manic/src/config/index.ts')],
                'manicjs/env': [path.resolve(import.meta.dirname, '../packages/manic/src/env/client.ts')],
                'manicjs/client': [path.resolve(import.meta.dirname, '../packages/manic/src/config/client.ts')],
                'manicjs/transitions': [path.resolve(import.meta.dirname, '../packages/manic/src/transitions/index.ts')]
              }
            }
          }
        }),
      ],
    },
  },
});
