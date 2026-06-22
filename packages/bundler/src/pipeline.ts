import { rm, mkdir } from 'fs/promises';
import { buildClient } from './client-bundle';
import { buildApi } from './api-bundle';
import { buildServer, buildSSRServer } from './server-bundle';
import {
  minifyDir,
  minifyFile,
  generateCompressedAssets,
  getDirSize,
  countRoutes,
} from './minify';
import { packageForDetectedHost } from './deploy';
import { registerPreloadPlugins } from './preload';
import type {
  BuildApplicationOptions,
  BuildSummary,
  BuildContext,
  BuildWarning,
} from './types';

export async function buildApplication<TConfig = unknown>(
  options: BuildApplicationOptions<TConfig>
): Promise<BuildSummary> {
  const start = performance.now();
  const cwd = options.cwd ?? process.cwd();
  const dist = options.dist;
  const config = options.config;
  const onPending = options.onPending ?? (() => {});
  const onSuccess = options.onSuccess ?? (() => {});
  const onError = options.onError ?? (() => {});
  const onLog = options.onLog ?? (() => {});

  const warnings: BuildWarning[] = [];

  const context: BuildContext<TConfig> = {
    config,
    cwd,
    dist,
    warnings,
    clientPlugins: options.clientPlugins || [],
    serverPlugins: options.serverPlugins || [],
    onPending,
    onSuccess,
    onError,
    onLog,
  };

  if (options.runLint !== false) {
    const lint = await runLint(context, options.lintConfigPath);
    if (lint.exitCode !== 0) {
      onError('Linting failed');
      throw new Error(
        `Lint failed\nstdout:\n${lint.stdout}\nstderr:\n${lint.stderr}`
      );
    }
  }

  if ((config.build as any)?.clean !== false) {
    await rm(dist, { recursive: true, force: true });
  }
  await mkdir(`${dist}/client`, { recursive: true });
  await registerPreloadPlugins(options.plugins ?? [], onLog);

  const ssrEnabled = config.router?.ssr !== false;
  const ssrMode = 'streaming';

  const [clientResult, apiResult] = await Promise.all([
    buildClient(context, options),
    buildApi(context, options),
  ]);

  // Generate SSR manifest
  if (ssrEnabled && options.writeSSRManifest) {
    await options.writeSSRManifest('app/~routes.ssr.ts');
  }

  const { html: clientHtml } = clientResult;
  const { apiEntries } = apiResult;

  const pageRoutes = (await options.discoverPageRoutes?.()) ?? [];
  const htmlInjections: string[] = [];

  await Promise.all(
    (options.plugins ?? []).map(async plugin => {
      if (!plugin.build) return;
      await plugin.build({
        config,
        pageRoutes,
        apiRoutes: [],
        prod: true,
        cwd,
        dist,
        async emitClientFile(
          relativePath: string,
          content: string | Uint8Array
        ) {
          const outputPath = `${dist}/client/${relativePath}`;
          const outDir = outputPath.split('/').slice(0, -1).join('/');
          await mkdir(outDir, { recursive: true });
          await Bun.write(outputPath, content);
        },
        injectHtml(tags: string) {
          htmlInjections.push(tags);
        },
      });
      onSuccess?.(`Plugin "${plugin.name}" completed`);
    })
  );

  let html = clientHtml;
  if (htmlInjections.length > 0) {
    html = html.replace('</head>', `${htmlInjections.join('\n')}\n</head>`);
    await Bun.write(`${dist}/client/index.html`, html);
  }

  await Promise.all([
    buildServer(context, options),
    packageForDetectedHost(
      dist,
      config as any,
      apiEntries,
      onPending,
      onSuccess
    ),
  ]);

  let ssrServerSize = 0;
  if (ssrEnabled) {
    ssrServerSize = await buildSSRServer(context, options);
  }

  onPending?.('Minifying with oxc-minify...');
  await Promise.all([
    minifyDir(`${dist}/client`, context),
    (await Bun.file(`${dist}/api`).exists())
      ? minifyDir(`${dist}/api`, context)
      : Promise.resolve(),
    minifyFile(`${dist}/server.js`, context),
    ssrEnabled
      ? minifyFile(`${dist}/server-ssr.js`, context)
      : Promise.resolve(),
  ]);

  onPending?.('Generating compressed assets...');
  await generateCompressedAssets(dist, context);
  onSuccess?.('Minifying with oxc-minify... done');

  const clientSize = await getDirSize(`${dist}/client`);
  const apiSize = (await Bun.file(`${dist}/api`).exists())
    ? await getDirSize(`${dist}/api`)
    : 0;
  const regularServerSize = (await Bun.file(`${dist}/server.js`).stat()).size;
  const serverSize = regularServerSize + apiSize + ssrServerSize;

  return {
    buildTimeMs: performance.now() - start,
    dist,
    clientSize,
    serverSize,
    totalSize: clientSize + serverSize,
    pageCount: await countRoutes('app/routes', '**/*.tsx'),
    apiCount: await countRoutes('app/api', '**/index.ts'),
    apiEntries,
    ssrEnabled,
    ssrMode: ssrEnabled ? ssrMode : undefined,
    ssrServerSize,
  };
}

async function runLint(
  context: BuildContext,
  lintConfigPath?: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const { cwd, onPending, onSuccess, onError } = context;
  const localBin = `${cwd}/node_modules/.bin/oxlint`;
  const useLocalBin = await Bun.file(localBin).exists();
  const args = lintConfigPath
    ? ['--config', lintConfigPath, '.']
    : (await Bun.file(`${cwd}/.oxlintrc.json`).exists())
      ? ['--config', '.oxlintrc.json', '.']
      : ['.'];

  onPending?.('Linting with oxlint...');
  const proc = Bun.spawn([useLocalBin ? localBin : 'oxlint', ...args], {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    onError?.('Linting failed');
    return { stdout, stderr, exitCode };
  }

  onSuccess?.('Linting passed');
  return { stdout, stderr, exitCode };
}
