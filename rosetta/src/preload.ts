import { transformGlob } from './index';
import { getLoaderForExtension } from './adapter';

// Register global Bun plugin to translate import.meta.glob
// This plugin works for both build-time (Bun.build) and runtime (bun --watch, bun run)
Bun.plugin({
  name: 'rosetta-glob-translator',
  setup(build) {
    
    // Process files in app/ and .source/ directories that might contain import.meta.glob
    // Filter matches absolute paths like `/.../.source/server.ts` or relative `app/routes/...ts`
    build.onLoad({ filter: /(?:^|\/)(?:app|\.source)\/.*\.ts$/u }, async args => {
      if (args.path.includes('node_modules') || args.path.includes('~manic.ts') || args.path.includes('.manic/')) {
        return;
      }
      const result = await transformSourceFile(args.path);
      return result;
    });
  },
});

async function transformSourceFile(filePath: string) {
  if (filePath.includes('node_modules')) return undefined;

  try {
    const file = Bun.file(filePath);
    const code = await file.text();
    const ext = filePath.split('.').pop() || '';
    const loader = getLoaderForExtension(ext);

    if (!code.includes('import.meta.glob')) {
      return { contents: code, loader };
    }

    const transformed = transformGlob(code, filePath);
    return {
      contents: transformed,
      loader,
    };
  } catch {
    return undefined;
  }
}

// Unused function kept for future use when dynamic config loading is needed
// async function _registerRosettaPreloads() { ... }
