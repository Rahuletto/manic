/* eslint-disable max-lines */
import {
  parseHtmlInjections,
  adaptConnectMiddleware,
  getLoaderForExtension,
} from './adapter';
import { Glob } from 'bun';
import * as path from 'path';
import { existsSync } from 'fs';

interface HtmlTagDescriptor {
  tag: string;
  attrs?: Record<string, string | boolean>;
  children?: string | HtmlTagDescriptor[];
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend';
}

/**
 * Converts Vite HTML tag descriptors into raw HTML tag strings.
 */
function convertViteDescriptorsToHtml(tags: HtmlTagDescriptor[]): string {
  const rendered: string[] = [];
  for (const tag of tags) {
    const attrsStr = Object.entries(tag.attrs || {})
      .map(([k, v]) => {
        if (v === true) return k;
        if (v === false) return '';
        return `${k}="${v}"`;
      })
      .filter(Boolean)
      .join(' ');

    const openTag = `<${tag.tag}${attrsStr ? ' ' + attrsStr : ''}>`;

    let childrenContent = '';
    if (typeof tag.children === 'string') {
      childrenContent = tag.children;
    } else if (Array.isArray(tag.children)) {
      childrenContent = convertViteDescriptorsToHtml(tag.children);
    }

    const selfClosing = ['link', 'meta', 'img', 'br', 'hr', 'input'].includes(
      tag.tag.toLowerCase()
    );
    const closeTag = selfClosing ? '' : `</${tag.tag}>`;
    rendered.push(`${openTag}${childrenContent}${closeTag}`);
  }
  return rendered.join('\n');
}

function handleHtmlTransformResult(
  result: any,
  originalHtml: string,
  ctx: any
) {
  if (!result) return;
  let injectedTags = '';
  if (typeof result === 'string') {
    injectedTags = parseHtmlInjections(result, originalHtml);
  } else if (Array.isArray(result)) {
    injectedTags = convertViteDescriptorsToHtml(result);
  } else if (typeof result === 'object') {
    if (result.html && Array.isArray(result.tags)) {
      injectedTags = convertViteDescriptorsToHtml(result.tags);
    } else if (result.html) {
      injectedTags = parseHtmlInjections(result.html, originalHtml);
    }
  }
  if (injectedTags) {
    ctx.injectHtml(injectedTags);
  }
}

/**
 * Creates a mock Vite plugin context with all standard functions.
 */
function createMockViteContext(build: any, ctx: any, pluginName: string) {
  const emittedFiles = new Map<
    string,
    { type: string; source?: string | Uint8Array; fileName?: string }
  >();

  return {
    emitFile(emittedFile: any) {
      const id =
        emittedFile.fileName ||
        `emitted-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      emittedFiles.set(id, emittedFile);
      return id;
    },
    getEmittedFiles() {
      return Array.from(emittedFiles.entries()).map(([id, file]) => ({
        ...file,
        id,
      }));
    },
    resolve(id: string, importer?: string, options?: any) {
      return build.resolve?.(id, importer, options);
    },
    addWatchFile(file: string) {
      // Bun doesn't have direct watch file API, but we can track it
      if (!build.watchFiles) build.watchFiles = new Set();
      build.watchFiles.add(file);
    },
    getWatchFiles() {
      return build.watchFiles ? Array.from(build.watchFiles) : [];
    },
    setAssetSource(assetId: string, source: string | Uint8Array) {
      const file = emittedFiles.get(assetId);
      if (file) file.source = source;
    },
    getAssetSource(assetId: string) {
      const file = emittedFiles.get(assetId);
      return file?.source;
    },
    error(err: Error | string) {
      throw typeof err === 'string' ? new Error(err) : err;
    },
    warn(msg: string, _options?: { id?: string }) {
      console.warn(`[${pluginName}] ${msg}`);
    },
    info(msg: string, _options?: { id?: string }) {
      console.info(`[${pluginName}] ${msg}`);
    },
    meta: {
      watchMode: !ctx.prod,
      rollupVersion: '4.0.0',
    },
    getModuleInfo(moduleId: string) {
      // Return basic module info
      return {
        id: moduleId,
        code: null,
        ast: null,
        importedIds: [],
        importers: [],
        isEntry: false,
        isExternal: false,
        dynamicallyImportedIds: [],
        hasModuleSideEffects: false,
        syntheticNamedExports: false,
      };
    },
    getModuleIds() {
      return [];
    },
    getFileName(entryId: string) {
      return entryId;
    },
    load(id: string) {
      return build.load?.(id);
    },
    transform(_code: string, id: string, _options?: any) {
      return build.transform?.(_code, id, _options);
    },
    parse(_code: string, _options?: any) {
      // Would need a parser like acorn/oxc - simplified
      return null;
    },
  };
}

/**
 * Translates a Vite/Rollup plugin into a Manic-compatible plugin structure.
 */
export function rosetta(vitePlugin: any, options?: { filter?: RegExp }): any {
  if (Array.isArray(vitePlugin)) {
    return vitePlugin.flatMap(p => rosetta(p));
  }

  if (!vitePlugin || typeof vitePlugin !== 'object' || !vitePlugin.name) {
    throw new Error(
      '[Rosetta] Invalid plugin input: must be a Vite/Rollup plugin object.'
    );
  }

  // Create the corresponding Bun plugin registration block
  const bunPlugin = {
    name: `rosetta-bun:${vitePlugin.name}`,
    setup(build: any) {
      // resolveId hook
      if (vitePlugin.resolveId) {
        build.onResolve({ filter: /.*/u }, async (args: any) => {
          const result = await vitePlugin.resolveId(args.path, args.importer, {
            isEntry: false,
            ssr: false,
            custom: args.custom,
          });
          if (result) {
            if (typeof result === 'string') return { path: result };
            if (typeof result === 'object' && result.id) {
              return {
                path: result.id,
                external: result.external ?? false,
                sideEffects: result.sideEffects,
                meta: result.meta,
              };
            }
          }
        });
      }

      // load + transform hooks
      if (vitePlugin.load || vitePlugin.transform) {
        const filter =
          (options && options.filter) ||
          /\.(?!(html|css|json|[jt]sx?|[mc]js|[mc]ts)$)[a-zA-Z0-9]+$/u;
        build.onLoad({ filter }, async (args: any) => {
          let contents: string | null = null;
          let hasLoaded = false;
          let hasTransformed = false;

          // Create mock context for plugin
          const mockContext = createMockViteContext(
            build,
            { prod: false },
            vitePlugin.name
          );

          if (vitePlugin.load) {
            const result = await vitePlugin.load.call(mockContext, args.path);
            if (result !== null && result !== undefined) {
              hasLoaded = true;
              if (typeof result === 'string') {
                contents = result;
              } else if (
                typeof result === 'object' &&
                result.code !== undefined
              ) {
                contents = result.code;
              }
            }
          }

          if (vitePlugin.transform) {
            let contentsToTransform = contents;
            if (contentsToTransform === null) {
              try {
                contentsToTransform = await Bun.file(args.path).text();
              } catch {
                return;
              }
            }

            const result = await vitePlugin.transform.call(
              mockContext,
              contentsToTransform,
              args.path
            );
            if (result !== null && result !== undefined) {
              hasTransformed = true;
              if (typeof result === 'string') {
                contents = result;
              } else if (
                typeof result === 'object' &&
                result.code !== undefined
              ) {
                contents = result.code;
              }
            }
          }

          if (!hasLoaded && !hasTransformed) {
            return undefined;
          }

          if (contents === null) {
            return undefined;
          }

          const ext = args.path.split('.').pop() || '';
          const loader = getLoaderForExtension(ext);

          return {
            contents,
            loader,
          };
        });
      }

      // moduleParsed hook - for AST-based plugins
      if (vitePlugin.moduleParsed) {
        build.onLoad({ filter: /\.[jt]sx?$/u }, async (args: any) => {
          try {
            const code = await Bun.file(args.path).text();
            const mockContext = createMockViteContext(
              build,
              { prod: false },
              vitePlugin.name
            );
            await vitePlugin.moduleParsed.call(mockContext, {
              code,
              id: args.path,
              ast: null,
            });
          } catch {
            // Ignore errors in moduleParsed
          }
        });
      }
    },
  };

  // Return the Manic plugin representation
  const manicPlugin = {
    name: `rosetta:${vitePlugin.name}`,
    preload: '@manicjs/rosetta/preload',

    async configureServer(ctx: any) {
      if (ctx.prod) return;

      // Create mock Vite context for server hooks
      // NOTE: transformSourceFilesInProject runs AFTER hooks so .source files
      // are generated first by the Vite plugin (e.g. fumadocs-mdx buildStart)
      const mockContext = createMockViteContext(null, ctx, vitePlugin.name);

      // config hook
      if (vitePlugin.config) {
        const mockConfig = { root: ctx.cwd, base: '/' };
        const mockEnv = {
          mode: ctx.prod ? 'production' : 'development',
          command: ctx.prod ? 'build' : 'serve',
        };
        await vitePlugin.config.call(mockContext, mockConfig, mockEnv);
      }

      // configResolved hook
      if (vitePlugin.configResolved) {
        const mockResolvedConfig = {
          root: ctx.cwd,
          base: '/',
          mode: ctx.prod ? 'production' : 'development',
          command: ctx.prod ? 'build' : 'serve',
          build: { outDir: ctx.dist || '.manic' },
          resolve: {},
          css: {},
          esbuild: {},
          optimizeDeps: {},
          ssr: {},
          server: {},
          preview: {},
        };
        await vitePlugin.configResolved.call(mockContext, mockResolvedConfig);
      }

      // options hook (Rollup)
      if (vitePlugin.options) {
        await vitePlugin.options.call(mockContext, {});
      }

      // buildStart hook
      if (vitePlugin.buildStart) {
        await vitePlugin.buildStart.call(mockContext, {});
      }

      // configureServer hook (Vite dev server)
      let mockServer: any;
      if (vitePlugin.configureServer) {
        const middlewares: any[] = [];
        const watchers = new Map<string, any>();
        const wsHandlers = new Map<string, any>();
        mockServer = {
          middlewares: {
            use(fn: any) {
              middlewares.push(fn);
            },
          },
          watcher: {
            on(event: string, _callback: any) {
              watchers.set(event, _callback);
            },
            off(event: string, _callback: any) {
              watchers.delete(event);
            },
          },
          ws: {
            on(event: string, _callback: any) {
              wsHandlers.set(event, _callback);
            },
            off(event: string, _callback: any) {
              wsHandlers.delete(event);
            },
            send(payload: any) {
              wsHandlers.forEach((handler: any) => handler(payload));
            },
          },
          config: vitePlugin.configResolved ? mockContext : undefined,
        };
        await vitePlugin.configureServer.call(mockContext, mockServer);

        for (const mw of middlewares) {
          ctx.addRoute('/*', adaptConnectMiddleware(mw) as any);
        }
      }

      // transformIndexHtml hook
      if (vitePlugin.transformIndexHtml) {
        const htmlPath = 'app/index.html';
        const file = Bun.file(htmlPath);
        if (await file.exists()) {
          const originalHtml = await file.text();
          const result = await vitePlugin.transformIndexHtml.call(
            mockContext,
            originalHtml,
            {
              path: '/',
              filename: htmlPath,
              server: mockServer,
              bundle: null,
            }
          );
          handleHtmlTransformResult(result, originalHtml, ctx);
        }
      }

      // handleHotUpdate hook (HMR)
      if (vitePlugin.handleHotUpdate) {
        // Store for later use in HMR
        ctx.rosettaHandleHotUpdate =
          vitePlugin.handleHotUpdate.bind(mockContext);
      }

      // Transform .source files to replace import.meta.glob (runs after all hooks
      // so Vite plugins like fumadocs-mdx have already generated the .source files)
      await transformSourceFilesInProject(ctx.cwd);
    },

    async build(ctx: any) {
      // Create mock Vite context for build hooks
      const mockContext = createMockViteContext(null, ctx, vitePlugin.name);

      // config hook
      if (vitePlugin.config) {
        const mockConfig = { root: ctx.cwd, base: '/' };
        const mockEnv = { mode: 'production', command: 'build' };
        await vitePlugin.config.call(mockContext, mockConfig, mockEnv);
      }

      // configResolved hook
      if (vitePlugin.configResolved) {
        const mockResolvedConfig = {
          root: ctx.cwd,
          base: '/',
          mode: 'production',
          command: 'build',
          build: { outDir: ctx.dist || '.manic' },
          resolve: {},
          css: {},
          esbuild: {},
          optimizeDeps: {},
          ssr: {},
          server: {},
          preview: {},
        };
        await vitePlugin.configResolved.call(mockContext, mockResolvedConfig);
      }

      // options hook (Rollup)
      if (vitePlugin.options) {
        await vitePlugin.options.call(mockContext, {});
      }

      // buildStart hook
      if (vitePlugin.buildStart) {
        await vitePlugin.buildStart.call(mockContext, {});
      }

      // renderStart hook (Rollup)
      if (vitePlugin.renderStart) {
        await vitePlugin.renderStart.call(mockContext, {}, {});
      }

      // renderChunk hook (Rollup) - for code transformation during chunk rendering
      if (vitePlugin.renderChunk) {
        ctx.rosettaRenderChunk = vitePlugin.renderChunk.bind(mockContext);
      }

      // generateBundle hook (Rollup)
      if (vitePlugin.generateBundle) {
        await vitePlugin.generateBundle.call(mockContext, {}, {});
      }

      // writeBundle hook (Rollup)
      if (vitePlugin.writeBundle) {
        await vitePlugin.writeBundle.call(mockContext, {});
      }

      // closeBundle hook (Rollup)
      if (vitePlugin.closeBundle) {
        await vitePlugin.closeBundle.call(mockContext);
      }

      // buildEnd hook (Vite)
      if (vitePlugin.buildEnd) {
        await vitePlugin.buildEnd.call(mockContext, {});
      }

      // transformIndexHtml hook (for production build)
      if (vitePlugin.transformIndexHtml) {
        const htmlPath = 'app/index.html';
        const file = Bun.file(htmlPath);
        if (await file.exists()) {
          const originalHtml = await file.text();
          const result = await vitePlugin.transformIndexHtml.call(
            mockContext,
            originalHtml,
            {
              path: '/',
              filename: htmlPath,
              server: null,
              bundle: null,
            }
          );
          handleHtmlTransformResult(result, originalHtml, ctx);
        }
      }

      // Transform .source files to replace import.meta.glob (runs after all hooks
      // so Vite plugins like fumadocs-mdx have already generated the .source files)
      await transformSourceFilesInProject(ctx.cwd);
    },
  };

  // Keep reference for preloading in Bun child process
  (manicPlugin as any).rosettaBunPlugin = bunPlugin;

  return manicPlugin;
}

function parseGlobCalls(code: string) {
  const calls: { start: number; end: number; args: string }[] = [];
  let pos = 0;
  while (pos < code.length) {
    const idx = code.indexOf('import.meta.glob', pos);
    if (idx === -1) break;

    const openParen = code.indexOf('(', idx + 'import.meta.glob'.length);
    if (openParen === -1) {
      pos = idx + 1;
      continue;
    }

    let count = 1;
    let i = openParen + 1;
    while (i < code.length && count > 0) {
      const char = code[i];
      if (char === '(') count++;
      else if (char === ')') count--;
      i++;
    }

    if (count === 0) {
      calls.push({
        start: idx,
        end: i,
        args: code.slice(openParen, i),
      });
      pos = i;
    } else {
      pos = openParen + 1;
    }
  }
  return calls;
}

export function transformGlob(code: string, filePath: string): string {
  const fileDir = path.dirname(filePath);
  const calls = parseGlobCalls(code);
  if (calls.length === 0) return code;

  let newCode = code;
  const importsToAdd: string[] = [];
  let globIndex = 0;

  for (let idx = calls.length - 1; idx >= 0; idx--) {
    const call = calls[idx];
    if (!call) continue;

    let patterns: string[] = [];
    let options: any = {};
    try {
      const evalArgs = new Function(`return [ ${call.args.slice(1, -1)} ]`);
      const args = evalArgs();
      patterns = Array.isArray(args[0]) ? args[0] : [args[0]];
      options = args[1] || {};
    } catch (err) {
      console.warn(
        `[Rosetta Glob] Failed to parse glob arguments in ${filePath}:`,
        err
      );
      continue;
    }

    const searchBase = options.base
      ? path.resolve(fileDir, options.base)
      : fileDir;

    const matchedFiles: string[] = [];
    for (const pattern of patterns) {
      const cleanPattern = pattern.startsWith('./')
        ? pattern.slice(2)
        : pattern;
      try {
        const glob = new Glob(cleanPattern);
        for (const file of glob.scanSync({ cwd: searchBase })) {
          matchedFiles.push(file);
        }
      } catch (err) {
        console.warn(
          `[Rosetta Glob] Failed to scan glob ${pattern} in ${searchBase}:`,
          err
        );
      }
    }

    const objEntries: string[] = [];
    for (let fileIdx = 0; fileIdx < matchedFiles.length; fileIdx++) {
      const file = matchedFiles[fileIdx];
      if (!file) continue;
      const firstPattern = patterns[0] ?? '';
      const key = firstPattern.startsWith('./') ? './' + file : file;
      const absolutePath = path.join(searchBase, file);
      const relativeImportPath = path.relative(fileDir, absolutePath);
      let importSpecifier = relativeImportPath;
      if (
        !importSpecifier.startsWith('.') &&
        !importSpecifier.startsWith('/')
      ) {
        importSpecifier = './' + importSpecifier;
      }

      if (options.eager) {
        const importName = `__rosetta_glob_${globIndex}_${fileIdx}`;
        if (options.import === 'default') {
          importsToAdd.push(`import ${importName} from "${importSpecifier}";`);
        } else {
          importsToAdd.push(
            `import * as ${importName} from "${importSpecifier}";`
          );
        }
        objEntries.push(JSON.stringify(key) + `: ${importName}`);
      } else if (options.import === 'default') {
        objEntries.push(
          JSON.stringify(key) +
            `: () => import("${importSpecifier}").then(m => m.default)`
        );
      } else {
        objEntries.push(
          JSON.stringify(key) + `: () => import("${importSpecifier}")`
        );
      }
    }

    const replacement = `{ ${objEntries.join(', ')} }`;
    newCode =
      newCode.slice(0, call.start) + replacement + newCode.slice(call.end);
    globIndex++;
  }

  if (importsToAdd.length > 0) {
    newCode = importsToAdd.join('\n') + '\n' + newCode;
  }

  return newCode;
}

async function transformSourceFilesInProject(cwd: string) {
  const sourceDirs = [`${cwd}/.source`, `${cwd}/app/.source`];

  const allPromises: Promise<void>[] = [];
  for (const sourceDir of sourceDirs) {
    if (!existsSync(sourceDir)) continue;
    const glob = new Bun.Glob('**/*.ts');
    const scanResult = glob.scanSync({ cwd: sourceDir });
    for (const file of scanResult) {
      const filePath = `${sourceDir}/${file}`;
      allPromises.push(transformSourceFile(filePath));
    }
  }
  await Promise.all(allPromises);
}

async function transformSourceFile(filePath: string): Promise<void> {
  try {
    const fileHandle = Bun.file(filePath);
    const code = await fileHandle.text();
    if (code.includes('import.meta.glob')) {
      console.log('[Rosetta] Transforming .source file:', filePath);
      const transformed = transformGlob(code, filePath);
      await Bun.write(filePath, transformed);
    }
  } catch (err) {
    console.error('[Rosetta] Error transforming', filePath, ':', err);
  }
}
