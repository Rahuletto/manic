import { existsSync, readdirSync, statSync } from 'fs';
import { minifySync } from 'oxc-minify';
import { ResolverFactory } from 'oxc-resolver';

export const resolver = new ResolverFactory({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
});

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
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

export async function minifyDir(dir: string): Promise<void> {
  const glob = new Bun.Glob('**/*.js');
  const files: string[] = [];
  for await (const file of glob.scan({ cwd: dir }))
    files.push(`${dir}/${file}`);

  await Promise.all(files.map(filePath => minifyFile(filePath)));
}

export async function minifyFile(filePath: string): Promise<void> {
  const code = await Bun.file(filePath).text();
  try {
    const minified = minifySync(filePath, code, {
      compress: { target: 'es2022' },
      mangle: true,
      codegen: { removeWhitespace: true },
    });
    if (minified.errors?.length) {
      console.warn(`[Bundler Minify] Warning in ${filePath}:`, minified.errors);
    }
    await Bun.write(filePath, minified.code);
  } catch (error) {
    console.error(`[Bundler Minify] Failed to minify ${filePath}:`, error);
  }
}
