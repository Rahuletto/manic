import { cp, mkdir, rm } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import {
  countRoutes,
  getDirSize,
  minifyDir,
  minifyFile,
  resolver,
} from './core';
import type {
  BuildApplicationOptions,
  BuildSummary,
  BundlerPlugin,
} from './types';

const runLint = async (cwd: string, lintConfigPath?: string) => {
  const localBin = `${cwd}/node_modules/.bin/oxlint`;
  const useLocalBin = existsSync(localBin);
  const args = lintConfigPath
    ? ['--config', lintConfigPath, '.']
    : existsSync(`${cwd}/.oxlintrc.json`)
      ? ['--config', '.oxlintrc.json', '.']
      : ['.'];
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
  return { stdout, stderr, exitCode };
};

const registerPreloadPlugins = async (
  plugins: BundlerPlugin[],
  onLog?: (scope: string, message: string) => void
) => {
  await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.preload) return;
      const mod = await import(plugin.preload);
      const bunPlugin = mod.default ?? mod.plugin;
      if (bunPlugin && typeof bunPlugin === 'object' && bunPlugin.name) {
        Bun.plugin(bunPlugin);
        onLog?.('bundler', `registered preload plugin ${bunPlugin.name}`);
      }
    })
  );
};

const renderClientHtml = async (
  dist: string,
  jsFile: string,
  cssFile: string | undefined,
  appName: string | undefined
) => {
  const htmlPath = 'app/index.html';
  let html = '';
  if (await Bun.file(htmlPath).exists()) {
    html = await Bun.file(htmlPath).text();
    if (cssFile) {
      html = html.includes('href="tailwindcss"')
        ? html.replace('href="tailwindcss"', `href="/${cssFile}"`)
        : html.replace(
            '</head>',
            `  <link rel="stylesheet" href="/${cssFile}">\n</head>`
          );
    }
    html = html.includes('src="./main.tsx"')
      ? html.replace('src="./main.tsx"', `src="/${jsFile}"`)
      : html.includes('src="/main.tsx"')
        ? html.replace('src="/main.tsx"', `src="/${jsFile}"`)
        : html.replace(
            '</body>',
            `  <script type="module" src="/${jsFile}"></script>\n</body>`
          );
  } else {
    html = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `  <title>${appName ?? 'App'}</title>`,
      cssFile ? `  <link rel="stylesheet" href="/${cssFile}">` : '',
      '</head>',
      '<body>',
      '  <div id="root"></div>',
      `  <script type="module" src="/${jsFile}"></script>`,
      '</body>',
      '</html>',
    ].join('\n');
  }
  await Bun.write(`${dist}/client/index.html`, html);
  return html;
};

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

  if (options.runLint !== false) {
    onPending('Linting with oxlint...');
    const lint = await runLint(cwd, options.lintConfigPath);
    if (lint.exitCode !== 0) {
      onError('Linting failed');
      throw new Error(
        `Lint failed\nstdout:\n${lint.stdout}\nstderr:\n${lint.stderr}`
      );
    }
    onSuccess('Linting passed');
  }

  await rm(dist, { recursive: true, force: true });
  await mkdir(`${dist}/client`, { recursive: true });
  await registerPreloadPlugins(options.plugins ?? [], options.onLog);

  onPending('Bundling client...');
  await options.writeRoutesManifest?.('app/~routes.generated.ts');
  const mainEntry = resolver.sync(cwd, './app/main');
  if (!mainEntry.path) throw new Error("Core entry 'app/main.tsx' not found.");

  const clientBuild = await Bun.build({
    entrypoints: [mainEntry.path],
    outdir: `${dist}/client`,
    target: 'browser',
    splitting: true,
    naming: {
      entry: '[name]-[hash].[ext]',
      chunk: 'chunks/[name]-[hash].[ext]',
      asset: 'assets/[name]-[hash].[ext]',
    },
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: options.clientPlugins,
  });
  if (!clientBuild.success) {
    throw new Error(`Client build failed:\n${clientBuild.logs.join('\n')}`);
  }
  onSuccess('Bundling client... done');

  const jsFile =
    clientBuild.outputs
      .find(output => output.kind === 'entry-point')
      ?.path.split('/')
      .pop() ?? 'main.js';
  const cssFile = clientBuild.outputs
    .find(output => output.path.endsWith('.css'))
    ?.path.split('/')
    .pop();

  if (existsSync('assets'))
    await cp('assets', `${dist}/client/assets`, { recursive: true });
  let html = await renderClientHtml(dist, jsFile, cssFile, config.app?.name);

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
      onSuccess(`Plugin "${plugin.name}" completed`);
    })
  );
  if (htmlInjections.length > 0) {
    html = html.replace('</head>', `${htmlInjections.join('\n')}\n</head>`);
    await Bun.write(`${dist}/client/index.html`, html);
  }

  const apiEntries: string[] = [];
  if (config.mode !== 'frontend' && existsSync('app/api')) {
    onPending('Bundling API routes...');
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
            plugins: options.serverPlugins,
          });
        })
      );
      await mkdir(`${dist}/client/.well-known`, { recursive: true });
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
      onSuccess('Bundling API routes... done');
    }
  }

  onPending('Bundling server...');
  const serverResolution = resolver.sync(cwd, './~manic');
  if (!serverResolution.path)
    throw new Error('~manic.ts not found. Create your server entry file.');

  let serverCode = await Bun.file(serverResolution.path).text();
  serverCode = serverCode.replace(
    /import\s+\w+\s+from\s+["']\.\/app\/index\.html["'];?/u,
    `const html = await Bun.file("${dist}/client/index.html").text();`
  );
  serverCode = serverCode.replace(
    /createManicServer\s*\(\s*\{\s*html:\s*\w+/u,
    `createManicServer({ html`
  );
  const prodEntry = `${dist}/_entry.ts`;
  await Bun.write(prodEntry, serverCode);
  const serverBuild = await Bun.build({
    entrypoints: [prodEntry],
    outdir: dist,
    target: 'bun',
    minify: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    naming: { entry: 'server.js' },
    plugins: options.serverPlugins,
  });
  await rm(prodEntry, { force: true });
  if (!serverBuild.success) {
    throw new Error(`Server build failed:\n${serverBuild.logs.join('\n')}`);
  }
  onSuccess('Bundling server... done');

  onPending('Minifying with oxc-minify...');
  await Promise.all([
    minifyDir(`${dist}/client`),
    existsSync(`${dist}/api`) ? minifyDir(`${dist}/api`) : Promise.resolve(),
    minifyFile(`${dist}/server.js`),
  ]);
  onSuccess('Minifying with oxc-minify... done');

  await Promise.all(
    (options.providers ?? []).map(async provider => {
      await provider.build({
        dist,
        config,
        apiEntries,
        clientDir: `${dist}/client`,
        serverFile: `${dist}/server.js`,
      });
    })
  );

  const clientSize = await getDirSize(`${dist}/client`);
  const apiSize = existsSync(`${dist}/api`)
    ? await getDirSize(`${dist}/api`)
    : 0;
  const serverSize = statSync(`${dist}/server.js`).size + apiSize;
  return {
    buildTimeMs: performance.now() - start,
    dist,
    clientSize,
    serverSize,
    totalSize: clientSize + serverSize,
    pageCount: await countRoutes('app/routes', '**/*.tsx'),
    apiCount: await countRoutes('app/api', '**/index.ts'),
    apiEntries,
  };
}
