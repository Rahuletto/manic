import { existsSync, readdirSync, statSync } from 'fs';
import { minifySync } from 'oxc-minify';
import { brotliCompressSync } from 'node:zlib';
import type { BuildContext } from './types';

const TEXT_EXTENSIONS = [
  '.js',
  '.css',
  '.html',
  '.json',
  '.xml',
  '.txt',
  '.svg',
  '.map',
];

export async function minifyDir(
  dir: string,
  context?: BuildContext
): Promise<void> {
  const glob = new Bun.Glob('**/*.js');
  const files: string[] = [];
  for await (const file of glob.scan({ cwd: dir }))
    files.push(`${dir}/${file}`);

  await Promise.all(files.map(filePath => minifyFile(filePath, context)));
}

export async function minifyFile(
  filePath: string,
  context?: BuildContext
): Promise<void> {
  const code = await Bun.file(filePath).text();
  try {
    const minified = minifySync(filePath, code, {
      compress: { target: 'es2022' },
      mangle: true,
      codegen: { removeWhitespace: true },
    });
    if (minified.errors?.length) {
      const warningMsg = `Minify warning in ${filePath}: ${minified.errors.map(e => e.message).join(', ')}`;
      console.warn(`[Bundler Minify] ${warningMsg}`);
      context?.warnings.push({
        file: filePath,
        message: warningMsg,
        code: 'MINIFY_WARNING',
      });
    }
    await Bun.write(filePath, minified.code);
  } catch (error) {
    console.error(`[Bundler Minify] Failed to minify ${filePath}:`, error);
    context?.warnings.push({
      file: filePath,
      message: `Minify failed: ${error}`,
      code: 'MINIFY_ERROR',
    });
  }
}

export async function generateCompressedAssets(
  dist: string,
  context?: BuildContext
): Promise<void> {
  const glob = new Bun.Glob('**/*');
  const files: string[] = [];
  for await (const file of glob.scan({ cwd: dist })) {
    const fullPath = `${dist}/${file}`;
    if (TEXT_EXTENSIONS.some(ext => file.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  await Promise.all(
    files.map(async filePath => {
      try {
        const content = await Bun.file(filePath).bytes();
        const gzipped = Bun.gzipSync(content);
        const brotli = brotliCompressSync(content);
        await Promise.all([
          Bun.write(`${filePath}.gz`, gzipped),
          Bun.write(`${filePath}.br`, brotli),
        ]);
      } catch (error) {
        console.warn(
          `[Bundler Compress] Failed to compress ${filePath}:`,
          error
        );
        context?.warnings.push({
          file: filePath,
          message: `Compression failed: ${error}`,
          code: 'COMPRESS_ERROR',
        });
      }
    })
  );
}

export async function getDirSize(dir: string): Promise<number> {
  if (!existsSync(dir)) return 0;
  const entries = readdirSync(dir, { withFileTypes: true });
  const sizes = await Promise.all(
    entries.map(entry => {
      const path = `${dir}/${entry.name}`;
      if (entry.isFile() && path.endsWith('.map')) return 0;
      return entry.isDirectory() ? getDirSize(path) : statSync(path).size;
    })
  );
  return sizes.reduce((acc, size) => acc + size, 0);
}

export async function countRoutes(
  dir: string,
  pattern: string
): Promise<number> {
  if (!existsSync(dir)) return 0;
  let count = 0;
  const glob = new Bun.Glob(pattern);
  for await (const file of glob.scan({ cwd: dir })) {
    if (!file.startsWith('~')) count += 1;
  }
  return count;
}
