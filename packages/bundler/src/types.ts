/** Route metadata exposed to bundler plugin hooks. */
export interface PageRoute {
  path: string;
  filePath: string;
  dynamic: boolean;
}

/** Context passed to bundler plugins during build execution. */
export interface BundlerPluginContext<TConfig> {
  config: TConfig;
  pageRoutes: PageRoute[];
  apiRoutes: Array<{ mountPath: string; filePath: string }>;
  prod: boolean;
  cwd: string;
  dist: string;
  emitClientFile(
    relativePath: string,
    content: string | Uint8Array
  ): Promise<void>;
  injectHtml(tags: string): void;
}

/** Bundler plugin contract for preloading and build-time extensions. */
export interface BundlerPlugin<TConfig = unknown> {
  name: string;
  preload?: string;
  build?(ctx: BundlerPluginContext<TConfig>): void | Promise<void>;
}

/** Options accepted by the `buildApplication()` pipeline API. */
export interface BuildApplicationOptions<TConfig = unknown> {
  config: TConfig & {
    app?: { name?: string; port?: number };
    router?: { ssr?: boolean };
  };
  dist: string;
  cwd?: string;
  runLint?: boolean;
  lintConfigPath?: string;
  writeRoutesManifest?: (path: string) => Promise<void>;
  writeSSRManifest?: (path: string) => Promise<void>;
  discoverPageRoutes?: () => Promise<PageRoute[]>;
  clientPlugins: import('bun').BunPlugin[];
  serverPlugins: import('bun').BunPlugin[];
  plugins?: BundlerPlugin<TConfig>[];
  onPending?: (message: string) => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onLog?: (scope: string, message: string) => void;
}

export interface BuildWarning {
  file: string;
  message: string;
  code?: string;
}

export interface BuildContext<TConfig = unknown> {
  config: TConfig & {
    app?: { name?: string; port?: number };
    router?: { ssr?: boolean };
  };
  cwd: string;
  dist: string;
  warnings: BuildWarning[];
  clientPlugins: import('bun').BunPlugin[];
  serverPlugins: import('bun').BunPlugin[];
  onPending?: (message: string) => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onLog?: (scope: string, message: string) => void;
}

/** Summary returned after a successful bundler run. */
export interface BuildSummary {
  buildTimeMs: number;
  dist: string;
  clientSize: number;
  serverSize: number;
  totalSize: number;
  pageCount: number;
  apiCount: number;
  apiEntries: string[];
  ssrEnabled: boolean;
  ssrMode?: 'streaming' | 'static';
  ssrServerSize?: number;
}
