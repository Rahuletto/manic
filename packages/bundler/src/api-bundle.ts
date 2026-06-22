import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import type { BuildContext, BuildApplicationOptions } from './types';

export interface ApiBundleResult {
  apiEntries: string[];
}

export async function buildApi<TConfig>(
  context: BuildContext<TConfig>,
  _options: BuildApplicationOptions<TConfig>
): Promise<ApiBundleResult> {
  const { cwd, dist, config, onPending, onSuccess, serverPlugins } = context;

  const apiEntries: string[] = [];
  if (existsSync('app/api')) {
    onPending?.('Bundling API routes...');
    const glob = new Bun.Glob('**/index.ts');
    for await (const file of glob.scan({ cwd: 'app/api' }))
      apiEntries.push(`app/api/${file}`);

    if (apiEntries.length > 0) {
      await mkdir(`${dist}/api`, { recursive: true });
      const dependencies = Object.keys(
        (await import(`${cwd}/package.json`)).dependencies ?? {}
      );
      await Promise.all(
        apiEntries.map(entry => {
          const outName = entry
            .replace('app/api/', '')
            .replace('/index.ts', '')
            .replace('index.ts', 'root');
          return Bun.build({
            entrypoints: [entry],
            outdir: `${dist}/api`,
            target: 'bun',
            minify: false,
            external: dependencies,
            naming: `${outName}.js`,
            plugins: serverPlugins,
          });
        })
      );
      await mkdir(`${dist}/client/.well-known`, { recursive: true });
      const pkgJson = await Bun.file(`${cwd}/package.json`).text();
      await Bun.write(`${dist}/api/package.json`, pkgJson);
      await Bun.write(
        `${dist}/client/.well-known/api-catalog`,
        JSON.stringify({
          linkset: [
            {
              anchor: '/api',
              'service-desc': [
                { href: '/openapi.json', type: 'application/json' },
              ],
            },
          ],
        })
      );
      onSuccess?.('Bundling API routes... done');
    }
  }
  return { apiEntries };
}
