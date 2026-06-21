import { rm, writeFile } from 'fs/promises';
import { resolver } from './core';
import { transformServerEntry } from './server-transform';
import type { BuildContext, BuildApplicationOptions } from './types';

export async function buildServer<TConfig>(
  context: BuildContext<TConfig>,
  options: BuildApplicationOptions<TConfig>
): Promise<void> {
  const { cwd, dist, config, onPending, onSuccess, onError, serverPlugins } = context;

  onPending?.('Bundling server...');
  const serverResolution = resolver.sync(cwd, './~manic');
  if (!serverResolution.path)
    throw new Error('~manic.ts not found. Create your server entry file.');

  const configPath = require('fs').existsSync(`${cwd}/manic.config.ts`)
    ? '../manic.config.ts'
    : '../manic.config.js';
  const discoveredPageRoutes = (await options.discoverPageRoutes?.()) ?? [];

  let serverCode = await Bun.file(serverResolution.path).text();
  serverCode = transformServerEntry(serverCode, {
    htmlPath: `${dist}/client/index.html`,
    configPath,
    routes: discoveredPageRoutes,
  });

  const prodEntry = `${dist}/_entry.ts`;
  await writeFile(prodEntry, serverCode);

  const serverBuild = await Bun.build({
    entrypoints: [prodEntry],
    outdir: dist,
    target: (config.build as any)?.serverTarget ?? 'bun',
    minify: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    naming: { entry: 'server.js' },
    plugins: serverPlugins,
  });

  await rm(prodEntry, { force: true });

  if (!serverBuild.success) {
    onError?.('Server build failed');
    throw new Error(`Server build failed:\n${serverBuild.logs.join('\n')}`);
  }

  onSuccess?.('Bundling server... done');
}

export async function buildSSRServer<TConfig>(
  context: BuildContext<TConfig>,
  options: BuildApplicationOptions<TConfig>
): Promise<number> {
  const { cwd, dist, onPending, onSuccess, onError, serverPlugins } = context;
  const config = context.config as any;

  if (config.router?.ssr === false) return 0;

  onPending?.('Bundling SSR server...');
  const ssrServerResolution = resolver.sync(cwd, './~manic.ssr');
  if (!ssrServerResolution.path) {
    throw new Error(
      '~manic.ssr.ts not found. Create your SSR server entry file when ssr is enabled.'
    );
  }

  const configPath = require('fs').existsSync(`${cwd}/manic.config.ts`)
    ? '../manic.config.ts'
    : '../manic.config.js';
  const discoveredPageRoutes = (await options.discoverPageRoutes?.()) ?? [];

  let ssrServerCode = await Bun.file(ssrServerResolution.path).text();
  ssrServerCode = transformServerEntry(ssrServerCode, {
    htmlPath: `${dist}/client/index.html`,
    configPath,
    routes: discoveredPageRoutes,
  });

  const ssrProdEntry = `${dist}/_ssr_entry.ts`;
  await writeFile(ssrProdEntry, ssrServerCode);

  // Externalize dependencies to share React and other packages with route components
  const dependencies = Object.keys(
    (await import(`${cwd}/package.json`)).dependencies ?? {}
  );

  const ssrServerBuild = await Bun.build({
    entrypoints: [ssrProdEntry],
    outdir: dist,
    target: (config.build as any)?.serverTarget ?? 'bun',
    minify: false,
    external: dependencies,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    naming: { entry: 'server-ssr.js' },
    plugins: serverPlugins,
  });

  await rm(ssrProdEntry, { force: true });

  if (!ssrServerBuild.success) {
    onError?.('SSR Server build failed');
    throw new Error(
      `SSR Server build failed:\n${ssrServerBuild.logs.join('\n')}`
    );
  }

  onSuccess?.('Bundling SSR server... done');
  return (await Bun.file(`${dist}/server-ssr.js`).stat()).size;
}
