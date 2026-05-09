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
  emitClientFile(relativePath: string, content: string | Uint8Array): Promise<void>;
  injectHtml(tags: string): void;
}

/** Bundler plugin contract for preloading and build-time extensions. */
export interface BundlerPlugin<TConfig = unknown> {
  name: string;
  preload?: string;
  build?(ctx: BundlerPluginContext<TConfig>): void | Promise<void>;
}

/** Context passed to providers during deployment export step. */
export interface BundlerProviderContext<TConfig> {
  dist: string;
  config: TConfig;
  apiEntries: string[];
  clientDir: string;
  serverFile: string;
}

/** Provider contract for platform-specific output generation. */
export interface BundlerProvider<TConfig = unknown> {
  name: string;
  build(context: BundlerProviderContext<TConfig>): Promise<void> | void;
}

/** Options accepted by the `buildApplication()` pipeline API. */
export interface BuildApplicationOptions<TConfig = unknown> {
  config: TConfig & { mode?: "fullstack" | "frontend"; app?: { name?: string } };
  dist: string;
  cwd?: string;
  runLint?: boolean;
  lintConfigPath?: string;
  writeRoutesManifest?: (path: string) => Promise<void>;
  discoverPageRoutes?: () => Promise<PageRoute[]>;
  clientPlugins: import("bun").BunPlugin[];
  serverPlugins: import("bun").BunPlugin[];
  plugins?: BundlerPlugin<TConfig>[];
  providers?: BundlerProvider<TConfig>[];
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
}
