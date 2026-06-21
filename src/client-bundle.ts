import { mkdir } from 'fs/promises';
import { resolver } from './core';
import { renderClientHtml, copyAssetsIfExists } from './client-html';
import { clientDirectivePlugin } from './client-directive-plugin';
import type { BuildContext, BuildApplicationOptions } from './types';

export interface ClientBundleResult {
  jsFile: string;
  cssFile: string | undefined;
  html: string;
}

export async function buildClient<TConfig>(
  context: BuildContext<TConfig>,
  options: BuildApplicationOptions<TConfig>
): Promise<ClientBundleResult> {
  const { cwd, dist, config, onPending, onSuccess, onError, onLog } = context;
  const { writeRoutesManifest, clientPlugins, plugins } = options;

  await mkdir(`${dist}/client`, { recursive: true });
  await registerPreloadPlugins(plugins ?? [], onLog);

  onPending?.('Bundling client...');
  await writeRoutesManifest?.('app/~routes.generated.ts');
  const mainEntry = resolver.sync(cwd, './app/main');
  if (!mainEntry.path) throw new Error("Core entry 'app/main.tsx' not found.");

  const clientBuild = await Bun.build({
    entrypoints: [mainEntry.path],
    outdir: `${dist}/client`,
    target: (config.build as any)?.clientTarget ?? 'browser',
    splitting: true,
    naming: {
      entry: '[name]-[hash].[ext]',
      chunk: 'chunks/[name]-[hash].[ext]',
      asset: 'assets/[name]-[hash].[ext]',
    },
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    external: [
      'readline',
      'fs',
      'path',
      'os',
      'crypto',
      'stream',
      'util',
      'events',
      'buffer',
      'querystring',
      'url',
      'zlib',
      'child_process',
      'cluster',
      'dns',
      'http',
      'https',
      'net',
      'tls',
      'dgram',
      'perf_hooks',
      'v8',
      'vm',
      'worker_threads',
      'process',
      '@manicjs/tui',
    ],
    plugins: [clientDirectivePlugin(), ...(clientPlugins || [])],
  });

  if (!clientBuild.success) {
    onError?.('Client build failed');
    throw new Error(`Client build failed:\n${clientBuild.logs.join('\n')}`);
  }

  onSuccess?.('Bundling client... done');

  const jsFile =
    clientBuild.outputs
      .find(output => output.kind === 'entry-point')
      ?.path.split('/')
      .pop() ?? 'main.js';
  const cssFile = clientBuild.outputs
    .find(output => output.path.endsWith('.css'))
    ?.path.split('/')
    .pop();

  await copyAssetsIfExists(dist);

  const html = await renderClientHtml(dist, jsFile, cssFile, config.app?.name);

  return { jsFile, cssFile, html };
}

async function registerPreloadPlugins(
  plugins: BuildApplicationOptions['plugins'],
  onLog?: (scope: string, message: string) => void
) {
  await Promise.all(
    plugins?.map(async plugin => {
      if (!plugin.preload) return;
      let resolvedPath = plugin.preload;
      try {
        resolvedPath = Bun.resolveSync(plugin.preload, process.cwd());
      } catch {
        // Fallback to original
      }
      const mod = await import(resolvedPath);
      const bunPlugin = mod.default ?? mod.plugin;
      if (bunPlugin && typeof bunPlugin === 'object' && bunPlugin.name) {
        Bun.plugin(bunPlugin);
        onLog?.('bundler', `registered preload plugin ${bunPlugin.name}`);
      }
    }) ?? []
  );
}
